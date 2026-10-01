// ----------------------------------------------------------------------------
// Renommer_auto.js — nomme les masters ouverts L, R, G, B, H, O, S en un clic.
// ----------------------------------------------------------------------------
// Les formules et les icônes de la fiche attendent des vues nommées L, R, G,
// B, H, O, S. Ce script lit le mot-clé FILTER de l'en-tête de chaque image
// mono ouverte (Lum, Red, Ha, OIII, SII...) et renomme la vue. Sans mot-clé
// FILTER, il cherche le filtre dans le nom du fichier (FILTER-L, _Ha_...).
// Les images couleur et les vues déjà bien nommées ne sont pas touchées ;
// si deux images ont le même filtre, seule la première est renommée.
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

#define TITLE "Renommer auto"

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

function main()
{
   console.show();
   let windows = ImageWindow.windows;
   let used = {};
   for ( let k = 0; k < windows.length; ++k )
      used[ windows[ k ].mainView.id ] = true;

   let done = 0, skipped = 0;
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
         console.warningln( TITLE + " : filtre inconnu pour '" + view.id + "' : renomme-la à la main." );
         ++skipped;
         continue;
      }
      if ( view.id == id )
         continue;
      if ( used[ id ] )
      {
         console.warningln( TITLE + " : '" + view.id + "' serait '" + id + "', mais ce nom est déjà pris : non renommée." );
         ++skipped;
         continue;
      }
      let old = view.id;
      view.id = id;
      used[ id ] = true;
      delete used[ old ];
      console.noteln( TITLE + " : '" + old + "' -> '" + id + "' (" + source + ")" );
      ++done;
   }
   console.noteln( "<end><cbr>" + TITLE + " : " + done + " vue(s) renommée(s), " + skipped + " à vérifier." );
}

main();
