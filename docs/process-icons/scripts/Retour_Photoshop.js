// ----------------------------------------------------------------------------
// Retour_Photoshop.js — rouvre dans PixInsight le .tif retouché dans Photoshop.
// ----------------------------------------------------------------------------
// Export_TIFF retient le chemin du dernier .tif écrit ; après les retouches,
// enregistre dans Photoshop (Ctrl+S, même fichier, TIFF), puis lance ce script :
// le fichier est ouvert dans une nouvelle vue <nom>_PS (l'image d'origine ne
// change pas).
// Paramètre fichier : chemin forcé ; vide = dernier export d'Export_TIFF.
// Demande de l'utilisateur, 22 octobre 2026. Non testé dans PixInsight.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight, avec
// clodoweg_ui.jsh et clodoweg_objet.jsh.
// ----------------------------------------------------------------------------

#feature-id    Retour_Photoshop : clodoweg > Retour de Photoshop
#feature-info  Rouvre dans PixInsight le dernier TIFF exporté par Export_TIFF, \
   après ses retouches dans Photoshop.

#include "clodoweg_ui.jsh"
#include "clodoweg_objet.jsh"

#define TITLE "Retour de Photoshop"

function rpPath( p )
{
   return p.fichier.length > 0 ? p.fichier : cwLastExport();
}

function rpDialog( p )
{
   let d = new CWDialog( TITLE, "<b>Retour de Photoshop</b> : rouvre le .tif retouché (enregistré dans Photoshop par Ctrl+S) " +
                         "dans une nouvelle vue. Vide = dernier export d'Export_TIFF.", "Fichier :" );
   let pathLabel = null;
   function refresh()
   {
      if ( pathLabel )
         pathLabel.text = "Fichier : <b>" + (rpPath( p ).length > 0 ? rpPath( p ) : "aucun export retenu") + "</b>";
   }
   let fileEdit = d.edit( "Fichier :", p.fichier, "Vide = dernier .tif écrit par Export_TIFF.", function( t ) { p.fichier = t.trim(); refresh(); } );
   d.button( "Choisir le fichier…", "Choisir un TIFF.", function()
   {
      let o = new OpenFileDialog;
      o.caption = "TIFF retouché";
      o.filters = [ [ "TIFF", "*.tif", "*.tiff" ] ];
      if ( o.execute() )
      {
         p.fichier = o.fileName;
         fileEdit.text = p.fichier;
         refresh();
      }
   } );
   pathLabel = d.info( "" );
   refresh();
   d.onExport = function() { Parameters.set( "fichier", p.fichier ); };
   d.validate = function() { return rpPath( p ).length == 0 ? "Aucun export retenu : choisis le fichier." : ""; };
   d.finish( "Ouvrir" );
   return d.execute();
}

function rpRun( p )
{
   let path = rpPath( p );
   if ( path.length == 0 )
      throw new Error( TITLE + " : aucun export retenu (lance d'abord Export_TIFF, ou indique le fichier)." );
   if ( !File.exists( path ) )
      throw new Error( TITLE + " : " + path + " introuvable." );
   let ws = ImageWindow.open( path );
   if ( ws.length == 0 || ws[ 0 ].isNull )
      throw new Error( TITLE + " : impossible d'ouvrir " + path + "." );
   let w = ws[ 0 ];
   let id = File.extractName( path ).replace( /[^A-Za-z0-9_]/g, "_" ) + "_PS";
   if ( ImageWindow.windowById( id ).isNull )
      w.mainView.id = id;
   w.show();
   w.zoomToFit();
   console.noteln( TITLE + " : " + path + " ouvert (" + w.mainView.id + ")." );
}

function main()
{
   let p = { fichier: cwParam( "fichier", "" ) };
   if ( cwWantsDialog() )
   {
      if ( rpDialog( p ) )
         cwRun( TITLE, function() { rpRun( p ); } );
      return;
   }
   rpRun( p );
}

main();
