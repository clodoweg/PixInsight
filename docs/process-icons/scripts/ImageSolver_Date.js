// ----------------------------------------------------------------------------
// ImageSolver_Date.js — ImageSolver en un glisser, avec date par défaut.
// ----------------------------------------------------------------------------
// ImageSolver refuse de résoudre une image sans date d'observation avec les
// catalogues Gaia locaux (XPSD). Ce script :
//   1. ajoute DATE-OBS = defaultDate (2020-01-01T00:00:00 par défaut)
//      SEULEMENT si l'image n'a aucune date (mots-clés DATE-OBS, DATE-BEG,
//      DATE-AVG, DATE ni propriété Observation:Time:Start) ;
//   2. résout l'image avec le moteur d'ImageSolver (script livré avec
//      PixInsight), inclus comme bibliothèque comme le fait WBPP
//      (BatchPreprocessing/BPP-Solver.js). Les réglages d'ImageSolver
//      (metadata_focal, solver_catalogMode...) sont les paramètres de l'icône,
//      lus par le moteur exactement comme pour une icône ImageSolver.
//
// #engine v8 : moteur JavaScript récent, exigé par le code d'ImageSolver
// (syntaxe class), comme dans les scripts officiels.
//
// Une seule icône, SANS conteneur : dans un ProcessContainer, ImageSolver
// échoue (« The image is already being processed ») car il ouvre son propre
// traitement pour écrire la solution astrométrique.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight, à côté
// des dossiers ImageSolver et PatternCorrection (le chemin d'inclusion
// ../ImageSolver/ImageSolver.js en dépend). Lancement : glisser l'icône sur
// l'image.
// ----------------------------------------------------------------------------

#engine v8

#feature-id    ImageSolver_Date : clodoweg > ImageSolver avec date par défaut
#feature-info  Ajoute DATE-OBS = 2020-01-01 aux images sans date d'observation, \
   puis les résout avec le moteur d'ImageSolver et les réglages de l'icône.

#define USE_SOLVER_LIBRARY true
#define SETTINGS_MODULE "ImageSolver"
#include "../ImageSolver/ImageSolver.js"

var DATE_TITLE = "ImageSolver_Date";

function hasObservationDate( window )
{
   let names = [ "DATE-OBS", "DATE-BEG", "DATE-AVG", "DATE" ];
   let kw = window.keywords;
   for ( let i = 0; i < kw.length; ++i )
      if ( names.indexOf( kw[ i ].name.trim().toUpperCase() ) >= 0 && kw[ i ].strippedValue.trim().length > 0 )
         return true;
   try
   {
      if ( window.mainView.hasProperty( "Observation:Time:Start" ) )
         return true;
   }
   catch ( e ) {}
   return false;
}

function addDefaultDate( window )
{
   let defaultDate = "2020-01-01T00:00:00";
   if ( Parameters.has( "defaultDate" ) )
      defaultDate = Parameters.getString( "defaultDate" ).trim();
   if ( hasObservationDate( window ) )
   {
      console.writeln( "<end><cbr>" + DATE_TITLE + " : " + window.mainView.id + " a déjà une date d'observation." );
      return;
   }
   let kw = window.keywords;
   kw.push( new FITSKeyword( "DATE-OBS", "'" + defaultDate + "'", "Date par defaut (ImageSolver_Date.js)" ) );
   window.keywords = kw;
   console.warningln( "<end><cbr>" + DATE_TITLE + " : " + window.mainView.id + " n'avait pas de date d'observation : DATE-OBS = " + defaultDate + " ajouté." );
}

// Même enchaînement que ImageSolver lancé sur une vue (ImageSolver.js, main()).
function solve( window )
{
   if ( !Parameters.has( "metadata_focal" ) )
      return;   // ancienne icône sans réglages d'ImageSolver : date seulement
   console.show();
   let engine = new ImageSolver;
   engine.initialize( window );
   engine.metadata.SaveParameters();
   engine.solverCfg.SaveParameters();
   engine.solveImage( window );
   engine.metadata.SaveSettings();
   console.writeln( "<end><cbr><br>" + "=".repeat( 98 ) );
   console.writeln( window.astrometricSolutionSummary().trim() );
   console.writeln( "=".repeat( 98 ) );
}

function mainDate()
{
   let window = Parameters.isViewTarget ? Parameters.targetView.window : ImageWindow.activeWindow;
   if ( window.isNull )
      throw new Error( DATE_TITLE + " : aucune image." );
   addDefaultDate( window );
   solve( window );
}

mainDate();
