// ----------------------------------------------------------------------------
// GC_Solver_auto.js — mode rapide : GradientCorrection sur TOUTES les images
// ouvertes, puis ImageSolver.
// ----------------------------------------------------------------------------
// Pour chaque image ouverte (vues principales) :
//   1. gradient = true (défaut) : GradientCorrection, réglages par défaut, sans
//      modèle de gradient (generateGradientModel décoché) ; gradient = false :
//      pas de GradientCorrection (icône R_Solver_auto : ImageSolver seul) ;
//   2. ImageSolver sur les images COULEUR seulement (RGB : c'est elle qui sert
//      à SPCC) ; solveTout = true : sur toutes les images ; solve = false : pas
//      d'ImageSolver (GradientCorrection seule). Date par défaut
//      ajoutée si l'image n'en a pas (comme ImageSolver_Date.js), puis moteur
//      d'ImageSolver (script livré avec PixInsight) inclus comme bibliothèque,
//      avec les réglages du matériel portés par l'icône.
// Une image en erreur n'arrête pas les autres : la console donne le détail.
// Les images au nom se terminant par « _stars » sont ignorées.
//
// À lancer AVANT les conteneurs rapides (R_C_RGB_rapide, R_C_L_rapide,
// R_C_RGB_fin_rapide…), qui n'ont plus de GradientCorrection.
//
// #engine v8 : exigé par le code d'ImageSolver (syntaxe class).
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight, à côté
// du dossier ImageSolver (chemin d'inclusion ../ImageSolver/ImageSolver.js).
// Lancement : double-clic sur l'icône, puis Apply Global (ou glisser sur une
// image : toutes les images ouvertes sont traitées de la même façon).
// ----------------------------------------------------------------------------

#engine v8

#feature-id    GC_Solver_auto : clodoweg > GradientCorrection et ImageSolver sur toutes les images
#feature-info  GradientCorrection sur toutes les images ouvertes, puis \
   ImageSolver sur les images couleur (ou toutes).

#define USE_SOLVER_LIBRARY true
#define SETTINGS_MODULE "ImageSolver"
#include "../ImageSolver/ImageSolver.js"

#include "clodoweg_ui.jsh"

var GCS_TITLE = "GC_Solver_auto";
var GCS_DATE = null;   // date par défaut choisie dans la fenêtre

function gcsParam( key, value )
{
   return Parameters.has( key ) ? Parameters.getString( key ).trim() : value;
}

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
   if ( hasObservationDate( window ) )
      return;
   let defaultDate = GCS_DATE || gcsParam( "defaultDate", "2020-01-01T00:00:00" );
   let kw = window.keywords;
   kw.push( new FITSKeyword( "DATE-OBS", "'" + defaultDate + "'", "Date par defaut (GC_Solver_auto.js)" ) );
   window.keywords = kw;
   console.warningln( "<end><cbr>" + GCS_TITLE + " : " + window.mainView.id + " sans date d'observation : DATE-OBS = " + defaultDate + " ajouté." );
}

// Même enchaînement que ImageSolver lancé sur une vue (ImageSolver.js, main()).
function solve( window )
{
   let engine = new ImageSolver;
   engine.initialize( window );
   engine.metadata.SaveParameters();
   engine.solverCfg.SaveParameters();
   let ok = engine.solveImage( window );
   engine.metadata.SaveSettings();
   if ( ok === false )
      throw new Error( "résolution astrométrique échouée" );
   console.writeln( "<end><cbr>" + window.astrometricSolutionSummary().trim() );
}

function gradient( view )
{
   let G = new GradientCorrection;
   G.generateGradientModel = false;
   G.executeOn( view );
}

function mainGCS( opts )
{
   opts = opts || {};
   let solveTout = ("solveTout" in opts) ? opts.solveTout : gcsParam( "solveTout", "false" ).toLowerCase() == "true";
   let avecGradient = ("gradient" in opts) ? opts.gradient : gcsParam( "gradient", "true" ).toLowerCase() == "true";
   let avecSolve = ("solve" in opts) ? opts.solve : gcsParam( "solve", "true" ).toLowerCase() == "true";   // solve = false : GradientCorrection seule (R_GC_Solver_auto_rapide)
   let wins = opts.windows || ImageWindow.windows.filter( function( w ) { return !w.mainView.id.endsWith( "_stars" ); } );
   if ( wins.length == 0 )
      throw new Error( GCS_TITLE + " : aucune image ouverte." );
   console.show();
   let bilan = [];
   for ( let i = 0; i < wins.length; ++i )
   {
      let w = wins[ i ], id = w.mainView.id, etapes = [];
      try
      {
         if ( avecGradient )
         {
            gradient( w.mainView );
            etapes.push( "GradientCorrection" );
         }
         if ( avecSolve && (solveTout || w.mainView.image.isColor) )
         {
            if ( !Parameters.has( "metadata_focal" ) )
               throw new Error( "icône sans réglages d'ImageSolver" );
            addDefaultDate( w );
            solve( w );
            etapes.push( "ImageSolver" );
         }
         bilan.push( id + " : " + (etapes.length ? etapes.join( " + " ) : "rien") );
      }
      catch ( e )
      {
         bilan.push( id + " : ERREUR après " + (etapes.length ? etapes.join( " + " ) : "rien") + " (" + e.message + ")" );
      }
   }
   console.noteln( "<end><cbr><br>" + GCS_TITLE + " :" );
   bilan.forEach( function( l ) { console.noteln( "   " + l ); } );
}

function gcsDialog()
{
   let o = { gradient: gcsParam( "gradient", "true" ).toLowerCase() == "true", solve: gcsParam( "solve", "true" ).toLowerCase() == "true",
             solveTout: gcsParam( "solveTout", "false" ).toLowerCase() == "true", date: gcsParam( "defaultDate", "2020-01-01T00:00:00" ) };
   let focal = gcsParam( "metadata_focal", "" ), pix = gcsParam( "metadata_xpixsz", "" );
   let d = new CWDialog( GCS_TITLE, "<b>Astrométrie de toutes les images</b> (ImageSolver, réglages du matériel portés par l'icône), " +
                         "et GradientCorrection en option. Une image en erreur n'arrête pas les autres.", "Date par défaut :" );
   d.info( focal ? "Réglages ImageSolver de l'icône : focale " + focal + " mm, pixel " + pix + " µm." :
                   "<b>Pas de réglages ImageSolver</b> (script lancé sans l'icône) : utilise l'icône Solver_auto." );
   d.check( "GradientCorrection d'abord", o.gradient, "Sans modèle de gradient.", function( c ) { o.gradient = c; } );
   d.check( "ImageSolver", o.solve, "", function( c ) { o.solve = c; } );
   d.check( "Résoudre toutes les images (sinon les images couleur seulement)", o.solveTout, "", function( c ) { o.solveTout = c; } );
   d.edit( "Date par défaut :", o.date, "Ajoutée seulement aux images sans date d'observation.", function( t ) { o.date = t.trim(); } );
   let windows = ImageWindow.windows, boxes = [];
   d.group( "Images" );
   if ( windows.length == 0 )
      d.info( "Aucune image ouverte." );
   for ( let k = 0; k < windows.length; ++k )
      boxes.push( { w: windows[ k ], box: d.check( windows[ k ].mainView.id, !windows[ k ].mainView.id.endsWith( "_stars" ), "", null ) } );
   d.endGroup();
   d.onExport = function()
   {
      Parameters.set( "gradient", o.gradient ? "true" : "false" );
      Parameters.set( "solve", o.solve ? "true" : "false" );
      Parameters.set( "solveTout", o.solveTout ? "true" : "false" );
      Parameters.set( "defaultDate", o.date );
   };
   d.finish( "Lancer" );
   if ( !d.execute() )
      return null;
   o.windows = boxes.filter( function( b ) { return b.box.checked; } ).map( function( b ) { return b.w; } );
   return o;
}

if ( cwWantsDialog() )
{
   let o = gcsDialog();
   if ( o != null )
   {
      GCS_DATE = o.date;
      cwRun( GCS_TITLE, function() { mainGCS( o ); } );
   }
}
else
   mainGCS();
