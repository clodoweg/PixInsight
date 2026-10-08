// ----------------------------------------------------------------------------
// Fond_auto.js — mesure le fond du ciel de l'image finie et le règle.
// ----------------------------------------------------------------------------
// Dernière étape du mode rapide (fin de C_Fin_rapide), sur l'image étirée :
//   1. mesure du fond de chaque canal : l'image est découpée en grille
//      (grille × grille cases, 8 par défaut) ; médiane de chaque case ; le
//      fond = médiane du quart le plus sombre des cases. La galaxie, même
//      grande, et les étoiles ne faussent donc pas la mesure ;
//   2. si le fond d'un canal s'écarte de plus de tolerance (0,005) de cible
//      (0,12 par défaut : fond final de la fiche, 0,12–0,14, données propres
//      après NXT 0,10–0,12), PixelMath applique à ce canal la fonction de
//      transfert des tons moyens mtf(m, $T) qui amène son fond exactement sur
//      cible : 0 reste 0, 1 reste 1, rien n'est écrêté. Chaque canal visant la
//      même valeur, le fond devient neutre (R = G = B) ;
//   3. la console donne le fond avant et après, canal par canal.
// Correction faible en pratique (quelques centièmes) : couleurs et contraste
// de la galaxie changent très peu.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Fond_auto : clodoweg > Fond du ciel automatique
#feature-info  Mesure le fond du ciel (canal par canal) et l'amène sur une \
   valeur cible, neutre, sans écrêtage.

#include "clodoweg_ui.jsh"

#define TITLE "Fond auto"

// Fond de chaque canal : médiane du quart le plus sombre des médianes de cases.
function background( img, n )
{
   let out = [];
   let w = img.width, h = img.height;
   for ( let c = 0; c < img.numberOfChannels; ++c )
   {
      let meds = [];
      for ( let j = 0; j < n; ++j )
         for ( let i = 0; i < n; ++i )
         {
            img.selectedChannel = c;
            img.selectedRect = new Rect( Math.floor( i*w/n ), Math.floor( j*h/n ), Math.floor( (i + 1)*w/n ), Math.floor( (j + 1)*h/n ) );
            meds.push( img.median() );
         }
      meds.sort( function( a, b ) { return a - b; } );
      let q = meds.slice( 0, Math.max( 1, Math.floor( meds.length/4 ) ) );
      out.push( q[ Math.floor( q.length/2 ) ] );
   }
   img.resetSelections();
   return out;
}

// Équilibre des tons moyens M tel que mtf(M, m) = t.
function midtones( m, t )
{
   return m*(t - 1)/(2*t*m - t - m);
}

function fmt( a )
{
   return a.map( function( v ) { return v.toFixed( 4 ); } ).join( " / " );
}

function faParams()
{
   return { cible: parseFloat( cwParam( "cible", "0.12" ) ), tolerance: parseFloat( cwParam( "tolerance", "0.005" ) ), grille: parseInt( cwParam( "grille", "8" ) ) };
}

function faExport( p )
{
   Parameters.set( "cible", p.cible.toFixed( 3 ) );
   Parameters.set( "tolerance", p.tolerance.toFixed( 3 ) );
   Parameters.set( "grille", p.grille.toFixed( 0 ) );
}

// Traite view ; name : nom affiché dans la console.
function faProcess( view, p, name )
{
   let target = p.cible, tol = p.tolerance, n = p.grille;
   let img = view.image;
   let bg = background( img, n );
   let exprs = [], change = false;
   for ( let c = 0; c < bg.length; ++c )
   {
      let m = bg[ c ];
      if ( !(m > 0 && m < 0.5) || Math.abs( m - target ) <= tol )
         exprs.push( "$T" );
      else
      {
         exprs.push( "mtf(" + midtones( m, target ).toFixed( 8 ) + ", $T)" );
         change = true;
      }
   }
   if ( !change )
   {
      console.noteln( TITLE + " : fond " + fmt( bg ) + " déjà à " + target + " ± " + tol + ", rien n'est changé." );
      return;
   }
   let P = new PixelMath;
   if ( img.isColor )
   {
      P.expression = exprs[ 0 ];
      P.expression1 = exprs[ 1 ];
      P.expression2 = exprs[ 2 ];
      P.useSingleExpression = false;
   }
   else
   {
      P.expression = exprs[ 0 ];
      P.useSingleExpression = true;
   }
   P.createNewImage = false;
   P.rescale = false;
   P.truncate = true;
   P.executeOn( view );
   console.noteln( TITLE + " : " + name + " fond " + fmt( bg ) + " -> " + fmt( background( view.image, n ) ) + " (cible " + target + ")." );
}

function faDialog( p, view )
{
   let d = new CWDialog( TITLE, "<b>Fond du ciel automatique</b> : le fond de chaque canal est mesuré (grille de cases, quart le plus sombre) " +
                         "et amené à la cible, neutre, sans écrêtage. Sur l'image sans étoiles, après Fond_desature, avant Etoiles_screen.", "Tolérance :" );
   let sel = { view: view };
   d.viewList( "Image :", view, "Image sans étoiles (après Fond_desature, avant Etoiles_screen).", function( v ) { sel.view = v; } );
   d.numeric( "Cible :", 0.05, 0.25, 3, p.cible, "Fond visé (0,12 par défaut ; 0,14 si l'image est trop sombre).", function( v ) { p.cible = v; } );
   d.numeric( "Tolérance :", 0.000, 0.020, 3, p.tolerance, "Écart accepté sans rien changer.", function( v ) { p.tolerance = v; } );
   d.numeric( "Grille :", 4, 16, 0, p.grille, "Nombre de cases par côté pour mesurer le fond.", function( v ) { p.grille = v; } );
   d.onExport = function() { faExport( p ); };
   d.validate = function() { return (sel.view == null || sel.view.isNull) ? "Choisis l'image." : ""; };
   d.finish();
   return d.execute() ? sel.view : null;
}

function main()
{
   let p = faParams();
   if ( cwWantsDialog() )
   {
      let view = faDialog( p, cwDefaultView() );
      if ( view != null )
         cwRun( TITLE, function() { cwApplyOnCopy( view, function( c ) { faProcess( c, p, view.id ); } ); } );
      return;
   }
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( TITLE + " : aucune image." );
   // glissé ou dans un conteneur : aussi sur copie puis recopie, pour le Ctrl+Z (8 octobre 2026)
   cwApplyOnCopy( view, function( c ) { faProcess( c, p, view.id ); } );
}

main();
