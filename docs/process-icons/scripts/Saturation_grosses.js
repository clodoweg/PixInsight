// ----------------------------------------------------------------------------
// Saturation_grosses.js — sature SEULEMENT les grosses étoiles (presque
// blanches) de l'image d'étoiles RGB_stars ; les petites ne bougent pas.
// ----------------------------------------------------------------------------
// Travaille sur la vue « vue » (RGB_stars par défaut), quelle que soit l'image
// sur laquelle on glisse l'icône (vue vide : l'image où on la glisse).
//   1. masque des grosses étoiles, comme Etoiles_grosses : luminance, copie
//      réduite à 2000 px de large, flou 1 px, ouverture morphologique (disque
//      de « taille » px, 7 par défaut : une étoile plus petite disparaît),
//      0 sous « seuil » (0,15), 1 à seuil + 0,10, étendu au halo (flou
//      « etendue » 12 px), ramené à la taille de l'image ;
//   2. copie de l'image saturée par la courbe de l'utilisateur
//      (CurvesTransformation, canaux c et S : 0,46094 -> 0,53646 et
//      0,46354 -> 0,54167, Akima), « passes » fois (1 par défaut) ;
//   3. résultat = masque × copie saturée + (1 − masque) × image : seules les
//      grosses étoiles (et leur halo) prennent la saturation ; calculé dans
//      une image cachée puis recopié dans la vue (beginProcess / endProcess :
//      affichage et Ctrl+Z, comme Etoiles_grosses).
// Paramètres : vue, taille, seuil, etendue, passes ; fenêtre avec « Voir le
// masque » (vue masque_sat_grosses, blanc = saturé).
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight, avec
// clodoweg_ui.jsh.
// ----------------------------------------------------------------------------

#feature-id    Saturation_grosses : clodoweg > Saturation des grosses étoiles
#feature-info  Sature seulement les grosses étoiles de RGB_stars (courbe c et S), \
   les petites étoiles ne bougent pas.

#include "clodoweg_ui.jsh"

#define SG_TITLE "Saturation grosses"
#define SG_WORK 2000
#define SG_MASK_VIEW "masque_sat_grosses"

function sgParams()
{
   return { vue: cwParam( "vue", "RGB_stars" ), taille: parseFloat( cwParam( "taille", "7" ) ), seuil: parseFloat( cwParam( "seuil", "0.15" ) ),
            etendue: parseFloat( cwParam( "etendue", "12" ) ), passes: parseInt( cwParam( "passes", "1" ) ) };
}

function sgExport( p )
{
   Parameters.set( "vue", p.vue );
   Parameters.set( "taille", p.taille.toFixed( 0 ) );
   Parameters.set( "seuil", p.seuil.toFixed( 2 ) );
   Parameters.set( "etendue", p.etendue.toFixed( 0 ) );
   Parameters.set( "passes", p.passes.toFixed( 0 ) );
}

// ---------------------------------------------------------------- masque

function sgNew( view, id, expr, gray )
{
   cwCloseWindow( id );
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
   if ( !P.executeOn( view ) )
      throw new Error( SG_TITLE + " : PixelMath a échoué (" + id + ", voir la console)." );
   let w = ImageWindow.windowById( id );
   if ( w.isNull )
      throw new Error( SG_TITLE + " : vue " + id + " non créée." );
   return w;
}

function sgPm( w, expr )
{
   let P = new PixelMath;
   P.expression = expr;
   P.useSingleExpression = true;
   P.createNewImage = false;
   P.rescale = false;
   P.truncate = true;
   P.executeOn( w.mainView );
}

function sgBlur( w, sigma )
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

function sgResize( w, width, height )
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
function sgMorpho( w, op, s )
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

// Masque des grosses étoiles (vue cachée id, à la taille de l'image).
function sgMask( view, p, id )
{
   let W = view.image.width, H = view.image.height;
   let w2 = Math.min( W, SG_WORK ), h2 = Math.round( H*w2/W );
   let m = sgNew( view, id, view.image.isColor ? "0.2126*$T[0] + 0.7152*$T[1] + 0.0722*$T[2]" : "$T", true );
   sgResize( m, w2, h2 );
   sgBlur( m, 1 );
   sgMorpho( m, MorphologicalTransformation.prototype.Erosion, p.taille );
   sgMorpho( m, MorphologicalTransformation.prototype.Dilation, p.taille );
   sgPm( m, "min(1, max(0, ($T - " + p.seuil + ")/0.10))" );
   sgBlur( m, p.etendue );
   sgPm( m, "min(1, 3*$T)" );
   sgResize( m, W, H );
   return m;
}

// ---------------------------------------------------------------- saturation

// Constante d'énumération : forme 1.9.5 (CurvesTransformation.X, celle de l'icône de l'utilisateur), sinon .prototype.X.
function sgEnum( name )
{
   let v = CurvesTransformation[ name ];
   return (v !== undefined) ? v : CurvesTransformation.prototype[ name ];
}

// Courbe de saturation donnée par l'utilisateur (canaux c et S, les autres identité).
function sgCurves( view )
{
   let id = [ [ 0.00000, 0.00000 ], [ 1.00000, 1.00000 ] ];
   let ak = sgEnum( "AkimaSubsplines" );
   let P = new CurvesTransformation;
   P.R = id; P.Rt = ak;
   P.G = id; P.Gt = ak;
   P.B = id; P.Bt = ak;
   P.K = id; P.Kt = ak;
   P.A = id; P.At = ak;
   P.L = id; P.Lt = ak;
   P.a = id; P.at = ak;
   P.b = id; P.bt = ak;
   P.c = [ [ 0.00000, 0.00000 ], [ 0.46094, 0.53646 ], [ 1.00000, 1.00000 ] ];
   P.ct = ak;
   P.H = id; P.Ht = ak;
   P.S = [ [ 0.00000, 0.00000 ], [ 0.46354, 0.54167 ], [ 1.00000, 1.00000 ] ];
   P.St = ak;
   if ( !P.executeOn( view ) )
      throw new Error( SG_TITLE + " : CurvesTransformation a échoué (voir la console)." );
}

function sgProcess( view, p )
{
   if ( !view.image.isColor )
      throw new Error( SG_TITLE + " : " + view.id + " n'est pas une image couleur." );
   let ids = [ "sg_m", "sg_sat", "sg_r" ];
   try
   {
      let m = sgMask( view, p, "sg_m" );
      let mMax = m.mainView.image.maximum(), mMean = m.mainView.image.mean();
      console.writeln( SG_TITLE + " : masque max " + mMax.toFixed( 3 ) + ", surface saturée environ " + (100*mMean).toFixed( 2 ) + " % de l'image." );
      if ( mMax < 0.01 )
         throw new Error( SG_TITLE + " : aucune grosse étoile trouvée avec ces réglages, l'image n'est pas modifiée. " +
                          "Baisse le seuil (0,10) ou la taille (5), et vérifie avec « Voir le masque »." );
      let s = sgNew( view, "sg_sat", "$T", false );
      for ( let k = 0; k < Math.max( 1, p.passes ); ++k )
         sgCurves( s.mainView );
      // résultat dans une image cachée (PixelMath exécuté sur la vue, nouvelle image), puis recopié
      // dans la vue entre beginProcess et endProcess : affichage et Ctrl+Z. Le mélange écrit
      // directement dans RGB_stars échouait (« Unknown error », retour de l'utilisateur).
      let r = sgNew( view, "sg_r", "sg_m*sg_sat + (1 - sg_m)*$T", false );
      view.beginProcess();
      view.image.assign( r.mainView.image );
      view.endProcess();
   }
   finally
   {
      for ( let k = 0; k < ids.length; ++k )
         cwCloseWindow( ids[ k ] );
   }
}

function sgShowMask( view, p )
{
   let m = sgMask( view, p, "sg_m" );
   let mv = sgNew( m.mainView, SG_MASK_VIEW, "$T", true );
   cwCloseWindow( "sg_m" );
   mv.show();
   mv.zoomToFit();
   console.noteln( SG_TITLE + " : masque affiché (" + SG_MASK_VIEW + ", blanc = saturé)." );
}

// ---------------------------------------------------------------- fenêtre

function sgDialog( p, view )
{
   let d = new CWDialog( SG_TITLE, "<b>Saturation des grosses étoiles</b> (presque blanches) de RGB_stars, sans toucher aux petites : " +
                         "masque des grosses étoiles (comme Etoiles_grosses), puis courbe de saturation (canaux c et S) sous ce masque. " +
                         "Règle le masque avec « Voir le masque » (blanc = saturé), puis Appliquer.", "Étendue au halo (px) :" );
   let sel = { view: view };
   d.viewList( "Image d'étoiles :", view, "Image d'étoiles étirée (RGB_stars), avant Etoiles_screen.", function( v ) { sel.view = v; } );
   d.group( "Masque des grosses étoiles" );
   d.numeric( "Taille (px) :", 3, 21, 0, p.taille, "Diamètre du disque, sur la copie à 2000 px. Plus grand = seules les plus grosses étoiles sont saturées.", function( v ) { p.taille = v; } );
   d.numeric( "Seuil :", 0.02, 0.50, 2, p.seuil, "Luminosité minimale d'une grosse étoile après l'ouverture. Plus bas = plus d'étoiles prises.", function( v ) { p.seuil = v; } );
   d.numeric( "Étendue au halo (px) :", 0, 30, 0, p.etendue, "Flou du masque pour couvrir le halo (12 par défaut).", function( v ) { p.etendue = v; } );
   d.endGroup();
   d.numeric( "Passes :", 1, 3, 0, p.passes, "Nombre de passages de la courbe de saturation (1 par défaut ; 2 = plus saturé).", function( v ) { p.passes = Math.round( v ); } );
   d.button( "Voir le masque", "Calcule le masque et l'affiche (vue " + SG_MASK_VIEW + ", blanc = saturé). L'image n'est pas modifiée.", function()
   {
      if ( sel.view == null || sel.view.isNull )
      {
         (new MessageBox( "Choisis d'abord l'image d'étoiles.", SG_TITLE )).execute();
         return;
      }
      try { sgShowMask( sel.view, p ); }
      catch ( e ) { (new MessageBox( e.message, SG_TITLE )).execute(); }
   } );
   d.onExport = function() { p.vue = (sel.view == null || sel.view.isNull) ? "" : sel.view.id; sgExport( p ); };
   d.validate = function() { return (sel.view == null || sel.view.isNull) ? "Choisis l'image d'étoiles." : ""; };
   d.finish();
   return d.execute() ? sel.view : null;
}

function main()
{
   let p = sgParams();
   if ( cwWantsDialog() )
   {
      let v = sgDialog( p, p.vue ? cwViewById( p.vue ) : cwDefaultView() );
      if ( v != null )
         cwRun( SG_TITLE, function() { sgProcess( v, p ); v.window.bringToFront(); } );
      return;
   }
   let view;
   if ( p.vue )
   {
      view = cwViewById( p.vue );
      if ( view == null )
      {
         console.warningln( SG_TITLE + " : vue " + p.vue + " introuvable, rien n'est fait." );
         return;
      }
   }
   else
      view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( SG_TITLE + " : aucune image." );
   sgProcess( view, p );
   console.noteln( SG_TITLE + " : grosses étoiles de " + view.id + " saturées (taille " + p.taille + ", seuil " + p.seuil +
                   ", étendue " + p.etendue + ", passes " + p.passes + ")." );
}

main();
