// ----------------------------------------------------------------------------
// Renommer_auto.js — nomme les masters ouverts L, R, G, B, H, O, S en un clic.
// ----------------------------------------------------------------------------
// Les formules et les icônes de la fiche attendent des vues nommées L, R, G,
// B, H, O, S. Ce script lit le mot-clé FILTER de l'en-tête de chaque image
// mono ouverte (Lum, Red, Ha, OIII, SII...) et renomme la vue. Sans mot-clé
// FILTER, il cherche le filtre dans le nom du fichier (FILTER-L, _Ha_...).
// Les images couleur et les vues déjà bien nommées ne sont pas touchées ;
// si deux images ont le même filtre, seule la première est renommée.
// Retient aussi le dossier de l'objet (dossier des masters, clodoweg_objet.jsh)
// pour Export_TIFF, utile quand les masters sont fermés avant l'export.
//
// Installation (Mac et PC) : dossier clodoweg dans src/scripts de PixInsight
// (Mac : /Applications/PixInsight/src/scripts/clodoweg ; PC : en général
// C:\Program Files\PixInsight\src\scripts\clodoweg). L'icône Renommer_auto de
// la fiche pointe vers $PXI_SRCDIR/scripts/clodoweg/Renommer_auto.js.
// Lancement : double-clic sur l'icône, puis Apply Global (rond), ou glisser
// l'icône sur n'importe quelle image : toutes les images ouvertes sont
// traitées.
// ----------------------------------------------------------------------------

#feature-id    Renommer_auto : clodoweg > Renommer les masters
#feature-info  Renomme les masters ouverts L, R, G, B, H, O, S d'après le \
   mot-clé FILTER (ou le nom du fichier).

#include "clodoweg_ui.jsh"
#include "clodoweg_objet.jsh"

#define REN_TITLE "Renommer auto"

// Nom de filtre (en-tête ou morceau du nom de fichier) -> nom de vue.
function filterToId( text )
{
   let t = text.toLowerCase().replace( /[\s_\-']/g, "" ).replace( /\d+(\.\d+)?nm$/, "" );
   if ( t.length == 0 )
      return "";
   let exact = { l: "L", lum: "L", luminance: "L", lumi: "L", clear: "L",
                 r: "R", red: "R", rouge: "R",
                 g: "G", green: "G", vert: "G",
                 b: "B", blue: "B", bleu: "B",
                 h: "H", ha: "H", halpha: "H", hydrogenalpha: "H",
                 o: "O", o3: "O", oiii: "O",
                 s: "S", s2: "S", sii: "S" };
   if ( exact.hasOwnProperty( t ) )
      return exact[ t ];
   if ( t.indexOf( "lum" ) == 0 ) return "L";
   if ( t.indexOf( "red" ) == 0 ) return "R";
   if ( t.indexOf( "green" ) == 0 ) return "G";
   if ( t.indexOf( "blue" ) == 0 ) return "B";
   if ( t.indexOf( "halpha" ) == 0 || t.indexOf( "ha" ) == 0 && t.length <= 4 ) return "H";
   if ( t.indexOf( "oiii" ) == 0 || t.indexOf( "o3" ) == 0 ) return "O";
   if ( t.indexOf( "sii" ) == 0 || t.indexOf( "s2" ) == 0 ) return "S";
   return "";
}

function fromKeyword( window )
{
   let keywords = window.keywords;
   for ( let k = 0; k < keywords.length; ++k )
      if ( keywords[ k ].name.trim().toUpperCase() == "FILTER" )
         return filterToId( keywords[ k ].strippedValue.trim() );
   return "";
}

function fromFileName( window )
{
   let path = window.filePath;
   if ( path.length == 0 )
      return "";
   let name = File.extractName( path );
   // Forme WBPP : ..._FILTER-Ha_...
   let m = name.match( /FILTER[-_]([A-Za-z0-9]+)/i );
   if ( m )
      return filterToId( m[ 1 ] );
   // Sinon : un morceau du nom séparé par _ - espace ou point.
   let parts = name.split( /[_\-\s.]+/ );
   for ( let k = 0; k < parts.length; ++k )
   {
      let p = parts[ k ];
      // Lettres seules (L, R, G, B, S...) : seulement en majuscule, pour éviter
      // les faux positifs (300s, bin, ...).
      if ( p.length == 1 && p != p.toUpperCase() )
         continue;
      let id = filterToId( p );
      if ( id.length > 0 )
         return id;
   }
   return "";
}

// Renommages prévus : [{ view, old, id, source, note }] (note non vide = pas renommée).
function renProposals()
{
   let windows = ImageWindow.windows;
   let used = {};
   for ( let k = 0; k < windows.length; ++k )
      used[ windows[ k ].mainView.id ] = true;
   let list = [];
   for ( let k = 0; k < windows.length; ++k )
   {
      let w = windows[ k ];
      let view = w.mainView;
      if ( view.image.isColor )
         continue;
      let id = fromKeyword( w );
      let source = "FILTER";
      if ( id.length == 0 )
      {
         id = fromFileName( w );
         source = "nom du fichier";
      }
      if ( id.length == 0 )
      {
         list.push( { view: view, old: view.id, id: "", source: "", note: "filtre inconnu : renomme-la à la main" } );
         continue;
      }
      if ( view.id == id )
      {
         list.push( { view: view, old: view.id, id: id, source: source, note: "déjà bien nommée" } );
         continue;
      }
      if ( used[ id ] )
      {
         list.push( { view: view, old: view.id, id: id, source: source, note: "nom " + id + " déjà pris : non renommée" } );
         continue;
      }
      used[ id ] = true;
      delete used[ view.id ];
      list.push( { view: view, old: view.id, id: id, source: source, note: "" } );
   }
   return list;
}

function renApply( list )
{
   console.show();
   let done = 0, skipped = 0;
   for ( let k = 0; k < list.length; ++k )
   {
      let r = list[ k ];
      if ( r.note.length > 0 )
      {
         if ( r.note != "déjà bien nommée" )
         {
            console.warningln( REN_TITLE + " : '" + r.old + "' : " + r.note + "." );
            ++skipped;
         }
         continue;
      }
      r.view.id = r.id;
      console.noteln( REN_TITLE + " : '" + r.old + "' -> '" + r.id + "' (" + r.source + ")" );
      ++done;
   }
   console.noteln( "<end><cbr>" + REN_TITLE + " : " + done + " vue(s) renommée(s), " + skipped + " à vérifier." );
   // dossier de l'objet retenu pour Export_TIFF (narrowband : les masters sont fermés avant l'export)
   let dir = cwObjectDirFromWindows();
   cwSaveObjectDir( dir );
   if ( dir.length > 0 )
      console.noteln( REN_TITLE + " : dossier de l'objet retenu pour Export_TIFF : " + dir );
}

function renDialog( list )
{
   let d = new CWDialog( REN_TITLE, "<b>Renommer les masters</b> mono ouverts en L, R, G, B, H, O, S, d'après le mot-clé FILTER (sinon le nom du fichier). " +
                         "Voici ce qui sera fait :", "Image :" );
   let html = "<table cellspacing='4'><tr><th align='left'>Vue</th><th align='left'>Nouveau nom</th><th align='left'>D'après</th></tr>";
   if ( list.length == 0 )
      html += "<tr><td colspan='3'>Aucune image mono ouverte.</td></tr>";
   for ( let k = 0; k < list.length; ++k )
   {
      let r = list[ k ];
      html += "<tr><td>" + r.old + "</td><td>" + (r.note.length ? "<i>" + r.note + "</i>" : "<b>" + r.id + "</b>") + "</td><td>" + r.source + "</td></tr>";
   }
   let dir = cwObjectDirFromWindows();
   d.info( html + "</table><p>Dossier de l'objet retenu pour Export_TIFF : <b>" + (dir.length > 0 ? dir : "aucun (images sans fichier)") + "</b></p>" );
   d.finish( "Renommer" );
   return d.execute();
}

function renommerAuto()
{
   let list = renProposals();
   if ( cwWantsDialog() )
   {
      if ( renDialog( list ) )
         cwRun( REN_TITLE, function() { renApply( list ); } );
      return;
   }
   renApply( list );
}

renommerAuto();
