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

#define TITLE "Fond desature"

function param( key, value )
{
   return Parameters.has( key ) ? Parameters.getString( key ).trim() : value;
}

function main()
{
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( TITLE + " : aucune image." );
   if ( !view.image.isColor )
   {
      console.warningln( TITLE + " : " + view.id + " n'est pas en couleur, rien n'est fait." );
      return;
   }
   let debut = parseFloat( param( "debut", "0.03" ) );
   let fin = parseFloat( param( "fin", "0.15" ) );
   let violetFin = parseFloat( param( "violetFin", "0.30" ) );
   let flou = parseFloat( param( "flou", "3" ) );
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
   P.showNewImage = true;
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
   console.noteln( TITLE + " : " + view.id + " fond " + bg.toFixed( 4 ) + " ; couleur retirée sous " + lo.toFixed( 3 ) +
                   ", violet neutralisé jusqu'à " + v1.toFixed( 3 ) + "." );
}

main();
