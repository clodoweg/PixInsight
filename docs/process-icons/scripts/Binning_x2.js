// ----------------------------------------------------------------------------
// Binning_x2.js — divise par 2 la taille de TOUTES les images ouvertes
// (binning logiciel 2x2 par moyenne, IntegerResample -2, Average).
// ----------------------------------------------------------------------------
// À lancer juste après Solver_auto (phase 1), masters linéaires ouverts :
// IntegerResample met à jour la solution astrométrique, SPFC, MGC et SPCC
// restent possibles sans refaire ImageSolver. 0,264″/px -> 0,528″/px, bruit
// divisé par 2 environ, traitement 4 fois plus rapide ; image finale 2 fois
// plus petite (pour un grand tirage : Agrandir_x2 avant l'export).
// Les images *_stars sont ignorées. Mots-clés XPIXSZ, YPIXSZ, XBINNING et
// YBINNING multipliés par 2 s'ils existent.
// Paramètre : facteur (2 par défaut ; 3 = binning 3x3).
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Binning_x2 : clodoweg > Binning x2 de toutes les images
#feature-info  Divise par 2 la taille de toutes les images ouvertes \
   (IntegerResample, moyenne), solution astrométrique gardée.

#include "clodoweg_ui.jsh"

#define BX_TITLE "Binning x2"

function bxKeywords( w, f )
{
   let kw = w.keywords, changed = false;
   for ( let i = 0; i < kw.length; ++i )
   {
      let n = kw[ i ].name.trim();
      if ( n == "XPIXSZ" || n == "YPIXSZ" || n == "XBINNING" || n == "YBINNING" )
      {
         let v = parseFloat( kw[ i ].strippedValue );
         if ( !isNaN( v ) )
         {
            kw[ i ] = new FITSKeyword( n, (v*f).toString(), kw[ i ].comment );
            changed = true;
         }
      }
   }
   if ( changed )
      w.keywords = kw;
}

function bxRun( f, wins )
{
   if ( isNaN( f ) || f < 2 )
      throw new Error( BX_TITLE + " : facteur invalide (2 ou plus)." );
   if ( wins.length == 0 )
      throw new Error( BX_TITLE + " : aucune image à réduire." );
   let done = [];
   for ( let i = 0; i < wins.length; ++i )
   {
      let w = wins[ i ];
      let P = new IntegerResample;
      P.zoomFactor = -f;
      P.downsamplingMode = IntegerResample.prototype.Average;
      if ( !P.executeOn( w.mainView ) )
         throw new Error( BX_TITLE + " : échec sur " + w.mainView.id + " (voir la console)." );
      bxKeywords( w, f );
      w.zoomToFit();
      done.push( w.mainView.id + " " + w.mainView.image.width + "x" + w.mainView.image.height );
   }
   console.noteln( BX_TITLE + " : " + done.length + " image(s) réduite(s) d'un facteur " + f + " : " + done.join( ", " ) + "." );
}

function bxDefaultWindows()
{
   return ImageWindow.windows.filter( function( w ) { return !w.mainView.id.endsWith( "_stars" ); } );
}

function bxDialog( p )
{
   let d = new CWDialog( BX_TITLE, "<b>Binning logiciel</b> (IntegerResample, moyenne) des images cochées, solution astrométrique gardée. " +
                         "Juste après Solver_auto. 2 = 0,528″/px, traitement 4 fois plus rapide ; pour un grand tirage, Agrandir_x2 avant l'export.", "Facteur :" );
   d.combo( "Facteur :", [ "2 (2×2)", "3 (3×3)" ], p.facteur == 3 ? 1 : 0, "Facteur de réduction.", function( k ) { p.facteur = k + 2; } );
   let windows = ImageWindow.windows, boxes = [];
   d.group( "Images à réduire" );
   if ( windows.length == 0 )
      d.info( "Aucune image ouverte." );
   for ( let k = 0; k < windows.length; ++k )
   {
      let w = windows[ k ];
      boxes.push( { w: w, box: d.check( w.mainView.id + "  (" + w.mainView.image.width + "×" + w.mainView.image.height + ")",
                                         !w.mainView.id.endsWith( "_stars" ), "", null ) } );
   }
   d.endGroup();
   d.onExport = function() { Parameters.set( "facteur", p.facteur.toFixed( 0 ) ); };
   d.finish( "Réduire" );
   if ( !d.execute() )
      return null;
   return boxes.filter( function( b ) { return b.box.checked; } ).map( function( b ) { return b.w; } );
}

function main()
{
   let p = { facteur: parseInt( cwParam( "facteur", "2" ) ) };
   if ( cwWantsDialog() )
   {
      let wins = bxDialog( p );
      if ( wins != null )
         cwRun( BX_TITLE, function() { bxRun( p.facteur, wins ); } );
      return;
   }
   bxRun( p.facteur, bxDefaultWindows() );
}

main();
