// ----------------------------------------------------------------------------
// Fond_desature.js — retire la couleur du fond du ciel et la teinte violette
// des zones faibles (halo de la galaxie), sans toucher aux étoiles ni aux
// parties brillantes de la galaxie.
// ----------------------------------------------------------------------------
// Sur l'image finie (étoiles comprises) :
//   1. fond mesuré sur la luminance (grille 8 × 8, quart le plus sombre des
//      cases, comme Fond_auto) ;
//   2. anti-violet dans les zones faibles : là où la luminance lissée est
//      sous fond + fin (0,15), le vert remonte jusqu'au plus petit du rouge et
//      du bleu s'il est plus bas que les deux (G = max(G, min(R, B)) : seul le
//      violet/magenta, où R et B dépassent G, est touché ; un bleu (R < G) ou
//      un rouge/orange (B < G) ne change pas) ;
//      effet décroissant jusqu'à fond + violetFin (0,30), nul au-delà (cœur,
//      régions roses brillantes, étoiles) ;
//   3. désaturation du fond : poids w tiré de la luminance lissée (flou px) :
//      w = 0 jusqu'à fond + debut (0,03), 1 à partir de fond + fin (0,15) ;
//      chaque canal devient Y + ($T − Y) × w (Y = luminance du pixel) : au
//      fond, gris neutre de même luminosité.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Fond_desature : clodoweg > Fond du ciel désaturé
#feature-info  Retire la couleur du fond du ciel (violet, bruit de couleur) \
   sans toucher à la galaxie ni aux étoiles.

#include "clodoweg_ui.jsh"

#define TITLE "Fond desature"

function fdParams()
{
   return { debut: parseFloat( cwParam( "debut", "0.03" ) ), fin: parseFloat( cwParam( "fin", "0.15" ) ),
            violetFin: parseFloat( cwParam( "violetFin", "0.30" ) ), flou: parseFloat( cwParam( "flou", "3" ) ) };
}

function fdExport( p )
{
   Parameters.set( "debut", p.debut.toFixed( 2 ) );
   Parameters.set( "fin", p.fin.toFixed( 2 ) );
   Parameters.set( "violetFin", p.violetFin.toFixed( 2 ) );
   Parameters.set( "flou", p.flou.toFixed( 1 ) );
}

// Traite view (couleur) ; name : nom affiché dans la console.
function fdProcess( view, p, name )
{
   let debut = p.debut, fin = p.fin, violetFin = p.violetFin, flou = p.flou;
   let Y = "(0.2126*$T[0] + 0.7152*$T[1] + 0.0722*$T[2])";

   // luminance lissée (vue temporaire)
   let id = "fond_lum";
   let old = ImageWindow.windowById( id );
   if ( !old.isNull )
      old.forceClose();
   let P = new PixelMath;
   P.expression = Y;
   P.useSingleExpression = true;
   P.createNewImage = true;
   P.showNewImage = false;
   P.newImageId = id;
   P.newImageColorSpace = PixelMath.prototype.Gray;
   P.newImageSampleFormat = PixelMath.prototype.f32;
   P.rescale = false;
   P.truncate = true;
   P.executeOn( view );
   let lw = ImageWindow.windowById( id );
   if ( lw.isNull )
      throw new Error( TITLE + " : luminance non créée." );

   // fond : quart le plus sombre des médianes de cases
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

   if ( flou > 0 )
   {
      let C = new Convolution;
      C.mode = Convolution.prototype.Parametric;
      C.sigma = flou;
      C.shape = 2;
      C.aspectRatio = 1;
      C.rotationAngle = 0;
      C.executeOn( lw.mainView );
   }

   // anti-violet : G remonté vers min(R, B) dans les zones faibles (magenta seulement)
   let v0 = bg + fin, v1 = bg + violetFin;
   let m = "(1 - min(1, max(0, (" + id + " - " + v0.toFixed( 6 ) + ")/" + (v1 - v0).toFixed( 6 ) + ")))";
   let V = new PixelMath;
   V.expression = "$T";
   V.expression1 = "$T + (max($T, min($T[0], $T[2])) - $T)*" + m;
   V.expression2 = "$T";
   V.useSingleExpression = false;
   V.createNewImage = false;
   V.rescale = false;
   V.truncate = true;
   V.executeOn( view );

   let lo = bg + debut, hi = bg + fin;
   let w = "min(1, max(0, (" + id + " - " + lo.toFixed( 6 ) + ")/" + (hi - lo).toFixed( 6 ) + "))";
   let D = new PixelMath;
   D.expression = Y + " + ($T - " + Y + ")*" + w;
   D.useSingleExpression = true;
   D.createNewImage = false;
   D.rescale = false;
   D.truncate = true;
   D.executeOn( view );

   lw.forceClose();
   console.noteln( TITLE + " : " + name + " fond " + bg.toFixed( 4 ) + " ; couleur retirée sous " + lo.toFixed( 3 ) +
                   ", violet neutralisé jusqu'à " + v1.toFixed( 3 ) + "." );
}


function fdDialog( p, view )
{
   let d = new CWDialog( TITLE, "<b>Fond du ciel désaturé</b> : retire la couleur du fond (violet, bruit de couleur) sans toucher " +
                         "à la galaxie ni aux étoiles. Sur l'image finie, juste après Etoiles_screen, avant Fond_auto.", "Fin du violet :" );
   let sel = { view: view };
   d.viewList( "Image :", view, "Image couleur finie, étoiles comprises.", function( v ) { sel.view = v; } );
   d.group( "Couleur du fond (au-dessus du fond mesuré)" );
   d.numeric( "Début :", 0.00, 0.10, 2, p.debut, "Sous fond + début : couleur retirée entièrement.", function( v ) { p.debut = v; } );
   d.numeric( "Fin :", 0.05, 0.40, 2, p.fin, "Au-dessus de fond + fin : couleur gardée (rampe entre les deux).", function( v ) { p.fin = v; } );
   d.endGroup();
   d.group( "Violet des zones faibles" );
   d.numeric( "Fin du violet :", 0.10, 0.60, 2, p.violetFin, "Violet (magenta) neutralisé jusqu'à fond + cette valeur.", function( v ) { p.violetFin = v; } );
   d.endGroup();
   d.numeric( "Flou (px) :", 0, 10, 1, p.flou, "Lissage de la luminance qui sert de masque.", function( v ) { p.flou = v; } );
   d.onExport = function() { fdExport( p ); };
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
   let p = fdParams();
   if ( cwWantsDialog() )
   {
      let view = fdDialog( p, cwDefaultView() );
      if ( view != null )
         cwRun( TITLE, function() { cwApplyOnCopy( view, function( c ) { fdProcess( c, p, view.id ); } ); } );
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
   fdProcess( view, p, view.id );
}

main();
