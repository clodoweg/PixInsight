// ----------------------------------------------------------------------------
// Export_TIFF.js — exporte l'image finie en TIFF 16 bits sRGB, profil ICC
// intégré, pour une finition dans Photoshop, Lightroom ou Affinity.
// ----------------------------------------------------------------------------
// Sur une COPIE (l'image ouverte ne change pas) :
//   1. copie en entiers 16 bits (suffisant pour une image déjà étirée) ;
//   2. icc = true : ICCProfileTransformation vers sRGB IEC61966-2.1
//      (rendu Perceptual, compensation du point noir) : sans profil, les
//      couleurs changent à l'ouverture dans un autre logiciel ;
//   3. enregistrée en TIFF dans le dossier de l'image (ou dans « dossier » si
//      l'image n'a jamais été enregistrée, ou si « dossier » est rempli), nom
//      = identifiant de la vue + suffixe (« _final ») + .tif ; un fichier
//      existant est remplacé.
// Le profil ICC est intégré selon les préférences de PixInsight (Edit >
// Global Preferences > Color Management : Embed ICC profiles, coché par
// défaut).
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Export_TIFF : clodoweg > Export TIFF 16 bits sRGB
#feature-info  Enregistre une copie de l'image en TIFF 16 bits, convertie en \
   sRGB avec profil ICC, pour Photoshop, Lightroom ou Affinity.

#define TITLE "Export TIFF"

function param( key, value )
{
   return Parameters.has( key ) ? Parameters.getString( key ).trim() : value;
}

function main()
{
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( TITLE + " : aucune image." );
   let suffixe = param( "suffixe", "_final" );
   let dossier = param( "dossier", "" );
   let icc = param( "icc", "true" ).toLowerCase() == "true";

   if ( dossier.length == 0 )
   {
      let fp = view.window.filePath;
      if ( fp.length > 0 )
         dossier = File.extractDrive( fp ) + File.extractDirectory( fp );
      else
         dossier = File.homeDirectory;
   }
   if ( !dossier.endsWith( "/" ) )
      dossier += "/";
   let path = dossier + view.id + suffixe + ".tif";

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
