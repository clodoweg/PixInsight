// ----------------------------------------------------------------------------
// Gradient_auto.js — mode rapide : GradientCorrection sur TOUTES les images
// ouvertes, et rien d'autre (pas d'ImageSolver).
// ----------------------------------------------------------------------------
// GradientCorrection, réglages par défaut, sans modèle de gradient
// (generateGradientModel décoché), sur chaque vue principale ouverte.
// Les images au nom se terminant par « _stars » sont ignorées ; une image en
// erreur n'arrête pas les autres (bilan en fin de console).
// À lancer AVANT R_C_RGB_rapide, R_C_L_rapide, R_C_RGB_fin_rapide, qui n'ont
// pas de GradientCorrection.
// Lancement : double-clic sur l'icône, puis Apply Global.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Gradient_auto : clodoweg > GradientCorrection sur toutes les images
#feature-info  GradientCorrection (sans modèle) sur toutes les images ouvertes.

#define GA_TITLE "Gradient_auto"

function main()
{
   let wins = ImageWindow.windows.filter( function( w ) { return !w.mainView.id.endsWith( "_stars" ); } );
   if ( wins.length == 0 )
      throw new Error( GA_TITLE + " : aucune image ouverte." );
   console.show();
   let bilan = [];
   for ( let i = 0; i < wins.length; ++i )
   {
      let id = wins[ i ].mainView.id;
      try
      {
         let G = new GradientCorrection;
         G.generateGradientModel = false;
         if ( !G.executeOn( wins[ i ].mainView ) )
            throw new Error( "échec (voir la console)" );
         bilan.push( id + " : GradientCorrection" );
      }
      catch ( e )
      {
         bilan.push( id + " : ERREUR (" + e.message + ")" );
      }
   }
   console.noteln( "<end><cbr><br>" + GA_TITLE + " :" );
   bilan.forEach( function( l ) { console.noteln( "   " + l ); } );
}

main();
