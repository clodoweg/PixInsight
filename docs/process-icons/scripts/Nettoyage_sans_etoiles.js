// ----------------------------------------------------------------------------
// Nettoyage_sans_etoiles.js — efface les restes de halos des étoiles BRILLANTES
// (taches rondes floues, halo coloré) de l'image sans étoiles étirée.
// ----------------------------------------------------------------------------
// StarXTerminator passé sur l'image linéaire laisse des halos faibles que
// l'étirement fait ressortir. Ceux des étoiles faibles et moyennes sont
// recouverts par les étoiles elles-mêmes (Etoiles_screen) ; ceux des étoiles
// brillantes dépassent et restent visibles. Le script ne vise qu'eux.
// Tout le calcul des masques se fait sur une copie réduite à 2000 px de large
// (mêmes réglages quelle que soit la taille de l'image), puis est ramené à la
// taille réelle :
//   1. étoiles brillantes : luminance de RGB_stars floutée 20 px ; noyau =
//      0 sous seuilBas (0,05), 1 au-dessus de seuilHaut (0,12) : une étoile
//      moyenne (vers 0,06) ne compte presque pas, une brillante (0,12 à 0,37)
//      compte entièrement ; le noyau est étendu (flou etendue 25 px × 3) pour
//      couvrir le halo ;
//   2. fond LOCAL : ouverture morphologique (érosion puis dilatation, disque
//      25 px, 3 fois chacune, puis flou 8 px) : tout ce qui est plus petit
//      qu'environ 75 px disparaît (taches, halos) ; le halo étendu de la
//      galaxie et les dégradés restent. On ne descend jamais sous ce fond
//      local : pas de trou noir autour de la galaxie ;
//   3. protections : (a) galaxie par son étendue (luminance floutée 60 px
//      au-dessus de fond + protege 0,08) ; (b) toute structure nettement plus
//      claire que le fond local (+ 0,15 : bras, petites galaxies) ;
//   4. dans le masque : $T − masque × max(0, lissé − fond local) (lissé :
//      flou 1,5 px), calculé à 2000 px puis ramené à la taille réelle (une
//      seule image pleine taille en mémoire) ; le bruit fin est gardé, rien
//      n'est éclairci ;
//   protections (version 4) : (b) élargie (flou 6 px × 2) ; (c) petits objets
//      compacts (petites galaxies dans un halo) plus clairs que le fond local
//      de compact (0,05), protection étendue (flou 4 px × 3) : plus d'anneau
//      sombre autour ; image lissée à 4 px et fond local remonté du biais de
//      l'ouverture : un deuxième passage n'assombrit presque plus ;
//   5. TRÈS grandes étoiles (version 3, halo de plus de 75 px qui restait
//      élargi) : luminance de RGB_stars floutée 50 px au-dessus de tresBrillant
//      (0,05 ; l'étoile bleue de NGC 1532 vaut 0,11, les autres moins de 0,045),
//      zone étendue (flou etendue2 80 px × gain2 8, environ 170 px de rayon) ; fond
//      local à grande échelle (ouverture sur une copie à 500 px, environ 300 px
//      à 2000 px, après un léger flou contre le biais du bruit) ; on garde le
//      plus grand des deux retraits.
// afficherMasque = true : garde la vue masque_nettoyage (blanc = nettoyé ;
// elle doit couvrir seulement les grandes étoiles et leur halo).
// Glisse l'icône sur l'image SANS étoiles juste après LRGB, RGB_stars ouverte.
// Ctrl+Z pour annuler.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Nettoyage_sans_etoiles : clodoweg > Nettoyage de l'image sans étoiles
#feature-info  Efface les restes de halos des étoiles brillantes de l'image \
   sans étoiles, sans toucher à la galaxie.

#include "clodoweg_ui.jsh"

#define TITLE "Nettoyage sans etoiles"
#define WORK 2000

function param( key, value )
{
   return cwParam( key, value );
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

function pm( w, expr )
{
   let P = new PixelMath;
   P.expression = expr;
   P.useSingleExpression = true;
   P.createNewImage = false;
   P.rescale = false;
   P.truncate = true;
   P.executeOn( w.mainView );
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

function resize( w, width, height )
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

// Disque de diamètre 25 px pour MorphologicalTransformation.
function morpho( w, op, n )
{
   let s = 25, r = (s - 1)/2, disk = [];
   for ( let y = 0; y < s; ++y )
      for ( let x = 0; x < s; ++x )
         disk.push( ((x - r)*(x - r) + (y - r)*(y - r) <= r*r) ? 1 : 0 );
   let M = new MorphologicalTransformation;
   M.operator = op;
   M.interlacingDistance = 1;
   M.lowThreshold = 0;
   M.highThreshold = 0;
   M.numberOfIterations = n;
   M.amount = 1;
   M.selectionPoint = 0.5;
   M.structureName = "";
   M.structureSize = s;
   M.structureWayTable = [ [ disk ] ];
   M.executeOn( w.mainView );
}

// Fond : médiane du quart le plus sombre des médianes de cases (grille n × n).
function background( img, n )
{
   let meds = [];
   for ( let j = 0; j < n; ++j )
      for ( let i = 0; i < n; ++i )
      {
         img.selectedRect = new Rect( Math.floor( i*img.width/n ), Math.floor( j*img.height/n ), Math.floor( (i + 1)*img.width/n ), Math.floor( (j + 1)*img.height/n ) );
         meds.push( img.median() );
      }
   img.resetSelections();
   meds.sort( function( a, b ) { return a - b; } );
   let q = meds.slice( 0, Math.max( 1, Math.floor( meds.length/4 ) ) );
   return q[ Math.floor( q.length/2 ) ];
}

// Écart médian entre l'image lissée et le fond local (le ciel occupe presque toute l'image : la médiane est
// celle du ciel), ajouté au fond local.
function correctBias( opw, liw )
{
   let id = "nt_bias";
   let n = opw.mainView.image.numberOfChannels;
   let d = newView( liw.mainView, id, "$T - " + opw.mainView.id + " + 0.5", false );
   let corr = [];
   let img = d.mainView.image;
   for ( let c = 0; c < n; ++c )
   {
      img.selectedChannel = c;
      corr.push( img.median() - 0.5 );
   }
   img.resetSelections();
   closeView( id );
   let P = new PixelMath;
   P.expression = "$T + " + corr[ 0 ].toFixed( 6 );
   if ( n > 1 )
   {
      P.expression1 = "$T + " + corr[ 1 ].toFixed( 6 );
      P.expression2 = "$T + " + corr[ 2 ].toFixed( 6 );
      P.useSingleExpression = false;
   }
   else
      P.useSingleExpression = true;
   P.createNewImage = false;
   P.rescale = false;
   P.truncate = true;
   P.executeOn( opw.mainView );
   return corr;
}

var NT_KEYS = [ [ "seuilBas", "0.05", 2 ], [ "seuilHaut", "0.12", 2 ], [ "etendue", "25", 0 ], [ "passes", "3", 0 ], [ "protege", "0.08", 2 ],
                [ "structure", "0.15", 2 ], [ "compact", "0.05", 2 ], [ "tresBrillant", "0.05", 2 ], [ "etendue2", "80", 0 ], [ "gain", "3", 1 ], [ "gain2", "8", 1 ] ];

function ntParams()
{
   let p = { etoiles: param( "etoiles", "RGB_stars" ), afficherMasque: param( "afficherMasque", "false" ).toLowerCase() == "true", apercu: false };
   NT_KEYS.forEach( function( k ) { p[ k[ 0 ] ] = parseFloat( param( k[ 0 ], k[ 1 ] ) ); } );
   return p;
}

function ntExport( p )
{
   Parameters.set( "etoiles", p.etoiles );
   NT_KEYS.forEach( function( k ) { Parameters.set( k[ 0 ], p[ k[ 0 ] ].toFixed( k[ 2 ] ) ); } );
   Parameters.set( "afficherMasque", p.afficherMasque ? "true" : "false" );
}

function ntDialog( p, view )
{
   let d = new CWDialog( TITLE, "<b>Nettoyage autour des étoiles</b> : retire les taches rondes et halos laissés par SXT autour des étoiles brillantes, " +
                         "sur l'image sans étoiles juste après LRGB (RGB_stars ouverte). « Voir le masque » montre ce qui sera nettoyé (blanc).", "Très brillantes (seuil) :" );
   let sel = { view: view };
   d.viewList( "Image sans étoiles :", view, "Image sans étoiles étirée.", function( v ) { sel.view = v; } );
   d.viewList( "Image d'étoiles :", cwViewById( p.etoiles ), "Étoiles étirées (RGB_stars).", function( v ) { p.etoiles = v.isNull ? "" : v.id; } );
   d.group( "Étoiles prises en compte" );
   d.numeric( "Seuil bas :", 0.01, 0.30, 2, p.seuilBas, "Luminance floutée des étoiles : début du masque.", function( v ) { p.seuilBas = v; } );
   d.numeric( "Seuil haut :", 0.02, 0.50, 2, p.seuilHaut, "Masque plein au-dessus.", function( v ) { p.seuilHaut = v; } );
   d.numeric( "Étendue (px) :", 5, 60, 0, p.etendue, "Extension du masque au halo (calcul à 2000 px).", function( v ) { p.etendue = v; } );
   d.numeric( "Gain :", 1, 10, 1, p.gain, "Plus haut = masque plus large et plus plein.", function( v ) { p.gain = v; } );
   d.endGroup();
   d.group( "Très grandes étoiles" );
   d.numeric( "Très brillantes (seuil) :", 0.01, 0.30, 2, p.tresBrillant, "Seuil des très grandes étoiles (luminance floutée 50 px).", function( v ) { p.tresBrillant = v; } );
   d.numeric( "Étendue 2 (px) :", 20, 200, 0, p.etendue2, "Zone autour des très grandes étoiles.", function( v ) { p.etendue2 = v; } );
   d.numeric( "Gain 2 :", 1, 20, 1, p.gain2, "", function( v ) { p.gain2 = v; } );
   d.endGroup();
   d.group( "Fond local et protections" );
   d.numeric( "Passes :", 1, 6, 0, p.passes, "Ouverture morphologique (taches de moins de 25 × passes px retirées).", function( v ) { p.passes = v; } );
   d.numeric( "Galaxie protégée :", 0.00, 0.30, 2, p.protege, "Au-dessus du fond + cette valeur : protégé.", function( v ) { p.protege = v; } );
   d.numeric( "Structures :", 0.00, 0.50, 2, p.structure, "Structures claires (bras) protégées.", function( v ) { p.structure = v; } );
   d.numeric( "Objets compacts :", 0.00, 0.30, 2, p.compact, "Petites galaxies dans un halo protégées.", function( v ) { p.compact = v; } );
   d.endGroup();
   d.check( "Garder la vue masque_nettoyage après l'application", p.afficherMasque, "", function( c ) { p.afficherMasque = c; } );
   d.button( "Voir le masque", "Calcule et affiche masque_nettoyage (blanc = nettoyé) ; l'image n'est pas modifiée.", function()
   {
      if ( sel.view == null || sel.view.isNull ) { (new MessageBox( "Choisis d'abord l'image.", TITLE )).execute(); return; }
      cwRun( TITLE, function() { let q = Object.create( p ); q.apercu = true; ntProcess( sel.view, q, sel.view.id ); } );
   } );
   d.onExport = function() { ntExport( p ); };
   d.validate = function() { return (sel.view == null || sel.view.isNull) ? "Choisis l'image sans étoiles." : (p.etoiles ? "" : "Choisis l'image d'étoiles."); };
   d.finish();
   return d.execute() ? sel.view : null;
}

function main()
{
   let p = ntParams();
   if ( cwWantsDialog() )
   {
      let v = ntDialog( p, cwDefaultView() );
      if ( v != null )
         cwRun( TITLE, function() { cwApplyOnCopy( v, function( c ) { ntProcess( c, p, v.id ); } ); } );
      return;
   }
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( TITLE + " : aucune image." );
   // glissé : aussi sur copie puis recopie, pour le Ctrl+Z (8 octobre 2026)
   cwApplyOnCopy( view, function( c ) { ntProcess( c, p, view.id ); } );
}

// p.apercu = true : calcule et affiche seulement le masque.
function ntProcess( view, p, name )
{
   let starsId = p.etoiles, seuilBas = p.seuilBas, seuilHaut = p.seuilHaut, etendue = p.etendue, passes = Math.round( p.passes );
   let protege = p.protege, structure = p.structure, compact = p.compact, tresBrillant = p.tresBrillant, etendue2 = p.etendue2;
   let gain = p.gain, gain2 = p.gain2, afficher = p.afficherMasque || p.apercu;

   let sw = ImageWindow.windowById( starsId );
   if ( sw.isNull )
      throw new Error( TITLE + " : la vue " + starsId + " (étoiles étirées) doit être ouverte." );
   let W = view.image.width, H = view.image.height;
   if ( sw.mainView.image.width != W || sw.mainView.image.height != H )
      throw new Error( TITLE + " : " + starsId + " et " + name + " n'ont pas la même taille." );
   let color = view.image.isColor;
   let Y = "(0.2126*$T[0] + 0.7152*$T[1] + 0.0722*$T[2])";
   let w2 = Math.min( W, WORK ), h2 = Math.round( H*w2/W ), k = W/w2;

   // copies réduites
   let st = newView( sw.mainView, "nt_st", sw.mainView.image.isColor ? Y : "$T", true );
   resize( st, w2, h2 );
   let sl = newView( view, "nt_sl", "$T", false );
   resize( sl, w2, h2 );
   let sy = newView( sl.mainView, "nt_sy", color ? Y : "$T", true );

   // 5. très grandes étoiles (avant que nt_st soit modifiée)
   let st2 = newView( st.mainView, "nt_st2", "$T", true );
   blur( st2, 50 );
   pm( st2, "min(1, max(0, ($T - " + tresBrillant + ")/0.03))" );
   blur( st2, etendue2 );
   pm( st2, "min(1, " + gain2 + "*$T)" );

   // 1. étoiles brillantes, étendues
   blur( st, 20 );
   pm( st, "min(1, max(0, ($T - " + seuilBas + ")/" + (seuilHaut - seuilBas) + "))" );
   let core = newView( st.mainView, "nt_core", "$T", true );   // l'étoile elle-même (avant extension)
   blur( core, 8 );
   pm( core, "min(1, 3*$T)" );
   blur( st, etendue );
   pm( st, "min(1, " + gain + "*$T)" );

   // 2. fond local (ouverture morphologique)
   let op = newView( sl.mainView, "nt_op", "$T", false );
   morpho( op, MorphologicalTransformation.prototype.Erosion, passes );
   morpho( op, MorphologicalTransformation.prototype.Dilation, passes );
   blur( op, 8 );
   let opy = newView( op.mainView, "nt_opy", color ? Y : "$T", true );
   // fond local à grande échelle : ouverture sur une copie 4 fois plus petite
   let op2 = newView( sl.mainView, "nt_op2", "$T", false );
   blur( op2, 2 );
   resize( op2, Math.round( w2/4 ), Math.round( h2/4 ) );
   morpho( op2, MorphologicalTransformation.prototype.Erosion, passes );
   morpho( op2, MorphologicalTransformation.prototype.Dilation, passes );
   resize( op2, w2, h2 );
   blur( op2, 20 );

   // 3. protections
   let bg = background( sy.mainView.image, 8 );
   let g60 = newView( sy.mainView, "nt_g60", "$T", true );
   blur( g60, 60 );
   let g4 = newView( sy.mainView, "nt_g4", "$T", true );
   blur( g4, 4 );
   // (b) structures claires (bras…), protection élargie (flou 6 px × 2) pour une transition douce
   let p2 = newView( sy.mainView, "nt_p2", "min(1, max(0, (nt_g4 - nt_opy - " + structure + ")/0.10))", true );
   blur( p2, 6 );
   pm( p2, "min(1, 2*$T)" );
   // (c) petits objets compacts (petites galaxies dans un halo) : plus clairs que le fond local de 0,05,
   //     protection étendue (flou 4 px × 3) pour ne pas laisser d'anneau sombre, sauf sur l'étoile elle-même
   let g1 = newView( sy.mainView, "nt_g1", "$T", true );
   blur( g1, 1 );
   let p3 = newView( sy.mainView, "nt_p3", "min(1, max(0, (nt_g1 - nt_opy - " + compact + ")/0.05))", true );
   blur( p3, 4 );
   pm( p3, "min(1, 3*$T)*(1 - nt_core)" );
   let prot = "(1 - max(min(1, max(0, (nt_g60 - " + (bg + protege).toFixed( 6 ) + ")/" + protege + ")), max(nt_p2, nt_p3)))";
   let mask = newView( st.mainView, "nt_m", "$T*" + prot, true );
   let mask2 = newView( st2.mainView, "nt_m2", "$T*" + prot, true );

   // 4. excès au-dessus du fond local, calculé à 2000 px (léger en mémoire : une seule image ramenée à la taille réelle)
   let li = newView( sl.mainView, "nt_li", "$T", false );
   blur( li, 4 );   // assez lissé pour que le bruit ne soit pas retiré (sinon chaque passage assombrit)
   // biais de l'ouverture (l'érosion suit le bas du bruit) : fonds locaux remontés au niveau du ciel
   correctBias( op, li );
   correctBias( op2, li );
   let ex = newView( sl.mainView, "nt_e", "max(nt_m*max(0, nt_li - nt_op), nt_m2*max(0, nt_li - nt_op2))", false );
   if ( afficher )
   {
      let mv = newView( mask.mainView, "masque_nettoyage", "max($T, nt_m2)", true );
      resize( mv, W, H );
      mv.show();
   }
   resize( ex, W, H );
   let temps = [ "nt_st", "nt_st2", "nt_sl", "nt_sy", "nt_op", "nt_op2", "nt_opy", "nt_g60", "nt_g4", "nt_g1", "nt_core", "nt_p2", "nt_p3", "nt_m", "nt_m2", "nt_li", "nt_e" ];
   if ( p.apercu )
   {
      temps.forEach( closeView );
      console.noteln( TITLE + " : masque affiché (masque_nettoyage, blanc = nettoyé) ; " + name + " n'est pas modifiée." );
      return;
   }

   // retrait sur l'image (rien n'est jamais éclairci)
   let P = new PixelMath;
   P.expression = "$T - nt_e";
   P.useSingleExpression = true;
   P.createNewImage = false;
   P.rescale = false;
   P.truncate = true;
   let ok = P.executeOn( view );

   temps.forEach( closeView );
   if ( !ok )
      throw new Error( TITLE + " : le retrait final a échoué (voir la console) ; l'image n'a pas été modifiée." );
   console.noteln( TITLE + " : " + name + " nettoyé autour des étoiles brillantes de " + starsId +
                   " (calcul à " + w2 + " px, fond " + bg.toFixed( 4 ) + ")" + (afficher ? " ; masque gardé : masque_nettoyage." : ".") );
}

main();
