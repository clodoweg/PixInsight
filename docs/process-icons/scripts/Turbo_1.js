// ----------------------------------------------------------------------------
// Turbo_1.js — mode Turbo, étape 1 : enchaîne les icônes rapides en un clic.
// ----------------------------------------------------------------------------
// Lance, dans l'ordre, les icônes du mode rapide chargées dans l'espace de
// travail (fichier Conteneurs-LRGB.xpsm ou Conteneurs-LHaRGB.xpsm ouvert) :
//   1. R_C_Preparation_rapide   en global (renommage, LinearPatternSubtraction,
//                                Combinaison_RGB, Solver_auto) ;
//   2. R_GC_Solver_auto_rapide  en global (GradientCorrection sur toutes les
//                                images) ;
//   3. R_C_RGB_rapide           sur la vue RGB (vueRGB) ;
//   4. R_C_L_rapide             sur la vue L (vueL) ;
//   5. R_C_Fin_GHS_rapide       sur la vue L (GHS_2_contraste, GHS_3_fond) ;
//   6. fermeture de L_stars si elle existe.
// Les icônes sont lues telles qu'elles sont dans l'espace de travail : un
// réglage changé dans une icône (double-clic) est pris en compte.
// Une étape en échec arrête la suite ; la console dit laquelle.
// Lancement : masters seuls ouverts, double-clic sur l'icône puis Apply Global.
//
// Installation (Mac et PC) : dans src/scripts/clodoweg de PixInsight.
// ----------------------------------------------------------------------------

#feature-id    Turbo_1 : clodoweg > Mode Turbo, étape 1
#feature-info  Enchaîne les icônes rapides : préparation, GradientCorrection, \
   conteneurs RGB et L, fin des GHS sur L.

#define TITLE "Turbo 1"

function param( key, value )
{
   return Parameters.has( key ) ? Parameters.getString( key ).trim() : value;
}

function runIcon( iconId, viewId )
{
   let P = ProcessInstance.fromIcon( iconId );
   if ( P == null )
      throw new Error( TITLE + " : icône " + iconId + " introuvable (charge Conteneurs-LRGB.xpsm ou Conteneurs-LHaRGB.xpsm)." );
   console.noteln( "<end><cbr><br>" + TITLE + " : " + iconId + (viewId ? " sur " + viewId : " (global)") );
   let ok;
   if ( viewId )
   {
      let w = ImageWindow.windowById( viewId );
      if ( w.isNull )
         throw new Error( TITLE + " : vue " + viewId + " introuvable pour " + iconId + "." );
      ok = P.executeOn( w.mainView );
   }
   else
      ok = P.executeGlobal();
   if ( ok === false )
      throw new Error( TITLE + " : " + iconId + " a échoué (voir la console)." );
}

function main()
{
   let vueRGB = param( "vueRGB", "RGB" );
   let vueL = param( "vueL", "L" );
   console.show();
   runIcon( "R_C_Preparation_rapide", null );
   runIcon( "R_GC_Solver_auto_rapide", null );
   runIcon( "R_C_RGB_rapide", vueRGB );
   runIcon( "R_C_L_rapide", vueL );
   runIcon( "R_C_Fin_GHS_rapide", vueL );
   let ls = ImageWindow.windowById( "L_stars" );
   if ( !ls.isNull )
   {
      ls.forceClose();
      console.noteln( TITLE + " : L_stars fermée." );
   }
   console.noteln( "<end><cbr><br>" + TITLE + " : terminé (" + vueRGB + " et " + vueL + " étirées, sans étoiles ; RGB_stars étirée)." );
}

main();
