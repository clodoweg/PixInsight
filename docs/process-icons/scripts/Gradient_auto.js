// ----------------------------------------------------------------------------
// Gradient_auto.js — mode rapide : GradientCorrection sur TOUTES les images
// ouvertes, et rien d'autre (pas d'ImageSolver).
// ----------------------------------------------------------------------------
// GradientCorrection, réglages par défaut, sans modèle de gradient
// (generateGradientModel décoché), sur chaque vue principale ouverte.
// Les images au nom se terminant par « _stars » sont ignorées ; une image en
// erreur n'arrête pas les autres (bilan en fin de console).
// outil = graxpert (demande de l'utilisateur, 22 octobre 2026) : process GraXpert (module DeepSkyForge,
// application GraXpert 4.0.0 ou plus installée), extraction de fond par IA, Subtraction, smoothing 0,
// image remplacée, sans débruitage ni déconvolution ; outil = gc (défaut) : GradientCorrection.
// À lancer AVANT R_C_RGB_rapide, R_C_L_rapide, R_C_RGB_fin_rapide, qui n'ont
// pas de GradientCorrection.
// Lancement : double-clic sur l'icône, puis Apply Global.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Gradient_auto : clodoweg > GradientCorrection sur toutes les images
#feature-info  GradientCorrection (sans modèle) ou GraXpert sur toutes les images ouvertes.

#include "clodoweg_ui.jsh"

#define GA_TITLE "Gradient_auto"

var GA_OUTIL = cwParam( "outil", "gc" ).toLowerCase();

function gaNomOutil()
{
   return GA_OUTIL == "graxpert" ? "GraXpert" : "GradientCorrection";
}

function gaGradient( view )
{
   let G;
   if ( GA_OUTIL == "graxpert" )
   {
      if ( typeof GraXpert == "undefined" )
         throw new Error( "process GraXpert absent : installe le module (dépôt DeepSkyForge) et l'application GraXpert 4.0.0 ou plus" );
      G = new GraXpert;
      G.backgroundExtraction = true;
      G.smoothing = 0;
      G.createBackground = false;
      G.denoising = false;
      G.deconvolution = false;
      G.replaceImage = true;
   }
   else
   {
      G = new GradientCorrection;
      G.generateGradientModel = false;
   }
   if ( !G.executeOn( view ) )
      throw new Error( "échec (voir la console)" );
}

// onCopy = true (toujours depuis le 8 octobre 2026) : calcul sur une copie puis recopie (étape Ctrl+Z, affichage).
function gaRun( wins, onCopy )
{
   if ( wins.length == 0 )
      throw new Error( GA_TITLE + " : aucune image à traiter." );
   console.show();
   let bilan = [];
   for ( let i = 0; i < wins.length; ++i )
   {
      let id = wins[ i ].mainView.id;
      try
      {
         if ( onCopy )
            cwApplyOnCopy( wins[ i ].mainView, gaGradient );
         else
            gaGradient( wins[ i ].mainView );
         bilan.push( id + " : " + gaNomOutil() );
      }
      catch ( e )
      {
         bilan.push( id + " : ERREUR (" + e.message + ")" );
      }
   }
   console.noteln( "<end><cbr><br>" + GA_TITLE + " :" );
   bilan.forEach( function( l ) { console.noteln( "   " + l ); } );
}

function gaDialog()
{
   let d = new CWDialog( GA_TITLE, "<b>Retrait du gradient</b> sur les images cochées : GradientCorrection (réglages par défaut, sans modèle) " +
                         "ou GraXpert (IA, Subtraction, smoothing 0 ; application GraXpert 4.0.0 ou plus). Mode rapide, avant la phase 3.", "Images :" );
   d.combo( "Outil :", [ "GradientCorrection", "GraXpert (IA)" ], GA_OUTIL == "graxpert" ? 1 : 0, "GraXpert : module DeepSkyForge et application GraXpert installés.",
            function( k ) { GA_OUTIL = k == 1 ? "graxpert" : "gc"; } );
   d.onExport = function() { Parameters.set( "outil", GA_OUTIL ); };
   let windows = ImageWindow.windows, boxes = [];
   d.group( "Images à corriger" );
   if ( windows.length == 0 )
      d.info( "Aucune image ouverte." );
   for ( let k = 0; k < windows.length; ++k )
      boxes.push( { w: windows[ k ], box: d.check( windows[ k ].mainView.id, !windows[ k ].mainView.id.endsWith( "_stars" ), "", null ) } );
   d.endGroup();
   d.finish( "Corriger" );
   if ( !d.execute() )
      return null;
   return boxes.filter( function( b ) { return b.box.checked; } ).map( function( b ) { return b.w; } );
}

function main()
{
   if ( cwWantsDialog() )
   {
      let wins = gaDialog();
      if ( wins != null )
         cwRun( GA_TITLE, function() { gaRun( wins, true ); } );
      return;
   }
   // toujours sur copie puis recopie : étape Ctrl+Z même sans fenêtre (retour de l'utilisateur sur Sharp_MMT, 8 octobre 2026)
   gaRun( ImageWindow.windows.filter( function( w ) { return !w.mainView.id.endsWith( "_stars" ); } ), true );
}

main();
