// ----------------------------------------------------------------------------
// Sauver_vues.js — enregistre une copie de toutes les images ouvertes en XISF
// dans un sous-dossier du dossier de l'objet (sauvegarde du travail en cours).
// ----------------------------------------------------------------------------
// PixInsight ne permet pas d'enregistrer le PROJET (.xosm) depuis un script
// (aucune fonction documentée) : ce script enregistre les IMAGES, ce qui permet
// de reprendre le traitement (rouvrir les .xisf, puis le fichier Conteneurs).
// Projet complet (espace de travail, icônes, historique) : File > Save Project.
//   1. dossier : vide = dossier de l'objet (dossier des masters, ou celui
//      retenu par Renommer_auto), sinon dossier personnel ;
//   2. sous-dossier sousDossier (sauvegarde par défaut), suivi de la date et
//      de l'heure si horodatage = true (sauvegarde_20261108_2143) ;
//   3. chaque image ouverte : COPIE cachée (même format, mots-clés FITS et
//      solution astrométrique recopiés), enregistrée sous <identifiant>.xisf ;
//      les images ouvertes ne changent pas (ni leur fichier, ni leur nom).
// Dernière étape des turbos (demande de l'utilisateur, 8 novembre 2026) et
// icône Sauvegarde_projet, tout à droite des workflows. Non testé dans
// PixInsight.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight, avec
// clodoweg_ui.jsh et clodoweg_objet.jsh.
// ----------------------------------------------------------------------------

#feature-id    Sauver_vues : clodoweg > Sauvegarde des images ouvertes
#feature-info  Enregistre une copie XISF de toutes les images ouvertes dans un \
   sous-dossier du dossier de l'objet.

#include <pjsr/UndoFlag.jsh>

#include "clodoweg_ui.jsh"
#include "clodoweg_objet.jsh"

#define TITLE "Sauvegarde"

function svParams()
{
   return { dossier: cwParam( "dossier", "" ), sousDossier: cwParam( "sousDossier", "sauvegarde" ), horodatage: cwBool( "horodatage", true ) };
}

function svExport( p )
{
   Parameters.set( "dossier", p.dossier );
   Parameters.set( "sousDossier", p.sousDossier );
   Parameters.set( "horodatage", p.horodatage ? "true" : "false" );
}

function svTwo( n )
{
   return (n < 10 ? "0" : "") + n;
}

// Dossier d'enregistrement (sans le créer).
function svDir( p )
{
   let dir = p.dossier;
   if ( dir.length == 0 )
   {
      dir = cwObjectDirFromWindows();
      if ( dir.length == 0 )
         dir = cwSavedObjectDir();
      if ( dir.length == 0 )
         dir = File.homeDirectory;
   }
   if ( !dir.endsWith( "/" ) )
      dir += "/";
   let sous = p.sousDossier.replace( /[\\:*?"<>|]/g, "_" ).replace( /\s+/g, "_" );
   if ( sous.length == 0 )
      sous = "sauvegarde";
   if ( p.horodatage )
   {
      let d = new Date;
      sous += "_" + d.getFullYear() + svTwo( d.getMonth() + 1 ) + svTwo( d.getDate() ) + "_" + svTwo( d.getHours() ) + svTwo( d.getMinutes() );
   }
   return dir + sous;
}

// Images à enregistrer : toutes les fenêtres ouvertes, sauf les vues de travail des scripts.
function svWindows()
{
   return ImageWindow.windows.filter( function( w ) { return !w.isNull && w.mainView.id.indexOf( "cw_" ) != 0 && w.mainView.id.indexOf( "tf_" ) != 0; } );
}

function svRun( p )
{
   let wins = svWindows();
   if ( wins.length == 0 )
   {
      console.warningln( TITLE + " : aucune image ouverte, rien n'est enregistré." );
      return;
   }
   let dir = svDir( p );
   if ( !File.directoryExists( dir ) )
      File.createDirectory( dir, true );
   console.writeln( TITLE + " : " + wins.length + " image(s) vers " + dir + "…" );
   processEvents();
   let t0 = Date.now(), ok = 0;
   for ( let k = 0; k < wins.length; ++k )
   {
      let w = wins[ k ], img = w.mainView.image, id = w.mainView.id;
      let path = dir + "/" + id + ".xisf";
      let c = new ImageWindow( img.width, img.height, img.numberOfChannels, img.bitsPerSample, img.isReal, img.isColor, "cw_sauve" );
      try
      {
         c.mainView.beginProcess( UndoFlag_NoSwapFile );
         c.mainView.image.assign( img );
         c.mainView.endProcess();
         c.keywords = w.keywords;
         if ( typeof c.copyAstrometricSolution == "function" )
            try { c.copyAstrometricSolution( w ); } catch ( e ) {}
         if ( c.saveAs( path, false/*queryOptions*/, false/*allowMessages*/, false/*strict*/, false/*verifyOverwrite*/ ) )
         {
            ++ok;
            console.writeln( "   " + id + ".xisf" );
         }
         else
            console.warningln( "   " + id + " : échec de l'enregistrement." );
      }
      catch ( e )
      {
         console.warningln( "   " + id + " : " + e.message );
      }
      c.forceClose();
      processEvents();
   }
   console.noteln( TITLE + " : " + ok + "/" + wins.length + " image(s) enregistrée(s) dans " + dir + " (" + ((Date.now() - t0)/1000).toFixed( 1 ) + " s). " +
                   "Projet complet : File > Save Project." );
}

function svDialog( p )
{
   let d = new CWDialog( TITLE, "<b>Sauvegarde</b> : copie XISF de toutes les images ouvertes dans un sous-dossier du dossier de l'objet. " +
                         "Les images ouvertes ne changent pas. Le projet complet (icônes, historique) : File &gt; Save Project.", "Sous-dossier :" );
   let label = null;
   function refresh()
   {
      if ( label )
         label.text = svWindows().length + " image(s) vers <b>" + svDir( p ) + "</b>";
   }
   let dirEdit = d.edit( "Dossier :", p.dossier, "Vide = dossier de l'objet (dossier des masters).", function( t ) { p.dossier = t.trim(); refresh(); } );
   d.button( "Choisir le dossier…", "Choisir le dossier.", function()
   {
      let g = new GetDirectoryDialog;
      g.caption = "Dossier de sauvegarde";
      if ( g.execute() )
      {
         p.dossier = g.directory;
         dirEdit.text = p.dossier;
         refresh();
      }
   } );
   d.edit( "Sous-dossier :", p.sousDossier, "Nom du sous-dossier créé (sauvegarde par défaut).", function( t ) { p.sousDossier = t.trim(); refresh(); } );
   d.check( "Ajouter la date et l'heure au sous-dossier", p.horodatage, "Une nouvelle sauvegarde à chaque fois, sans écraser la précédente.", function( c ) { p.horodatage = c; refresh(); } );
   label = d.info( "" );
   refresh();
   d.onExport = function() { svExport( p ); };
   d.validate = function() { return svWindows().length == 0 ? "Aucune image ouverte." : ""; };
   d.finish( "Enregistrer" );
   return d.execute();
}

function main()
{
   let p = svParams();
   if ( cwWantsDialog() )
   {
      if ( svDialog( p ) )
         cwRun( TITLE, function() { svRun( p ); } );
      return;
   }
   svRun( p );
}

main();
