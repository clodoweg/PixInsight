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

## Scripts : toujours une fenêtre de réglages

Chaque script de `docs/process-icons/scripts/` a une fenêtre de réglages (demande de l'utilisateur) et elle est TOUJOURS mise à jour quand le script change (nouveau paramètre = nouveau contrôle, même texte d'aide que la description de l'icône). Convention dans `docs/kb/generateur.md` : fichier commun `clodoweg_ui.jsh` (CWDialog, cwWantsDialog, cwApplyOnCopy) ; icône glissée ou script dans un conteneur (`dialogue = false`, ajouté par le générateur) = exécution directe ; double-clic puis Apply Global = fenêtre ; une image modifiée depuis la fenêtre passe par cwApplyOnCopy (affichage et Ctrl+Z). Un nouveau script suit la même convention.

## Publication

- Branche `main`, commits en français avec les lignes d'attribution de la session, puis `git push origin main`.
- Séquence : `sh docs/process-icons/build/build.sh` (régénère les xpsm et `docs/kb/icones-*.md` ; valide les XML), mise à jour de `docs/kb/` et `docs/sources.md`, commit, push.
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
- `docs/process-icons/scripts/` : scripts de l'utilisateur, installés par l'utilisateur dans `src/scripts/clodoweg/` (icônes en `$PXI_SRCDIR/scripts/clodoweg/…`) : Renommer_auto, LPS_UnClic, Combiner_RGB (paramètre `garder`), GC_Solver_auto (icône Solver_auto), clodoweg_ui.jsh (fenêtres communes, à copier aussi), Gradient_auto (icône R_Gradient_auto_rapide : GradientCorrection seule), Sharp_MMT (accentuation finale MMT, dans C_Sharp_MMT), Lineaire_auto (icône R_Lineaire_rapide : lance des icônes du chemin principal sur des vues), ImageSolver_Date, Masque_auto, Etoiles_auto, Fond_auto, Fond_desature, Nettoyage_sans_etoiles, Etoiles_grosses (narrowband seulement), Saturation_grosses (option P4 : ta courbe c/S sous un masque des grosses étoiles de RGB_stars), Export_TIFF, Binning_x2, Fermer_vues.
- Disposition : colonnes P1 Préparation … P7 Étoiles ; dans chaque colonne les groupes `P#_Nom` (chemin principal, `E##_`), `P#_options` (`Opt_`), `P#_rapide` (`R_`).

## Workflows actuels (LRGB et LHaRGB)

Process galaxies (demande de l'utilisateur, 5 octobre 2026) : L sans étoiles, RGB étiré avec étoiles par MAS, étoiles du RGB remises à la fin.
- **P1** : E00 LinearPatternSubtraction, E01 Renommer_auto, E02 Combinaison_RGB (LHaRGB : R gardée), E03 Solver_auto ; option Binning_x2.
- **P2** : ImageSolver, SPFC, MGC + MARS (options GradientCorrection, DBE).
- **P3 LRGB** : C_RGB_lineaire (BXT Correct Only, SPCC, BXT, NXT), C_L_lineaire (BXT, NXT, SXT_L_lineaire sans image d'étoiles). **P3 LHaRGB** : C_RGB_couleur, BXT_L_H, Continuum_auto (HaNB), H_dans_RGB, C_RGB_bruit (NXT, ferme H, R, HaNB), NXT_L, SXT_L_lineaire.
- **P4** : GHS_1 (à la main), GHS_2 sur L sans étoiles ; MAS (réglages de l'utilisateur, fond 0,15) puis SXT_RGB_etire (Unscreen, crée RGB_stars) sur RGB, SCNR_etoiles_vert (script Etoiles_auto sur RGB_stars seulement : SCNR vert 1,0) ; options P4 (pas dans le rapide) : SCNR_etoiles_violet (Invert / SCNR vert 1,0 / Invert), Saturation_grosses ; GHS_3_fond sur L et sur le RGB sans étoiles. Option : Statistical_Stretch (à la place de MAS).
- **P5** : LRGB_ajout_L sur les deux images sans étoiles, Saturation 0,5.
- **P6** : HDRMT_30 (par défaut ; HDRMT_40 en option), C_Finition (Courbes saturation 0,58 ; option Finition_saturee = ancienne version à 0,65, aussi saturation 0,58 dans R_C_Fin_rapide), C_Sharp_MMT (Masque_L, script Sharp_MMT : MMT couches 2 à 4 biais +0,04, Masque_retirer ; en rapide : Sharp_MMT dans R_C_Fin_rapide, sous le masque), NXT_final ; option Sharp_USM (UnsharpMask sous masque, à la place) (+ autres options).
- **P7** : sur l'image sans étoiles Fond_desature, Fond_auto (0,12), puis Etoiles_screen ; options Fond_auto_clair (à la place de Fond_auto), Etoiles_reduites, Boost_final, Agrandir_x2, ICC_sRGB, Export_TIFF (ne ferme aucune vue).
- **Turbo** : T_Turbo_debut (colonne P1) = R_C_Preparation_rapide + R_Gradient_auto_rapide + R_Lineaire_rapide en un seul conteneur, Apply Global.
- **Rapide** : R_C_Preparation_rapide, R_Gradient_auto_rapide, R_Lineaire_rapide (script Lineaire_auto), GHS_1, GHS_2, GHS_3_fond sur L (chemin principal), R_C_RGB_etire_rapide (MAS, SXT, SCNR_etoiles_vert, GHS fond ; SCNR_etoiles_violet pas dans le rapide), R_C_LRGB_rapide (LRGB seul), R_C_Fin_rapide, R_C_Etoiles_fond_rapide (Fond_desature, Fond_auto, Etoiles_screen, Export_TIFF).

## Contraintes PixInsight apprises

- Un script ne peut pas lancer une instance Script (« Attempt to execute a Script instance recursively ») ; un ProcessContainer peut enchaîner des scripts, chacun avec son moteur. `ProcessInstance.fromIcon(id)` exécute une icône de process natifs.
- `#engine v8` (exigé par ImageSolver) casse l'ancien code : `PixelMath.prototype.RGB` (« signed integer value expected »), LinearPatternSubtraction.jsh (« Boolean value expected »).
- ImageSolver échoue sur l'image glissée dans un conteneur : conteneurs avec Solver_auto en Apply Global.
- Retours à la ligne des descriptions écrits `&#10;` (fait par `save()`) : un CR (fichier converti en CRLF par git sous Windows) s'affiche mal dans PixInsight, lignes inversées et vides en haut (test de l'utilisateur, 5 octobre 2026 : LF, `&#10;`, `<br>` et U+2028 marchent ; CR et CRLF non). `.gitattributes` force LF pour .xpsm et .js.
- Jamais de guillemets dans un paramètre de Script. Modules RC Astro et GHS : à réinstaller par Process › Modules › Install Modules s'ils disparaissent.

## Pistes non commencées

Voir `docs/idees-acceleration.md` (inventaire automatique des cibles, traitement en série). Points ouverts : section « Non vérifié » de `docs/sources.md`.

- Options supprimées des workflows galaxies (demande de l'utilisateur, 5 octobre 2026) : GraXpert, Coeurs_etoiles, RepairedHSV, VeraLux_HMS, Etoiles_auto_etire, MKStarReduction, Etoiles_grosses, Etoiles_couleur (script Etoiles_couleur.js supprimé), puis Etoiles_plafond. Ne pas les remettre sans demande.
