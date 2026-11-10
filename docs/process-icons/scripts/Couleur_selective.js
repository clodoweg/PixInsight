// ----------------------------------------------------------------------------
// Couleur_selective.js — équivalent de Couleur sélective de Photoshop
// (Image > Réglages > Couleur sélective), réglages lus dans les profils .asv
// de l'utilisateur (SHO, SHO_2, SHO_3 ; 8 novembre 2026).
// ----------------------------------------------------------------------------
// Neuf gammes (rouges, jaunes, verts, cyans, bleus, magentas, blancs, neutres,
// noirs), chacune « c,m,y,k » de -100 à +100 (cyan, magenta, jaune, noir).
// Adobe ne publie pas la formule ; méthode reconstituée (choix de ma part,
// celle des réimplémentations courantes) :
//   poids de chaque gamme pour un pixel (mx, md, mn = plus grand, moyen, plus
//   petit de R, G, B) : rouges = mx − md si R est le plus grand ; jaunes =
//   md − mn si B est le plus petit ; verts = mx − md si G est le plus grand ;
//   cyans = md − mn si R est le plus petit ; bleus = mx − md si B est le plus
//   grand ; magentas = md − mn si G est le plus petit ; blancs = 2·(mn − 0,5)
//   si mn > 0,5 ; noirs = 2·(0,5 − mx) si mx < 0,5 ; neutres = 1 − |mx − 0,5|
//   − |mn − 0,5| ;
//   encre : cyan agit sur R, magenta sur G, jaune sur B ; pour un réglage a
//   (−1 à 1) et un noir k : d = ((−1 − a)·k − a)·(1 − v) en relatif (× 1 en
//   absolu), borné à [−v, 1 − v] ; chaque canal v reçoit la somme des
//   poids × d de toutes les gammes.
// Calcul sur une copie cachée puis recopie (cwApplyOnCopy) : Ctrl+Z.
// Fenêtre : bouton Aperçu (copie affichée dans la vue CS_apercu) et préréglages SHO, SHO 2, SHO 3 (10 novembre 2026).
// Non testé dans PixInsight.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Couleur_selective : clodoweg > Couleur sélective (façon Photoshop)
#feature-info  Équivalent de Couleur sélective de Photoshop : neuf gammes de \
   couleurs, réglages cyan, magenta, jaune, noir.

#include "clodoweg_ui.jsh"

#define TITLE "Couleur selective"

// gamme : clé, libellé, poids (expression PixelMath, symboles sr, sg, sb, smx, smd, smn)
var CS_GAMMES = [
   [ "rouges", "Rouges :", "iif(sr == smx, smx - smd, 0)" ],
   [ "jaunes", "Jaunes :", "iif(sb == smn, smd - smn, 0)" ],
   [ "verts", "Verts :", "iif(sg == smx, smx - smd, 0)" ],
   [ "cyans", "Cyans :", "iif(sr == smn, smd - smn, 0)" ],
   [ "bleus", "Bleus :", "iif(sb == smx, smx - smd, 0)" ],
   [ "magentas", "Magentas :", "iif(sg == smn, smd - smn, 0)" ],
   [ "blancs", "Blancs :", "max(0, 2*(smn - 0.5))" ],
   [ "neutres", "Neutres :", "max(0, 1 - abs(smx - 0.5) - abs(smn - 0.5))" ],
   [ "noirs", "Noirs :", "max(0, 2*(0.5 - smx))" ] ];

// Préréglages de la fenêtre (profils .asv de l'utilisateur, méthode relative ; demande de l'utilisateur, 10 novembre 2026) :
// rouges, jaunes, verts, cyans ; bleus, magentas, blancs, neutres, noirs à 0
var CS_PRESETS = [
   [ "SHO", { rouges: "-25,25,0,0", jaunes: "-50,50,0,0", verts: "-50,50,0,0", cyans: "0,0,-50,0" } ],
   [ "SHO 2", { rouges: "-25,25,0,0", jaunes: "-25,25,0,0", verts: "-50,50,0,0", cyans: "0,0,-50,0" } ],
   [ "SHO 3", { rouges: "0,0,0,0", jaunes: "-25,25,0,0", verts: "-50,50,0,0", cyans: "0,0,-50,0" } ],
   [ "Aucun (tout à 0)", {} ] ];

function csParse( t )
{
   let v = t.split( "," ).map( function( x ) { let n = parseFloat( x ); return isNaN( n ) ? 0 : Math.max( -100, Math.min( 100, n ) ); } );
   while ( v.length < 4 )
      v.push( 0 );
   return v.slice( 0, 4 );
}

function csParams()
{
   let p = { relatif: cwBool( "relatif", true ) };
   CS_GAMMES.forEach( function( sg ) { p[ sg[ 0 ] ] = cwParam( sg[ 0 ], "0,0,0,0" ); } );
   return p;
}

function csExport( p )
{
   CS_GAMMES.forEach( function( sg ) { Parameters.set( sg[ 0 ], csParse( p[ sg[ 0 ] ] ).join( "," ) ); } );
   Parameters.set( "relatif", p.relatif ? "true" : "false" );
}

// expression du canal ch (0 = R / cyan, 1 = G / magenta, 2 = B / jaune) ; "" si rien ne change
function csExpr( p, ch )
{
   let v = [ "sr", "sg", "sb" ][ ch ];
   let terms = [];
   CS_GAMMES.forEach( function( sg )
   {
      let a = csParse( p[ sg[ 0 ] ] );
      let ai = a[ ch ]/100, k = a[ 3 ]/100;
      let f = (-1 - ai)*k - ai;
      if ( Math.abs( f ) < 1e-6 )
         return;
      let d = f.toFixed( 4 ) + (p.relatif ? "*(1 - " + v + ")" : "");
      terms.push( "(" + sg[ 2 ] + ")*min(max(" + d + ", -" + v + "), 1 - " + v + ")" );
   } );
   if ( terms.length == 0 )
      return "";
   return "sr = $T[0]; sg = $T[1]; sb = $T[2];\nsmx = max(sr, sg, sb); smn = min(sr, sg, sb); smd = sr + sg + sb - smx - smn;\n" + v + " + " + terms.join( "\n + " );
}

function csProcess( view, p )
{
   let e = [ csExpr( p, 0 ), csExpr( p, 1 ), csExpr( p, 2 ) ];
   if ( e[ 0 ] == "" && e[ 1 ] == "" && e[ 2 ] == "" )
   {
      console.warningln( TITLE + " : tous les réglages sont à 0, rien ne change." );
      return;
   }
   let P = new PixelMath;
   P.expression = e[ 0 ] == "" ? "$T" : e[ 0 ];
   P.expression1 = e[ 1 ] == "" ? "$T" : e[ 1 ];
   P.expression2 = e[ 2 ] == "" ? "$T" : e[ 2 ];
   P.useSingleExpression = false;
   P.symbols = "sr, sg, sb, smx, smn, smd";
   P.createNewImage = false;
   P.rescale = false;
   P.truncate = true;
   if ( !P.executeOn( view ) )
      throw new Error( TITLE + " : PixelMath a échoué (voir la console)." );
}

function csRun( view, p )
{
   if ( !view.image.isColor )
   {
      console.warningln( TITLE + " : " + view.id + " n'est pas en couleur, rien n'est fait." );
      return;
   }
   cwApplyOnCopy( view, function( c ) { csProcess( c, p ); } );
   console.noteln( TITLE + " : " + view.id + " (" + (p.relatif ? "relatif" : "absolu") + " ; " +
                   CS_GAMMES.map( function( g ) { return g[ 0 ] + " " + csParse( p[ g[ 0 ] ] ).join( "/" ); } ).join( ", " ) + ")." );
}

// Aperçu (demande de l'utilisateur, 10 novembre 2026) : copie de l'image, réglages de la fenêtre appliqués, affichée dans
// la vue CS_apercu (remplacée à chaque clic) ; l'image n'est pas modifiée ; vue fermée quand la fenêtre se ferme.
#define CS_APERCU "CS_apercu"

function csPreview( view, p )
{
   cwCloseWindow( CS_APERCU );
   let w = cwPixelMathNew( view, "$T", CS_APERCU );
   try
   {
      csProcess( w.mainView, p );
   }
   catch ( e )
   {
      w.forceClose();
      throw e;
   }
   w.show();
   w.zoomToFit();
   console.noteln( TITLE + " : aperçu dans " + CS_APERCU + " (l'image " + view.id + " n'est pas modifiée)." );
}

function csDialog( p, view )
{
   let d = new CWDialog( TITLE, "<b>Couleur sélective</b> façon Photoshop : pour chaque gamme, « cyan, magenta, jaune, noir » de -100 à +100 " +
                         "(ex. verts -50,50,0,0 : vert tiré vers l'or). Formule d'Adobe non publiée : équivalent approché.", "Magentas :" );
   let sel = { view: view };
   d.viewList( "Image :", view, "Image couleur (finie, ou sans étoiles après la palette).", function( v ) { sel.view = v; } );
   let methode = d.combo( "Méthode :", [ "relative (comme tes profils)", "absolue" ], p.relatif ? 0 : 1, "Relative : proportionnelle à l'encre déjà présente.", function( k ) { p.relatif = k == 0; } );
   let edits = {};
   d.combo( "Préréglage :", [ "(réglages actuels)" ].concat( CS_PRESETS.map( function( x ) { return x[ 0 ]; } ) ), 0,
            "Remplit les gammes avec un de tes profils Photoshop (méthode relative) ; tu peux ensuite modifier les valeurs.", function( k )
   {
      if ( k == 0 )
         return;
      let v = CS_PRESETS[ k - 1 ][ 1 ];
      CS_GAMMES.forEach( function( g )
      {
         p[ g[ 0 ] ] = v[ g[ 0 ] ] || "0,0,0,0";
         if ( edits[ g[ 0 ] ] )
            edits[ g[ 0 ] ].text = p[ g[ 0 ] ];
      } );
      p.relatif = true;
      methode.currentItem = 0;
   } );
   d.group( "Gammes : cyan, magenta, jaune, noir" );
   CS_GAMMES.forEach( function( g ) { edits[ g[ 0 ] ] = d.edit( g[ 1 ], p[ g[ 0 ] ], "Quatre nombres séparés par des virgules, de -100 à +100.", function( t ) { p[ g[ 0 ] ] = t.trim(); } ); } );
   d.endGroup();
   d.button( "Aperçu", "Applique les réglages à une copie, affichée dans la vue CS_apercu ; l'image ne change pas. Reclique après chaque changement.", function()
   {
      if ( sel.view == null || sel.view.isNull || !sel.view.image.isColor )
         return;
      cwRun( TITLE, function() { csPreview( sel.view, p ); } );
   } );
   d.onExport = function() { csExport( p ); };
   d.validate = function() { return (sel.view == null || sel.view.isNull) ? "Choisis l'image." : (sel.view.image.isColor ? "" : "L'image doit être en couleur."); };
   d.finish();
   let ok = d.execute();
   cwCloseWindow( CS_APERCU );
   return ok ? sel.view : null;
}

function main()
{
   let p = csParams();
   if ( cwWantsDialog() )
   {
      let v = csDialog( p, cwDefaultView() );
      if ( v != null )
         cwRun( TITLE, function() { csRun( v, p ); } );
      return;
   }
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( TITLE + " : aucune image." );
   csRun( view, p );
}

main();
