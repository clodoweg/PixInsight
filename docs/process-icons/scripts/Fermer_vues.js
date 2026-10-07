// ----------------------------------------------------------------------------
// Fermer_vues.js — ferme sans demander les vues temporaires d'un traitement.
// ----------------------------------------------------------------------------
// Paramètre « views » : noms des vues à fermer, séparés par des virgules
// (par exemple HDR_avant, ou L_stars), ou * pour TOUTES les vues ouvertes.
// Les vues absentes sont ignorées ; l'image cible n'est jamais fermée. Sert de dernière étape dans les
// conteneurs de la fiche (HDRMT_50, C_L_lineaire, C_L_rapide...).
//
// Installation (Mac et PC) : dossier clodoweg dans src/scripts de PixInsight
// (Mac : /Applications/PixInsight/src/scripts/clodoweg ; PC : en général
// C:\Program Files\PixInsight\src\scripts\clodoweg).
// ----------------------------------------------------------------------------

#feature-id    Fermer_vues : clodoweg > Fermer des vues
#feature-info  Ferme sans confirmation les vues dont les noms sont donnés \
   dans le paramètre views (séparés par des virgules ; * = toutes).

#include "clodoweg_ui.jsh"

#define TITLE "Fermer vues"

function fvRun( list, target )
{
   let ids = list.split( "," );
   if ( list.trim() == "*" )
      ids = ImageWindow.windows.map( function( w ) { return w.mainView.id; } );
   let closed = 0;
   for ( let k = 0; k < ids.length; ++k )
   {
      let id = ids[ k ].trim();
      if ( id.length == 0 || id == target )
         continue;
      let w = ImageWindow.windowById( id );
      if ( w.isNull )
         continue;
      w.forceClose();
      ++closed;
   }
   console.noteln( TITLE + " : " + closed + " vue(s) fermée(s) (" + list + ")." );
}

function fvDialog( p )
{
   let d = new CWDialog( TITLE, "<b>Fermer des vues</b> sans demander d'enregistrer. Coche les vues à fermer.", "Vues :" );
   let all = p.views.trim() == "*";
   let wanted = p.views.split( "," ).map( function( x ) { return x.trim(); } );
   let windows = ImageWindow.windows, boxes = [];
   d.group( "Vues ouvertes" );
   if ( windows.length == 0 )
      d.info( "Aucune vue ouverte." );
   for ( let k = 0; k < windows.length; ++k )
   {
      let id = windows[ k ].mainView.id;
      boxes.push( { id: id, box: d.check( id, all || wanted.indexOf( id ) >= 0, "", null ) } );
   }
   d.endGroup();
   function selected()
   {
      let out = [];
      for ( let k = 0; k < boxes.length; ++k )
         if ( boxes[ k ].box.checked )
            out.push( boxes[ k ].id );
      return out.join( ", " );
   }
   d.onExport = function() { Parameters.set( "views", selected() ); };
   d.finish( "Fermer" );
   if ( !d.execute() )
      return false;
   p.views = selected();
   return true;
}

function main()
{
   let p = { views: cwParam( "views", "" ) };
   if ( cwWantsDialog() )
   {
      if ( fvDialog( p ) )
         cwRun( TITLE, function() { fvRun( p.views, "" ); } );
      return;
   }
   fvRun( p.views, Parameters.isViewTarget ? Parameters.targetView.id : "" );
}

main();
