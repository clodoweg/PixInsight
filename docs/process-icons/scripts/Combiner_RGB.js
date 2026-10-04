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

#ifndef CLODOWEG_TURBO
#feature-id    Combiner_RGB : clodoweg > Combiner R, G, B
#endif
#ifndef CLODOWEG_TURBO
#feature-info  Combine R, G, B en RGB, copie l'en-tête du rouge et ferme R, G, B.
#endif

#define CRGB_TITLE "Combiner RGB"

function combinerRGB()
{
   let red = "R", green = "G", blue = "B", newId = "RGB";
   let closeSources = true, copyKeywords = true, garder = [];
   if ( Parameters.has( "red" ) ) red = Parameters.getString( "red" ).trim();
   if ( Parameters.has( "green" ) ) green = Parameters.getString( "green" ).trim();
   if ( Parameters.has( "blue" ) ) blue = Parameters.getString( "blue" ).trim();
   if ( Parameters.has( "newId" ) ) newId = Parameters.getString( "newId" ).trim();
   if ( Parameters.has( "closeSources" ) ) closeSources = Parameters.getBoolean( "closeSources" );
   if ( Parameters.has( "copyKeywords" ) ) copyKeywords = Parameters.getBoolean( "copyKeywords" );
   if ( Parameters.has( "garder" ) ) garder = Parameters.getString( "garder" ).split( "," ).map( function( x ) { return x.trim(); } );

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

   if ( copyKeywords )
      rgb.keywords = windows[ 0 ].keywords;

   let fermees = [];
   if ( closeSources )
      for ( let i = 0; i < 3; ++i )
         if ( garder.indexOf( ids[ i ] ) < 0 )
         {
            windows[ i ].forceClose();
            fermees.push( ids[ i ] );
         }

   rgb.show();
   rgb.bringToFront();
   console.noteln( "<end><cbr>" + CRGB_TITLE + " : '" + newId + "' créée" + ( copyKeywords ? ", en-tête de '" + red + "' copié" : "" ) +
                   ( fermees.length ? ", " + fermees.join( ", " ) + " fermée(s)." : "." ) );
}

#ifndef CLODOWEG_TURBO
combinerRGB();
#endif
