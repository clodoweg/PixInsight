# Instructions pour Claude

Ce dépôt contient une fiche de référence PixInsight (`docs/pixinsight-workflow.html`), ses icônes de process et la liste de ses sources (`docs/sources.md`). Réponds en français, en textes courts et simples.

## Valider avec des sources avant d'insérer

Avant d'ajouter ou de modifier un contenu technique (réglage, valeur, ordre des étapes, formule, URL) :

1. Cherche des sources et lis-les : documentation officielle d'abord, puis tutoriels reconnus, puis forums.
2. Recoupe avec deux sources quand c'est possible ; si elles divergent, dis-le et donne la position de l'éditeur.
3. Une valeur non vérifiée est signalée comme telle dans la fiche et ajoutée à « Non vérifié » dans `docs/sources.md`.
4. Chaque source utilisée va dans `docs/sources.md` (rubrique, type Officiel / Tutoriel / Forum ; *(résumé)* si non ouverte). Une demande de l'utilisateur y est notée avec sa phrase.
5. Dans la réponse : ce qui est vérifié, ce qui diverge, ce qui ne l'est pas.

## Publication

- Branche `main`, commits en français avec les lignes d'attribution de la session, puis `git push origin main`.
- Artifact claude.ai identique au dépôt : https://claude.ai/artifact/1U1vcUpg8C4iwbDxUiKYPv (capacité `downloads` déjà déclarée, ne pas la repasser).
- Séquence complète :
  1. `sh docs/process-icons/build/build.sh` (régénère icônes, `preparer-data.json`, page ; valide les XML) ;
  2. `python3 docs/process-icons/build/page.py unwrap docs/pixinsight-workflow.html <scratchpad>/workflow-pixinsight.html` ;
  3. commit + push ;
  4. publier ce fichier avec `url` = l'URL de l'artifact (dans une nouvelle session : action `read` d'abord).

## Utilisateur

PixInsight 1.9.5 sur **PC Windows** ; CDK17 (2 939 mm) + QHY600 (IMX455) ; filtres Antlia V Pro LRGB et Antlia 3 nm (Ha, OIII, SII) ; RC Astro (BXT, NXT, SXT) ; module GHS. Une centaine de galaxies, **masters déjà empilés**. Il n'utilise que **`Conteneurs-LRGB` et `Conteneurs-LHaRGB`** (le narrowband existe mais sert peu). Préférences fixes :
- jamais d'espace dans les noms de fichiers ou de vues ; export nommé d'après le dossier des masters (`NGC1532.tiff`) ;
- L étirée à la main par les 3 GHS, jamais par Statistical Stretch (RGB seulement) ;
- pas de DynamicCrop ; sorties de contrôle désactivées (GradientCorrection sans modèle, SPCC sans graphes) ;
- vues narrowband nommées H, O, S ; pas de vues intermédiaires (les icônes modifient $T) ;
- images inutiles fermées au fur et à mesure par les icônes.

## Fichiers

- `docs/pixinsight-workflow.html` : la fiche (workflows, mode rapide et Turbo, préparateur « Préparer ma photo », techniques, standards de couleur, fiches outils avec encadré « À régler »). Les données du préparateur sont réécrites par `build.sh`.
- `docs/process-icons/` : `make_workflows.py` (listes d'étapes par workflow, conteneurs rapides et Turbo ; écrit `scripts/Turbo_1.js` et `scripts/Turbo_2_debut.js`, fichiers GÉNÉRÉS), `layout.py` (phase, rôle core / opt / alternative, `CONTAINERS`, textes `WHEN`), `short_desc.py` (descriptions LANCEMENT / PRÉRÉGLÉ / À RÉGLER / SI ; variantes par workflow dans `V`), `make_icons.py` (instances). Sortie : `workflows/Conteneurs-X.xpsm` seulement.
- `docs/depots-pixinsight.txt` : les dépôts PixInsight à ajouter, une URL par ligne (demande de l'utilisateur).
- `docs/process-icons/scripts/` : scripts de la fiche, installés par l'utilisateur dans `src/scripts/clodoweg/` (icônes en `$PXI_SRCDIR/scripts/clodoweg/…`) : Renommer_auto, LPS_UnClic, Combiner_RGB (paramètre `garder`), GC_Solver_auto (icônes Solver_auto et GC_Solver_auto_rapide), ImageSolver_Date, Masque_auto, Etoiles_auto, Fond_auto, Fond_desature, Nettoyage_sans_etoiles, Etoiles_grosses, Export_TIFF (paramètre `fermer`), Binning_x2, Fermer_vues, Turbo_1, Turbo_2_debut. Etoiles_LRGB.js n'est plus utilisé.
- Disposition : colonnes P1 Préparation … P7 Étoiles ; dans chaque colonne les groupes `P#_Nom` (chemin principal, `E##_`), `P#_options` (`Opt_`), `P#_rapide` (`R_`) et, en LRGB, `P#_turbo` (`T_`).

## Workflows actuels (LRGB et LHaRGB)

Étoiles gardées jusqu'à LRGB, SXT ensuite (demande de l'utilisateur) :
- **P1** : E00 LinearPatternSubtraction, E01 Renommer_auto, E02 Combinaison_RGB (LRGB : R, G, B fermées ; LHaRGB : G, B fermées, R gardée), E03 Solver_auto (ImageSolver sur toutes les images ; Apply Global).
- **P2** : ImageSolver, SPFC, MGC + MARS (options GradientCorrection, DBE).
- **P3 LRGB** : C_RGB_lineaire (BXT Correct Only, SPCC, BXT, NXT), C_L_lineaire (BXT, NXT). **P3 LHaRGB** : C_RGB_couleur, BXT_L_H, **E12 Continuum_auto** (script SetiAstro, crée **HaNB** ; Continuum_H supprimé), H_dans_RGB (R + w·HaNB), option H_dans_L, C_RGB_bruit (NXT_RGB puis ferme H, R, HaNB), NXT_L.
- **P4** : GHS_1 (à la main), GHS_2, GHS_3_fond sur L ; Statistical Stretch puis GHS_3_fond sur RGB ; tout avec étoiles.
- **P5** : LRGB_ajout_L (avec étoiles), **SXT_LRGB** (Unscreen coché) ; option Etoiles_auto_etire.
- **P6** (finition en parties) : HDRMT_40, C_Finition (Masque_L, Courbes, LHE, LHE_fin, Masque_retirer), NXT_final ; options Nettoyage_sans_etoiles, HDRMT_30/50/eclat, Boost_finition(_light), NXT doux/fort.
- **P7** : Etoiles_screen, C_Fond_final (Fond_auto 0,12, Fond_desature, ferme RGB_stars) ; options MT_etoiles, Halo_B_Gon, Etoiles_grosses (réduit seulement les grosses étoiles, script), Etoiles_plafond (cœurs sous 1), Etoiles_reduites, Boost_final(_doux), Fond_auto_clair, ICC_sRGB, Export_TIFF (puis ferme L).
- **Rapide** : R_C_Preparation_rapide (P1, Apply Global), R_GC_Solver_auto_rapide (GradientCorrection sur toutes les images), R_C_RGB_rapide (LRGB) / R_C_RGB_fin_rapide (LHaRGB), R_C_L_rapide, GHS_1 à la main puis R_C_Fin_GHS_rapide, R_C_LRGB_rapide (LRGB_ajout_L, SXT, Etoiles_auto_etire), R_C_Fin_rapide, R_C_Etoiles_fond_rapide (avec Export_TIFF). Pas de GradientCorrection dans les conteneurs rapides.
- **Turbo (LRGB)** : T_Turbo_1 (conteneur : préparation, Solver_auto, script Turbo_1 = GradientCorrection, traitement RGB, R_C_L_rapide ; s'arrête avant GHS_1), GHS_1 à la main, T_Turbo_2 (Turbo_2_debut = R_C_Fin_GHS_rapide sur L, puis C_LRGB_rapide, C_Fin_rapide, C_Etoiles_fond_rapide).
- **Icônes à tester** (options, demande du 5 octobre 2026) : Binning_x2 (P1, après Solver_auto), GraXpert (P2), H_dans_RGB_v2 et CombineHaWithRGB (P3 LHaRGB), MAS et VeraLux_HMS (P4), DarkStructureEnhance (P6), MKStarReduction (P7), Agrandir_x2 (P7, avant ICC_sRGB et Export_TIFF). Versions de MAS et GraXpert non vérifiées ; VeraLux_HMS et MKStarReduction sont des icônes-notes.

## Contraintes PixInsight apprises

- Un script ne peut pas lancer une instance Script (« Attempt to execute a Script instance recursively ») ; un ProcessContainer peut enchaîner des scripts, chacun avec son moteur. `ProcessInstance.fromIcon(id)` exécute une icône de process natifs.
- `#engine v8` (exigé par ImageSolver) casse l'ancien code : `PixelMath.prototype.RGB` (« signed integer value expected »), LinearPatternSubtraction.jsh (« Boolean value expected »).
- ImageSolver échoue sur l'image glissée dans un conteneur : conteneurs avec Solver_auto en Apply Global.
- Scripts inclus : gardes `#ifndef CLODOWEG_TURBO` autour de `#feature-*` et de l'appel principal ; noms de fonctions et de macros uniques.
- Jamais de guillemets dans un paramètre de Script. Modules RC Astro et GHS : à réinstaller par Process › Modules › Install Modules s'ils disparaissent.

## Pistes non commencées

Voir `docs/idees-acceleration.md` (inventaire automatique des cibles, traitement en série). Points ouverts : section « Non vérifié » de `docs/sources.md`.
