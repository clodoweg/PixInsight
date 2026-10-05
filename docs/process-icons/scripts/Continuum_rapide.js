// ----------------------------------------------------------------------------
// Continuum_rapide.js — LHaRGB, mode rapide : continuum retiré de H, H injecté
// dans le RGB, NXT sur le RGB, puis H, R et HaNB fermées. Sans fenêtre à
// remplir (remplace Continuum_auto, H_dans_RGB et C_RGB_bruit du chemin
// principal).
// ----------------------------------------------------------------------------
// Vues attendues (linéaires, alignées) : H (après BXT_L_H), R (gardée par
// Combinaison_RGB) et RGB (après C_RGB_couleur). Lancé après R_Lineaire_rapide.
//   1. coefficient k du continuum, méthode de PhotometricContinuumSubtraction
//      (Charles Hagen) simplifiée : régression robuste PAR L'ORIGINE de
//      y = H − méd(H) sur x = R − méd(R), sur les pixels nettement au-dessus
//      du fond (étoiles, galaxie ; x > 15 σ), sans les pixels saturés, sur
//      des copies réduites 4 fois (moyenne) ; départ = médiane des rapports
//      y/x, puis moindres carrés repondérés (poids de Tukey, c = 4,685) : les
//      régions HII (excès de H) sont rejetées comme points aberrants ;
//      k forcé si le paramètre k est > 0 ;
//   2. HaNB = H − k·(R − méd(R)) (même formule que PCS), tronqué à [0, 1] ;
//   3. RGB : R + w·HaNB, B + bleu·w·HaNB (part de Hβ, 0 par défaut comme
//      H_dans_RGB) ;
//   4. NoiseXTerminator sur le RGB (Denoise « nxt », 0,80 comme C_RGB_bruit ;
//      0 = pas de NXT) ;
//   5. fermer = true : H, R et HaNB fermées (false : HaNB gardée, pour
//      H_dans_L).
// Le RGB est modifié par recopie d'une image cachée (beginProcess /
// endProcess) : affichage et Ctrl+Z, depuis la fenêtre comme en conteneur.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight, avec
// clodoweg_ui.jsh.
// ----------------------------------------------------------------------------

#feature-id    Continuum_rapide : clodoweg > Continuum H et injection dans le RGB
#feature-info  LHaRGB : retire le continuum de H (coefficient calculé sur les \
   étoiles), injecte H dans le RGB, NXT, ferme H, R et HaNB.

#include "clodoweg_ui.jsh"

#define CR_TITLE "Continuum rapide"
#define CR_BIN 4
#define CR_TUKEY 4.685

function crParams()
{
   return { h: cwParam( "h", "H" ), r: cwParam( "r", "R" ), rgb: cwParam( "rgb", "RGB" ),
            k: parseFloat( cwParam( "k", "0" ) ), w: parseFloat( cwParam( "w", "1.0" ) ), bleu: parseFloat( cwParam( "bleu", "0" ) ),
            nxt: parseFloat( cwParam( "nxt", "0.80" ) ), fermer: cwBool( "fermer", true ) };
}

function crExport( p )
{
   Parameters.set( "h", p.h );
   Parameters.set( "r", p.r );
   Parameters.set( "rgb", p.rgb );
   Parameters.set( "k", p.k.toFixed( 4 ) );
   Parameters.set( "w", p.w.toFixed( 2 ) );
   Parameters.set( "bleu", p.bleu.toFixed( 2 ) );
   Parameters.set( "nxt", p.nxt.toFixed( 2 ) );
   Parameters.set( "fermer", p.fermer ? "true" : "false" );
}

// Nouvelle image cachée id = expr (PixelMath exécuté sur view).
function crNew( view, id, expr, gray )
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
      throw new Error( CR_TITLE + " : PixelMath a échoué (" + id + ", voir la console)." );
   let w = ImageWindow.windowById( id );
   if ( w.isNull )
      throw new Error( CR_TITLE + " : vue " + id + " non créée." );
   return w;
}

function crSamples( view, id )
{
   let w = crNew( view, id, "$T", true );
   let I = new IntegerResample;
   I.zoomFactor = -CR_BIN;
   I.downsamplingMode = IntegerResample.prototype.Average;
   I.executeOn( w.mainView );
   let img = w.mainView.image;
   let a = new Float32Array( img.width*img.height );
   img.getSamples( a );
   w.forceClose();
   return a;
}

function crMedian( arr )
{
   let s = Array.prototype.slice.call( arr ).sort( function( a, b ) { return a - b; } );
   let n = s.length;
   return n == 0 ? 0 : ((n & 1) ? s[ (n - 1)/2 ] : 0.5*(s[ n/2 - 1 ] + s[ n/2 ]));
}

// Médiane et écart type robuste (1,4826 × MAD) d'un tableau, sur un échantillon de 200 000 valeurs au plus.
function crStats( a )
{
   let step = Math.max( 1, Math.floor( a.length/200000 ) ), s = [];
   for ( let i = 0; i < a.length; i += step )
      s.push( a[ i ] );
   let m = crMedian( s );
   let d = s.map( function( v ) { return Math.abs( v - m ); } );
   return { med: m, sigma: 1.4826*crMedian( d ) };
}

// Coefficient k : régression robuste par l'origine de (H − méd H) sur (R − méd R).
function crCoefficient( hView, rView )
{
   let H = crSamples( hView, "cr_h" ), R = crSamples( rView, "cr_r" );
   let sh = crStats( H ), sr = crStats( R );
   let xs = [], ys = [];
   let seuil = 15*sr.sigma;
   for ( let i = 0; i < R.length; ++i )
   {
      let x = R[ i ] - sr.med;
      if ( x > seuil && R[ i ] < 0.8 && H[ i ] < 0.8 )
      {
         xs.push( x );
         ys.push( H[ i ] - sh.med );
      }
   }
   console.writeln( CR_TITLE + " : " + xs.length + " pixels au-dessus de 15 σ du fond de R utilisés pour k." );
   if ( xs.length < 200 )
      throw new Error( CR_TITLE + " : trop peu de pixels brillants pour calculer k (" + xs.length + "). Donne k à la main (paramètre k, 0,1 à 0,5 en général)." );
   let k = crMedian( xs.map( function( x, i ) { return ys[ i ]/x; } ) );
   for ( let it = 0; it < 10; ++it )
   {
      let res = xs.map( function( x, i ) { return ys[ i ] - k*x; } );
      let s = 1.4826*crMedian( res.map( Math.abs ) );
      if ( s <= 0 )
         break;
      let num = 0, den = 0;
      for ( let i = 0; i < xs.length; ++i )
      {
         let u = res[ i ]/(CR_TUKEY*s);
         if ( Math.abs( u ) >= 1 )
            continue;
         let wt = (1 - u*u)*(1 - u*u);
         num += wt*xs[ i ]*ys[ i ];
         den += wt*xs[ i ]*xs[ i ];
      }
      if ( den <= 0 )
         break;
      let k2 = num/den;
      if ( Math.abs( k2 - k ) < 1e-6 )
      {
         k = k2;
         break;
      }
      k = k2;
   }
   return { k: k, medR: sr.med };
}

function crNxt( view, denoise )
{
   let N = new NoiseXTerminator;
   N.denoise = denoise;
   N.iterations = 1;
   N.enable_color_separation = false;
   N.enable_frequency_separation = false;
   if ( !N.executeOn( view ) )
      throw new Error( CR_TITLE + " : NoiseXTerminator a échoué (voir la console)." );
}

function crRun( p )
{
   let hView = cwViewById( p.h ), rView = cwViewById( p.r ), rgbView = cwViewById( p.rgb );
   if ( hView == null || rView == null || rgbView == null )
      throw new Error( CR_TITLE + " : vues " + p.h + ", " + p.r + " et " + p.rgb + " attendues (ouvertes, linéaires, alignées)." );
   if ( !rgbView.image.isColor )
      throw new Error( CR_TITLE + " : " + p.rgb + " doit être l'image couleur." );
   let c = crCoefficient( hView, rView );
   let k = (p.k > 0) ? p.k : c.k;
   console.noteln( CR_TITLE + " : k = " + k.toFixed( 4 ) + (p.k > 0 ? " (donné)" : " (calculé ; " + c.k.toFixed( 4 ) + ")") + "." );
   if ( !(k > 0) || k > 2 )
      throw new Error( CR_TITLE + " : k = " + k.toFixed( 4 ) + " invraisemblable ; vérifie H et R (alignées, linéaires) ou donne k à la main." );
   cwCloseWindow( "HaNB" );
   let ha = crNew( hView, "HaNB", "$T - " + k.toFixed( 6 ) + "*(" + p.r + " - " + c.medR.toFixed( 8 ) + ")", true );
   let wv = p.w.toFixed( 4 ), bv = (p.bleu*p.w).toFixed( 4 );
   cwCloseWindow( "cr_rgb" );
   let P = new PixelMath;
   P.expression = "$T + " + wv + "*HaNB";
   P.expression1 = "$T";
   P.expression2 = "$T + " + bv + "*HaNB";
   P.useSingleExpression = false;
   P.createNewImage = true;
   P.showNewImage = false;
   P.newImageId = "cr_rgb";
   P.newImageColorSpace = PixelMath.prototype.SameAsTarget;
   P.newImageSampleFormat = PixelMath.prototype.f32;
   P.rescale = false;
   P.truncate = true;
   if ( !P.executeOn( rgbView ) )
      throw new Error( CR_TITLE + " : l'injection de HaNB a échoué (voir la console)." );
   let inj = ImageWindow.windowById( "cr_rgb" );
   if ( inj.isNull )
      throw new Error( CR_TITLE + " : image injectée non créée." );
   try
   {
      if ( p.nxt > 0 )
         crNxt( inj.mainView, p.nxt );
      rgbView.beginProcess();
      rgbView.image.assign( inj.mainView.image );
      rgbView.endProcess();
   }
   finally
   {
      inj.forceClose();
   }
   if ( p.fermer )
   {
      ha.forceClose();
      cwCloseWindow( p.h );
      cwCloseWindow( p.r );
   }
   else
      ha.show();
   rgbView.window.bringToFront();
   console.noteln( CR_TITLE + " : HaNB = " + p.h + " − " + k.toFixed( 4 ) + "·(" + p.r + " − méd), injecté dans " + p.rgb + " (w " + p.w + ", bleu " + p.bleu + ")" +
                   (p.nxt > 0 ? ", NXT " + p.nxt : "") + (p.fermer ? " ; " + p.h + ", " + p.r + " et HaNB fermées." : " ; HaNB gardée.") );
}

function crDialog( p )
{
   let d = new CWDialog( CR_TITLE, "<b>LHaRGB, mode rapide</b> : continuum retiré de H (k calculé sur les étoiles : régression robuste de H sur R), " +
                         "HaNB injecté dans le rouge du RGB, NXT sur le RGB, puis H, R et HaNB fermées. Images linéaires et alignées, après R_Lineaire_rapide.", "Part du bleu (Hβ) :" );
   d.viewList( "H :", cwViewById( p.h ), "Master H (linéaire, après BXT_L_H).", function( v ) { p.h = v.isNull ? "" : v.id; } );
   d.viewList( "R :", cwViewById( p.r ), "Master R (gardé par Combinaison_RGB).", function( v ) { p.r = v.isNull ? "" : v.id; } );
   d.viewList( "RGB :", cwViewById( p.rgb ), "Image couleur linéaire (après C_RGB_couleur).", function( v ) { p.rgb = v.isNull ? "" : v.id; } );
   d.numeric( "k (0 = auto) :", 0, 1, 4, p.k, "Coefficient du continuum : 0 = calculé ; sinon valeur forcée (0,1 à 0,5 en général).", function( v ) { p.k = v; } );
   d.numeric( "w :", 0, 3, 2, p.w, "Force de l'injection dans le rouge (1,0 ; régions HII rouge vif : 0,5 ; invisibles : 2).", function( v ) { p.w = v; } );
   d.numeric( "Part du bleu (Hβ) :", 0, 0.35, 2, p.bleu, "Ajout au bleu = part × w × HaNB (0 ; 0,2 donne des régions HII plus roses ; 0,35 au plus).", function( v ) { p.bleu = v; } );
   d.numeric( "NXT (0 = aucun) :", 0, 1, 2, p.nxt, "Denoise de NoiseXTerminator sur le RGB (0,80 comme C_RGB_bruit).", function( v ) { p.nxt = v; } );
   d.check( "Fermer H, R et HaNB à la fin", p.fermer, "Décoche pour garder HaNB (option H_dans_L).", function( c ) { p.fermer = c; } );
   d.onExport = function() { crExport( p ); };
   d.validate = function() { return (p.h && p.r && p.rgb) ? "" : "Choisis H, R et RGB."; };
   d.finish();
   return d.execute();
}

function main()
{
   let p = crParams();
   if ( cwWantsDialog() )
   {
      if ( crDialog( p ) )
         cwRun( CR_TITLE, function() { crRun( p ); } );
      return;
   }
   crRun( p );
}

main();
