# Icônes de process PixInsight

Icônes prêtes à charger, avec les réglages de la fiche `docs/pixinsight-workflow.html`. Ce sont des **valeurs de départ** : ajuste-les sur tes images.

## Charger les icônes

1. Télécharge le fichier `.xpsm` voulu.
2. Dans PixInsight : clic droit sur l'espace de travail › *Process Icons* › *Load Process Icons* (ou *Merge Process Icons* pour les ajouter à tes icônes existantes), puis choisis le fichier.
3. Double-clique sur une icône pour ouvrir le process avec ses réglages, ou glisse-la sur une image pour l'appliquer directement.

Les fichiers n'ont pas été testés dans PixInsight avant publication : ils ont été construits à partir d'icônes réelles générées par PixInsight 1.9.3 (voir Sources), en ne changeant que les valeurs. Si une icône ne se charge pas, signale-le.

**PixInsight 1.9.5** : les icônes n'ont pas non plus été testées dans cette version. Elles n'utilisent ni AutomaticBackgroundExtractor ni SubframeSelector, les deux process dont les instances antérieures à la 1.9.4 doivent être recréées. Les icônes-notes (scripts) ne dépendent pas de la version.

## 01-PixelMath-formules.xpsm

Les formules supposent des images nommées comme indiqué (renomme tes vues avec le bon identifiant avant de les appliquer).

| Icône | Images attendues | Résultat |
|---|---|---|
| `Foraxx_SHO` | `Sii`, `Ha`, `Oiii` (étirées, sans étoiles) | Nouvelle image RGB `SHO_Foraxx` |
| `Foraxx_HOO` | `Ha`, `Oiii` | Nouvelle image RGB `HOO_Foraxx` |
| `HOO_simple` | `Ha`, `Oiii` | R = Ha, G = OIII, B = OIII |
| `HOO_Hubble` | `Ha`, `Oiii` | G = 0,6·Ha + 0,4·OIII (Galactic Hunter) |
| `DualBand_Ha` / `DualBand_OIII` | À appliquer sur l'image couleur dual-band | Nouvelles images mono `Ha` et `Oiii` |
| `Continuum_Ha` | `Ha`, `R` | `Ha_cs` ; ajuste `k = 0.9` dans la formule |
| `Ha_dans_R` | `R`, `Ha_cs` | `R_Ha` ; ajuste `w = 1.0` |
| `Etoiles_screen` | `starless`, `stars` (étirées) | Nouvelle image `Final` |
| `Etoiles_HOO_synth` | `Ha_stars`, `Oiii_stars` (linéaires) | Étoiles RGB synthétiques, G = 20 % Ha + 80 % OIII |
| `Blanshan_Transfer` / `_Halo` / `_Star` | Vue sans étoiles nommée `starless` ; appliquer sur l'image avec étoiles | Version 2, identique à la page (S = 0,15) |
| `Blanshan_Transfer_V3` / `_Halo_V3` / `_Star_V3` | Idem | Version 3 d'origine, avec les commentaires de Bill Blanshan (S = 0,20 ; Star en mode doux M = 3) |

## 02-RC-Astro.xpsm (licences RC Astro requises)

| Icône | Réglages |
|---|---|
| `BXT_CorrectOnly` | Correct Only, avant SPCC |
| `BXT_RGB` | Sharpen Stars 0,25, Halos 0, Nonstellar 0,50, PSF automatique |
| `BXT_L_Ha` | Idem, Nonstellar 0,80 |
| `BXT_NB_combine` | Idem, Nonstellar 0,60, pour la combinaison SHO/HOO simple |
| `NXT_L_Ha` | Denoise 0,60, Detail 0,15, 1 itération |
| `NXT_RGB` | Denoise 0,80 |
| `NXT_OIII_SII` | Denoise 0,75 |
| `NXT_final_etire` | Denoise 0,40, passe finale légère |
| `SXT_lineaire` | Étoiles générées, **Unscreen décoché** (image linéaire) |
| `SXT_etire` | Étoiles générées, Unscreen coché (image étirée uniquement) |

## 03-Natifs-PixInsight.xpsm

| Icône | Réglages |
|---|---|
| `LRGB_ajout_L` | Seul L activé (vue nommée `L`), Lightness 0,5, Saturation 0,40, réduction du bruit de chrominance |
| `LinearFit_ref_Ha` | Référence : vue nommée `Ha` |
| `SCNR_vert` | Green, Average Neutral, 1,0 |
| `SCNR_SHO_partiel` | Green, Average Neutral, 0,70 |
| `LHE_150` | Kernel radius 150, Contrast limit 2,0, Amount 0,35, noyau circulaire |
| `HDRMT_6` | 6 couches, 1 itération, To lightness, Preserve hue, Lightness mask |
| `MT_reduction_etoiles` | Morphological Selection 0,25, Amount 0,60, 1 itération, élément circulaire 5×5 |
| `SPFC_RGB_filtres` | SpectrophotometricFluxCalibration pour un RGB combiné (filtres Astrodon E-series et capteur IMX571, comme l'icône SPCC : **à remplacer par ton matériel**) |
| `SPFC_couleur_OSC` | SPFC pour une caméra couleur : filtres Bayer Sony (R/G/B-UVIRcut), QE idéale |
| `SPFC_L` | SPFC pour un master L : Gray filter Astronomik L-2 (à remplacer par ton filtre), QE idéale |
| `SPFC_Ha` / `SPFC_OIII` / `SPFC_SII` | SPFC en Narrowband mode : 656,3 / 500,7 / 672,4 nm, bande passante 3 nm (mets celle de ton filtre) |
| `MGC_MARS` | MultiscaleGradientCorrection : base MARS, filtres MARS L/R/G/B, Gradient scale 1024, Structure separation 3, Model smoothness 1,0, modèle affiché |
| `DBE_base` | DynamicBackgroundExtraction sans points : Samples per row 15, radius 15, Tolerance 0,5, Shadows relaxation 3, Smoothing 0,25, Subtract, Normalize |
| `DynamicCrop_base` | DynamicCrop sans recadrage : trace ton cadre, puis crée ton icône |
| `NBN_SHO` / `NBN_HOO` | NarrowbandNormalization, palette SHO ou HOO, valeurs par défaut, sur l'image combinée étirée sans étoiles |
| `CC_auto_WBPP` | Auto detect, Hot sigma 2,5, Cold désactivé ; à sélectionner comme modèle dans WBPP |

Les process qui dépendent de ton matériel ou de ton image (WBPP, SPCC, SPFC, DBE, MGC, GHS) sont dans les fichiers par workflow ci-dessous.

## 04-Materiel-QHY600-Antlia.xpsm (ton matériel)

Icônes SPCC et SPFC configurées pour **QHY600 (capteur Sony IMX455) + filtres Antlia V Pro**, avec les courbes de filtres et de capteur issues de ta base de filtres PixInsight. Les cinq workflows utilisent les mêmes réglages.

| Icône | Réglages |
|---|---|
| `SPCC_QHY600_Antlia` | Average Spiral Galaxy ; QE Sony IMX411/455/461/533/571 ; Antlia V Pro Series R, G, B ; neutralisation du fond (−2,80 / +2,00) sur l'image entière (ou aperçu du script Find Background, voir la description) ; graphes |
| `SPFC_RGB_QHY600_Antlia` | Image RGB combinée : Antlia V Pro R, G, B ; QE IMX455 |
| `SPFC_L_QHY600_Antlia` | Master L : courbe approchée du filtre Antlia V Pro L (420 à 715 nm, 95 %, d'après les caractéristiques publiées, la vraie courbe n'étant pas dans ta base) ; QE IMX455 |
| `SPFC_Ha/OIII/SII_QHY600_Antlia` | Narrowband mode, 656,3 / 500,7 / 672,4 nm, bande passante 3 nm (filtres Antlia 3 nm) ; QE IMX455 |

## Un fichier par workflow (dossier `workflows/`)

Chaque fichier contient **tous les process du workflow, dans l'ordre**, numérotés (`LRGB_01_WBPP`, `LRGB_02_CC_auto`…) et disposés en colonnes de haut en bas. **Chaque icône porte une description détaillée** : réglages, vues attendues, quand l'appliquer et pourquoi. Pour la lire dans PixInsight, survole l'icône ou ouvre-la (champ *Description*).

| Fichier | Icônes | Contenu |
|---|---|---|
| `Workflow-LRGB.xpsm` | 31 | Prétraitement, combinaison RGB, gradient, BXT Correct Only, SPCC, BXT, SXT linéaire, NXT, GHS, LRGBCombination, finition, étoiles (standard de couleur et contrôle après recombinaison) |
| `Workflow-LHaRGB.xpsm` | 37 | LRGB + soustraction du continuum, Ha dans le rouge et dans L, NBRGBCombination en alternative ; contrôles de couleur et des étoiles (option : étoiles prises avant injection) |
| `Workflow-RGB-SHO.xpsm` | 44 | Masters narrowband, LinearFit, combinaison SHO simple, BXT, SXT, extraction des canaux, palettes (NarrowbandNormalization avec rendu visé et contrôle des couleurs, Foraxx, Perfect Palette Picker, NBColourMapper), étoiles RGB (couleurs attendues et contrôle de la recombinaison) |
| `Workflow-SHO-sans-RGB.xpsm` | 43 | Idem sans RGB, avec étoiles narrowband (NB to RGB Star Combination, étoiles HOO synthétiques, CorrectMagentaStars) et leur standard de couleur (contrôle à la sonde, ajustements) |
| `Workflow-HOO.xpsm` | 40 | Extraction dual-band pour caméra couleur, combinaison HOO, NarrowbandNormalization HOO (avec rendu visé et contrôle des couleurs), Foraxx HOO, variante Hubble, Perfect Palette Picker, Ha en luminance, standard des étoiles HOO (vert synthétique, contrôle à la sonde) |

**Trois sortes d'icônes :**

- **Process réglés** : s'appliquent directement (PixelMath, BlurXTerminator, NoiseXTerminator, StarXTerminator, LRGBCombination, LinearFit, SCNR, LHE, HDRMT, MorphologicalTransformation, CurvesTransformation, GradientCorrection, NarrowbandNormalization SHO et HOO, CosmeticCorrection).
- **Process à compléter sur ton image ou ton matériel** :
  - `MGC_MARS` : charge la base MARS dans les préférences de MGC si elle ne l'est pas.
  - `DynamicCrop` et `DBE` : icônes réelles, sans cadre ni points (ils dépendent de l'image).
  - `SPCC` et `SPFC_…` : configurés pour ton matériel (QHY600 + Antlia V Pro). Bande passante narrowband 3 nm (filtres Antlia 3 nm).
  - `GHS_1_premier`, `GHS_2_contraste`, `GHS_3_fond` : Local intensity et protections réglés, mais **Stretch factor à 0 et SP à choisir sur ton image** (l'icône ne fait rien tant que tu ne l'as pas réglée). Leurs descriptions donnent les repères de niveau : fond vers 0,20–0,25 après le 1er étirement, 0,12–0,14 (30–35 sur 255) dans l'image finale, jamais 0.
  - `Courbes` : légère courbe en S et saturation, à ajuster à l'œil.
- **Icônes-notes** (process *NoOperation*, sans effet) : seulement pour les **scripts** (WBPP, ImageSolver, Statistical Stretch, Star Stretch, Halo-B-Gon, CorrectMagentaStars, NB to RGB Star Combination, Perfect Palette Picker, NBColourMapper, Automatic Continuum Subtraction, NBRGBCombination) et les en-têtes d'étape. Une icône de script enregistre le chemin du fichier et son empreinte sur la machine de l'auteur, et WBPP 3.x a changé d'emplacement : une icône de script recopiée risquerait de ne pas se charger chez toi. La description donne tous les réglages à faire dans le script.

ChannelCombination et ChannelExtraction sont remplacés par des icônes PixelMath équivalentes (par exemple `$T[1]` pour extraire le canal vert).

Les fichiers ont été générés par `make_workflows.py` (dans ce dossier) à partir des modèles vérifiés.

## Sources

- SPFC, MGC et DBE n'ont pas de modèle `.xpsm` public : leurs icônes sont construites à partir de la liste de paramètres du code d'AutoIntegrate, au format des paramètres communs avec SPCC (modèle réel) ; courbes de filtres et de capteur tirées du même code et de l'icône SPCC de theAstroShed (`spfc_curves.json`).

- [theAstroShed, icônes de process](https://github.com/jamiesmith/pixinsight-icons) : fichiers `.xpsm` générés par PixInsight 1.9.3, utilisés comme modèles (noms de paramètres, versions, valeurs d'énumération) ; formules Foraxx identiques ; formules de Bill Blanshan V3 (`FromLukeAndBill.xpsm`).
- [AutoIntegrate](https://github.com/jarmoruuth/AutoIntegrate) : opérateur `Selection` de MorphologicalTransformation et masque circulaire 5×5 ; formules de Bill Blanshan V2 ; paramètres de MultiscaleGradientCorrection.
- Les modèles de SPCC (*Average Spiral Galaxy*), GradientCorrection, GHS, CurvesTransformation, NarrowbandNormalization et l'usage de NoOperation comme icône-note avec description viennent aussi des fichiers de theAstroShed.
