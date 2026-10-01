// ----------------------------------------------------------------------------
// ImageSolver_Date.js — date d'observation par défaut pour ImageSolver.
// ----------------------------------------------------------------------------
// ImageSolver refuse de résoudre une image sans date d'observation avec les
// catalogues Gaia locaux (XPSD). Ce script ajoute DATE-OBS = defaultDate
// (2020-01-01T00:00:00 par défaut) SEULEMENT si l'image n'a aucune date
// (mots-clés DATE-OBS, DATE-BEG, DATE-AVG, DATE ni propriété
// Observation:Time:Start). Une vraie date n'est jamais remplacée.
//
// Icône ImageSolver de la fiche : si les paramètres solverPath et
// solverParams sont présents, le script lance ensuite ImageSolver lui-même
// (instance Script, comme une icône ImageSolver) avec ces réglages. Une seule
// icône, SANS conteneur : dans un ProcessContainer, ImageSolver échoue
// (« The image is already being processed ») car il ouvre son propre
// traitement pour écrire la solution astrométrique.
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight, à côté
// du dossier PatternCorrection. Lancement : glisser l'icône sur l'image.
// ----------------------------------------------------------------------------

#feature-id    ImageSolver_Date : clodoweg > Date par défaut pour ImageSolver
#feature-info  Ajoute DATE-OBS = 2020-01-01 aux images sans date d'observation, \
   puis lance ImageSolver si l'icône en donne les réglages.

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
      console.writeln( "<end><cbr>" + TITLE + " : " + window.mainView.id + " a déjà une date d'observation." );
   else
   {
      let kw = window.keywords;
      kw.push( new FITSKeyword( "DATE-OBS", "'" + defaultDate + "'", "Date par defaut (ImageSolver_Date.js)" ) );
      window.keywords = kw;
      console.warningln( "<end><cbr>" + TITLE + " : " + window.mainView.id + " n'avait pas de date d'observation : DATE-OBS = " + defaultDate + " ajouté." );
   }
   runSolver( window );
}

// Lance ImageSolver (script livré avec PixInsight) sur l'image, avec les
// réglages de l'icône (paramètre solverParams : « nom=valeur;nom=valeur;... », sans
// guillemets : PixInsight transmet les paramètres d'icône par une ligne de commande
// run -p="nom,valeur" que des guillemets couperaient).
function runSolver( window )
{
   if ( !Parameters.has( "solverPath" ) || !Parameters.has( "solverParams" ) )
      return;
   let P = new Script;
   P.filePath = Parameters.getString( "solverPath" ).trim();
   P.md5sum = "";
   let list = [];
   let items = Parameters.getString( "solverParams" ).split( ";" );
   for ( let k = 0; k < items.length; ++k )
   {
      let i = items[ k ].indexOf( "=" );
      if ( i > 0 )
         list.push( [ items[ k ].substring( 0, i ).trim(), items[ k ].substring( i + 1 ).trim() ] );
   }
   P.parameters = list;
   console.writeln( "<end><cbr>" + TITLE + " : ImageSolver sur " + window.mainView.id + "..." );
   if ( !P.executeOn( window.mainView ) )
      throw new Error( TITLE + " : ImageSolver a échoué sur " + window.mainView.id + " (voir la console)." );
}

main();
