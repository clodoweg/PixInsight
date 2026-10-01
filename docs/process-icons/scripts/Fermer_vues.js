// ----------------------------------------------------------------------------
// Fermer_vues.js — ferme sans demander les vues temporaires d'un traitement.
// ----------------------------------------------------------------------------
// Paramètre « views » : noms des vues à fermer, séparés par des virgules
// (par exemple HDR_avant, ou L_stars). Les vues absentes sont ignorées ;
// l'image cible n'est jamais fermée. Sert de dernière étape dans les
// conteneurs de la fiche (HDRMT_50, C_L_lineaire, C_L_rapide...).
//
// Installation (Mac et PC) : dossier clodoweg dans src/scripts de PixInsight
// (Mac : /Applications/PixInsight/src/scripts/clodoweg ; PC : en général
// C:\Program Files\PixInsight\src\scripts\clodoweg).
// ----------------------------------------------------------------------------

#feature-id    Fermer_vues : clodoweg > Fermer des vues
#feature-info  Ferme sans confirmation les vues dont les noms sont donnés \
   dans le paramètre views (séparés par des virgules).

#define TITLE "Fermer vues"

function main()
{
   let list = Parameters.has( "views" ) ? Parameters.getString( "views" ) : "";
   let target = Parameters.isViewTarget ? Parameters.targetView.id : "";
   let ids = list.split( "," );
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

main();
