// ----------------------------------------------------------------------------
// Look_Lightroom.js — retouche finale façon Lightroom (panneau Réglages de
// base) : Hautes lumières, Blancs, Température, Teinte, sous un masque de
// luminance en option (demande de l'utilisateur, 8 octobre 2026).
// ----------------------------------------------------------------------------
// Les formules d'Adobe ne sont pas publiées : équivalents APPROCHÉS, valeurs
// de -100 à +100 comme dans Lightroom.
//   1. hautes (défaut -50) : courbe de luminosité (CIE L*, Akima) ; les tons
//      clairs bougent : 0,75 -> 0,75 + 0,08·h, 0,90 -> 0,90 + 0,05·h (h =
//      hautes/100) ; négatif = détail récupéré dans les zones claires ;
//   2. blancs (défaut +50) : haut de la même courbe : 0,90 -> + 0,05·b,
//      0,97 -> 0,97 + 0,025·b (b = blancs/100) ; 0, 0,5 et 1 ne bougent pas ;
//   3. temperature (défaut +10) : R × (1 + 0,003·t), B × (1 − 0,003·t) :
//      plus chaud (+10 : R × 1,03, B × 0,97) ;
//   4. teinte (défaut +20) : G × (1 − 0,0015·n) : vers le magenta (+20 :
//      G × 0,97) ;
//   5. masque = true (défaut) : tout est mélangé par un masque de luminance
//      tiré de l'image (fond coupé sous s = 0,14, flou 2 px) : le fond du
//      ciel reste neutre ; masque = false : image entière.
// Calcul sur une copie cachée puis recopie (cwApplyOnCopy) : Ctrl+Z.
// Dans un conteneur glissé (image verrouillée), traitement direct, sans masque.
//
// Place : sur l'image SANS étoiles finie, juste avant la recombinaison des
// étoiles (choix de l'utilisateur, 9 octobre 2026).
// Lancement : glisser l'icône sur l'image = réglages de l'icône ;
// double-clic puis Apply Global = fenêtre de réglages.
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Look_Lightroom : clodoweg > Hautes lumières, Blancs, Température, Teinte
#feature-info  Retouche finale façon Lightroom (Hautes lumières, Blancs, \
   Température, Teinte), sous masque de luminance en option.

#include "clodoweg_ui.jsh"

#define LR_TITLE "Look Lightroom"

function lrParams()
{
   return { hautes: parseFloat( cwParam( "hautes", "-50" ) ), blancs: parseFloat( cwParam( "blancs", "50" ) ),
            temperature: parseFloat( cwParam( "temperature", "10" ) ), teinte: parseFloat( cwParam( "teinte", "20" ) ),
            masque: cwBool( "masque", true ), s: parseFloat( cwParam( "s", "0.14" ) ), flou: parseFloat( cwParam( "flou", "2" ) ) };
}

function lrExport( p )
{
   Parameters.set( "hautes", p.hautes.toFixed( 0 ) );
   Parameters.set( "blancs", p.blancs.toFixed( 0 ) );
   Parameters.set( "temperature", p.temperature.toFixed( 0 ) );
   Parameters.set( "teinte", p.teinte.toFixed( 0 ) );
   Parameters.set( "masque", p.masque ? "true" : "false" );
   Parameters.set( "s", p.s.toFixed( 2 ) );
   Parameters.set( "flou", p.flou.toFixed( 1 ) );
}

function lrDialog( p, view )
{
   let d = new CWDialog( LR_TITLE, "<b>Retouche finale façon Lightroom</b> (équivalents approchés, -100 à +100). " +
                         "Masque de luminance : le fond du ciel reste neutre.", "Seuil du masque (s) :" );
   let sel = { view: view };
   d.viewList( "Image :", view, "L'image sans étoiles finie, avant Etoiles_screen.", function( v ) { sel.view = v; } );
   d.group( "Réglages" );
   d.numeric( "Hautes lumières :", -100, 100, 0, p.hautes, "-50 par défaut : zones claires assombries (détail récupéré).", function( v ) { p.hautes = v; } );
   d.numeric( "Blancs :", -100, 100, 0, p.blancs, "+50 par défaut : tons les plus clairs remontés vers 1.", function( v ) { p.blancs = v; } );
   d.numeric( "Température :", -100, 100, 0, p.temperature, "+10 par défaut : plus chaud (R plus haut, B plus bas).", function( v ) { p.temperature = v; } );
   d.numeric( "Teinte :", -100, 100, 0, p.teinte, "+20 par défaut : vers le magenta (G plus bas) ; négatif = vers le vert.", function( v ) { p.teinte = v; } );
   d.endGroup();
   d.group( "Masque de luminance" );
   d.check( "Appliquer sous masque de luminance", p.masque, "Coché par défaut : le fond du ciel n'est pas touché.", function( c ) { p.masque = c; } );
   d.numeric( "Seuil du masque (s) :", 0, 0.5, 2, p.s, "Tout ce qui est sous s est protégé : fond mesuré + 0,01.", function( v ) { p.s = v; } );
   d.numeric( "Flou du masque (px) :", 0, 10, 1, p.flou, "Lissage du masque.", function( v ) { p.flou = v; } );
   d.endGroup();
   d.onExport = function() { lrExport( p ); };
   d.validate = function() { return (sel.view == null || sel.view.isNull) ? "Choisis l'image." : ""; };
   d.finish();
   return d.execute() ? sel.view : null;
}

// points de la courbe de luminosité, croissants, 0 et 1 fixes
function lrCourbe( p )
{
   let h = p.hautes/100, b = p.blancs/100;
   let pts = [ [ 0, 0 ], [ 0.5, 0.5 ], [ 0.75, 0.75 + 0.08*h ], [ 0.90, 0.90 + 0.05*h + 0.05*b ], [ 0.97, 0.97 + 0.025*b ], [ 1, 1 ] ];
   for ( let i = 1; i < pts.length - 1; ++i )
      pts[ i ][ 1 ] = Math.min( Math.max( pts[ i ][ 1 ], pts[ i - 1 ][ 1 ] + 0.001 ), 0.995 + 0.001*i );
   return pts;
}

function lrProcess( view, p )
{
   if ( p.hautes != 0 || p.blancs != 0 )
   {
      let C = new CurvesTransformation;
      C.L = lrCourbe( p );
      C.Lt = CurvesTransformation.prototype.AkimaSubsplines;
      C.executeOn( view );
   }
   if ( view.image.isColor && (p.temperature != 0 || p.teinte != 0) )
   {
      let kr = 1 + 0.003*p.temperature, kb = 1 - 0.003*p.temperature, kg = 1 - 0.0015*p.teinte;
      let P = new PixelMath;
      P.expression = "$T*" + kr.toFixed( 4 );
      P.expression1 = "$T*" + kg.toFixed( 4 );
      P.expression2 = "$T*" + kb.toFixed( 4 );
      P.useSingleExpression = false;
      P.createNewImage = false;
      P.rescale = false;
      P.truncate = true;
      P.executeOn( view );
   }
}

// masque de luminance caché lr_masque (gris), tiré de view
function lrMasque( view, p )
{
   let id = "lr_masque";
   cwCloseWindow( id );
   let lum = view.image.isColor ? "(0.2126*$T[0] + 0.7152*$T[1] + 0.0722*$T[2])" : "$T";
   let P = new PixelMath;
   P.expression = "max(0, (" + lum + " - " + p.s + ") / (1 - " + p.s + "))";
   P.useSingleExpression = true;
   P.createNewImage = true;
   P.showNewImage = false;
   P.newImageId = id;
   P.newImageColorSpace = PixelMath.prototype.Gray;
   P.newImageSampleFormat = PixelMath.prototype.f32;
   P.rescale = false;
   P.truncate = true;
   P.executeOn( view );
   let w = ImageWindow.windowById( id );
   if ( w.isNull )
      throw new Error( LR_TITLE + " : masque non créé (voir la console)." );
   if ( p.flou > 0 )
   {
      let C = new Convolution;
      C.mode = Convolution.prototype.Parametric;
      C.sigma = p.flou;
      C.shape = 2;
      C.aspectRatio = 1;
      C.rotationAngle = 0;
      C.executeOn( w.mainView );
   }
   return id;
}

function lrRun( view, p )
{
   let mid = null;
   try
   {
      if ( p.masque && !cwTargetLocked( view ) )
         mid = lrMasque( view, p );
      cwApplyOnCopy( view, function( c ) { lrProcess( c, p ); },
                     mid ? function( cid ) { return mid + "*" + cid + " + (1-" + mid + ")*$T"; } : null );
   }
   finally
   {
      if ( mid )
         cwCloseWindow( mid );
   }
   console.noteln( LR_TITLE + " : " + view.id + " (hautes lumières " + p.hautes + ", blancs " + p.blancs + ", température " + p.temperature +
                   ", teinte " + p.teinte + (mid ? ", sous masque de luminance s = " + p.s : ", sans masque") + ")." );
}

function main()
{
   let p = lrParams();
   if ( cwWantsDialog() )
   {
      let v = lrDialog( p, cwDefaultView() );
      if ( v != null )
         cwRun( LR_TITLE, function() { lrRun( v, p ); } );
      return;
   }
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( LR_TITLE + " : aucune image." );
   lrRun( view, p );
}

main();
