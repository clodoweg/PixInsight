// ----------------------------------------------------------------------------
// Combiner_RGB.js — combine les masters R, G, B en une image couleur, copie
// l'en-tête FITS du master rouge (coordonnées, date… utiles à ImageSolver),
// puis ferme les masters R, G et B.
// Paramètre « garder » : masters à laisser ouverts (séparés par des virgules,
// par exemple R en LHaRGB, où R sert encore à Continuum_auto) ; les autres
// sont fermés si closeSources = true.
// ----------------------------------------------------------------------------
// Les fermetures se font sans demander d'enregistrer (forceClose) : enregistre
// d'abord les masters si tu veux garder une version modifiée (par exemple
// après LPS_UnClic).
//
// Lancement : double-clic sur l'icône Combinaison_RGB de la fiche, puis
// Apply Global. Installation (Mac et PC) : dans src/scripts/clodoweg de
// PixInsight, à côté du dossier PatternCorrection.
// ----------------------------------------------------------------------------

#feature-id    Combiner_RGB : clodoweg > Combiner R, G, B
#feature-info  Combine R, G, B en RGB, copie l'en-tête du rouge et ferme R, G, B.

#include "clodoweg_ui.jsh"

#define CRGB_TITLE "Combiner RGB"

function crgbParams()
{
   return { red: cwParam( "red", "R" ), green: cwParam( "green", "G" ), blue: cwParam( "blue", "B" ), newId: cwParam( "newId", "RGB" ),
            closeSources: cwBool( "closeSources", true ), copyKeywords: cwBool( "copyKeywords", true ), garder: cwParam( "garder", "" ) };
}

function crgbExport( p )
{
   Parameters.set( "red", p.red );
   Parameters.set( "green", p.green );
   Parameters.set( "blue", p.blue );
   Parameters.set( "newId", p.newId );
   Parameters.set( "closeSources", p.closeSources ? "true" : "false" );
   Parameters.set( "copyKeywords", p.copyKeywords ? "true" : "false" );
   Parameters.set( "garder", p.garder );
}

function crgbRun( p )
{
   let red = p.red, green = p.green, blue = p.blue, newId = p.newId;
   let garder = p.garder.split( "," ).map( function( x ) { return x.trim(); } );
   let ids = [ red, green, blue ];
   let windows = [];
   for ( let i = 0; i < 3; ++i )
   {
      let w = ImageWindow.windowById( ids[ i ] );
      if ( w.isNull )
         throw new Error( CRGB_TITLE + " : aucune image nommée '" + ids[ i ] + "'. Renomme tes masters R, G et B." );
      windows.push( w );
   }
   if ( !ImageWindow.windowById( newId ).isNull )
      throw new Error( CRGB_TITLE + " : une image '" + newId + "' existe déjà ; ferme-la ou renomme-la." );

   let P = new PixelMath;
   P.expression = red;
   P.expression1 = green;
   P.expression2 = blue;
   P.useSingleExpression = false;
   P.createNewImage = true;
   P.showNewImage = true;
   P.newImageId = newId;
   P.newImageColorSpace = PixelMath.prototype.RGB;
   P.newImageSampleFormat = PixelMath.prototype.f32;
   P.rescale = false;
   P.truncate = true;
   if ( !P.executeOn( windows[ 0 ].mainView ) )
      throw new Error( CRGB_TITLE + " : échec de la combinaison." );

   let rgb = ImageWindow.windowById( newId );
   if ( rgb.isNull )
      throw new Error( CRGB_TITLE + " : image '" + newId + "' introuvable après la combinaison." );

   if ( p.copyKeywords )
      rgb.keywords = windows[ 0 ].keywords;

   let fermees = [];
   if ( p.closeSources )
      for ( let i = 0; i < 3; ++i )
         if ( garder.indexOf( ids[ i ] ) < 0 )
         {
            windows[ i ].forceClose();
            fermees.push( ids[ i ] );
         }

   rgb.show();
   rgb.bringToFront();
   console.noteln( "<end><cbr>" + CRGB_TITLE + " : '" + newId + "' créée" + ( p.copyKeywords ? ", en-tête de '" + red + "' copié" : "" ) +
                   ( fermees.length ? ", " + fermees.join( ", " ) + " fermée(s)." : "." ) );
}

function crgbDialog( p )
{
   let d = new CWDialog( CRGB_TITLE, "<b>Combiner R, G, B</b> en une image couleur. L'en-tête FITS du rouge (coordonnées, date) est copié pour ImageSolver ; " +
                         "les masters sont fermés sans demander d'enregistrer.", "Nouvelle image :" );
   function pick( text, id, set )
   {
      d.viewList( text, cwViewById( id ), "Master " + text, function( v ) { set( v.isNull ? "" : v.id ); } );
   }
   d.group( "Masters" );
   pick( "Rouge :", p.red, function( id ) { p.red = id; } );
   pick( "Vert :", p.green, function( id ) { p.green = id; } );
   pick( "Bleu :", p.blue, function( id ) { p.blue = id; } );
   d.endGroup();
   d.group( "Résultat" );
   d.edit( "Nouvelle image :", p.newId, "Nom de l'image couleur créée (sans espace).", function( t ) { p.newId = t.trim(); } );
   d.check( "Copier l'en-tête FITS du rouge", p.copyKeywords, "Coordonnées et date pour ImageSolver.", function( c ) { p.copyKeywords = c; } );
   d.check( "Fermer les masters après", p.closeSources, "Fermés sans enregistrer.", function( c ) { p.closeSources = c; } );
   d.edit( "Garder ouverts :", p.garder, "Masters à laisser ouverts, séparés par des virgules (LHaRGB : R, pour Continuum_auto).", function( t ) { p.garder = t; } );
   d.endGroup();
   d.onExport = function() { crgbExport( p ); };
   d.validate = function()
   {
      if ( !p.red || !p.green || !p.blue ) return "Choisis les trois masters.";
      if ( p.newId.length == 0 || p.newId.indexOf( " " ) >= 0 ) return "Nom de l'image vide ou avec un espace.";
      return "";
   };
   d.finish( "Combiner" );
   return d.execute();
}

function combinerRGB()
{
   let p = crgbParams();
   if ( cwWantsDialog() )
   {
      if ( crgbDialog( p ) )
         cwRun( CRGB_TITLE, function() { crgbRun( p ); } );
      return;
   }
   crgbRun( p );
}

combinerRGB();
