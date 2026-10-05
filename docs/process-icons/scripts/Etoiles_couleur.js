// ----------------------------------------------------------------------------
// Etoiles_couleur.js — redonne leur couleur aux cœurs d'étoiles blancs.
// ----------------------------------------------------------------------------
// Les cœurs des étoiles brillantes sont saturés (R = G = B) : leur couleur
// est perdue, elle ne reste que dans le halo. Le script la reprend du halo,
// à la manière de RepairedHSVSeparation, mais sans fenêtre ni recombinaison :
//   1. Y = (R + G + B)/3 ; masque des cœurs m = rampe de 0,7·s à s, avec
//      s = seuil × max(Y) ;
//   2. couleur moyenne du halo autour de chaque cœur : flou gaussien (sigma
//      = rayon) de l'image privée de ses cœurs, (1 − m)·RGB (convolution
//      normalisée : le halo brillant pèse le plus) ;
//   3. dans les cœurs : luminance Y gardée (× plafond), rapport R:G:B du
//      halo ; le canal le plus fort ne dépasse pas 1 (teinte gardée) ;
//      hors des cœurs, rien ne change ;
//   4. saturation > 0 : ColorSaturation (même courbe qu'Etoiles_auto).
// Deux icônes :
//   - Coeurs_etoiles (P4, option, AVANT MAS, sur le RGB linéaire avec ses
//     étoiles) : vue vide (image où on glisse l'icône), seuil 0,50, rayon 8,
//     plafond 1, saturation 0 ; MAS protège ensuite les cœurs réparés ;
//   - Etoiles_couleur (P7, option, sur RGB_stars avant Etoiles_screen) :
//     vue RGB_stars (traitée quelle que soit l'image où on glisse l'icône),
//     seuil 0,80, rayon 6, plafond 0,85, saturation 1,0.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight, avec
// clodoweg_ui.jsh.
// ----------------------------------------------------------------------------

#feature-id    Etoiles_couleur : clodoweg > Couleur des cœurs d'étoiles
#feature-info  Redonne aux cœurs d'étoiles saturés (blancs) la couleur de \
   leur halo, puis sature éventuellement les étoiles.

#include "clodoweg_ui.jsh"

#define EC_TITLE "Etoiles couleur"

function ecParams()
{
   return { vue: cwParam( "vue", "" ), seuil: parseFloat( cwParam( "seuil", "0.80" ) ), rayon: parseFloat( cwParam( "rayon", "6" ) ),
            plafond: parseFloat( cwParam( "plafond", "0.85" ) ), saturation: parseFloat( cwParam( "saturation", "1.0" ) ) };
}

function ecExport( p )
{
   Parameters.set( "vue", p.vue );
   Parameters.set( "seuil", p.seuil.toFixed( 2 ) );
   Parameters.set( "rayon", p.rayon.toFixed( 1 ) );
   Parameters.set( "plafond", p.plafond.toFixed( 2 ) );
   Parameters.set( "saturation", p.saturation.toFixed( 2 ) );
}

function ecNew( view, id, expr, gray )
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
      throw new Error( EC_TITLE + " : PixelMath a échoué (" + id + ", voir la console)." );
   let w = ImageWindow.windowById( id );
   if ( w.isNull )
      throw new Error( EC_TITLE + " : vue " + id + " non créée." );
   return w;
}

function ecBlur( w, sigma )
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

function ecProcess( view, p )
{
   if ( !view.image.isColor )
      throw new Error( EC_TITLE + " : " + view.id + " n'est pas une image couleur." );
   let ids = [ "ec_y", "ec_m", "ec_a" ];
   try
   {
      let y = ecNew( view, "ec_y", "($T[0] + $T[1] + $T[2])/3", true );
      let s = p.seuil*y.mainView.image.maximum();
      if ( s <= 0 )
         throw new Error( EC_TITLE + " : image vide." );
      let s0 = 0.7*s;
      let m = ecNew( y.mainView, "ec_m", "min(1, max(0, ($T - " + s0.toFixed( 6 ) + ")/" + (s - s0).toFixed( 6 ) + "))", true );
      ecBlur( m, 1.5 );
      let surface = m.mainView.image.mean();
      console.writeln( EC_TITLE + " : seuil " + s.toFixed( 4 ) + ", cœurs traités environ " + (100*surface).toFixed( 3 ) + " % de l'image." );
      let a = ecNew( view, "ec_a", "$T*(1 - ec_m)", false );
      ecBlur( a, p.rayon );
      let pl = p.plafond.toFixed( 4 );
      let P = new PixelMath;
      P.expression = "ay = (ec_a[0] + ec_a[1] + ec_a[2])/3;\n" +
                     "yy = ec_y*(1 - ec_m*(1 - " + pl + "));\n" +
                     "mc = yy*max(ec_a[0], max(ec_a[1], ec_a[2]))/max(ay, 1e-7);\n" +
                     "c = iif(ay > 1e-7, yy*ec_a/max(ay, 1e-7)/max(1, mc), $T);\n" +
                     "ec_m*c + (1 - ec_m)*$T";
      P.symbols = "ay, yy, mc, c";
      P.useSingleExpression = true;
      P.createNewImage = false;
      P.rescale = false;
      P.truncate = true;
      if ( !P.executeOn( view ) )
         throw new Error( EC_TITLE + " : la recoloration a échoué (voir la console)." );
   }
   finally
   {
      for ( let k = 0; k < ids.length; ++k )
         cwCloseWindow( ids[ k ] );
   }
   if ( p.saturation > 0 )
   {
      let C = new ColorSaturation;
      C.HS = [ [ 0, p.saturation*0.4 ], [ 0.5, p.saturation*0.7 ], [ 1, p.saturation*0.4 ] ];
      C.HSt = ColorSaturation.prototype.AkimaSubsplines;
      C.hueShift = 0;
      C.executeOn( view );
   }
}

function ecDialog( p, view )
{
   let d = new CWDialog( EC_TITLE, "<b>Couleur des cœurs d'étoiles</b> : les cœurs saturés (blancs) prennent la couleur de leur halo ; " +
                         "hors des cœurs, rien ne change. Sur le RGB <b>linéaire</b> avant MAS (seuil 0,50, plafond 1, saturation 0) " +
                         "ou sur <b>RGB_stars</b> avant Etoiles_screen (seuil 0,80, plafond 0,85, saturation 1,0).", "Saturation ensuite :" );
   let sel = { view: view };
   d.viewList( "Image :", view, "Image couleur à traiter.", function( v ) { sel.view = v; } );
   d.numeric( "Seuil :", 0.10, 0.99, 2, p.seuil, "Début des cœurs, en fraction du maximum de luminance (plus bas = plus d'étoiles traitées).", function( v ) { p.seuil = v; } );
   d.numeric( "Rayon :", 1, 30, 1, p.rayon, "Distance (px) où la couleur du halo est prise : environ le rayon des cœurs blancs.", function( v ) { p.rayon = v; } );
   d.numeric( "Plafond :", 0.50, 1.00, 2, p.plafond, "Luminosité des cœurs (1 = gardée ; 0,85 = un peu assombris, la couleur se voit mieux).", function( v ) { p.plafond = v; } );
   d.numeric( "Saturation ensuite :", 0, 2, 2, p.saturation, "ColorSaturation après la réparation (0 = rien).", function( v ) { p.saturation = v; } );
   d.onExport = function() { p.vue = (sel.view == null || sel.view.isNull) ? "" : sel.view.id; ecExport( p ); };
   d.validate = function() { return (sel.view == null || sel.view.isNull) ? "Choisis l'image." : ""; };
   d.finish();
   return d.execute() ? sel.view : null;
}

function main()
{
   let p = ecParams();
   if ( cwWantsDialog() )
   {
      let v = ecDialog( p, p.vue ? cwViewById( p.vue ) : cwDefaultView() );
      if ( v != null )
         cwRun( EC_TITLE, function() { cwApplyOnCopy( v, function( c ) { ecProcess( c, p ); } ); } );
      return;
   }
   let view;
   if ( p.vue )
   {
      view = cwViewById( p.vue );
      if ( view == null )
      {
         console.warningln( EC_TITLE + " : vue " + p.vue + " introuvable, rien n'est fait." );
         return;
      }
   }
   else
      view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( EC_TITLE + " : aucune image." );
   // glissée sur l'image elle-même : exécution directe (historique géré par PixInsight) ;
   // sinon (autre vue, ou lancement global) : copie et recopie, pour l'affichage et le Ctrl+Z
   if ( Parameters.isViewTarget && Parameters.targetView.id == view.id )
      ecProcess( view, p );
   else
      cwApplyOnCopy( view, function( c ) { ecProcess( c, p ); } );
   console.noteln( EC_TITLE + " : cœurs de " + view.id + " recolorés (seuil " + p.seuil + ", rayon " + p.rayon + ", plafond " + p.plafond +
                   ", saturation " + p.saturation + ")." );
}

main();
