// ----------------------------------------------------------------------------
// Voile_PS.js — Correction du voile (Dehaze) façon Photoshop / Lightroom.
// ----------------------------------------------------------------------------
// Adobe ne publie pas son code. Méthode des brevets d'Adobe sur le sujet
// (US9508126B2, 2015 : modèle physique, calcul en sRGB LINÉAIRE ; US9508129B1 :
// canal sombre de He et al. 2009) ; lien avec le curseur de Lightroom non
// confirmé par Adobe :
//   1. image passée en sRGB linéaire (décodage sRGB exact) ;
//   2. canal sombre D = min(R, G, B), lissé (gaussienne, rayon px) : voile local ;
//   3. lumière de l'air A = maximum du canal sombre lissé (gris, pas de dominante) ;
//   4. transmission t = max(t0, 1 − ω·D/A), ω = force/100 (curseur : +20 -> 0,20) ;
//   5. image sans voile J = (I − A)/t + A, bornée à [0, 1], réencodée en sRGB.
// Effet : fond et tons moyens assombris, contraste et saturation montés là où
// le « voile » est fort. Réglage non encore comparé à Photoshop (à caler sur
// une image de l'utilisateur avant / après Photoshop +20).
// Calcul sur une copie cachée puis recopie (cwApplyOnCopy) : Ctrl+Z.
// Demande de l'utilisateur, 11 novembre 2026. Non testé dans PixInsight.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Voile_PS : clodoweg > Correction du voile (façon Photoshop)
#feature-info  Correction du voile (Dehaze) : modèle physique, canal sombre, \
   calcul en sRGB linéaire.

#include "clodoweg_ui.jsh"

#define TITLE "Correction du voile"


function vpParams()
{
   return { force: parseFloat( cwParam( "force", "20" ) ), rayon: parseFloat( cwParam( "rayon", "15" ) ), t0: parseFloat( cwParam( "t0", "0.10" ) ) };
}

function vpExport( p )
{
   Parameters.set( "force", p.force.toFixed( 0 ) );
   Parameters.set( "rayon", p.rayon.toFixed( 0 ) );
   Parameters.set( "t0", p.t0.toFixed( 2 ) );
}

function vpProcess( view, p )
{
   let w = Math.max( 0, Math.min( 100, p.force ) )/100;
   if ( w <= 0 )
   {
      console.warningln( TITLE + " : force 0, rien ne change." );
      return;
   }
   // canal sombre en linéaire (image couleur : trois canaux identiques), lissé
   let dec = function( c ) { return "iif($T[" + c + "] <= 0.04045, $T[" + c + "]/12.92, (($T[" + c + "] + 0.055)/1.055)^2.4)"; };
   let dw = cwPixelMathNew( view, "min(" + dec( 0 ) + ", " + dec( 1 ) + ", " + dec( 2 ) + ")", "vp_sombre" );
   try
   {
      if ( p.rayon > 0 )
      {
         let G = new Convolution;
         G.mode = Convolution.prototype.Parametric;
         G.sigma = p.rayon;
         G.shape = 2;
         G.aspectRatio = 1;
         G.rotationAngle = 0;
         G.executeOn( dw.mainView );
      }
      let A = Math.max( 0.5, Math.min( 1, dw.mainView.image.maximum() ) );
      let P = new PixelMath;
      P.expression = "l = iif($T <= 0.04045, $T/12.92, (($T + 0.055)/1.055)^2.4);\n" +
                     "t = max(" + p.t0.toFixed( 3 ) + ", 1 - " + w.toFixed( 4 ) + "*vp_sombre/" + A.toFixed( 5 ) + ");\n" +
                     "j = min(1, max(0, (l - " + A.toFixed( 5 ) + ")/t + " + A.toFixed( 5 ) + "));\n" +
                     "iif(j <= 0.0031308, 12.92*j, 1.055*j^(1/2.4) - 0.055)";
      P.symbols = "l, t, j";
      P.useSingleExpression = true;
      P.createNewImage = false;
      P.rescale = false;
      P.truncate = true;
      if ( !P.executeOn( view ) )
         throw new Error( TITLE + " : PixelMath a échoué (voir la console)." );
      console.noteln( TITLE + " : force " + p.force.toFixed( 0 ) + " (ω " + w.toFixed( 2 ) + "), lumière de l'air A = " + A.toFixed( 4 ) +
                      ", rayon " + p.rayon + " px, t0 " + p.t0 + "." );
   }
   finally
   {
      dw.forceClose();
   }
}

function vpRun( view, p )
{
   if ( !view.image.isColor )
   {
      console.warningln( TITLE + " : " + view.id + " n'est pas en couleur, rien n'est fait." );
      return;
   }
   cwApplyOnCopy( view, function( c ) { vpProcess( c, p ); } );
}

#define VP_APERCU "VP_apercu"

function vpDialog( p, view )
{
   let d = new CWDialog( TITLE, "<b>Correction du voile</b> façon Photoshop / Lightroom : modèle physique des brevets d'Adobe (canal sombre, " +
                         "calcul en sRGB linéaire). Force +20 = ton réglage Photoshop.", "Transmission min. (t0) :" );
   let sel = { view: view };
   d.viewList( "Image :", view, "Image couleur finie (sRGB).", function( v ) { sel.view = v; } );
   d.numeric( "Force :", 0, 100, 0, p.force, "Comme le curseur de Photoshop (0 à 100) : +20 par défaut.", function( v ) { p.force = v; } );
   d.numeric( "Rayon (px) :", 0, 60, 0, p.rayon, "Taille des zones où le voile est estimé (lissage du canal sombre).", function( v ) { p.rayon = v; } );
   d.numeric( "Transmission min. (t0) :", 0.05, 0.50, 2, p.t0, "Limite l'effet dans les zones très voilées.", function( v ) { p.t0 = v; } );
   d.button( "Aperçu", "Applique sur une copie affichée dans la vue VP_apercu ; l'image ne change pas.", function()
   {
      if ( sel.view == null || sel.view.isNull || !sel.view.image.isColor )
         return;
      cwRun( TITLE, function()
      {
         cwCloseWindow( VP_APERCU );
         let w = cwPixelMathNew( sel.view, "$T", VP_APERCU );
         vpProcess( w.mainView, p );
         w.show();
         w.zoomToFit();
      } );
   } );
   d.onExport = function() { vpExport( p ); };
   d.validate = function() { return (sel.view == null || sel.view.isNull) ? "Choisis l'image." : (sel.view.image.isColor ? "" : "L'image doit être en couleur."); };
   d.finish();
   let ok = d.execute();
   cwCloseWindow( VP_APERCU );
   return ok ? sel.view : null;
}

function main()
{
   let p = vpParams();
   if ( cwWantsDialog() )
   {
      let v = vpDialog( p, cwDefaultView() );
      if ( v != null )
         cwRun( TITLE, function() { vpRun( v, p ); } );
      return;
   }
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( TITLE + " : aucune image." );
   vpRun( view, p );
}

main();
