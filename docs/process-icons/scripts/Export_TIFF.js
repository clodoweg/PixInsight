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
//      Ex. : /Astro/NGC1532/master/masterLight_L.xisf -> NGC1532.tif, enregistré
//      dans /Astro/NGC1532/. Espaces toujours retirés : « NGC 1532 » -> NGC1532.
//      Si aucune image ouverte n'a de fichier (narrowband : masters fermés
//      par les rapides) : dossier retenu par Renommer_auto au début du
//      traitement ; sinon mot-clé OBJECT de l'image, sinon identifiant de la
//      vue ; dossier personnel.
//      Paramètres : nom (force le nom), dossier (force le dossier), suffixe
//      (ajouté au nom, vide par défaut). Un fichier existant est remplacé.
// Aucune vue n'est fermée (demande de l'utilisateur).
// photoshop = true : le .tif est ensuite ouvert dans Photoshop (demande de
//   l'utilisateur, 22 octobre 2026). PC : Photoshop.exe cherché dans
//   C:/Program Files/Adobe/Adobe Photoshop* (le plus récent), ou chemin forcé
//   par photoshopExe ; lancé par « cmd /c start ». Mac : « open -b
//   com.adobe.Photoshop ». Faux par défaut. Non testé dans PixInsight.
// Le profil ICC est intégré selon les préférences de PixInsight (Edit >
// Global Preferences > Color Management : Embed ICC profiles, coché par
// défaut).
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Export_TIFF : clodoweg > Export TIFF 16 bits sRGB
#feature-info  Enregistre une copie de l'image en TIFF 16 bits, convertie en \
   sRGB avec profil ICC, pour Photoshop, Lightroom ou Affinity ; peut \
   l'ouvrir ensuite dans Photoshop.

#include <pjsr/UndoFlag.jsh>

#include "clodoweg_ui.jsh"
#include "clodoweg_objet.jsh"

#define TITLE "Export TIFF"

// Dossier de l'objet : dossier des masters ouverts ; sinon celui retenu par Renommer_auto
// (narrowband : les masters sont fermés par les rapides).
function objectDir()
{
   let dir = cwObjectDirFromWindows();
   return dir.length > 0 ? dir : cwSavedObjectDir();
}

function keyword( view, name )
{
   let k = view.window.keywords;
   for ( let i = 0; i < k.length; ++i )
      if ( k[ i ].name == name )
         return k[ i ].strippedValue.trim();
   return "";
}

function etParams()
{
   return { nom: cwParam( "nom", "" ), suffixe: cwParam( "suffixe", "" ), dossier: cwParam( "dossier", "" ),
            icc: cwBool( "icc", true ), photoshop: cwBool( "photoshop", false ), photoshopExe: cwParam( "photoshopExe", "" ) };
}

function etExport( p )
{
   Parameters.set( "nom", p.nom );
   Parameters.set( "suffixe", p.suffixe );
   Parameters.set( "dossier", p.dossier );
   Parameters.set( "icc", p.icc ? "true" : "false" );
   Parameters.set( "photoshop", p.photoshop ? "true" : "false" );
   Parameters.set( "photoshopExe", p.photoshopExe );
}

// PC : Photoshop.exe le plus récent de C:/Program Files/Adobe, sinon "".
function etFindPhotoshop()
{
   let base = "C:/Program Files/Adobe/";
   let names = [];
   let f = new FileFind;
   if ( f.begin( base + "*" ) )
      do
         if ( f.isDirectory && f.name.indexOf( "Adobe Photoshop" ) == 0 && File.exists( base + f.name + "/Photoshop.exe" ) )
            names.push( f.name );
      while ( f.next() );
   f.end();
   names.sort();   // « Adobe Photoshop 2025 » après « Adobe Photoshop 2024 »
   return names.length > 0 ? base + names[ names.length - 1 ] + "/Photoshop.exe" : "";
}

// Ouvre le fichier dans Photoshop ; un échec n'annule pas l'export (message seulement).
function etOpenPhotoshop( path, exe )
{
   let windows = File.directoryExists( "C:/Windows" );
   let prog, args;
   if ( windows )
   {
      if ( exe.length == 0 )
         exe = etFindPhotoshop();
      if ( exe.length == 0 || !File.exists( exe ) )
      {
         console.warningln( TITLE + " : Photoshop.exe introuvable" + (exe.length > 0 ? " (" + exe + ")" : " dans C:/Program Files/Adobe") +
                            " ; indique son chemin dans la fenêtre (photoshopExe)." );
         return;
      }
      prog = "cmd.exe";
      args = [ "/c", "start", "", exe.replace( /\//g, "\\" ), path.replace( /\//g, "\\" ) ];
   }
   else
   {
      prog = "/usr/bin/open";
      args = exe.length > 0 ? [ "-a", exe, path ] : [ "-b", "com.adobe.Photoshop", path ];
   }
   try
   {
      let P = new ExternalProcess;
      P.start( prog, args );
      P.waitForFinished( 15000 );   // cmd / open rendent la main tout de suite, Photoshop reste ouvert
      console.noteln( TITLE + " : ouverture dans Photoshop demandée." );
   }
   catch ( e )
   {
      console.warningln( TITLE + " : Photoshop non lancé (" + e.message + ")." );
   }
}

// Chemin du fichier : nom et dossier vides = d'après le dossier des masters ouverts.
function etPath( view, p )
{
   let nom = p.nom, dossier = p.dossier;
   let dir = objectDir();
   if ( nom.length == 0 )
      nom = dir.length > 0 ? cwLastName( dir ) : keyword( view, "OBJECT" );
   if ( nom.length == 0 )
      nom = view.id;
   nom = nom.replace( /\s+/g, "" ).replace( /[\/\\:*?"<>|]/g, "_" );   // jamais d'espace (demande de l'utilisateur) : NGC 1532 -> NGC1532
   if ( dossier.length == 0 )
      dossier = dir.length > 0 ? dir : File.homeDirectory;
   if ( !dossier.endsWith( "/" ) )
      dossier += "/";
   return dossier + nom + p.suffixe.replace( /\s+/g, "" ) + ".tif";   // .tif (demande de l'utilisateur, 22 octobre 2026)
}

function etDialog( p, view )
{
   let d = new CWDialog( TITLE, "<b>Export TIFF</b> : copie de l'image en TIFF 16 bits, convertie en sRGB avec profil ICC, " +
                         "pour Photoshop, Lightroom ou Affinity. L'image ouverte ne change pas.", "Dossier :" );
   let sel = { view: view };
   let pathLabel = null;
   function refresh()
   {
      if ( pathLabel )
         pathLabel.text = "Fichier : <b>" + ((sel.view == null || sel.view.isNull) ? "?" : etPath( sel.view, p )) + "</b>";
   }
   d.viewList( "Image :", view, "Image finie à exporter.", function( v ) { sel.view = v; refresh(); } );
   d.edit( "Nom :", p.nom, "Vide = nom du dossier des masters (NGC1532) ; jamais d'espace.", function( t ) { p.nom = t.trim(); refresh(); } );
   d.edit( "Suffixe :", p.suffixe, "Ajouté au nom (ex. _v2).", function( t ) { p.suffixe = t.trim(); refresh(); } );
   let dirEdit = d.edit( "Dossier :", p.dossier, "Vide = dossier de l'objet (au-dessus du dossier master).", function( t ) { p.dossier = t.trim(); refresh(); } );
   d.button( "Choisir le dossier…", "Choisir le dossier d'enregistrement.", function()
   {
      let g = new GetDirectoryDialog;
      g.caption = "Dossier d'enregistrement";
      if ( g.execute() )
      {
         p.dossier = g.directory;
         dirEdit.text = p.dossier;
         refresh();
      }
   } );
   d.check( "Convertir en sRGB IEC61966-2.1 (profil ICC intégré)", p.icc, "", function( c ) { p.icc = c; } );
   d.check( "Ouvrir ensuite dans Photoshop", p.photoshop, "Le .tif est ouvert dans Photoshop après l'enregistrement.", function( c ) { p.photoshop = c; } );
   let exeEdit = d.edit( "Photoshop :", p.photoshopExe, "Vide = trouvé tout seul (PC : C:/Program Files/Adobe/Adobe Photoshop…/Photoshop.exe ; Mac : open -b com.adobe.Photoshop).", function( t ) { p.photoshopExe = t.trim(); } );
   d.button( "Choisir Photoshop…", "Choisir Photoshop.exe (PC) ou l'application (Mac).", function()
   {
      let o = new OpenFileDialog;
      o.caption = "Photoshop";
      if ( o.execute() )
      {
         p.photoshopExe = o.fileName;
         exeEdit.text = p.photoshopExe;
      }
   } );
   pathLabel = d.info( "" );
   refresh();
   d.onExport = function() { etExport( p ); };
   d.validate = function() { return (sel.view == null || sel.view.isNull) ? "Choisis l'image." : ""; };
   d.finish( "Exporter" );
   return d.execute() ? sel.view : null;
}

function main()
{
   let p = etParams();
   if ( cwWantsDialog() )
   {
      let view = etDialog( p, cwDefaultView() );
      if ( view != null )
         cwRun( TITLE, function() { etRun( view, p ); } );
      return;
   }
   let view = Parameters.isViewTarget ? Parameters.targetView : ImageWindow.activeWindow.mainView;
   if ( view.isNull )
      throw new Error( TITLE + " : aucune image." );
   etRun( view, p );
}

function etRun( view, p )
{
   let icc = p.icc;
   let path = etPath( view, p );

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
   if ( p.photoshop )
      etOpenPhotoshop( path, p.photoshopExe );
}

main();
