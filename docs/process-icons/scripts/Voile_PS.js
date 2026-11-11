// ----------------------------------------------------------------------------
// Voile_PS.js — Correction du voile (Dehaze) façon Photoshop / Lightroom.
// ----------------------------------------------------------------------------
// Adobe ne publie pas son code. Modèle de ses brevets (US9508126B2, US9508129B1 :
// I = J·t + A·(1 − t), canal sombre de He et al. 2009), CALÉ sur une image de
// l'utilisateur avant / après Photoshop « Correction du voile +20 » (11 novembre
// 2026, JPEG 1631 × 2000 de sa nébuleuse SHO) :
//   1. lumière de l'air A = 99e centile de chaque canal × (0,71 ; 1,08 ; 1,03)
//      (facteurs mesurés : Photoshop retire moins de rouge que de vert/bleu) ;
//   2. canal sombre d = min(R/A_R, G/A_G, B/A_B) (valeurs gamma sRGB, le calage
//      est meilleur qu'en linéaire), moyenné puis lissé à très grande échelle
//      (rayon = 7,4 % de la largeur de l'image : meilleur calage) ;
//   3. transmission t = max(t0 = 0,10 ; 1 − ω·d), ω = 0,00765 × force
//      (+20 -> 0,153) ; J = (I − A)/t + A, bornée à [0, 1].
// Calage : 59 % de la variation de Photoshop reproduite (R²), écart moyen
// 0,0071 contre 0,0144 sans rien faire ; variation moyenne R/G/B proche
// (Photoshop −0,006 / −0,017 / −0,017). Une seule image de calage : autres
// forces et autres images non vérifiées (ω supposé proportionnel à la force).
// Calcul en JavaScript : passes 1 et 2 sur un pixel sur 4 (centile, grille du
// canal sombre), passe 3 sur toute l'image. Copie cachée puis recopie : Ctrl+Z.
// Non testé dans PixInsight.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Voile_PS : clodoweg > Correction du voile (façon Photoshop)
#feature-info  Correction du voile (Dehaze) : modèle physique, canal sombre, \
   calcul en sRGB linéaire.

#include <pjsr/UndoFlag.jsh>

#include "clodoweg_ui.jsh"

#define TITLE "Correction du voile"


function vpParams()
{
   return { force: parseFloat( cwParam( "force", "20" ) ), rayon: parseFloat( cwParam( "rayon", "7.4" ) ), t0: parseFloat( cwParam( "t0", "0.10" ) ) };
}

function vpExport( p )
{
   Parameters.set( "force", p.force.toFixed( 0 ) );
   Parameters.set( "rayon", p.rayon.toFixed( 1 ) );
   Parameters.set( "t0", p.t0.toFixed( 2 ) );
}

// facteurs de A mesurés sur l'image de calage (Photoshop +20)
var VP_KA = [ 0.71, 1.08, 1.03 ];
var VP_OMEGA = 0.00765;   // ω par unité de force (0,153 à +20)

function vpProcess( view, p )
{
   let w = VP_OMEGA*Math.max( 0, Math.min( 100, p.force ) );
   if ( w <= 0 )
   {
      console.warningln( TITLE + " : force 0, rien ne change." );
      return;
   }
   let img = view.image, W = img.width, H = img.height, pas = 4;
   let R = [], G = [], B = [];
   // 1. 99e centile de chaque canal (un pixel sur 4)
   let NB = 1024, hist = [ [], [], [] ], tot = 0;
   for ( let c = 0; c < 3; ++c ) for ( let k = 0; k < NB; ++k ) hist[ c ][ k ] = 0;
   for ( let y = 0; y < H; y += pas )
   {
      let r = new Rect( 0, y, W, y + 1 );
      img.getSamples( R, r, 0 ); img.getSamples( G, r, 1 ); img.getSamples( B, r, 2 );
      for ( let x = 0; x < W; x += pas )
      {
         hist[ 0 ][ Math.min( NB - 1, Math.floor( Math.max( 0, R[ x ] )*NB ) ) ]++;
         hist[ 1 ][ Math.min( NB - 1, Math.floor( Math.max( 0, G[ x ] )*NB ) ) ]++;
         hist[ 2 ][ Math.min( NB - 1, Math.floor( Math.max( 0, B[ x ] )*NB ) ) ]++;
         ++tot;
      }
   }
   let A = [];
   for ( let c = 0; c < 3; ++c )
   {
      let n = 0, k = 0;
      for ( ; k < NB; ++k ) { n += hist[ c ][ k ]; if ( n >= 0.99*tot ) break; }
      A.push( Math.max( 0.05, Math.min( 1, (k + 0.5)/NB*VP_KA[ c ] ) ) );
   }
   // 2. grille du canal sombre normalisé (moyenne par case), un pixel sur 4
   let nx = 96, cw = Math.ceil( W/nx ), ny = Math.ceil( H/cw ), ch = cw;
   let somme = [], nb = [];
   for ( let k = 0; k < nx*ny; ++k ) { somme[ k ] = 0; nb[ k ] = 0; }
   for ( let y = 0; y < H; y += pas )
   {
      let r = new Rect( 0, y, W, y + 1 );
      img.getSamples( R, r, 0 ); img.getSamples( G, r, 1 ); img.getSamples( B, r, 2 );
      let gy = Math.min( ny - 1, Math.floor( y/ch ) );
      for ( let x = 0; x < W; x += pas )
      {
         let d = Math.min( R[ x ]/A[ 0 ], G[ x ]/A[ 1 ], B[ x ]/A[ 2 ] );
         let k = gy*nx + Math.min( nx - 1, Math.floor( x/cw ) );
         somme[ k ] += d; nb[ k ]++;
      }
   }
   let grille = [];
   for ( let k = 0; k < nx*ny; ++k ) grille[ k ] = nb[ k ] > 0 ? somme[ k ]/nb[ k ] : 0;
   // lissage gaussien de la grille (sigma en cases), bords recopiés
   let sg = Math.max( 0.5, p.rayon/100*W/cw ), rad = Math.ceil( 3*sg ), noyau = [], sn = 0;
   for ( let i = -rad; i <= rad; ++i ) { let v = Math.exp( -i*i/(2*sg*sg) ); noyau.push( v ); sn += v; }
   for ( let i = 0; i < noyau.length; ++i ) noyau[ i ] /= sn;
   let tmp = [];
   for ( let gy = 0; gy < ny; ++gy )
      for ( let gx = 0; gx < nx; ++gx )
      {
         let v = 0;
         for ( let i = -rad; i <= rad; ++i ) v += noyau[ i + rad ]*grille[ gy*nx + Math.min( nx - 1, Math.max( 0, gx + i ) ) ];
         tmp[ gy*nx + gx ] = v;
      }
   for ( let gy = 0; gy < ny; ++gy )
      for ( let gx = 0; gx < nx; ++gx )
      {
         let v = 0;
         for ( let i = -rad; i <= rad; ++i ) v += noyau[ i + rad ]*tmp[ Math.min( ny - 1, Math.max( 0, gy + i ) )*nx + gx ];
         grille[ gy*nx + gx ] = v;
      }
   // 3. image entière : canal sombre interpolé (bilinéaire, centres des cases), t, J
   view.beginProcess( UndoFlag_NoSwapFile );
   try
   {
      let bloc = 64;
      for ( let y0 = 0; y0 < H; y0 += bloc )
      {
         let y1 = Math.min( H, y0 + bloc ), rect = new Rect( 0, y0, W, y1 );
         img.getSamples( R, rect, 0 ); img.getSamples( G, rect, 1 ); img.getSamples( B, rect, 2 );
         for ( let y = y0; y < y1; ++y )
         {
            let fy = Math.min( ny - 1, Math.max( 0, (y + 0.5)/ch - 0.5 ) ), iy = Math.min( ny - 2, Math.floor( fy ) ), ty = fy - iy;
            if ( ny < 2 ) { iy = 0; ty = 0; }
            let base = (y - y0)*W;
            for ( let x = 0; x < W; ++x )
            {
               let fx = Math.min( nx - 1, Math.max( 0, (x + 0.5)/cw - 0.5 ) ), ix = Math.min( nx - 2, Math.floor( fx ) ), tx = fx - ix;
               let k0 = iy*nx + ix, k1 = (ny < 2) ? k0 : k0 + nx;
               let d = (grille[ k0 ]*(1 - tx) + grille[ k0 + 1 ]*tx)*(1 - ty) + (grille[ k1 ]*(1 - tx) + grille[ k1 + 1 ]*tx)*ty;
               let t = Math.max( p.t0, 1 - w*d ), i = base + x;
               R[ i ] = Math.min( 1, Math.max( 0, (R[ i ] - A[ 0 ])/t + A[ 0 ] ) );
               G[ i ] = Math.min( 1, Math.max( 0, (G[ i ] - A[ 1 ])/t + A[ 1 ] ) );
               B[ i ] = Math.min( 1, Math.max( 0, (B[ i ] - A[ 2 ])/t + A[ 2 ] ) );
            }
         }
         img.setSamples( R, rect, 0 ); img.setSamples( G, rect, 1 ); img.setSamples( B, rect, 2 );
         processEvents();
      }
   }
   finally
   {
      view.endProcess();
   }
   console.noteln( TITLE + " : force " + p.force.toFixed( 0 ) + " (ω " + w.toFixed( 3 ) + "), A = " + A.map( function( a ) { return a.toFixed( 3 ); } ).join( " / " ) +
                   ", rayon " + p.rayon + " % de la largeur, t0 " + p.t0 + "." );
}

function vpRun( view, p )
{
   if ( !view.image.isColor )
   {
      console.warningln( TITLE + " : " + view.id + " n'est pas en couleur, rien n'est fait." );
      return;
   }
   cwApplyOnCopy( view, function( c ) { vpProcess( c, p ); } );
}

#define VP_APERCU "VP_apercu"

function vpDialog( p, view )
{
   let d = new CWDialog( TITLE, "<b>Correction du voile</b> façon Photoshop / Lightroom : modèle physique des brevets d'Adobe (canal sombre), " +
                         "calé sur ton image avant / après Photoshop +20. Force +20 = ton réglage Photoshop.", "Transmission min. (t0) :" );
   let sel = { view: view };
   d.viewList( "Image :", view, "Image couleur finie (sRGB).", function( v ) { sel.view = v; } );
   d.numeric( "Force :", 0, 100, 0, p.force, "Comme le curseur de Photoshop (0 à 100) : +20 par défaut.", function( v ) { p.force = v; } );
   d.numeric( "Rayon (% largeur) :", 1, 20, 1, p.rayon, "Taille des zones où le voile est estimé, en % de la largeur de l'image (7,4 : calé sur Photoshop).", function( v ) { p.rayon = v; } );
   d.numeric( "Transmission min. (t0) :", 0.05, 0.50, 2, p.t0, "Limite l'effet dans les zones très voilées.", function( v ) { p.t0 = v; } );
   d.button( "Aperçu", "Applique sur une copie affichée dans la vue VP_apercu ; l'image ne change pas.", function()
   {
      if ( sel.view == null || sel.view.isNull || !sel.view.image.isColor )
         return;
      cwRun( TITLE, function()
      {
         cwCloseWindow( VP_APERCU );
         let w = cwPixelMathNew( sel.view, "$T", VP_APERCU );
         vpProcess( w.mainView, p );
         w.show();
         w.zoomToFit();
      } );
   } );
   d.onExport = function() { vpExport( p ); };
   d.validate = function() { return (sel.view == null || sel.view.isNull) ? "Choisis l'image." : (sel.view.image.isColor ? "" : "L'image doit être en couleur."); };
   d.finish();
   let ok = d.execute();
   cwCloseWindow( VP_APERCU );
   return ok ? sel.view : null;
}

function main()
{
   let p = vpParams();
   if ( cwWantsDialog() )
   {
      let v = vpDialog( p, cwDefaultView() );
      if ( v != null )
         cwRun( TITLE, function() { vpRun( v, p ); } );
      return;
   }
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( TITLE + " : aucune image." );
   vpRun( view, p );
}

main();
