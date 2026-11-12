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
// fond = true (icône Opt_Magenta_moins, 12 novembre 2026) : seulement le fond
//   du ciel (luminance lissée sous fond + debut 0,02 : effet entier ; au-dessus
//   de fond + fin 0,12 : rien ; transition en S), pas les nébuleuses.
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
   return { force: parseFloat( cwParam( "force", "0.80" ) ), methode: cwParam( "methode", "min" ).toLowerCase() == "moyenne" ? "moyenne" : "min",
            fond: cwBool( "fond", false ), debut: parseFloat( cwParam( "debut", "0.02" ) ), fin: parseFloat( cwParam( "fin", "0.12" ) ),
            flou: parseFloat( cwParam( "flou", "8" ) ) };
}

function mmExport( p )
{
   Parameters.set( "force", p.force.toFixed( 2 ) );
   Parameters.set( "methode", p.methode );
   Parameters.set( "fond", p.fond ? "true" : "false" );
   Parameters.set( "debut", p.debut.toFixed( 2 ) );
   Parameters.set( "fin", p.fin.toFixed( 2 ) );
   Parameters.set( "flou", p.flou.toFixed( 1 ) );
}

// Masque du fond (fond = true ; demande de l'utilisateur, 12 novembre 2026 : « que sur le fond du ciel (noir) et pas sur les zones de
// nébuleuses ») : luminance lissée (flou px), fond mesuré comme Fond_desature (grille 8 × 8, quart le plus sombre) ; poids 1 sous
// fond + debut, 0 au-dessus de fond + fin, transition en S ; renvoie [id de la vue luminance, expression du poids, fond]
function mmMasque( view, p )
{
   let id = "mm_lum";
   cwCloseWindow( id );
   let P = new PixelMath;
   P.expression = "0.2126*$T[0] + 0.7152*$T[1] + 0.0722*$T[2]";
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
      throw new Error( TITLE + " : luminance non créée." );
   let img = w.mainView.image, n = 8, meds = [];
   for ( let j = 0; j < n; ++j )
      for ( let i = 0; i < n; ++i )
      {
         img.selectedRect = new Rect( Math.floor( i*img.width/n ), Math.floor( j*img.height/n ), Math.floor( (i + 1)*img.width/n ), Math.floor( (j + 1)*img.height/n ) );
         meds.push( img.median() );
      }
   img.resetSelections();
   meds.sort( function( a, b ) { return a - b; } );
   let q = meds.slice( 0, Math.max( 1, Math.floor( meds.length/4 ) ) );
   let bg = q[ Math.floor( q.length/2 ) ];
   if ( p.flou > 0 )
   {
      let C = new Convolution;
      C.mode = Convolution.prototype.Parametric;
      C.sigma = p.flou;
      C.shape = 2;
      C.aspectRatio = 1;
      C.rotationAngle = 0;
      C.executeOn( w.mainView );
   }
   let lo = bg + p.debut, hi = bg + Math.max( p.fin, p.debut + 0.01 );
   let r = "min(1, max(0, (" + id + " - " + lo.toFixed( 6 ) + ")/" + (hi - lo).toFixed( 6 ) + "))";
   return [ id, "(1 - (" + r + ")^2*(3 - 2*" + r + "))", bg ];
}

function mmProcess( view, p )
{
   let cible = p.methode == "moyenne" ? "($T[0] + $T[2])/2" : "min($T[0], $T[2])";
   let m = null, poids = "";
   if ( p.fond )
   {
      m = mmMasque( view, p );
      poids = "*" + m[ 1 ];
   }
   let P = new PixelMath;
   P.expression = "$T";
   P.expression1 = "$T + " + Math.max( 0, Math.min( 1, p.force ) ).toFixed( 3 ) + poids + "*(max($T, " + cible + ") - $T)";
   P.expression2 = "$T";
   P.useSingleExpression = false;
   P.createNewImage = false;
   P.rescale = false;
   P.truncate = true;
   let ok = P.executeOn( view );
   if ( m != null )
   {
      cwCloseWindow( m[ 0 ] );
      console.writeln( TITLE + " : fond seulement (fond mesuré " + m[ 2 ].toFixed( 4 ) + " ; effet entier sous " + (m[ 2 ] + p.debut).toFixed( 3 ) +
                       ", nul au-dessus de " + (m[ 2 ] + p.fin).toFixed( 3 ) + ")." );
   }
   if ( !ok )
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
   d.check( "Fond du ciel seulement (pas les nébuleuses)", p.fond, "Effet entier sur le fond sombre, nul sur la nébuleuse, transition douce.", function( c ) { p.fond = c; } );
   d.numeric( "Début (fond +) :", 0, 0.20, 2, p.debut, "Fond seulement : effet entier jusqu'à fond mesuré + cette valeur.", function( v ) { p.debut = v; } );
   d.numeric( "Fin (fond +) :", 0.02, 0.40, 2, p.fin, "Fond seulement : plus d'effet au-dessus de fond mesuré + cette valeur.", function( v ) { p.fin = v; } );
   d.numeric( "Flou (px) :", 0, 30, 1, p.flou, "Lissage du masque du fond.", function( v ) { p.flou = v; } );
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
