# Icônes de process PixInsight

Icônes prêtes à charger, avec les réglages de la fiche `docs/pixinsight-workflow.html`. Ce sont des **valeurs de départ** : ajuste-les sur tes images.

## Charger les icônes

1. Télécharge le fichier `.xpsm` voulu.
2. Dans PixInsight : clic droit sur l'espace de travail › *Process Icons* › *Load Process Icons* (ou *Merge Process Icons* pour les ajouter à tes icônes existantes), puis choisis le fichier.
3. Double-clique sur une icône pour ouvrir le process avec ses réglages, ou glisse-la sur une image pour l'appliquer directement.

Les fichiers n'ont pas été testés dans PixInsight avant publication : ils ont été construits à partir d'icônes réelles générées par PixInsight 1.9.3 (voir Sources), en ne changeant que les valeurs. Si une icône ne se charge pas, signale-le.

**PixInsight 1.9.5** : les icônes n'ont pas non plus été testées dans cette version. Elles n'utilisent ni AutomaticBackgroundExtractor ni SubframeSelector, les deux process dont les instances antérieures à la 1.9.4 doivent être recréées. Les icônes-notes (scripts) ne dépendent pas de la version.

## Workflows (dossier `workflows/`)

**Le plus simple : le préparateur de la page** (section « Préparer ma photo » de `docs/pixinsight-workflow.html`). Tu choisis tes filtres, tes méthodes (gradient, étirement, palette) et tes options ; il affiche les étapes de ta photo avec ce qu'il faut régler et télécharge un `.xpsm` qui ne contient qu'elles (dans la page publiée sur claude.ai, un `.zip` à décompresser). Ses données sont dans `preparer-data.json`, régénéré avec les icônes.

**Mode rapide (galaxies LRGB et LHaRGB)** : en bas de `Conteneurs-LRGB.xpsm` et `Conteneurs-LHaRGB.xpsm`, sous `R_MODE_RAPIDE`, icônes préfixées `R_` (6 icônes en LRGB, 11 en LHaRGB, plus les options) ; SXT toujours avant l'étirement : `C_L_rapide` (GradientCorrection, BXT, SXT, NXT : s'arrête avant l'étirement), puis GHS_1_premier, GHS_2_contraste, GHS_3_fond à la main, puis `Etoiles_LRGB` (facultatif) ; presque tout préréglé, gradient par GradientCorrection seulement (MGC + MARS réservé au mode normal) : `E00_C_Preparation_rapide` (masters seuls ouverts, Apply Global : Renommer_auto → LinearPatternSubtraction sur les masters mono → Combinaison_RGB), icône `ImageSolver` sur RGB (seule : ImageSolver échoue dans un conteneur ; nécessaire à SPCC), `C_RGB_rapide` (GradientCorrection → BXT Correct Only → SPCC → BXT → SXT → NXT → Statistical Stretch 0,25 sans dialogue → GHS fond SP = HP = 0,22 → Etoiles_auto, courbe de Star Stretch, SCNR), `C_L_rapide` (GradientCorrection → BXT → SXT → NXT), les 3 GHS à la main, `Etoiles_LRGB`, puis `C_Fin_rapide` (LRGB → HDRMT à 40 % → masque attaché → Courbes, saturation 0,68 → LHE rayon 150 → LHE_fin rayon 40 → masque retiré → NXT_final (Denoise 0,40) → Etoiles_screen → Fond_auto → Fond_desature ; Boost_final en option). L'icône `E01_Mode_rapide` donne l'ordre. Options : LinearPatternSubtraction, Renommer_auto, Combinaison_RGB (étapes de la préparation seules), Find_Background, en LHaRGB Continuum_auto et H_dans_L (reprises des conteneurs), ImageSolver_seul, GHS_1_premier / GHS_2_contraste / GHS_3_fond (les 3 GHS des conteneurs, à la main), Star_Stretch (étoiles à l'œil : décoche d'abord Etoiles_auto dans le conteneur RGB), C_Fin_simple (finition sans HDRMT, avec étoiles), C_Fin_sans_etoiles (pour insérer un Boost, HDRMT_50, HDRMT_eclat ou NXT final avant les étoiles), Boost_finition_light, Boost_finition, HDRMT_50, NXT final, Halo-B-Gon, MT, Etoiles_screen, Etoiles_reduites. Détails : section « Mode rapide » de la page.

Mode normal : **`Conteneurs-X.xpsm`, un fichier par workflow** (les anciens `Workflow-X`, `Options-X` et les icônes unitaires `01`–`04` ont été retirés à la demande de l'utilisateur, qui n'utilise que les conteneurs et le mode rapide ; ils restent dans l'historique git) : le chemin principal complet ET toutes les options, rangées dans la colonne de leur phase sous une icône-titre `P#_options` (`Opt_HDRMT_50` en Finition, `Opt_DBE` en Gradient…). Dans le chemin principal, chaque suite d'étapes sans réglage intermédiaire, appliquée à la même image, est remplacée par une icône *ProcessContainer* (un clic au lieu de trois à cinq) : LRGB 17 icônes au lieu de 24, LHaRGB 23 au lieu de 28, RGB-SHO 26 au lieu de 34, SHO sans RGB 24 au lieu de 31, HOO 24 au lieu de 28. Chaque étape garde les réglages de son icône. Le préparateur fait la même chose avec la case « Regrouper en conteneurs ».

| Conteneur | Image cible | Étapes |
|---|---|---|
| `C_RGB_lineaire` (LRGB) | RGB combiné, linéaire, gradient retiré | BXT Correct Only → SPCC → BXT → SXT → NXT |
| `C_L_lineaire` (LRGB) | master L | BXT → NXT (étoiles gardées jusqu'après l'étirement) |
| `C_L_etoiles` (LRGB, LHaRGB) | L étirée, après Star_Stretch sur RGB_stars | SXT_L_etire (Unscreen) → Etoiles_LRGB_etire (luminance de L_stars ajoutée à RGB_stars, L_stars fermée) |
| `C_RGB_couleur` (LHaRGB) | RGB combiné | BXT Correct Only → SPCC → BXT |
| `C_RGB_etoiles_bruit` (LHaRGB) | RGB après injection de H | SXT → NXT |
| `C_SHO_lineaire`, `C_HOO_lineaire` | combinaison narrowband linéaire | BXT → SXT |
| `C_Extraction_SHO`, `C_Extraction_HOO`, `C_Extraction_etoiles` | image sans étoiles (ou d'étoiles) | extraction des canaux |
| `C_Etoiles_RGB` (RGB + SHO) | RGB combiné | BXT Correct Only → SPCC → BXT → SXT |
| `C_Finition` | image sans étoiles étirée | Masque_L (créé et attaché) → Courbes → LHE → LHE_fin → Masque_retirer |
| `HDRMT_50` (option) | image sans étoiles étirée | copie `HDR_avant` → HDRMT → PixelMath `a·$T + (1 − a)·HDR_avant`, a = 0,5 → Fermer_vues (`HDR_avant`) |
| `Boost_final` (option, image finie) | image finie avec étoiles, L sans étoiles ouverte | Masque_L tiré de `L` (paramètre `source`, s = 0,20, `gamma` 2 : masque² = fort sur le très lumineux, faible sur le halo ; `exclure` = RGB_stars : étoiles retirées du masque) → CurvesTransformation c 0,46094 → 0,53646 et S 0,46354 → 0,54167 → Masque_retirer (LRGB, LHaRGB, modes normal et rapide) |
| `HDRMT_eclat` (option) | image sans étoiles étirée | même suite avec a = 0,4 → Masque_L → courbe très légère (saturation 0,57) → LHE rayon 80, Amount 0,12 → Masque_retirer (HDRMT puis Boost_finition_light) |

Format recopié des conteneurs des icônes de theAstroShed (PixInsight 1.9.3) : instances imbriquées sans identifiant, `enabled="true"`, pas de description sur le conteneur. Pas encore testé dans PixInsight : essaie d'abord sur une copie de l'image.

Dans les trois fichiers, **une colonne par phase**, avec une icône-titre sans effet en haut (`P1_Preparation`, `P2_Gradient`, `P3_Lineaire`, `P4_Etirement`, `P5_Couleur`, `P6_Finition`, `P7_Etoiles`). **Chaque icône porte une description courte** : `PRÉRÉGLÉ` (ce que l'icône règle déjà), `À RÉGLER` (ce qu'il te reste à faire) et `SI … ->` (quoi changer selon le symptôme), plus le mode de lancement pour les scripts. Textes dans `short_desc.py`, phases et rôles dans `layout.py` ; explications complètes dans les fiches de la page.

| Workflow | Principal | Options | Contenu |
|---|---|---|---|
| LRGB | 24 | 12 | Prétraitement, combinaison RGB, MGC, BXT Correct Only, SPCC, BXT, SXT linéaire, NXT, GHS, LRGBCombination, finition, étoiles |
| LHaRGB | 28 | 15 | LRGB + soustraction du continuum et H dans le rouge ; options : calcul automatique de k, H dans L, NBRGBCombination |
| RGB-SHO | 34 | 19 | Masters narrowband, combinaison SHO simple, BXT, SXT, extraction, NarrowbandNormalization, étoiles RGB ; options : Foraxx, Perfect Palette Picker, NBColourMapper, SCNR, LinearFit |
| SHO-sans-RGB | 31 | 19 | Idem sans RGB, étoiles narrowband par NB to RGB Star Combination ; options : étoiles HOO synthétiques, CorrectMagentaStars |
| HOO | 28 | 19 | Combinaison HOO, NarrowbandNormalization HOO ; options : extraction dual-band (caméra couleur), Foraxx HOO, variante Hubble, H en luminance |

(Les nombres ne comptent pas les icônes-titres. Masters déjà empilés : WBPP et CosmeticCorrection sont en options, pour repartir des brutes. Première étape de chaque workflow : `E00_LinearPatternSubtraction` (les autres étapes gardent leurs numéros), qui retire les lignes résiduelles du capteur sur tous les masters ouverts : lance `scripts/LPS_UnClic.js` (moteur de Vicent Peris appelé sans dialogue, zone de fond automatique), à copier une fois par ordinateur (Mac ou PC) dans `src/scripts/clodoweg/` du dossier de PixInsight, à côté de `PatternCorrection` (Mac : `/Applications/PixInsight/src/scripts/clodoweg/` ; PC : en général `C:\Program Files\PixInsight\src\scripts\clodoweg\` ; pas le dossier `scripts` du premier niveau) : l'icône pointe vers `$PXI_SRCDIR/scripts/clodoweg/LPS_UnClic.js`.)

**Trois sortes d'icônes :**

- **Process réglés** : s'appliquent directement (PixelMath, BlurXTerminator, NoiseXTerminator, StarXTerminator, LRGBCombination, LinearFit, SCNR, LHE, HDRMT, MorphologicalTransformation, CurvesTransformation, GradientCorrection, NarrowbandNormalization SHO et HOO, CosmeticCorrection).
- **Process à compléter sur ton image ou ton matériel** :
  - `MGC_MARS`, `MGC_MARS_H`, `MGC_MARS_O` : charge la base MARS (DR2) dans les préférences de MGC si elle ne l'est pas. Les icônes H et O sont dans les workflows LHaRGB (H seulement), RGB-SHO, SHO sans RGB et HOO.
  - `DBE` : icône réelle, sans points (ils dépendent de l'image).
  - `SPCC` et `SPFC_…` : configurés pour ton matériel (QHY600 + Antlia V Pro). Bande passante narrowband 3 nm (filtres Antlia 3 nm).
  - `GHS_1_premier`, `GHS_2_contraste`, `GHS_3_fond` : Local intensity et protections réglés, mais **SP à choisir sur ton image** ; GHS_1 : Stretch factor 0 et SP 0 ; GHS_2 : Stretch factor 1 et SP 0,35 (valeurs de départ) ; GHS_3 : Stretch factor 1 et SP = HP = 0,20 (fond à 0,23 après GHS_2). Chaîne calculée pour un pic à 0,25 après GHS_1 (l'icône ne fait rien tant que tu ne l'as pas réglée). Leurs descriptions donnent les repères de niveau : fond vers 0,20–0,25 après le 1er étirement, 0,12–0,14 (30–35 sur 255) dans l'image finale, jamais 0.
  - `Courbes` : légère courbe en S et saturation, à ajuster à l'œil.
- **Icônes de script** (process *Script*) : elles lancent directement le script, avec ses paramètres préréglés quand le script les lit.

  | Script | Lancement | Paramètres préréglés | Empreinte MD5 |
  |---|---|---|---|
  | Statistical Stretch | glisser sur l'image | oui (Target Median 0,25, Linked, Blackpoint Sigma 5…), dialogue ouvert | oui |
  | Star Stretch | glisser sur l'image d'étoiles | oui (Stretch Amount 6, Color Boost 1,3) | oui |
  | Find Background | activer l'image puis glisser | oui (aperçu « Background », recherche rapide), sans dialogue | oui |
  | Automatic Continuum Subtraction | double-clic puis *Apply Global* | oui (Starry, sortie linéaire, sans réduction de bruit) | oui |
  | NB to RGB Star Combination | glisser sur une image | non : la v1.6 ne relit pas les paramètres d'icône | oui |
  | Halo-B-Gon, Perfect Palette Picker | double-clic puis *Apply Global* | non : ces scripts n'en lisent pas | oui |
  | CorrectMagentaStars | glisser sur l'image (s'applique sans dialogue) | oui (Amount 0,8) | vide |
  | WBPP 3.1, ImageSolver | double-clic puis *Apply Global* | non (WBPP garde ses réglages lui-même ; code d'ImageSolver 1.9.5 non public) | vide |

  Chemins en `$PXI_SRCDIR/scripts/…`, valables sur toute installation. Scripts SetiAstro : fichiers de l'archive `SetiAstroScripts09.19.2026.zip` (dépôt 1.9.4 à 1.9.5), dont l'icône porte l'empreinte MD5 ; après une mise à jour d'un script, PixInsight bloque l'icône : double-clique-la, efface le champ MD5, réenregistre-la. Scripts livrés avec PixInsight : chemins relevés dans des icônes réelles (ImageSolver, CorrectMagentaStars) ou dans psf-guard pour WBPP 3.1 sous PixInsight 1.9.5 ; empreinte laissée vide, donc sans vérification.
- **Icônes-notes** (process *NoOperation*, sans effet) : en-têtes d'étape, et deux scripts dont le chemin d'installation n'a pas pu être vérifié : NBColourMapper (paquet inaccessible, serveur anti-robots) et NBRGBCombination (livré avec PixInsight, chemin inconnu). Leur description donne tous les réglages.

ChannelCombination et ChannelExtraction sont remplacés par des icônes PixelMath équivalentes (par exemple `$T[1]` pour extraire le canal vert).

Les fichiers ont été générés par `make_workflows.py` (dans ce dossier) à partir des modèles vérifiés.

**Régénérer tout** (icônes 01–04, workflows, options, conteneurs, données du préparateur et page) : `sh docs/process-icons/build/build.sh`. Le dossier `build/` contient les modèles d'instances (`templates.json`, `all.x`, `FromLukeAndBill.xpsm`, issus des icônes de theAstroShed, licence Apache 2.0 dans `LICENSE-theAstroShed-icons`), le script du préparateur (`prep_build.py`), la conversion page du dépôt ↔ source de l'artifact (`page.py`) et un audit des réglages (`audit_icons.py`, à lancer depuis `docs/process-icons`).

## Sources

- SPFC, MGC et DBE n'ont pas de modèle `.xpsm` public : leurs icônes sont construites à partir de la liste de paramètres du code d'AutoIntegrate, au format des paramètres communs avec SPCC (modèle réel) ; courbes de filtres et de capteur tirées du même code et de l'icône SPCC de theAstroShed (`spfc_curves.json`).

- [theAstroShed, icônes de process](https://github.com/jamiesmith/pixinsight-icons) : fichiers `.xpsm` générés par PixInsight 1.9.3, utilisés comme modèles (noms de paramètres, versions, valeurs d'énumération) ; formules Foraxx identiques ; formules de Bill Blanshan V3 (`FromLukeAndBill.xpsm`).
- [AutoIntegrate](https://github.com/jarmoruuth/AutoIntegrate) : opérateur `Selection` de MorphologicalTransformation et masque circulaire 5×5 ; formules de Bill Blanshan V2 ; paramètres de MultiscaleGradientCorrection.
- Les modèles de SPCC (*Average Spiral Galaxy*), GradientCorrection, GHS, CurvesTransformation, NarrowbandNormalization et l'usage de NoOperation comme icône-note avec description viennent aussi des fichiers de theAstroShed.

## Scripts de la fiche (dossier `scripts/`)

À copier une fois par ordinateur (Mac ou PC) dans `src/scripts/clodoweg/` du dossier de PixInsight, à côté de `PatternCorrection` (Mac : `/Applications/PixInsight/src/scripts/clodoweg/`) :

- `Masque_auto.js` : paramètre `exclure` (image d'étoiles retirée du masque : masque × (1 − min(1, `exclureGain` 4 × étoiles lissées 3 px))) ; paramètre `gamma` (masque^gamma, 1 par défaut ; 2 pour Boost_final) ; paramètre `source` (vue dont on tire la luminance, par exemple `L` sans étoiles pour Boost_final ; vide = l'image cible) ; icônes `Masque_L` (mode attacher : crée `masque_L`, luminance Rec. 709 au fond coupé à s = 0,14, flou 2 px, et l'attache à l'image) et `Masque_retirer` (détache et ferme) ; dans C_Finition, les Boost et C_Fin_rapide.
- `Fermer_vues.js` : ferme sans confirmation les vues listées dans son paramètre `views` (virgules) ; dernière étape des conteneurs `HDRMT_50` (copie `HDR_avant`), `C_L_lineaire`, `C_L_etoiles_bruit` et `C_L_rapide` (`L_stars`, étoiles de la luminance, inutiles) ; icône `Fermer_L_stars` dans les fichiers `Workflow-X`.
- `Etoiles_LRGB.js` : dernière étape de `C_L_rapide` (et de l'option `C_L_rapide_SXT_lineaire_etoilesL`) ; icône `Etoiles_LRGB_etire` des workflows normaux LRGB et LHaRGB ; étire `L_stars` avec la courbe d'Etoiles_auto si `etirerL` = true (SXT linéaire ; false si SXT a tourné après l'étirement), crée la luminance `partL × L_stars + (1 − partL) × luminance de RGB_stars` (0,5), l'applique à `RGB_stars` par LRGBCombination (mL 0,5, mc 0,35, sans réduction de bruit), puis ferme `L_stars`. Sans cette option, `L_stars` est fermée par la finition.
- `Fond_desature.js` : option de fin (mode rapide et tous les workflows normaux) ; fond mesuré sur la luminance (grille 8 × 8) ; anti-violet : `G = G + (max(G, min(R, B)) − G)·m`, m = 1 sous fond + `fin` (0,15), 0 au-dessus de fond + `violetFin` (0,30) ; puis désaturation `Y + ($T − Y)·w`, w = rampe de la luminance lissée (`flou` 3 px) entre fond + `debut` (0,03) et fond + `fin` (0,15).
- `Fond_auto.js` : dernière étape de `C_Fin_rapide` et `C_Fin_simple` (et option seule) ; fond de chaque canal mesuré sur une grille de 8 × 8 cases (médiane du quart le plus sombre des médianes de cases, insensible à une grande galaxie), puis PixelMath `mtf(m, $T)` canal par canal pour amener le fond sur `cible` (0,12), sans écrêtage ; rien n'est fait si l'écart est sous `tolerance` (0,005) ; fond avant et après dans la console.
- `Etoiles_auto.js` : étirement des étoiles sans dialogue, dernière étape de `C_RGB_rapide` et `C_RGB_fin_rapide` ; travaille sur la vue `vue` (RGB_stars) quelle que soit la cible : PixelMath `3^a·x / ((3^a − 1)·x + 1)` (courbe de Star Stretch, a = amount 6), puis ColorSaturation par teinte (satAmount 1,3 : 0,4 × sur les rouges, 0,7 × sur les cyans), SCNR vert si `scnr = true`. Réécriture de la formule, pas de code de SetiAstro.
- `Renommer_auto.js` : première icône de chaque workflow (`Renommer_auto`) ; renomme les masters mono ouverts L, R, G, B, H, O, S d'après le mot-clé FILTER (Lum, Red, Ha, OIII, SII…), sinon d'après le nom du fichier (`FILTER-Ha`, `_L_`) ; images couleur et noms déjà pris laissés tels quels, avec un message dans la console. Double-clic puis Apply Global.
- `LPS_UnClic.js` : LinearPatternSubtraction sans dialogue (icône `E00_LinearPatternSubtraction`, première étape de tous les workflows ; dans `E00_C_Preparation_rapide` des modes rapides). Toutes les images mono ouvertes sont corrigées, les images couleur sont ignorées.
- `Combiner_RGB.js` : icône `Combinaison_RGB` des workflows ; combine les masters R, G, B en `RGB`, copie l'en-tête FITS du rouge (coordonnées et date pour ImageSolver), puis ferme R, G et B sans demander d'enregistrer (`closeSources = false` pour les garder). Double-clic puis Apply Global.
- `ImageSolver_Date.js` : icône `ImageSolver` des workflows (une seule icône, pas de conteneur : dans un ProcessContainer, ImageSolver échoue avec « The image is already being processed ») ; ajoute `DATE-OBS = 2020-01-01` aux images sans date, puis résout l'image avec le moteur d'ImageSolver inclus comme bibliothèque (comme WBPP : `#include "../ImageSolver/ImageSolver.js"`) et les réglages de l'icône, ceux d'ImageSolver (`$PXI_SRCDIR/scripts/ImageSolver/ImageSolver.js`, version 6.4.2) avec focale 2 939 mm, pixel 3,76 µm, catalogue automatique et correction de distorsion. Glisser l'icône `ImageSolver` sur l'image suffit.

