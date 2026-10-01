// ----------------------------------------------------------------------------
// ImageSolver_Date.js — date d'observation par défaut pour ImageSolver.
// ----------------------------------------------------------------------------
// ImageSolver refuse de résoudre une image sans date d'observation avec les
// catalogues Gaia locaux (XPSD). Ce script ajoute DATE-OBS = defaultDate
// (2020-01-01T00:00:00 par défaut) SEULEMENT si l'image n'a aucune date
// (mots-clés DATE-OBS, DATE-BEG, DATE-AVG, DATE ni propriété
// Observation:Time:Start). Une vraie date n'est jamais remplacée.
//
// Utilisé en première étape du conteneur ImageSolver de la fiche (glisser
// l'icône sur l'image). Installation (Mac et PC) : dans src/scripts/clodoweg
// de PixInsight, à côté du dossier PatternCorrection.
// ----------------------------------------------------------------------------

#feature-id    ImageSolver_Date : clodoweg > Date par défaut pour ImageSolver
#feature-info  Ajoute DATE-OBS = 2020-01-01 aux images sans date d'observation.

#define TITLE "Date par défaut"

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

function main()
{
   let defaultDate = "2020-01-01T00:00:00";
   if ( Parameters.has( "defaultDate" ) )
      defaultDate = Parameters.getString( "defaultDate" ).trim();

   let window = Parameters.isViewTarget ? Parameters.targetView.window : ImageWindow.activeWindow;
   if ( window.isNull )
      throw new Error( TITLE + " : aucune image." );

   if ( hasObservationDate( window ) )
   {
      console.writeln( "<end><cbr>" + TITLE + " : " + window.mainView.id + " a déjà une date d'observation, rien à faire." );
      return;
   }
   let kw = window.keywords;
   kw.push( new FITSKeyword( "DATE-OBS", "'" + defaultDate + "'", "Date par defaut (ImageSolver_Date.js)" ) );
   window.keywords = kw;
   console.warningln( "<end><cbr>" + TITLE + " : " + window.mainView.id + " n'avait pas de date d'observation : DATE-OBS = " + defaultDate + " ajouté." );
}

main();
