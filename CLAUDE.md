# Instructions pour Claude

Ce dépôt contient les icônes de process PixInsight de l'utilisateur, leur générateur, ma base de connaissances (`docs/kb/`) et la liste des sources (`docs/sources.md`). Réponds en français, en textes courts et simples.

## Base de connaissances (à lire en premier)

`docs/kb/` est ma référence (l'utilisateur ne la lit pas) : avant de répondre à une question ou de modifier une icône, lis `docs/kb/README.md` puis le fichier concerné (`icones-LRGB.md` / `icones-LHaRGB.md` générés, `workflows.md`, `outils.md`, `techniques.md`, `preparation.md`, `narrowband.md`, `generateur.md`). Après chaque changement, mets à jour le fichier thématique concerné ; `icones-*.md` se régénèrent par `build.sh`.

## Valider avec des sources avant d'insérer

Avant d'ajouter ou de modifier un contenu technique (réglage, valeur, ordre des étapes, formule, URL) :

1. Cherche des sources et lis-les : documentation officielle d'abord, puis tutoriels reconnus, puis forums.
2. Recoupe avec deux sources quand c'est possible ; si elles divergent, dis-le et donne la position de l'éditeur.
3. Une valeur non vérifiée est signalée comme telle dans `docs/kb/` et ajoutée à « Non vérifié » dans `docs/sources.md`.
4. Chaque source utilisée va dans `docs/sources.md` (rubrique, type Officiel / Tutoriel / Forum ; *(résumé)* si non ouverte). Une demande de l'utilisateur y est notée avec sa phrase.
5. Dans la réponse : ce qui est vérifié, ce qui diverge, ce qui ne l'est pas.

## Descriptions des icônes

À chaque changement d'une icône (réglage, place, ordre, script, nouvelle icône), mets TOUJOURS à jour sa description, et celles des icônes et conteneurs qui la citent : `short_desc.py` (S et V : PRÉRÉGLÉ, À RÉGLER, SI), `layout.py` (`WHEN` pour une option) et les textes D_/T_ de `make_workflows.py`. Textes courts, une idée par ligne, lisibles sans autre document.

## Publication

- Branche `main`, commits en français avec les lignes d'attribution de la session, puis `git push origin main`.
- Séquence : `sh docs/process-icons/build/build.sh` (régénère les xpsm, `scripts/Turbo_*.js` et `docs/kb/icones-*.md` ; valide les XML), mise à jour de `docs/kb/` et `docs/sources.md`, commit, push.
- Plus de page HTML ni d'artifact (supprimés le 5 octobre 2026, à la demande de l'utilisateur ; l'ancienne fiche reste dans l'historique git).

## Utilisateur

PixInsight 1.9.5 sur **PC Windows** ; CDK17 (2 939 mm) + QHY600 (IMX455) ; filtres Antlia V Pro LRGB et Antlia 3 nm (Ha, OIII, SII) ; RC Astro (BXT, NXT, SXT) ; module GHS. Une centaine de galaxies, **masters déjà empilés** ; aussi **beaucoup de SHO et de RGB + SHO** (nébuleuses). Travail fait d'abord sur les galaxies (`Conteneurs-LRGB`, `Conteneurs-LHaRGB`) ; prochaine étape annoncée : beaucoup de demandes sur `Conteneurs-SHO-sans-RGB` et `Conteneurs-RGB-SHO` (HOO existe aussi). Préférences fixes :
- jamais d'espace dans les noms de fichiers ou de vues ; export nommé d'après le dossier des masters (`NGC1532.tiff`) ;
- L étirée à la main par les 3 GHS, jamais par Statistical Stretch (RGB seulement) ;
- pas de DynamicCrop ; sorties de contrôle désactivées (GradientCorrection sans modèle, SPCC sans graphes) ;
- vues narrowband nommées H, O, S ; pas de vues intermédiaires (les icônes modifient $T) ;
- images inutiles fermées au fur et à mesure par les icônes.

## Fichiers

- `docs/kb/` : base de connaissances (voir plus haut).
- `docs/process-icons/` : `make_workflows.py` (listes d'étapes par workflow, conteneurs rapides), `layout.py` (phase, rôle core / opt / alternative, `CONTAINERS`, textes `WHEN`), `short_desc.py` (descriptions LANCEMENT / PRÉRÉGLÉ / À RÉGLER / SI ; variantes par workflow dans `V`), `make_icons.py` (instances). Sortie : `workflows/Conteneurs-X.xpsm` seulement.
- `docs/depots-pixinsight.txt` : les dépôts PixInsight à ajouter, une URL par ligne (demande de l'utilisateur).
- `docs/process-icons/scripts/` : scripts de l'utilisateur, installés par l'utilisateur dans `src/scripts/clodoweg/` (icônes en `$PXI_SRCDIR/scripts/clodoweg/…`) : Renommer_auto, LPS_UnClic, Combiner_RGB (paramètre `garder`), GC_Solver_auto (icône Solver_auto), Gradient_auto (icône R_Gradient_auto_rapide : GradientCorrection seule), Lineaire_auto (icône R_Lineaire_rapide : lance des icônes du chemin principal sur des vues), ImageSolver_Date, Masque_auto, Etoiles_auto, Fond_auto, Fond_desature, Nettoyage_sans_etoiles, Etoiles_grosses, Export_TIFF (paramètre `fermer`), Binning_x2, Fermer_vues. Etoiles_LRGB.js n'est plus utilisé.
- Disposition : colonnes P1 Préparation … P7 Étoiles ; dans chaque colonne les groupes `P#_Nom` (chemin principal, `E##_`), `P#_options` (`Opt_`), `P#_rapide` (`R_`).

## Workflows actuels (LRGB et LHaRGB)

Process galaxies (demande de l'utilisateur, 5 octobre 2026) : L sans étoiles, RGB étiré avec étoiles par MAS, étoiles du RGB remises à la fin.
- **P1** : E00 LinearPatternSubtraction, E01 Renommer_auto, E02 Combinaison_RGB (LHaRGB : R gardée), E03 Solver_auto ; option Binning_x2.
- **P2** : ImageSolver, SPFC, MGC + MARS (options GradientCorrection, DBE, GraXpert).
- **P3 LRGB** : C_RGB_lineaire (BXT Correct Only, SPCC, BXT, NXT), C_L_lineaire (BXT, NXT, SXT_L_lineaire sans image d'étoiles). **P3 LHaRGB** : C_RGB_couleur, BXT_L_H, Continuum_auto (HaNB), H_dans_RGB, C_RGB_bruit (NXT, ferme H, R, HaNB), NXT_L, SXT_L_lineaire.
- **P4** : GHS_1 (à la main), GHS_2 sur L sans étoiles ; MAS (réglages de l'utilisateur, fond 0,15) puis SXT_RGB_etire (Unscreen, crée RGB_stars) sur RGB ; GHS_3_fond sur L et sur le RGB sans étoiles. Options : Statistical_Stretch (à la place de MAS), VeraLux_HMS.
- **P5** : LRGB_ajout_L sur les deux images sans étoiles, Saturation 0,5 ; option Etoiles_auto_etire.
- **P6** : HDRMT_30 (par défaut ; HDRMT_40 en option), C_Finition, NXT_final (+ options).
- **P7** : Etoiles_screen, Fond_desature (seul, à la place de l'ancien C_Fond_final) ; options SCNR_vert, Fond_auto, Fond_auto_clair, Etoiles_grosses, Etoiles_plafond, Etoiles_reduites, Boost_final, Agrandir_x2, ICC_sRGB, Export_TIFF (ferme L et RGB_stars).
- **Rapide** : R_C_Preparation_rapide, R_Gradient_auto_rapide, R_Lineaire_rapide (script Lineaire_auto), GHS_1 puis R_C_Fin_GHS_rapide sur L, R_C_RGB_etire_rapide (MAS, SXT, GHS fond), R_C_LRGB_rapide (LRGB seul), R_C_Fin_rapide, R_C_Etoiles_fond_rapide (Etoiles_screen, Fond_desature, Export_TIFF).

## Contraintes PixInsight apprises

- Un script ne peut pas lancer une instance Script (« Attempt to execute a Script instance recursively ») ; un ProcessContainer peut enchaîner des scripts, chacun avec son moteur. `ProcessInstance.fromIcon(id)` exécute une icône de process natifs.
- `#engine v8` (exigé par ImageSolver) casse l'ancien code : `PixelMath.prototype.RGB` (« signed integer value expected »), LinearPatternSubtraction.jsh (« Boolean value expected »).
- ImageSolver échoue sur l'image glissée dans un conteneur : conteneurs avec Solver_auto en Apply Global.
- Retours à la ligne des descriptions écrits `&#10;` (fait par `save()`) : un CR (fichier converti en CRLF par git sous Windows) s'affiche mal dans PixInsight, lignes inversées et vides en haut (test de l'utilisateur, 5 octobre 2026 : LF, `&#10;`, `<br>` et U+2028 marchent ; CR et CRLF non). `.gitattributes` force LF pour .xpsm et .js.
- Jamais de guillemets dans un paramètre de Script. Modules RC Astro et GHS : à réinstaller par Process › Modules › Install Modules s'ils disparaissent.

## Pistes non commencées

Voir `docs/idees-acceleration.md` (inventaire automatique des cibles, traitement en série). Points ouverts : section « Non vérifié » de `docs/sources.md`.
