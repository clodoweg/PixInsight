// ----------------------------------------------------------------------------
// Nettoyage_sans_etoiles.js — efface les restes de halos d'étoiles (taches
// rondes floues) de l'image sans étoiles étirée.
// ----------------------------------------------------------------------------
// StarXTerminator passé sur l'image linéaire laisse des halos faibles que
// l'étirement fait ressortir (disques flous, halo bleu des étoiles brillantes).
// Ils sont aussi clairs que les bras faibles de la galaxie : un seuil ne les
// sépare pas. Le script les repère par leur POSITION (autour des étoiles de
// RGB_stars) et protège la galaxie par son ÉTENDUE :
//   1. masque des étoiles : luminance de RGB_stars floutée à deux échelles
//      (rayon1 12 px pour les petits halos, rayon2 40 px pour les grands halos
//      des étoiles brillantes), m = min(1, gain1 × flou1 + gain2 × flou2) :
//      une étoile brillante couvre une zone large, une étoile faible presque
//      rien ;
//   2. protection de la galaxie : luminance de l'image floutée sur 30 px ;
//      au-dessus de fond + protege (0,05), m décroît, nul à fond + 2 × protege :
//      le corps de la galaxie et ses bras proches restent intacts ; une tache
//      isolée, petite, est diluée par ce flou et n'est pas protégée ;
//   3. dans le masque, chaque canal perd l'excès lissé au-dessus du fond :
//      $T − m × max(0, lissé − fond) (lissé : flou 3 px ; fond : grille 8 × 8,
//      quart le plus sombre des cases, comme Fond_auto). Le bruit fin est
//      gardé (pas de plage lisse), rien n'est jamais éclairci.
// afficherMasque = true : garde la vue masque_nettoyage pour vérifier ce qui
// est touché (blanc = nettoyé). Glisse l'icône sur l'image SANS étoiles,
// RGB_stars ouverte, avant HDRMT_40. Ctrl+Z pour annuler.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Nettoyage_sans_etoiles : clodoweg > Nettoyage de l'image sans étoiles
#feature-info  Efface les restes de halos d'étoiles de l'image sans étoiles, \
   autour des étoiles de RGB_stars, sans toucher à la galaxie.

#define TITLE "Nettoyage sans etoiles"

function param( key, value )
{
   return Parameters.has( key ) ? Parameters.getString( key ).trim() : value;
}

function closeView( id )
{
   let w = ImageWindow.windowById( id );
   if ( !w.isNull )
      w.forceClose();
}

// Nouvelle vue id = expression évaluée sur view (gris ou même espace que view).
function newView( view, id, expr, gray )
{
   closeView( id );
   let P = new PixelMath;
   P.expression = expr;
   P.useSingleExpression = true;
   P.createNewImage = true;
   P.showNewImage = false;
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

function blur( w, sigma )
{
   if ( sigma <= 0 )
      return;
   let C = new Convolution;
   C.mode = Convolution.prototype.Parametric;
   C.sigma = sigma;
   C.shape = 2;
   C.aspectRatio = 1;
   C.rotationAngle = 0;
   C.executeOn( w.mainView );
}

// Fond de chaque canal : médiane du quart le plus sombre des médianes de cases.
function background( img, n )
{
   let out = [];
   for ( let c = 0; c < img.numberOfChannels; ++c )
   {
      let meds = [];
      for ( let j = 0; j < n; ++j )
         for ( let i = 0; i < n; ++i )
         {
            img.selectedChannel = c;
            img.selectedRect = new Rect( Math.floor( i*img.width/n ), Math.floor( j*img.height/n ), Math.floor( (i + 1)*img.width/n ), Math.floor( (j + 1)*img.height/n ) );
            meds.push( img.median() );
         }
      meds.sort( function( a, b ) { return a - b; } );
      let q = meds.slice( 0, Math.max( 1, Math.floor( meds.length/4 ) ) );
      out.push( q[ Math.floor( q.length/2 ) ] );
   }
   img.resetSelections();
   return out;
}

function main()
{
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( TITLE + " : aucune image." );
   let starsId = param( "etoiles", "RGB_stars" );
   let r1 = parseFloat( param( "rayon1", "12" ) ), g1 = parseFloat( param( "gain1", "40" ) );
   let r2 = parseFloat( param( "rayon2", "40" ) ), g2 = parseFloat( param( "gain2", "200" ) );
   let protege = parseFloat( param( "protege", "0.05" ) );
   let flouGalaxie = parseFloat( param( "flouGalaxie", "30" ) );
   let lissage = parseFloat( param( "lissage", "3" ) );
   let afficher = param( "afficherMasque", "false" ).toLowerCase() == "true";

   let sw = ImageWindow.windowById( starsId );
   if ( sw.isNull )
      throw new Error( TITLE + " : la vue " + starsId + " (étoiles étirées) doit être ouverte." );
   if ( sw.mainView.image.width != view.image.width || sw.mainView.image.height != view.image.height )
      throw new Error( TITLE + " : " + starsId + " et " + view.id + " n'ont pas la même taille." );

   let color = view.image.isColor;
   let Ys = sw.mainView.image.isColor ? "(0.2126*$T[0] + 0.7152*$T[1] + 0.0722*$T[2])" : "$T";
   let Yt = color ? "(0.2126*$T[0] + 0.7152*$T[1] + 0.0722*$T[2])" : "$T";

   // 1. masque des étoiles à deux échelles
   let s1 = newView( sw.mainView, "nt_s1", Ys, true );
   let s2 = newView( sw.mainView, "nt_s2", Ys, true );
   blur( s1, r1 );
   blur( s2, r2 );

   // 2. protection de la galaxie (étendue) et image lissée
   let gw = newView( view, "nt_g", Yt, true );
   blur( gw, flouGalaxie );
   let lw = newView( view, "nt_lis", "$T", false );
   blur( lw, lissage );

   let bg = background( view.image, 8 );
   let bgY = color ? 0.2126*bg[0] + 0.7152*bg[1] + 0.0722*bg[2] : bg[0];
   let m = "(min(1, " + g1 + "*nt_s1 + " + g2 + "*nt_s2)*(1 - min(1, max(0, (nt_g - " + (bgY + protege).toFixed( 6 ) + ")/" + protege.toFixed( 6 ) + "))))";

   if ( afficher )
   {
      let mw = newView( view, "masque_nettoyage", m, true );
      mw.show();
   }

   // 3. excès lissé au-dessus du fond retiré dans le masque
   let P = new PixelMath;
   if ( color )
   {
      P.expression = "$T - " + m + "*max(0, nt_lis - " + bg[0].toFixed( 6 ) + ")";
      P.expression1 = "$T - " + m + "*max(0, nt_lis - " + bg[1].toFixed( 6 ) + ")";
      P.expression2 = "$T - " + m + "*max(0, nt_lis - " + bg[2].toFixed( 6 ) + ")";
      P.useSingleExpression = false;
   }
   else
   {
      P.expression = "$T - " + m + "*max(0, nt_lis - " + bg[0].toFixed( 6 ) + ")";
      P.useSingleExpression = true;
   }
   P.createNewImage = false;
   P.rescale = false;
   P.truncate = true;
   P.executeOn( view );

   [ "nt_s1", "nt_s2", "nt_g", "nt_lis" ].forEach( closeView );
   console.noteln( TITLE + " : " + view.id + " nettoyé autour des étoiles de " + starsId + " (fond " +
                   bg.map( function( v ) { return v.toFixed( 4 ); } ).join( " / " ) + ", galaxie protégée au-dessus de " + (bgY + protege).toFixed( 3 ) +
                   ")" + (afficher ? " ; masque gardé : masque_nettoyage." : ".") );
}

main();
