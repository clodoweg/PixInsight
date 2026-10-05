// ----------------------------------------------------------------------------
// LPS_UnClic.js — LinearPatternSubtraction en un clic, sans dialogue.
// ----------------------------------------------------------------------------
// Appelle directement le moteur LPSEngine de Vicent Peris
// (<pjsr/LinearPatternSubtraction.jsh>, livré avec PixInsight) avec des
// réglages fixes, sur toutes les images MONO ouvertes (par défaut : les
// masters ; une image couleur ouverte est ignorée) ou une seule.
// Zone de fond : choisie automatiquement (la plus sombre) si autoBackground.
//
// Installation (Mac et PC) : créer le dossier clodoweg dans src/scripts de
// PixInsight, à côté de PatternCorrection (Mac : /Applications/PixInsight/
// src/scripts/clodoweg ; PC : en général C:\Program Files\PixInsight\src\
// scripts\clodoweg ; pas le dossier scripts du premier niveau) et y copier ce
// fichier. L'icône Opt_LinearPatternSubtraction de la fiche pointe vers
// $PXI_SRCDIR/scripts/clodoweg/LPS_UnClic.js.
// Lancement : glisser l'icône sur l'image, ou activer l'image puis
// double-clic sur l'icône et Apply Global.
// ----------------------------------------------------------------------------

#feature-id    LPS_UnClic : Pattern Correction > LPS un clic
#feature-info  LinearPatternSubtraction sans dialogue (moteur de Vicent Peris), \
   zone de fond automatique, image active ou toutes les images ouvertes.

#include <pjsr/LinearPatternSubtraction.jsh>
#include "clodoweg_ui.jsh"

#define LPS_TITLE "LPS un clic"

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
   this.allOpenImages = true;            // true = traite toutes les images ouvertes (false = image active ou cible)
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
      throw new Error( LPS_TITLE + " : impossible d'activer l'image " + window.mainView.id );

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
      LPS_TITLE, window.mainView.id, engine.backgroundReferenceLeft, engine.backgroundReferenceTop,
      engine.backgroundReferenceWidth, engine.backgroundReferenceHeight,
      P.correctColumns ? "colonnes" : "lignes" ) );
   engine.execute();
}

function lpsCandidate( w )
{
   let id = w.mainView.id;
   if ( id == "LS" || id == "SS" || id == "pattern" || id.indexOf( "LS" ) == 0 || id.indexOf( "SS" ) == 0 || id.indexOf( "pattern" ) == 0 )
      return false;
   return !w.mainView.image.isColor;
}

function lpsExport( P )
{
   let b = function( k ) { Parameters.set( k, P[ k ] ? "true" : "false" ); };
   let i = function( k ) { Parameters.set( k, Math.round( P[ k ] ).toString() ); };
   b( "correctColumns" ); b( "correctEntireImage" ); Parameters.set( "defectTableFilePath", P.defectTableFilePath );
   i( "layersToRemove" ); i( "rejectionLimit" ); b( "globalRejection" ); i( "globalRejectionLimit" );
   i( "backgroundReferenceLeft" ); i( "backgroundReferenceTop" ); i( "backgroundReferenceWidth" ); i( "backgroundReferenceHeight" );
   b( "autoBackground" ); b( "allOpenImages" ); b( "closeWorkingImages" );
}

function lpsDialog( P )
{
   let d = new CWDialog( LPS_TITLE, "<b>LinearPatternSubtraction</b> (moteur de Vicent Peris) sur les masters mono cochés : " +
                         "retire les lignes (ou colonnes) du capteur. Zone de fond choisie automatiquement (la plus sombre).", "Limite globale :" );
   d.combo( "Corriger :", [ "les lignes", "les colonnes" ], P.correctColumns ? 1 : 0, "", function( k ) { P.correctColumns = k == 1; } );
   d.check( "Corriger toute l'image", P.correctEntireImage, "", function( c ) { P.correctEntireImage = c; } );
   d.numeric( "Couches retirées :", 1, 12, 0, P.layersToRemove, "Layers to remove (9 par défaut).", function( v ) { P.layersToRemove = v; } );
   d.numeric( "Rejet :", 1, 10, 0, P.rejectionLimit, "Rejection limit (3 par défaut).", function( v ) { P.rejectionLimit = v; } );
   d.check( "Rejet global", P.globalRejection, "", function( c ) { P.globalRejection = c; } );
   d.numeric( "Limite globale :", 1, 10, 0, P.globalRejectionLimit, "Global rejection limit (5 par défaut).", function( v ) { P.globalRejectionLimit = v; } );
   d.check( "Zone de fond automatique (la plus sombre)", P.autoBackground, "Sinon : zone 0, 0, 512, 512 de l'icône.", function( c ) { P.autoBackground = c; } );
   d.check( "Fermer les fenêtres de travail (LS, SS, pattern)", P.closeWorkingImages, "", function( c ) { P.closeWorkingImages = c; } );
   let windows = ImageWindow.windows, boxes = [];
   d.group( "Masters à corriger (mono)" );
   for ( let k = 0; k < windows.length; ++k )
      if ( lpsCandidate( windows[ k ] ) )
         boxes.push( { w: windows[ k ], box: d.check( windows[ k ].mainView.id, true, "", null ) } );
   if ( boxes.length == 0 )
      d.info( "Aucun master mono ouvert." );
   d.endGroup();
   d.onExport = function() { lpsExport( P ); };
   d.finish( "Corriger" );
   if ( !d.execute() )
      return null;
   return boxes.filter( function( b ) { return b.box.checked; } ).map( function( b ) { return b.w; } );
}

function lpsCorrect( windows, P )
{
   if ( windows.length == 0 )
      throw new Error( LPS_TITLE + " : aucune image à corriger." );
   console.show();
   let T = new ElapsedTime;
   for ( let k = 0; k < windows.length; ++k )
   {
      correctWindow( windows[ k ], P );
      if ( console.abortRequested )
         break;
   }
   console.noteln( "<end><cbr>" + LPS_TITLE + " : " + windows.length + " image(s) corrigée(s) en " + T.text );
}

function lpsUnClic()
{
   let P = new LPS1Parameters;
   P.import();
   if ( cwWantsDialog() )
   {
      let wins = lpsDialog( P );
      if ( wins != null )
         cwRun( LPS_TITLE, function() { lpsCorrect( wins, P ); } );
      return;
   }
   console.show();

   let windows = [];
   if ( P.allOpenImages )
   {
      let all = ImageWindow.windows;
      for ( let k = 0; k < all.length; ++k )
      {
         let id = all[ k ].mainView.id;
         if ( id == "LS" || id == "SS" || id == "pattern" || id.indexOf( "LS" ) == 0 || id.indexOf( "SS" ) == 0 || id.indexOf( "pattern" ) == 0 )
            continue;
         // Les masters sont mono : une image couleur ouverte (RGB combiné, image traitée) n'est pas touchée.
         if ( all[ k ].mainView.image.isColor )
         {
            console.writeln( LPS_TITLE + " : " + id + " (couleur) ignorée." );
            continue;
         }
         windows.push( all[ k ] );
      }
   }
   else if ( Parameters.isViewTarget )
      windows.push( Parameters.targetView.window );
   else if ( !ImageWindow.activeWindow.isNull )
      windows.push( ImageWindow.activeWindow );

   if ( windows.length == 0 )
      throw new Error( LPS_TITLE + " : aucune image ouverte." );

   let T = new ElapsedTime;
   for ( let k = 0; k < windows.length; ++k )
   {
      correctWindow( windows[ k ], P );
      if ( console.abortRequested )
         break;
   }
   console.noteln( "<end><cbr>" + LPS_TITLE + " : " + windows.length + " image(s) corrigée(s) en " + T.text );
}

lpsUnClic();
