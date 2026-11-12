// ----------------------------------------------------------------------------
// Magenta_moins.js — retire le magenta / violet d'une image couleur
// (méthode classique « inverser, SCNR vert, inverser »).
// ----------------------------------------------------------------------------
// Le magenta, c'est du vert qui manque : R et B au-dessus de G. Dans l'image
// inversée, il devient du vert, que SCNR retire ; écrit sans inversion :
//   methode = min (défaut, « Maximum Neutral » de SCNR dans l'image
//     inversée) : G' = max(G, min(R, B)) : seul le vrai magenta (R ET B
//     au-dessus de G) est touché ; un bleu (R < G) ou un rouge/orange (B < G)
//     ne change pas ;
//   methode = moyenne (« Average Neutral ») : G' = max(G, (R + B)/2) : plus
//     fort, touche aussi les bleus-violets et les roses ;
//   force (0 à 1, 0,80 par défaut) : G'' = G + force·(G' − G).
// R et B ne changent pas : le magenta devient gris/neutre ou tire vers la
// teinte voisine (bleu ou rouge), un peu plus clair.
// Calcul sur une copie cachée puis recopie (cwApplyOnCopy) : Ctrl+Z.
// Demande de l'utilisateur, 12 novembre 2026. Non testé dans PixInsight.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Magenta_moins : clodoweg > Retirer le magenta
#feature-info  Retire le magenta / violet (inverser, SCNR vert, inverser), \
   sans toucher aux bleus ni aux rouges (méthode min).

#include "clodoweg_ui.jsh"

#define TITLE "Retirer le magenta"
#define MM_APERCU "MM_apercu"

function mmParams()
{
   return { force: parseFloat( cwParam( "force", "0.80" ) ), methode: cwParam( "methode", "min" ).toLowerCase() == "moyenne" ? "moyenne" : "min" };
}

function mmExport( p )
{
   Parameters.set( "force", p.force.toFixed( 2 ) );
   Parameters.set( "methode", p.methode );
}

function mmProcess( view, p )
{
   let cible = p.methode == "moyenne" ? "($T[0] + $T[2])/2" : "min($T[0], $T[2])";
   let P = new PixelMath;
   P.expression = "$T";
   P.expression1 = "$T + " + Math.max( 0, Math.min( 1, p.force ) ).toFixed( 3 ) + "*(max($T, " + cible + ") - $T)";
   P.expression2 = "$T";
   P.useSingleExpression = false;
   P.createNewImage = false;
   P.rescale = false;
   P.truncate = true;
   if ( !P.executeOn( view ) )
      throw new Error( TITLE + " : PixelMath a échoué (voir la console)." );
}

function mmRun( view, p )
{
   if ( !view.image.isColor )
   {
      console.warningln( TITLE + " : " + view.id + " n'est pas en couleur, rien n'est fait." );
      return;
   }
   cwApplyOnCopy( view, function( c ) { mmProcess( c, p ); } );
   console.noteln( TITLE + " : " + view.id + " (méthode " + p.methode + ", force " + p.force.toFixed( 2 ) + ")." );
}

function mmDialog( p, view )
{
   let d = new CWDialog( TITLE, "<b>Retirer le magenta</b> (inverser, SCNR vert, inverser) : le vert manquant est rendu là où R et B le dépassent. " +
                         "Méthode min : seul le vrai magenta ; moyenne : plus fort, touche aussi les bleus-violets.", "Méthode :" );
   let sel = { view: view };
   d.viewList( "Image :", view, "Image couleur (sans étoiles de préférence).", function( v ) { sel.view = v; } );
   d.combo( "Méthode :", [ "min : vrai magenta seulement (doux)", "moyenne : plus fort (violets aussi)" ], p.methode == "moyenne" ? 1 : 0, "", function( k ) { p.methode = k == 1 ? "moyenne" : "min"; } );
   d.numeric( "Force :", 0, 1, 2, p.force, "1 = tout le magenta retiré ; 0,8 par défaut.", function( v ) { p.force = v; } );
   d.button( "Aperçu", "Applique sur une copie affichée dans la vue MM_apercu ; l'image ne change pas.", function()
   {
      if ( sel.view == null || sel.view.isNull || !sel.view.image.isColor )
         return;
      cwRun( TITLE, function()
      {
         cwCloseWindow( MM_APERCU );
         let w = cwPixelMathNew( sel.view, "$T", MM_APERCU );
         mmProcess( w.mainView, p );
         w.show();
         w.zoomToFit();
      } );
   } );
   d.onExport = function() { mmExport( p ); };
   d.validate = function() { return (sel.view == null || sel.view.isNull) ? "Choisis l'image." : (sel.view.image.isColor ? "" : "L'image doit être en couleur."); };
   d.finish();
   let ok = d.execute();
   cwCloseWindow( MM_APERCU );
   return ok ? sel.view : null;
}

function main()
{
   let p = mmParams();
   if ( cwWantsDialog() )
   {
      let v = mmDialog( p, cwDefaultView() );
      if ( v != null )
         cwRun( TITLE, function() { mmRun( v, p ); } );
      return;
   }
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( TITLE + " : aucune image." );
   mmRun( view, p );
}

main();
