// ----------------------------------------------------------------------------
// Stat_canaux.js — Statistical Stretch sur plusieurs canaux mono en un clic
// (S, H, O), à la place des GHS (demande de l'utilisateur, 9 octobre 2026).
// ----------------------------------------------------------------------------
// Le script SetiAstro statisticalstretch.js ne s'applique qu'à la vue glissée :
// impossible de le lancer sur S, H et O d'un coup. Ce script refait son calcul
// (code v2.3 relu), une passe, pour chaque vue de « vues » :
//   1. point noir bp = médiane − sigma × 1,4826 × MAD (jamais sous le
//      minimum de l'image) ; x' = (x − bp) / (1 − bp) ;
//   2. fonction de transfert des tons moyens qui place la médiane sur
//      « cible » : y = mtf(m, x'), m = c·(cible − 1) / (2·c·cible − cible − c),
//      c = médiane de x'.
// Même cible pour tous les canaux : médianes identiques. Ensuite GHS_3_fond
// sur chaque canal (fond 0,25 -> 0,12-0,14).
// Calcul sur une copie cachée puis recopie (cwApplyOnCopy) : un Ctrl+Z par vue.
//
// Lancement : double-clic puis Apply Global (fenêtre), ou dans un conteneur
// Apply Global (R_C_Stat_canaux_rapide) : réglages de l'icône.
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Stat_canaux : clodoweg > Statistical Stretch sur S, H, O
#feature-info  Statistical Stretch (calcul de SetiAstro) sur plusieurs \
   canaux mono en un clic, même médiane cible.

#include "clodoweg_ui.jsh"

#define SC_TITLE "Stat canaux"

function scParams()
{
   return { vues: cwParam( "vues", "S,H,O" ), cible: parseFloat( cwParam( "cible", "0.25" ) ), sigma: parseFloat( cwParam( "sigma", "5" ) ) };
}

function scExport( p )
{
   Parameters.set( "vues", p.vues );
   Parameters.set( "cible", p.cible.toFixed( 2 ) );
   Parameters.set( "sigma", p.sigma.toFixed( 1 ) );
}

function scDialog( p )
{
   let d = new CWDialog( SC_TITLE, "<b>Statistical Stretch</b> (calcul de SetiAstro) sur chaque canal mono, même médiane cible. " +
                         "Canaux LINÉAIRES sans étoiles ; ensuite GHS_3_fond sur chaque canal.", "Blackpoint Sigma :" );
   d.edit( "Vues :", p.vues, "Canaux à étirer, séparés par des virgules (S,H,O ; HOO : H,O).", function( t ) { p.vues = t.trim(); } );
   d.numeric( "Target Median :", 0.05, 0.5, 2, p.cible, "0,25 par défaut (comme Statistical_Stretch), puis GHS_3_fond.", function( v ) { p.cible = v; } );
   d.numeric( "Blackpoint Sigma :", 0, 10, 1, p.sigma, "5 par défaut : plus haut = fond plus sombre ; plus bas = plus de signal faible.", function( v ) { p.sigma = v; } );
   d.onExport = function() { scExport( p ); };
   d.validate = function()
   {
      let l = scListe( p.vues );
      if ( l.length == 0 )
         return "Aucune vue.";
      for ( let i = 0; i < l.length; ++i )
         if ( ImageWindow.windowById( l[ i ] ).isNull )
            return "Vue " + l[ i ] + " absente.";
      return "";
   };
   d.finish( "Étirer" );
   return d.execute();
}

function scListe( vues )
{
   return vues.split( "," ).map( function( s ) { return s.trim(); } ).filter( function( s ) { return s.length > 0; } );
}

// une passe de Statistical Stretch sur view (mono ou couleur liée)
function scEtire( view, p )
{
   let img = view.image;
   let med = img.median(), mad = img.MAD(), mini = img.minimum();
   let bp = Math.max( mini, med - p.sigma*1.4826*mad );
   if ( bp >= 1 )
      bp = 0;
   let c = (med - bp)/(1 - bp);
   let t = p.cible;
   let m = c*(t - 1)/(2*c*t - t - c);
   let P = new PixelMath;
   P.expression = "mtf(" + m.toFixed( 8 ) + ", max(0, ($T - " + bp.toFixed( 8 ) + ")/(1 - " + bp.toFixed( 8 ) + ")))";
   P.useSingleExpression = true;
   P.createNewImage = false;
   P.rescale = false;
   P.truncate = true;
   P.executeOn( view );
   return { bp: bp, med: med, m: m };
}

function scRun( p )
{
   let l = scListe( p.vues );
   console.show();
   for ( let i = 0; i < l.length; ++i )
   {
      let w = ImageWindow.windowById( l[ i ] );
      if ( w.isNull )
      {
         console.warningln( SC_TITLE + " : vue " + l[ i ] + " absente, ignorée." );
         continue;
      }
      let r = null;
      cwApplyOnCopy( w.mainView, function( c ) { r = scEtire( c, p ); } );
      console.noteln( SC_TITLE + " : " + l[ i ] + " étirée (médiane " + r.med.toFixed( 5 ) + " -> " + p.cible + ", point noir " + r.bp.toFixed( 5 ) + ")." );
   }
}

function main()
{
   let p = scParams();
   if ( cwWantsDialog() )
   {
      if ( scDialog( p ) )
         cwRun( SC_TITLE, function() { scRun( p ); } );
      return;
   }
   scRun( p );
}

main();
