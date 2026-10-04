// ----------------------------------------------------------------------------
// Turbo_2_debut.js — mode Turbo, début de l'étape 2 (fichier GÉNÉRÉ par make_workflows.py : ne pas modifier à la main).
// ----------------------------------------------------------------------------
// Première étape du conteneur T_Turbo_2 (glissé sur RGB), après GHS_1_premier
// fait à la main sur L :
//   1. icône R_C_Fin_GHS_rapide (GHS_2_contraste puis GHS_3_fond) sur L,
//      réglages lus dans l'icône (même résultat qu'en mode rapide) ;
//   2. fermeture de L_stars (pas d'Etoiles_LRGB en mode Turbo).
// La vue cible du conteneur (RGB) n'est pas touchée ici.
// Paramètre : vueL (L par défaut).
//
// Installation : dans src/scripts/clodoweg.
// ----------------------------------------------------------------------------

#feature-id    Turbo_2_debut : clodoweg > Mode Turbo, début de l'étape 2
#feature-info  R_C_Fin_GHS_rapide sur L, puis fermeture de L_stars.

#define T2_TITLE "Turbo 2 (début)"

function t2Param( key, value )
{
   return Parameters.has( key ) ? Parameters.getString( key ).trim() : value;
}

function turbo2Debut()
{
   let vueL = t2Param( "vueL", "L" );
   let P = ProcessInstance.fromIcon( "R_C_Fin_GHS_rapide" );
   if ( P == null )
      throw new Error( T2_TITLE + " : icône R_C_Fin_GHS_rapide introuvable (charge Conteneurs-LRGB.xpsm)." );
   let w = ImageWindow.windowById( vueL );
   if ( w.isNull )
      throw new Error( T2_TITLE + " : vue " + vueL + " introuvable." );
   console.show();
   console.noteln( "<end><cbr><br>" + T2_TITLE + " : R_C_Fin_GHS_rapide sur " + vueL );
   if ( P.executeOn( w.mainView ) === false )
      throw new Error( T2_TITLE + " : R_C_Fin_GHS_rapide a échoué sur " + vueL + "." );
   let ls = ImageWindow.windowById( "L_stars" );
   if ( !ls.isNull )
   {
      ls.forceClose();
      console.noteln( T2_TITLE + " : L_stars fermée." );
   }
}

turbo2Debut();
