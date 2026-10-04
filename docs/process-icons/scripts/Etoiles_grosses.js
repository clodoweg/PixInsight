// ----------------------------------------------------------------------------
// Etoiles_grosses.js — réduit SEULEMENT les grosses étoiles de l'image
// d'étoiles (RGB_stars), avant Etoiles_screen ; les petites ne bougent pas.
// ----------------------------------------------------------------------------
// Calcul du masque sur une copie réduite à 2000 px de large (mêmes réglages
// quelle que soit la taille de l'image), puis ramené à la taille réelle :
//   1. luminance de l'image d'étoiles, légère floutée (1 px) ;
//   2. ouverture morphologique (érosion puis dilatation, disque de « taille »
//      px, 7 par défaut, soit environ 33 px sur une image de 9 576 px) : une
//      étoile plus petite que le disque disparaît, une grosse reste ;
//   3. masque = 0 sous « seuil » (0,15), 1 à seuil + 0,10, puis étendu au
//      halo (flou « etendue » 6 px × 3) ;
//   4. sous le masque, la luminance Y de chaque pixel devient mtf(force, Y)
//      (force 0,70 : un halo à 0,5 descend à 0,30, à 0,2 à 0,10 ; un cœur à 1
//      reste à 1), les trois canaux multipliés par le même facteur : couleur
//      gardée, l'étoile paraît plus petite.
// Paramètres : taille (plus grand = seules les plus grosses), seuil, etendue,
// force (0,5 = rien ; plus haut = plus réduit), afficherMasque (garde la vue
// masque_grosses : blanc = réduit).
// Glisse l'icône sur l'image d'étoiles (RGB_stars), puis Etoiles_screen.
// Ctrl+Z pour annuler.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Etoiles_grosses : clodoweg > Réduire les grosses étoiles
#feature-info  Réduit seulement les grosses étoiles de l'image d'étoiles, \
   couleur gardée, avant la réintégration.

#define EG_TITLE "Etoiles grosses"
#define EG_WORK 2000

function egParam( key, value )
{
   return Parameters.has( key ) ? Parameters.getString( key ).trim() : value;
}

function egClose( id )
{
   let w = ImageWindow.windowById( id );
   if ( !w.isNull )
      w.forceClose();
}

function egNew( view, id, expr )
{
   egClose( id );
   let P = new PixelMath;
   P.expression = expr;
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
      throw new Error( EG_TITLE + " : vue " + id + " non créée." );
   return w;
}

function egPm( w, expr )
{
   let P = new PixelMath;
   P.expression = expr;
   P.useSingleExpression = true;
   P.createNewImage = false;
   P.rescale = false;
   P.truncate = true;
   P.executeOn( w.mainView );
}

function egBlur( w, sigma )
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

function egResize( w, width, height )
{
   if ( w.mainView.image.width == width && w.mainView.image.height == height )
      return;
   let R = new Resample;
   R.mode = Resample.prototype.AbsolutePixels;
   R.absoluteMode = Resample.prototype.ForceWidthAndHeight;
   R.xSize = width;
   R.ySize = height;
   R.executeOn( w.mainView );
}

// Disque de diamètre s (impair) pour MorphologicalTransformation.
function egMorpho( w, op, s )
{
   s = Math.max( 3, 2*Math.floor( s/2 ) + 1 );
   let r = (s - 1)/2, disk = [];
   for ( let y = 0; y < s; ++y )
      for ( let x = 0; x < s; ++x )
         disk.push( ((x - r)*(x - r) + (y - r)*(y - r) <= r*r) ? 1 : 0 );
   let M = new MorphologicalTransformation;
   M.operator = op;
   M.interlacingDistance = 1;
   M.lowThreshold = 0;
   M.highThreshold = 0;
   M.numberOfIterations = 1;
   M.amount = 1;
   M.selectionPoint = 0.5;
   M.structureName = "";
   M.structureSize = s;
   M.structureWayTable = [ [ disk ] ];
   M.executeOn( w.mainView );
}

function main()
{
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( EG_TITLE + " : aucune image." );
   let taille = parseFloat( egParam( "taille", "7" ) );
   let seuil = parseFloat( egParam( "seuil", "0.15" ) );
   let etendue = parseFloat( egParam( "etendue", "6" ) );
   let force = parseFloat( egParam( "force", "0.70" ) );
   let afficher = egParam( "afficherMasque", "false" ).toLowerCase() == "true";

   let color = view.image.isColor;
   let Y = color ? "(0.2126*$T[0] + 0.7152*$T[1] + 0.0722*$T[2])" : "$T";
   let W = view.image.width, H = view.image.height;
   let w2 = Math.min( W, EG_WORK ), h2 = Math.round( H*w2/W );

   // 1-3. masque des grosses étoiles, à 2000 px
   let m = egNew( view, "eg_m", Y );
   egResize( m, w2, h2 );
   egBlur( m, 1 );
   egMorpho( m, MorphologicalTransformation.prototype.Erosion, taille );
   egMorpho( m, MorphologicalTransformation.prototype.Dilation, taille );
   egPm( m, "min(1, max(0, ($T - " + seuil + ")/0.10))" );
   egBlur( m, etendue );
   egPm( m, "min(1, 3*$T)" );
   egResize( m, W, H );
   if ( afficher )
   {
      let mv = egNew( m.mainView, "masque_grosses", "$T" );
      mv.show();
   }

   // 4. luminance Y -> mtf(force, Y) sous le masque, même facteur sur R, G, B
   let P = new PixelMath;
   P.expression = "y = " + Y + ";\nf = iif(y > 0.000001, mtf(" + force.toFixed( 4 ) + ", y)/y, 1);\n$T*(1 - eg_m + eg_m*f)";
   P.symbols = "y, f";
   P.useSingleExpression = true;
   P.createNewImage = false;
   P.rescale = false;
   P.truncate = true;
   let ok = P.executeOn( view );
   egClose( "eg_m" );
   if ( !ok )
      throw new Error( EG_TITLE + " : la réduction a échoué (voir la console) ; l'image n'a pas été modifiée." );
   console.noteln( EG_TITLE + " : grosses étoiles de " + view.id + " réduites (taille " + taille + " px à " + w2 + " px, seuil " + seuil +
                   ", force " + force + ")" + (afficher ? " ; masque gardé : masque_grosses." : ".") );
}

main();
