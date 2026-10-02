# Instructions pour Claude

Ce dépôt contient une fiche de référence PixInsight (`docs/pixinsight-workflow.html`) et la liste de ses sources (`docs/sources.md`). Réponds en français.

## Valider avec des sources avant d'insérer

Avant d'ajouter ou de modifier un contenu technique dans la fiche (réglage, valeur, ordre des étapes, formule, URL de dépôt) :

1. Cherche des sources et lis-les. Priorité : documentation officielle de l'éditeur ou de l'auteur de l'outil, puis tutoriels écrits reconnus, puis forums.
2. Recoupe avec au moins deux sources quand c'est possible. Si les sources divergent, dis-le dans la fiche et indique la position de l'éditeur.
3. N'insère une valeur non vérifiée qu'en le signalant clairement (« valeur de départ issue de la pratique ») et ajoute-la à la section « Non vérifié » de `docs/sources.md`.
4. Ajoute chaque source utilisée dans `docs/sources.md`, dans la bonne rubrique, avec son type (Officiel, Tutoriel, Forum). Marque *(résumé)* une page que tu n'as pas pu ouvrir toi-même.
5. Dans ta réponse, résume ce qui a été vérifié, ce qui diverge et ce qui ne l'est pas, avec les liens.

## Publication

- Travaille sur la branche `main`.
- Si la fiche existe aussi comme artifact claude.ai, garde les deux versions identiques.

## État du projet (mémoire pour reprendre dans une autre session)

Utilisateur : astrophotographe, PixInsight 1.9.5 sur macOS (Apple Silicon), CDK17 (2 939 mm) + QHY600 (IMX455, 3,76 µm, 0,264″/px en bin 1), filtres Antlia V Pro LRGB et Antlia 3 nm (Ha, OIII, SII), licences RC Astro (BXT AI4, NXT AI3, SXT AI11). Une centaine de photos à retraiter ; **masters déjà empilés, un par filtre et par cible**. Il préfère le **mode conteneurs** et des textes **courts et simples**.

### Fichiers
- `docs/pixinsight-workflow.html` : la fiche (workflows LRGB, LHaRGB, RGB + SHO, SHO sans RGB, HOO ; techniques GHS, Foraxx, continuum, réduction d'étoiles, **Masques** ; standards de couleur et d'étoiles ; 37 fiches outils). Chaque fiche outil commence par un encadré **« À régler »** (valeurs des icônes + « si… → … »), le détail est replié. En haut : section **« Préparer ma photo »** (préparateur : filtres → méthodes → options → conteneurs ; télécharge un `.xpsm`, ou un `.zip` dans l'artifact car `.xpsm` n'est pas autorisé par la capacité `downloads`).
- `docs/sources.md` : toutes les sources (règle ci-dessus) ; `docs/depots-pixinsight.txt` : dépôts.
- `docs/process-icons/` : `01`–`04` icônes unitaires (04 = matériel QHY600/Antlia) ; `workflows/Workflow-X` (chemin principal), `Options-X`, **`Conteneurs-X` = fichier unique conseillé** (chemin principal avec ProcessContainer + options rangées sous leur phase `P#_options`). Colonnes par phase P1 Préparation … P7 Étoiles ; noms `E01_…`, `Opt_…`, `C_…`.
- Générateurs : `make_icons.py` (01–03), `make_workflows.py` (workflows, 04, preparer-data.json), `layout.py` (phase et rôle de chaque étape : core / opt / alternatives grad:mgc|gc|dbe, str:ghs|stat, pal:nbn|foraxx|hubble ; conteneurs `CONTAINERS`), `short_desc.py` (descriptions courtes : LANCEMENT / PRÉRÉGLÉ / À RÉGLER / SI, paragraphes séparés par une ligne vide).
- **Tout régénérer : `sh docs/process-icons/build/build.sh`** (reproduit exactement les fichiers commités ; valide les XML).

### Conventions
- Masque automatique partout : icône Masque_L = script Masque_auto.js (crée masque_L, flou 2 px, l'attache ; window.mask) et Masque_retirer (detach + fermeture) ; C_Finition = Masque_L → Courbes → LHE → LHE_fin → Masque_retirer ; Boost avec masque intégré. Rapide : C_Fin_rapide (LRGB → masque → Courbes → LHE → LHE_fin → retrait → Etoiles_screen), option C_Fin_sans_etoiles. Rapide-LRGB 9 icônes, Rapide-LHaRGB 14. Non testé dans PixInsight (masque attaché pendant un conteneur).
- Pas de vues intermédiaires (demande de l'utilisateur) : Etoiles_screen et Etoiles_reduites modifient l'image sans étoiles directement ($T), plus de Final / Final_reduit ; H_dans_L sur L directement (plus de L_H). Etoiles_reduites = screen + Blanshan Transfer V2 en une formule (W = ~((~$T)*(~ÉTOILES)), Img1 = $T), choix « et » du préparateur : screen par défaut en LRGB/LHaRGB, reduit par défaut en narrowband. Script Fermer_vues.js (clodoweg, paramètre views) ferme HDR_avant (HDRMT_50) et L_stars (C_L_lineaire, C_L_etoiles_bruit, C_L_rapide, icône Fermer_L_stars).
- Options de finition : Boost_finition_light (courbe 0,24/0,76, S 0,57, LHE 80 px 0,12) et Boost_finition (0,23/0,77, S 0,60, LHE 0,20) ; à 1:1 sur NGC 1532 le Boost normal donnait bras cyan et aspect peint.
- Option HDRMT_50 (remplace Opt_HDRMT) : ProcessContainer [PixelMath copie $T -> HDR_avant, HDRMT, PixelMath a*$T + (1-a)*HDR_avant, a = 0,5] ; fermer HDR_avant après.
- LinearPatternSubtraction (LPS_UnClic) = étape E00 de tous les workflows (chemin principal, plus en option) ; numérotation décalée pour que la suite garde ses numéros (make_workflows.write/layout_all et prep_build.py).
- Pas de DynamicCrop dans aucune icône ni workflow (choix de l'utilisateur, 1er octobre 2026).
- Sorties de contrôle désactivées (choix de l'utilisateur) : GradientCorrection generateGradientModel=false, SPCC generateGraphs=false (MGC Show gradient model reste coché).
- Mode rapide (galaxies) : workflows/Rapide-LRGB.xpsm (6 icônes) et Rapide-LHaRGB.xpsm (11) ; E00 = C_Preparation_rapide (Renommer_auto, LPS, Combinaison_RGB en un conteneur, demande de l'utilisateur ; étapes seules en options ; layout_all numérote E00 pour LPS ou C_Preparation_rapide) ; LPS_UnClic ignore les images couleur ; C_Fin_rapide = LRGB → HDRMT a 0,4 → Masque_L → Courbes sat 0,68 → LHE 150 → LHE_fin 40 → Masque_retirer → Etoiles_screen → script Fond_auto.js (réordonné après analyse : HDRMT avant le contraste, 2 LHE, 1 courbe, 1 masque ; ancienne version à 13 étapes = option C_Fin_rapide_ancien, fin_ancien()) (fond mesuré, grille 8×8, amené à 0,12 par mtf canal par canal ; demande de l'utilisateur), choix de l'utilisateur après essais sur NGC 1532 ; ancienne finition = option C_Fin_simple ; option HDRMT_eclat partout (hdrmt_eclat() : HDRMT a = 0,4 (0,7 au départ ; 0,4 demandé par l'utilisateur) puis Boost_finition_light, demande de l'utilisateur ; hdrmt_items(a) partagé avec HDRMT_50); options étoiles (Halo_B_Gon, MT_etoiles, Etoiles_screen, Etoiles_reduites) en colonne P6, sous C_Fin_sans_etoiles et les options de finition (demande de l'utilisateur), write_rapide dans make_workflows.py. Gradient = GradientCorrection seule, dans les conteneurs (pas de SPFC ni MGC/MARS : mode soigné seulement, choix de l'utilisateur). ImageSolver en icône seule sur RGB (pour SPCC). Conteneurs C_RGB_rapide (GC, BXT CO, SPCC, BXT, SXT, NXT, Statistical Stretch openDialogbox=false, GHS_fond SP=HP=0,22, script Etoiles_auto.js sur RGB_stars), C_L_rapide (GC, BXT, SXT, NXT, Fermer L_stars, Statistical Stretch sans dialogue, GHS_auto_fond = GHS_auto.js mode fond, fond mesuré amené à 0,11). L en Statistical Stretch par défaut (confirmé par l'utilisateur après essai du GHS_auto adouci, rendu proche) : choix de l'utilisateur après comparaison sur une galaxie (GHS auto SP = fond, b = 10 : fond laiteux, cœur écrasé). Star_Stretch = option (décocher Etoiles_auto avant). Options de comparaison pour L (demande de l'utilisateur) : C_L_rapide_ghs (GHS_auto.js mode premier : SP = médiane × 0,5, b = 6, HP 0,85, puis GHS_auto_fond ; sans GHS_2), C_L_rapide_lineaire (sans étirement) + GHS_1/2/3 à la main ; l_rapide(bxt, mode) et l_opts() ; LHaRGB : GC sur R, C_RGB_couleur_rapide, C_H_rapide (GC, BXT), Continuum_H, H_dans_RGB, C_RGB_fin_rapide. Section #rapide de la page.
- Renommer_auto.js (clodoweg) : première icône de tous les workflows. Réduction d'étoiles (Etoiles_reduites) en option en LRGB/LHaRGB (choix de l'utilisateur), par défaut en narrowband. LHaRGB : Combinaison_RGB avec closeSources=false (R sert à Continuum_H).
- Disposition des icônes : largeur de colonne = 90 + 4,4 × (nom le plus long), au lieu de 260 fixe (make_workflows.col_width, et même calcul dans build/prep_build.py).
- Finition : deux LHE dans le chemin principal (LHE 150 px / 0,30 / 12-bit puis LHE_fin 40 px / 0,25 / 10-bit ; Boost LHE_moyen 80 px 10-bit), C_Finition = Courbes → LHE → LHE_fin. Option Boost_finition (ProcessContainer : Courbes_boost puis LHE 80 px / 0,20), rejouable.
- Couleur : Courbes 0,25 → 0,19 / 0,75 → 0,81, saturation 0,5 → 0,65 ; Star_Stretch Color Boost 1,3 ; LRGB_ajout_L Saturation 0,35 ; pas de SCNR par défaut sur les étoiles RGB (contrôle à la sonde, Remove Green si étoile verte).
- Star_Stretch : Stretch Amount 6 dans toutes les icônes (choix de l'utilisateur ; défaut du script 5). Blanshan_Transfer S = 0,20. BXT Sharpen Stars reste 0,25.
- Recombinaison des étoiles : Etoiles_screen = ~((~$T) * (~ÉTOILES)), à glisser sur l'image sans étoiles finale ; ÉTOILES = RGB_stars (LRGB, LHaRGB, RGB+SHO), NBtoRGB_stars (SHO sans RGB), HOO_stars (HOO). Blanshan_Transfer glissé sur l'image sans étoiles, lit 'Final', crée 'Final_reduit'. Plus de vues à renommer starless / stars dans les workflows.
- Étirement LRGB / LHaRGB : par défaut Statistical Stretch sur le RGB (couleur seule) et GHS_1 + GHS_2 sur L (détail), puis GHS_3_fond sur les deux avant LRGB. Choix « mix » du préparateur (layout.LUM, WF_DEFAULT ; 'def' dans les données du préparateur ; JS dans build/prep_build.py, pas dans la page). GHS sur tout et Statistical Stretch sur tout restent proposés. Les autres workflows : GHS par défaut.
- Étirement : GHS uniquement sur l'image sans étoiles (étoiles : Star Stretch). GHS_3_fond est dans le chemin principal (rôle core) et suit GHS comme Statistical Stretch (Target Median 0,25 → fond ramené à 0,12–0,14). Valeurs de départ GHS par étape : tableau #ghs-valeurs de la page. Préréglages des icônes : GHS_2 SF 1, SP 0,35, HP 0,9 ; GHS_3 SF 1, SP = HP = 0,20 ; GHS_1 SF 0. Calculs faits pour un pic à 0,25 après GHS_1 (choix de l'utilisateur) : fond 0,25 → 0,23 → 0,13.
- Gradient : garder les deux voies dans chaque workflow. L'utilisateur essaie d'abord MGC + MARS (chemin principal : ImageSolver → SPFC → MGC) et, si MGC échoue (cible hors couverture MARS, sud au-delà de −15° environ), passe à GradientCorrection (ou DBE) rangé dans les options de la phase Gradient. ImageSolver reste dans le chemin principal dans les deux cas (nécessaire à SPCC).
- Vues narrowband nommées **H, O, S** partout (formules, icônes, texte) ; exceptions : valeurs de filtre MARS `Ha`/`OIII` dans MGC, libellés d'interface (Lightness = Ha, O3/S2 boost, Ha Stars…), raies physiques Hα/Hβ, noms HII, HaRGB, LHaRGB.
- Scripts écrits pour la fiche : `docs/process-icons/scripts/` (`LPS_UnClic.js`, `ImageSolver_Date.js`, `Combiner_RGB.js`, `Renommer_auto.js`, `Fermer_vues.js`), installés par l'utilisateur dans `src/scripts/clodoweg/` de PixInsight (icônes en `$PXI_SRCDIR/scripts/clodoweg/…`, Mac et PC). ImageSolver = UNE icône Script ImageSolver_Date.js (date si absente, puis moteur d'ImageSolver inclus en bibliothèque comme WBPP : #define USE_SOLVER_LIBRARY, #include "../ImageSolver/ImageSolver.js" ; les 46 réglages d'ImageSolver sont des paramètres de l'icône ; le script doit commencer par #engine v8, sinon « class is a reserved identifier »). new Script depuis un script : propriétés en lecture seule, impossible. Jamais de guillemets dans un paramètre de Script (PixInsight les passe par run -p="nom,valeur") ; option de secours ImageSolver_seul. Jamais ImageSolver dans un ProcessContainer.
- Icônes de scripts = vraies instances Script (chemin `$PXI_SRCDIR/scripts/...`, MD5 de l'archive SetiAstro 19/09/2026 ; MD5 vide pour les scripts livrés avec PixInsight).
- ProcessContainer : format recopié des icônes de theAstroShed (instances imbriquées sans id, `enabled="true"`, pas de description). **Non testé dans PixInsight** par l'utilisateur à ce jour.
- Commits sur `main`, en français, avec les lignes d'attribution demandées par la session.

### Artifact claude.ai
- URL : https://claude.ai/artifact/1U1vcUpg8C4iwbDxUiKYPv (capacité `downloads` déclarée). Le garder identique au dépôt.
- Pour le mettre à jour depuis une nouvelle session : `python3 docs/process-icons/build/page.py unwrap docs/pixinsight-workflow.html <scratchpad>/workflow-pixinsight.html`, lire l'artifact (action `read`), puis publier ce fichier avec `url` = l'URL ci-dessus (ne pas repasser `capabilities`).

### En cours / prochaines étapes proposées (non commencées)

**Idées pour réduire encore le nombre d'icônes : voir `docs/idees-acceleration.md`** (A fait : WBPP et CosmeticCorrection passés en options dans `layout.py` ; ordre conseillé ensuite : B + D + renommage automatique, puis narrowband sans séparation des canaux, puis script « Traiter ma cible »).

1. **Masters déjà empilés** : mode sans WBPP/CosmeticCorrection ; vérifier si les masters d'une cible sont alignés entre eux (sinon ajouter StarAlignment, référence L ou H).
2. **Inventaire automatique** des ~100 cibles (script Python lisant les en-têtes XISF/FITS : cible, filtres, temps de pose → workflow, alertes, `.xpsm` par cible). En attente de l'utilisateur : exemple de nom de fichier, empilement en une seule passe WBPP ou non, en-tête d'un master.
3. **Deux vitesses** (rapide : conteneurs + Statistical Stretch + palette par défaut ; complet pour les meilleures).
4. **Traitement de nuit en série** avec ImageContainer, après test des conteneurs.
5. **Tableau de suivi** des 100 photos (page avec base de données).
6. Vérifier AutoIntegrate (mode lot, compatibilité 1.9.5) comme premier jet.
Points ouverts : voir la section « Non vérifié » de `docs/sources.md`.
