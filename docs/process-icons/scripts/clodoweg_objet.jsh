// ----------------------------------------------------------------------------
// clodoweg_objet.jsh — dossier de l'objet (là où sont les masters), commun à
// Renommer_auto.js et Export_TIFF.js.
// ----------------------------------------------------------------------------
// cwObjectDirFromWindows() : dossier des masters ouverts (L, R, G, B, H, O, S
//   d'abord) ; un dossier au nom générique (master, lights, WBPP…) est sauté
//   au profit du dossier parent. Vide si aucune image ouverte n'a de fichier.
// cwSaveObjectDir( dir ) / cwSavedObjectDir() : dossier retenu dans les
//   réglages de PixInsight (clé clodoweg/objectDir), écrit par Renommer_auto
//   au début du traitement, relu par Export_TIFF quand les masters sont fermés
//   (narrowband : les rapides ferment S, H, O).
// À copier avec les scripts dans src/scripts/clodoweg.
// ----------------------------------------------------------------------------

#ifndef __CLODOWEG_OBJET_JSH
#define __CLODOWEG_OBJET_JSH

#include <pjsr/DataType.jsh>

#define CW_OBJDIR_KEY "clodoweg/objectDir"

var CW_GENERIQUES = [ "master", "masters", "light", "lights", "output", "wbpp", "calibrated", "registered",
                      "integration", "integrated", "stacked", "fits", "xisf", "traitement", "pixinsight" ];

function cwLastName( dir )
{
   let parts = dir.split( "/" ).filter( function( p ) { return p.length > 0; } );
   return parts.length > 0 ? parts[ parts.length - 1 ] : "";
}

function cwObjectDirFromWindows()
{
   let prio = [ "L", "R", "G", "B", "H", "O", "S" ];
   let wins = ImageWindow.windows.filter( function( w ) { return w.filePath.length > 0; } );
   wins.sort( function( a, b )
   {
      let ia = prio.indexOf( a.mainView.id ), ib = prio.indexOf( b.mainView.id );
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
   } );
   if ( wins.length == 0 )
      return "";
   let fp = wins[ 0 ].filePath;
   let dir = File.extractDrive( fp ) + File.extractDirectory( fp );
   while ( CW_GENERIQUES.indexOf( cwLastName( dir ).toLowerCase() ) >= 0 && dir.lastIndexOf( "/" ) > 0 )
      dir = dir.substring( 0, dir.lastIndexOf( "/" ) );
   return dir;
}

function cwSaveObjectDir( dir )
{
   if ( dir.length > 0 )
      Settings.write( CW_OBJDIR_KEY, DataType_String, dir );
}

function cwSavedObjectDir()
{
   let dir = Settings.read( CW_OBJDIR_KEY, DataType_String );
   return (Settings.lastReadOK && dir != null && File.directoryExists( dir )) ? dir : "";
}

#endif   // __CLODOWEG_OBJET_JSH
