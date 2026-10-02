// ----------------------------------------------------------------------------
// Halos_auto.js — retire les halos diffus laissés par SXT autour des étoiles
// brillantes, hors de la galaxie (mode rapide).
// ----------------------------------------------------------------------------
// Sur l'image SANS ÉTOILES étirée (L ou RGB, fond déjà réglé), avec l'image
// d'étoiles de SXT encore ouverte (paramètre etoiles : L_stars ou RGB_stars) :
//   1. zone des halos : les cœurs d'étoiles plus brillants que seuil (dans
//      l'image d'étoiles) sont flous de rayon (sigma, px) puis amplifiés
//      (gain) : la zone vaut 1 autour des étoiles brillantes, d'autant plus
//      large que l'étoile est grosse ; les étoiles faibles n'en ont pas ;
//   2. protection de la galaxie : là où l'image lissée dépasse le fond de plus
//      de protegeMin (0,09), la correction diminue, nulle au-delà de
//      protegeMax (0,19) ; cette protection est elle-même élargie par un flou ;
//   3. correction : dans la zone et hors protection, l'excès lissé au-dessus
//      du fond (flou de lissage px) est retiré : le halo disparaît, le bruit
//      et les petits détails restent. Fond mesuré canal par canal (grille
//      8 × 8, quart le plus sombre des cases, comme Fond_auto).
// afficher = true : garde les vues de contrôle halo_zone et halo_protection.
// La console donne la part de l'image corrigée.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Halos_auto : clodoweg > Halos d'étoiles automatiques
#feature-info  Retire les halos diffus autour des étoiles brillantes (image \
   sans étoiles étirée), hors de la galaxie.

#define TITLE "Halos auto"

function param( key, value )
{
   return Parameters.has( key ) ? Parameters.getString( key ).trim() : value;
}

function background( img, n )
{
   let out = [];
   let w = img.width, h = img.height;
   for ( let c = 0; c < img.numberOfChannels; ++c )
   {
      let meds = [];
      for ( let j = 0; j < n; ++j )
         for ( let i = 0; i < n; ++i )
         {
            img.selectedChannel = c;
            img.selectedRect = new Rect( Math.floor( i*w/n ), Math.floor( j*h/n ), Math.floor( (i + 1)*w/n ), Math.floor( (j + 1)*h/n ) );
            meds.push( img.median() );
         }
      meds.sort( function( a, b ) { return a - b; } );
      let q = meds.slice( 0, Math.max( 1, Math.floor( meds.length/4 ) ) );
      out.push( q[ Math.floor( q.length/2 ) ] );
   }
   img.resetSelections();
   return out;
}

function lum( isColor )
{
   return isColor ? "(0.2126*$T[0] + 0.7152*$T[1] + 0.0722*$T[2])" : "$T";
}

// Nouvelle vue mono (ou de même espace couleur) créée par PixelMath à partir de view.
function newImage( view, id, expr, gray )
{
   let old = ImageWindow.windowById( id );
   if ( !old.isNull )
      old.forceClose();
   let P = new PixelMath;
   P.expression = expr;
   P.useSingleExpression = true;
   P.createNewImage = true;
   P.showNewImage = true;
   P.newImageId = id;
   P.newImageColorSpace = gray ? PixelMath.prototype.Gray : PixelMath.prototype.SameAsTarget;
   P.newImageSampleFormat = PixelMath.prototype.f32;
   P.rescale = false;
   P.truncate = true;
   P.executeOn( view );
   let w = ImageWindow.windowById( id );
   if ( w.isNull )
      throw new Error( TITLE + " : vue " + id + " non créée." );
   return w;
}

function blur( window, sigma )
{
   if ( sigma <= 0 )
      return;
   let C = new Convolution;
   C.mode = Convolution.prototype.Parametric;
   C.sigma = sigma;
   C.shape = 2;
   C.aspectRatio = 1;
   C.rotationAngle = 0;
   C.executeOn( window.mainView );
}

function apply( window, expr )
{
   let P = new PixelMath;
   P.expression = expr;
   P.useSingleExpression = true;
   P.createNewImage = false;
   P.rescale = false;
   P.truncate = true;
   P.executeOn( window.mainView );
}

function main()
{
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( TITLE + " : aucune image." );
   let starsId = param( "etoiles", "L_stars" );
   let seuil = parseFloat( param( "seuil", "0.25" ) );
   let rayon = parseFloat( param( "rayon", "80" ) );
   let gain = parseFloat( param( "gain", "200" ) );
   let lissage = parseFloat( param( "lissage", "20" ) );
   let pMin = parseFloat( param( "protegeMin", "0.09" ) );
   let pMax = parseFloat( param( "protegeMax", "0.19" ) );
   let afficher = param( "afficher", "false" ).toLowerCase() == "true";

   let stars = ImageWindow.windowById( starsId );
   if ( stars.isNull )
   {
      console.warningln( TITLE + " : image d'étoiles " + starsId + " introuvable, rien n'est fait." );
      return;
   }
   let img = view.image;
   let bg = background( img, 8 );
   let bgL = img.isColor ? 0.2126*bg[ 0 ] + 0.7152*bg[ 1 ] + 0.0722*bg[ 2 ] : bg[ 0 ];

   // 1. zone des halos, depuis les cœurs d'étoiles brillants
   let zone = newImage( stars.mainView, "halo_zone", "iif(" + lum( stars.mainView.image.isColor ) + " > " + seuil + ", 1, 0)", true );
   blur( zone, rayon );
   apply( zone, "min(1, " + gain + "*$T)" );

   // 2. protection de la galaxie (et de toute grande zone brillante)
   let prot = newImage( view, "halo_protection", lum( img.isColor ), true );
   blur( prot, 50 );
   apply( prot, "min(1, max(0, ($T - " + (bgL + pMin) + ")/" + (pMax - pMin) + "))" );
   blur( prot, 50 );
   apply( prot, "min(1, 2*$T)" );

   // 3. excès lissé au-dessus du fond, retiré dans la zone hors protection
   let flou = newImage( view, "halo_flou", "$T", false );
   blur( flou, lissage );
   let P = new PixelMath;
   if ( img.isColor )
   {
      let e = [];
      for ( let c = 0; c < 3; ++c )
         e.push( "$T - max(0, halo_flou - " + bg[ c ].toFixed( 6 ) + ")*halo_zone*(1 - halo_protection)" );
      P.expression = e[ 0 ];
      P.expression1 = e[ 1 ];
      P.expression2 = e[ 2 ];
      P.useSingleExpression = false;
   }
   else
   {
      P.expression = "$T - max(0, halo_flou - " + bg[ 0 ].toFixed( 6 ) + ")*halo_zone*(1 - halo_protection)";
      P.useSingleExpression = true;
   }
   P.createNewImage = false;
   P.rescale = false;
   P.truncate = true;
   P.executeOn( view );

   // part de l'image corrigée
   let part = newImage( zone.mainView, "halo_part", "halo_zone*(1 - halo_protection)", true );
   let pct = 100*part.mainView.image.mean();
   part.forceClose();
   flou.forceClose();
   if ( !afficher )
   {
      zone.forceClose();
      prot.forceClose();
   }
   console.noteln( TITLE + " : " + view.id + " halos retirés autour des étoiles de " + starsId + " (seuil " + seuil + ", rayon " + rayon +
                   " px) ; " + pct.toFixed( 1 ) + " % de l'image corrigée, fond " + bg.map( function( v ) { return v.toFixed( 4 ); } ).join( " / " ) + "." );
}

main();
