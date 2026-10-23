// ----------------------------------------------------------------------------
// Taches_fond.js — lisse les taches de couleur du fond du ciel (bruit de
// couleur à grande échelle) sans toucher à la luminosité ni à la galaxie.
// ----------------------------------------------------------------------------
// Sur le RGB étiré SANS étoiles (LRGB, LHaRGB : le détail vient de L, la
// couleur du fond du RGB peut être lissée fort) :
//   1. copie floutée : MultiscaleLinearTransform, couches 1 à « couches »
//      (6 par défaut) désactivées, résidu seul gardé : couleurs moyennées
//      sur ~64 px et plus ;
//   2. luminance lissée (flou px) et fond mesuré (grille 8 × 8, quart le
//      plus sombre des cases, comme Fond_desature) ;
//   3. dans le fond : chaque canal devient Y + (B − YB) × force + ($T − Y) ×
//      (1 − force) (Y, YB : luminance du pixel et de la copie floutée) :
//      même luminosité, couleur lissée ; poids 1 sous fond + debut (0,05),
//      0 au-dessus de fond + fin (0,20) : galaxies et halos brillants gardés.
// Demande de l'utilisateur, 23 octobre 2026 (fond marbré de couleurs après
// GraXpert, image non linéaire). Non testé dans PixInsight.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Taches_fond : clodoweg > Taches de couleur du fond
#feature-info  Lisse la couleur du fond du ciel (taches rouges, bleues) sans \
   toucher à la luminosité ni à la galaxie.

#include "clodoweg_ui.jsh"

#define TITLE "Taches fond"

function tfParams()
{
   return { couches: parseInt( cwParam( "couches", "6" ) ), force: parseFloat( cwParam( "force", "1.00" ) ),
            debut: parseFloat( cwParam( "debut", "0.05" ) ), fin: parseFloat( cwParam( "fin", "0.20" ) ),
            flou: parseFloat( cwParam( "flou", "3" ) ) };
}

function tfExport( p )
{
   Parameters.set( "couches", p.couches.toFixed( 0 ) );
   Parameters.set( "force", p.force.toFixed( 2 ) );
   Parameters.set( "debut", p.debut.toFixed( 2 ) );
   Parameters.set( "fin", p.fin.toFixed( 2 ) );
   Parameters.set( "flou", p.flou.toFixed( 1 ) );
}

function tfProcess( view, p, name )
{
   let Y = "(0.2126*$T[0] + 0.7152*$T[1] + 0.0722*$T[2])";

   // 1. copie floutée : résidu de MultiscaleLinearTransform seul
   let bw = cwPixelMathNew( view, "$T", "tf_flou" );
   let L = new MultiscaleLinearTransform;
   let layers = [];
   // enabled, biasEnabled, bias, noiseReductionEnabled, noiseReductionThreshold, noiseReductionAmount, noiseReductionIterations
   for ( let k = 0; k < p.couches; ++k )
      layers.push( [ false, true, 0.000, false, 3.000, 1.00, 1 ] );
   layers.push( [ true, true, 0.000, false, 3.000, 1.00, 1 ] );   // résidu
   L.layers = layers;
   if ( !L.executeOn( bw.mainView ) )
      throw new Error( TITLE + " : MultiscaleLinearTransform a échoué (voir la console)." );

   // 2. luminance lissée, en RGB (une image grise dans un PixelMath RGB échoue au canal 1)
   let lw = cwPixelMathNew( view, Y, "tf_lum" );
   let img = lw.mainView.image, n = 8, meds = [];
   for ( let j = 0; j < n; ++j )
      for ( let i = 0; i < n; ++i )
      {
         img.selectedRect = new Rect( Math.floor( i*img.width/n ), Math.floor( j*img.height/n ), Math.floor( (i + 1)*img.width/n ), Math.floor( (j + 1)*img.height/n ) );
         meds.push( img.median() );
      }
   img.resetSelections();
   meds.sort( function( a, b ) { return a - b; } );
   let q = meds.slice( 0, Math.max( 1, Math.floor( meds.length/4 ) ) );
   let bg = q[ Math.floor( q.length/2 ) ];
   if ( p.flou > 0 )
   {
      let C = new Convolution;
      C.mode = Convolution.prototype.Parametric;
      C.sigma = p.flou;
      C.shape = 2;
      C.aspectRatio = 1;
      C.rotationAngle = 0;
      C.executeOn( lw.mainView );
   }

   // 3. couleur floutée dans le fond, luminosité gardée
   let lo = bg + p.debut, hi = bg + p.fin;
   let w = "(1 - min(1, max(0, (tf_lum - " + lo.toFixed( 6 ) + ")/" + (hi - lo).toFixed( 6 ) + ")))*" + p.force.toFixed( 3 );
   let YB = "(0.2126*tf_flou[0] + 0.7152*tf_flou[1] + 0.0722*tf_flou[2])";
   let P = new PixelMath;
   P.expression = "$T + ((tf_flou - " + YB + ") - ($T - " + Y + "))*" + w;
   P.useSingleExpression = true;
   P.createNewImage = false;
   P.rescale = false;
   P.truncate = true;
   let ok = P.executeOn( view );
   bw.forceClose();
   lw.forceClose();
   if ( !ok )
      throw new Error( TITLE + " : PixelMath a échoué (voir la console)." );
   console.noteln( TITLE + " : " + name + " fond " + bg.toFixed( 4 ) + " ; couleur lissée sous " + lo.toFixed( 3 ) +
                   ", gardée au-dessus de " + hi.toFixed( 3 ) + " (couches " + p.couches + ", force " + p.force.toFixed( 2 ) + ")." );
}

function tfDialog( p, view )
{
   let d = new CWDialog( TITLE, "<b>Taches de couleur du fond</b> : lisse la couleur du fond (taches rouges, bleues) en gardant sa " +
                         "luminosité ; galaxies et halos brillants gardés. Sur le RGB étiré SANS étoiles, avant LRGB.", "Couches :" );
   let sel = { view: view };
   d.viewList( "Image :", view, "RGB étiré sans étoiles.", function( v ) { sel.view = v; } );
   d.numeric( "Couches :", 4, 8, 0, p.couches, "Taille des taches lissées : 6 = ~64 px et moins ; 7 pour de plus grandes taches.", function( v ) { p.couches = Math.round( v ); } );
   d.numeric( "Force :", 0.20, 1.00, 2, p.force, "1 = couleur du fond entièrement lissée.", function( v ) { p.force = v; } );
   d.group( "Zone traitée (au-dessus du fond mesuré)" );
   d.numeric( "Début :", 0.00, 0.20, 2, p.debut, "Sous fond + début : lissage complet.", function( v ) { p.debut = v; } );
   d.numeric( "Fin :", 0.05, 0.50, 2, p.fin, "Au-dessus de fond + fin : rien ne change (galaxies).", function( v ) { p.fin = v; } );
   d.endGroup();
   d.numeric( "Flou (px) :", 0, 10, 1, p.flou, "Lissage de la luminance qui sert de masque.", function( v ) { p.flou = v; } );
   d.onExport = function() { tfExport( p ); };
   d.validate = function()
   {
      if ( sel.view == null || sel.view.isNull ) return "Choisis l'image.";
      if ( !sel.view.image.isColor ) return "L'image doit être en couleur.";
      if ( p.fin <= p.debut ) return "Fin doit être plus grand que Début.";
      return "";
   };
   d.finish();
   return d.execute() ? sel.view : null;
}

function main()
{
   let p = tfParams();
   if ( cwWantsDialog() )
   {
      let view = tfDialog( p, cwDefaultView() );
      if ( view != null )
         cwRun( TITLE, function() { cwApplyOnCopy( view, function( c ) { tfProcess( c, p, view.id ); } ); } );
      return;
   }
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( TITLE + " : aucune image." );
   if ( !view.image.isColor )
   {
      console.warningln( TITLE + " : " + view.id + " n'est pas en couleur, rien n'est fait." );
      return;
   }
   cwApplyOnCopy( view, function( c ) { tfProcess( c, p, view.id ); } );
}

main();
