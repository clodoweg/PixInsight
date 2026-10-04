// ----------------------------------------------------------------------------
// Export_TIFF.js — exporte l'image finie en TIFF 16 bits sRGB, profil ICC
// intégré, pour une finition dans Photoshop, Lightroom ou Affinity.
// ----------------------------------------------------------------------------
// Sur une COPIE (l'image ouverte ne change pas) :
//   1. copie en entiers 16 bits (suffisant pour une image déjà étirée) ;
//   2. icc = true : ICCProfileTransformation vers sRGB IEC61966-2.1
//      (rendu Perceptual, compensation du point noir) : sans profil, les
//      couleurs changent à l'ouverture dans un autre logiciel ;
//   3. enregistrée en TIFF sous le NOM DE L'OBJET : nom du dossier d'où
//      viennent les masters (L, R, G, B, H… encore ouverts, ou toute image
//      ouverte depuis un fichier) ; un dossier au nom générique (master,
//      masters, lights, output, WBPP…) est sauté au profit du dossier parent.
//      Ex. : /Astro/NGC1532/master/masterLight_L.xisf -> NGC1532.tiff, enregistré
//      dans /Astro/NGC1532/. Espaces toujours retirés : « NGC 1532 » -> NGC1532.
//      Si aucune image ouverte n'a de fichier : mot-clé
//      OBJECT de l'image, sinon identifiant de la vue ; dossier personnel.
//      Paramètres : nom (force le nom), dossier (force le dossier), suffixe
//      (ajouté au nom, vide par défaut). Un fichier existant est remplacé.
// Le profil ICC est intégré selon les préférences de PixInsight (Edit >
// Global Preferences > Color Management : Embed ICC profiles, coché par
// défaut).
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Export_TIFF : clodoweg > Export TIFF 16 bits sRGB
#feature-info  Enregistre une copie de l'image en TIFF 16 bits, convertie en \
   sRGB avec profil ICC, pour Photoshop, Lightroom ou Affinity.

#include <pjsr/UndoFlag.jsh>

#define TITLE "Export TIFF"

function param( key, value )
{
   return Parameters.has( key ) ? Parameters.getString( key ).trim() : value;
}

var GENERIQUES = [ "master", "masters", "light", "lights", "output", "wbpp", "calibrated", "registered",
                   "integration", "integrated", "stacked", "fits", "xisf", "traitement", "pixinsight" ];

function lastName( dir )
{
   let parts = dir.split( "/" ).filter( function( p ) { return p.length > 0; } );
   return parts.length > 0 ? parts[ parts.length - 1 ] : "";
}

// Dossier de l'objet : dossier des masters ouverts (L, R, G, B, H, O, S d'abord), dossiers génériques sautés.
function objectDir()
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
   while ( GENERIQUES.indexOf( lastName( dir ).toLowerCase() ) >= 0 && dir.lastIndexOf( "/" ) > 0 )
      dir = dir.substring( 0, dir.lastIndexOf( "/" ) );
   return dir;
}

function keyword( view, name )
{
   let k = view.window.keywords;
   for ( let i = 0; i < k.length; ++i )
      if ( k[ i ].name == name )
         return k[ i ].strippedValue.trim();
   return "";
}

function main()
{
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( TITLE + " : aucune image." );
   let suffixe = param( "suffixe", "" );
   let dossier = param( "dossier", "" );
   let nom = param( "nom", "" );
   let icc = param( "icc", "true" ).toLowerCase() == "true";

   let dir = objectDir();
   if ( nom.length == 0 )
      nom = dir.length > 0 ? lastName( dir ) : keyword( view, "OBJECT" );
   if ( nom.length == 0 )
      nom = view.id;
   nom = nom.replace( /\s+/g, "" ).replace( /[\/\\:*?"<>|]/g, "_" );   // jamais d'espace (demande de l'utilisateur) : NGC 1532 -> NGC1532
   if ( dossier.length == 0 )
      dossier = dir.length > 0 ? dir : File.homeDirectory;
   if ( !dossier.endsWith( "/" ) )
      dossier += "/";
   let path = dossier + nom + suffixe.replace( /\s+/g, "" ) + ".tiff";

   // 1. copie 16 bits
   let img = view.image;
   let w = new ImageWindow( img.width, img.height, img.numberOfChannels, 16, false, img.isColor, view.id + "_export" );
   w.mainView.beginProcess( UndoFlag_NoSwapFile );
   w.mainView.image.apply( img );
   w.mainView.endProcess();

   // 2. conversion sRGB
   if ( icc && img.isColor )
   {
      let T = new ICCProfileTransformation;
      T.targetProfile = "sRGB IEC61966-2.1";
      T.toDefaultProfile = false;
      T.renderingIntent = ICCProfileTransformation.prototype.Perceptual;
      T.useBlackPointCompensation = true;
      T.useFloatingPointTransformation = true;
      T.executeOn( w.mainView );
   }

   // 3. enregistrement
   let ok = w.saveAs( path, false/*queryOptions*/, false/*allowMessages*/, false/*strict*/, false/*verifyOverwrite*/ );
   w.forceClose();
   if ( !ok )
      throw new Error( TITLE + " : échec de l'enregistrement de " + path + "." );
   console.noteln( TITLE + " : " + path + " (TIFF 16 bits" + (icc && img.isColor ? ", sRGB IEC61966-2.1" : "") + ")." );
}

main();
