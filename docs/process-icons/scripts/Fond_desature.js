// ----------------------------------------------------------------------------
// Fond_desature.js — retire la couleur du fond du ciel (teinte violette,
// bruit de couleur), sans toucher à la galaxie ni aux étoiles.
// ----------------------------------------------------------------------------
// Sur l'image finie (étoiles comprises) :
//   1. fond mesuré sur la luminance (grille 8 × 8, quart le plus sombre des
//      cases, comme Fond_auto) ;
//   2. poids w tiré de la luminance de l'IMAGE ELLE-MÊME, lissée (flou px) :
//      w = 0 jusqu'à fond + debut (0,02), 1 à partir de fond + fin (0,08),
//      rampe entre les deux. Les étoiles et la galaxie, plus claires, ont
//      w = 1 et gardent leur couleur ; le fond a w = 0 ;
//   3. chaque canal devient Y + ($T − Y) × w (Y = luminance du pixel) : au
//      fond, la couleur est retirée (gris neutre de même luminosité) ; la
//      luminosité ne change nulle part.
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
   let debut = parseFloat( param( "debut", "0.02" ) );
   let fin = parseFloat( param( "fin", "0.08" ) );
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
                   ", gardée au-dessus de " + hi.toFixed( 3 ) + "." );
}

main();
