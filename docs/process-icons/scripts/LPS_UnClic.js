// ----------------------------------------------------------------------------
// LPS_UnClic.js — LinearPatternSubtraction en un clic, sans dialogue.
// ----------------------------------------------------------------------------
// Appelle directement le moteur LPSEngine de Vicent Peris
// (<pjsr/LinearPatternSubtraction.jsh>, livré avec PixInsight) avec des
// réglages fixes, sur l'image active ou sur toutes les images ouvertes.
// Zone de fond : choisie automatiquement (la plus sombre) si autoBackground.
//
// Installation : copier ce fichier dans /Users/Shared/PixInsight/scripts/
// (chemin utilisé par l'icône Opt_LinearPatternSubtraction de la fiche).
// Lancement : glisser l'icône sur l'image, ou activer l'image puis
// double-clic sur l'icône et Apply Global.
// ----------------------------------------------------------------------------

#feature-id    LPS_UnClic : Pattern Correction > LPS un clic
#feature-info  LinearPatternSubtraction sans dialogue (moteur de Vicent Peris), \
   zone de fond automatique, image active ou toutes les images ouvertes.

#include <pjsr/LinearPatternSubtraction.jsh>

#define TITLE "LPS un clic"

function LPS1Parameters()
{
   // Réglages par défaut = ceux du dialogue de l'utilisateur.
   this.correctColumns = false;          // false = lignes
   this.correctEntireImage = true;
   this.defectTableFilePath = "";
   this.layersToRemove = 9;
   this.rejectionLimit = 3;
   this.globalRejection = true;
   this.globalRejectionLimit = 5;
   this.backgroundReferenceLeft = 0;
   this.backgroundReferenceTop = 0;
   this.backgroundReferenceWidth = 512;
   this.backgroundReferenceHeight = 512;
   this.autoBackground = true;           // cherche la zone de fond la plus sombre
   this.allOpenImages = false;           // true = traite toutes les images ouvertes
   this.closeWorkingImages = true;       // ferme les fenêtres LS, SS et pattern

   this.import = function()
   {
      let b = ( k ) => { if ( Parameters.has( k ) ) this[ k ] = Parameters.getBoolean( k ); };
      let i = ( k ) => { if ( Parameters.has( k ) ) this[ k ] = Parameters.getInteger( k ); };
      let s = ( k ) => { if ( Parameters.has( k ) ) this[ k ] = Parameters.getString( k ).trim(); };
      b( "correctColumns" ); b( "correctEntireImage" ); s( "defectTableFilePath" );
      i( "layersToRemove" ); i( "rejectionLimit" ); b( "globalRejection" ); i( "globalRejectionLimit" );
      i( "backgroundReferenceLeft" ); i( "backgroundReferenceTop" );
      i( "backgroundReferenceWidth" ); i( "backgroundReferenceHeight" );
      b( "autoBackground" ); b( "allOpenImages" ); b( "closeWorkingImages" );
   };
}

/*
 * Zone de fond la plus sombre : grille de carrés (512 px, ou un quart de la
 * plus petite dimension), en évitant une marge de 5 % sur les bords (bords
 * noirs d'alignement) et les zones vides (médiane quasi nulle).
 */
function darkestBackground( image )
{
   let size = Math.min( 512, Math.floor( Math.min( image.width, image.height ) / 4 ) );
   let marginX = Math.floor( image.width * 0.05 ), marginY = Math.floor( image.height * 0.05 );
   let step = Math.max( 16, Math.floor( size / 2 ) );
   let best = null, bestMedian = Infinity;
   for ( let y = marginY; y + size <= image.height - marginY; y += step )
      for ( let x = marginX; x + size <= image.width - marginX; x += step )
      {
         let r = new Rect( size, size );
         r.moveTo( x, y );
         let m = image.median( r );
         if ( m > 1.0e-5 && m < bestMedian )
         {
            bestMedian = m;
            best = { left: x, top: y, width: size, height: size };
         }
      }
   return best;
}

function correctWindow( window, P )
{
   window.show();
   window.bringToFront();
   processEvents();
   if ( ImageWindow.activeWindow.mainView.id != window.mainView.id )
      throw new Error( TITLE + " : impossible d'activer l'image " + window.mainView.id );

   let engine = new LPSEngine();
   engine.targetIsActiveImage = true;
   engine.closeFormerWorkingImages = P.closeWorkingImages;
   engine.correctColumns = P.correctColumns;
   engine.correctEntireImage = P.correctEntireImage;
   engine.defectTableFilePath = P.defectTableFilePath;
   engine.layersToRemove = P.layersToRemove;
   engine.rejectionLimit = P.rejectionLimit;
   engine.globalRejection = P.globalRejection;
   engine.globalRejectionLimit = P.globalRejectionLimit;
   engine.backgroundReferenceLeft = P.backgroundReferenceLeft;
   engine.backgroundReferenceTop = P.backgroundReferenceTop;
   engine.backgroundReferenceWidth = P.backgroundReferenceWidth;
   engine.backgroundReferenceHeight = P.backgroundReferenceHeight;

   if ( P.autoBackground )
   {
      let bg = darkestBackground( window.mainView.image );
      if ( bg != null )
      {
         engine.backgroundReferenceLeft = bg.left;
         engine.backgroundReferenceTop = bg.top;
         engine.backgroundReferenceWidth = bg.width;
         engine.backgroundReferenceHeight = bg.height;
      }
   }
   console.writeln( format( "<end><cbr>%s : %s — fond %d, %d, %d x %d — %s",
      TITLE, window.mainView.id, engine.backgroundReferenceLeft, engine.backgroundReferenceTop,
      engine.backgroundReferenceWidth, engine.backgroundReferenceHeight,
      P.correctColumns ? "colonnes" : "lignes" ) );
   engine.execute();
}

function main()
{
   let P = new LPS1Parameters;
   P.import();
   console.show();

   let windows = [];
   if ( Parameters.isViewTarget )
      windows.push( Parameters.targetView.window );
   else if ( P.allOpenImages )
   {
      let all = ImageWindow.windows;
      for ( let k = 0; k < all.length; ++k )
      {
         let id = all[ k ].mainView.id;
         if ( id != "LS" && id != "SS" && id != "pattern" && id.indexOf( "LS" ) != 0 && id.indexOf( "SS" ) != 0 && id.indexOf( "pattern" ) != 0 )
            windows.push( all[ k ] );
      }
   }
   else if ( !ImageWindow.activeWindow.isNull )
      windows.push( ImageWindow.activeWindow );

   if ( windows.length == 0 )
      throw new Error( TITLE + " : aucune image ouverte." );

   let T = new ElapsedTime;
   for ( let k = 0; k < windows.length; ++k )
   {
      correctWindow( windows[ k ], P );
      if ( console.abortRequested )
         break;
   }
   console.noteln( "<end><cbr>" + TITLE + " : " + windows.length + " image(s) corrigée(s) en " + T.text );
}

main();
