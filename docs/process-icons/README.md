# Icônes de process PixInsight

Icônes prêtes à charger, avec les réglages de la fiche `docs/pixinsight-workflow.html`. Ce sont des **valeurs de départ** : ajuste-les sur tes images.

## Charger les icônes

1. Télécharge le fichier `.xpsm` voulu.
2. Dans PixInsight : clic droit sur l'espace de travail › *Process Icons* › *Load Process Icons* (ou *Merge Process Icons* pour les ajouter à tes icônes existantes), puis choisis le fichier.
3. Double-clique sur une icône pour ouvrir le process avec ses réglages, ou glisse-la sur une image pour l'appliquer directement.

Les fichiers n'ont pas été testés dans PixInsight avant publication : ils ont été construits à partir d'icônes réelles générées par PixInsight 1.9.3 (voir Sources), en ne changeant que les valeurs. Si une icône ne se charge pas, signale-le.

**PixInsight 1.9.5** : les icônes n'ont pas non plus été testées dans cette version. Elles n'utilisent ni AutomaticBackgroundExtractor ni SubframeSelector, les deux process dont les instances antérieures à la 1.9.4 doivent être recréées. Les icônes-notes (scripts) ne dépendent pas de la version.

## 01-PixelMath-formules.xpsm

Les formules supposent des images nommées comme indiqué (renomme tes vues avec le bon identifiant avant de les appliquer). Masters narrowband : `H` (Hα), `O` (OIII), `S` (SII) ; les descriptions des icônes utilisent la même notation. Les icônes suivent la même convention (`SPFC_H`, `MGC_MARS_O`, `NXT_O_S`…) ; seules les valeurs de filtre MARS dans MGC restent `Ha` et `OIII`, noms imposés par la base.

| Icône | Images attendues | Résultat |
|---|---|---|
| `Foraxx_SHO` | `S`, `H`, `O` (étirées, sans étoiles) | Nouvelle image RGB `SHO_Foraxx` |
| `Foraxx_HOO` | `H`, `O` | Nouvelle image RGB `HOO_Foraxx` |
| `HOO_simple` | `H`, `O` | R = H, G = O, B = O |
| `HOO_Hubble` | `H`, `O` | G = 0,6·H + 0,4·O (Galactic Hunter) |
| `DualBand_H` / `DualBand_O` | À appliquer sur l'image couleur dual-band | Nouvelles images mono `H` et `O` |
| `Continuum_H` | `H`, `R` | `H_cs` ; ajuste `k = 0.9` dans la formule |
| `H_dans_R` | `R`, `H_cs` | `R_H` ; ajuste `w = 1.0` |
| `Etoiles_screen` | `starless`, `stars` (étirées) | Nouvelle image `Final` |
| `Etoiles_HOO_synth` | `H_stars`, `O_stars` (linéaires) | Étoiles RGB synthétiques, G = 20 % H + 80 % O |
| `Masque_L` / `Masque_L_mono` | Image sans étoiles étirée (couleur / mono) ; glisser l'icône dessus | Nouvelle vue mono `masque_L` : luminance Rec. 709 avec le fond coupé, `s = 0.14` par défaut (fond + 0,01). Chaque workflow l'inclut avant les courbes et LHE |
| `Blanshan_Transfer` / `_Halo` / `_Star` | Vue sans étoiles nommée `starless` ; appliquer sur l'image avec étoiles | Version 2, identique à la page (S = 0,15) |
| `Blanshan_Transfer_V3` / `_Halo_V3` / `_Star_V3` | Idem | Version 3 d'origine, avec les commentaires de Bill Blanshan (S = 0,20 ; Star en mode doux M = 3) |

## 02-RC-Astro.xpsm (licences RC Astro requises)

| Icône | Réglages |
|---|---|
| `BXT_CorrectOnly` | Correct Only, avant SPCC |
| `BXT_RGB` | Sharpen Stars 0,25, Halos 0, Nonstellar 0,50, PSF automatique |
| `BXT_L_H` | Idem, Nonstellar 0,80 |
| `BXT_NB_combine` | Idem, Nonstellar 0,60, pour la combinaison SHO/HOO simple |
| `NXT_L_H` | Denoise 0,60, Detail 0,15, 1 itération |
| `NXT_RGB` | Denoise 0,80 |
| `NXT_O_S` | Denoise 0,75 |
| `NXT_final_etire` | Denoise 0,40, passe finale légère |
| `SXT_lineaire` | Étoiles générées, **Unscreen décoché** (image linéaire) |
| `SXT_etire` | Étoiles générées, Unscreen coché (image étirée uniquement) |

## 03-Natifs-PixInsight.xpsm

| Icône | Réglages |
|---|---|
| `LRGB_ajout_L` | Seul L activé (vue nommée `L`), Lightness 0,5, Saturation 0,40, réduction du bruit de chrominance |
| `LinearFit_ref_H` | Référence : vue nommée `H` |
| `SCNR_vert` | Green, Average Neutral, 1,0 |
| `SCNR_SHO_partiel` | Green, Average Neutral, 0,70 |
| `LHE_150` | Kernel radius 150, Contrast limit 2,0, Amount 0,35, noyau circulaire |
| `HDRMT_6` | 6 couches, 1 itération, To lightness, Preserve hue, Lightness mask |
| `MT_reduction_etoiles` | Morphological Selection 0,25, Amount 0,60, 1 itération, élément circulaire 5×5 |
| `SPFC_RGB_filtres` | SpectrophotometricFluxCalibration pour un RGB combiné (filtres Astrodon E-series et capteur IMX571, comme l'icône SPCC : **à remplacer par ton matériel**) |
| `SPFC_couleur_OSC` | SPFC pour une caméra couleur : filtres Bayer Sony (R/G/B-UVIRcut), QE idéale |
| `SPFC_L` | SPFC pour un master L : Gray filter Astronomik L-2 (à remplacer par ton filtre), QE idéale |
| `SPFC_H` / `SPFC_O` / `SPFC_S` | SPFC en Narrowband mode : 656,3 / 500,7 / 672,4 nm, bande passante 3 nm (mets celle de ton filtre) |
| `MGC_MARS` | MultiscaleGradientCorrection : base MARS, filtres MARS L/R/G/B, Gradient scale 1024, Structure separation 3, Model smoothness 1,0, modèle affiché |
| `MGC_MARS_H` / `MGC_MARS_O` | Idem pour un master narrowband : filtre MARS Gray = `Ha` ou `OIII` (base MARS DR2, juin 2026). Pas de bande S dans MARS : GradientCorrection ou DBE pour S |
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
| `SPFC_H/O/S_QHY600_Antlia` | Narrowband mode, 656,3 / 500,7 / 672,4 nm, bande passante 3 nm (filtres Antlia 3 nm) ; QE IMX455 |

## Un fichier par workflow (dossier `workflows/`)

Chaque fichier contient **tous les process du workflow, dans l'ordre**, numérotés (`LRGB_01_WBPP`, `LRGB_02_CC_auto`…) et disposés en colonnes de haut en bas. **Chaque icône porte une description courte** : `PRÉRÉGLÉ` (ce que l'icône règle déjà), `À RÉGLER` (ce qu'il te reste à faire) et `SI … ->` (quoi changer selon le symptôme), plus le mode de lancement pour les scripts. Textes dans `short_desc.py` ; explications complètes dans les fiches de la page. Pour la lire dans PixInsight, survole l'icône ou ouvre-la (champ *Description*).

| Fichier | Icônes | Contenu |
|---|---|---|
| `Workflow-LRGB.xpsm` | 33 | Prétraitement, combinaison RGB, gradient, BXT Correct Only, SPCC, BXT, SXT linéaire, NXT, GHS, LRGBCombination, finition, étoiles (standard de couleur et contrôle après recombinaison) |
| `Workflow-LHaRGB.xpsm` | 40 | LRGB + soustraction du continuum, H dans le rouge et dans L, NBRGBCombination en alternative ; contrôles de couleur et des étoiles (option : étoiles prises avant injection) |
| `Workflow-RGB-SHO.xpsm` | 48 | Masters narrowband, LinearFit, combinaison SHO simple, BXT, SXT, extraction des canaux, palettes (NarrowbandNormalization avec rendu visé et contrôle des couleurs, Foraxx, Perfect Palette Picker, NBColourMapper), étoiles RGB (couleurs attendues et contrôle de la recombinaison) |
| `Workflow-SHO-sans-RGB.xpsm` | 46 | Idem sans RGB, avec étoiles narrowband (NB to RGB Star Combination, étoiles HOO synthétiques, CorrectMagentaStars) et leur standard de couleur (contrôle à la sonde, ajustements) |
| `Workflow-HOO.xpsm` | 43 | Extraction dual-band pour caméra couleur, combinaison HOO, NarrowbandNormalization HOO (avec rendu visé et contrôle des couleurs), Foraxx HOO, variante Hubble, Perfect Palette Picker, H en luminance, standard des étoiles HOO (vert synthétique, contrôle à la sonde) |

**Trois sortes d'icônes :**

- **Process réglés** : s'appliquent directement (PixelMath, BlurXTerminator, NoiseXTerminator, StarXTerminator, LRGBCombination, LinearFit, SCNR, LHE, HDRMT, MorphologicalTransformation, CurvesTransformation, GradientCorrection, NarrowbandNormalization SHO et HOO, CosmeticCorrection).
- **Process à compléter sur ton image ou ton matériel** :
  - `MGC_MARS`, `MGC_MARS_H`, `MGC_MARS_O` : charge la base MARS (DR2) dans les préférences de MGC si elle ne l'est pas. Les icônes H et O sont dans les workflows LHaRGB (H seulement), RGB-SHO, SHO sans RGB et HOO.
  - `DynamicCrop` et `DBE` : icônes réelles, sans cadre ni points (ils dépendent de l'image).
  - `SPCC` et `SPFC_…` : configurés pour ton matériel (QHY600 + Antlia V Pro). Bande passante narrowband 3 nm (filtres Antlia 3 nm).
  - `GHS_1_premier`, `GHS_2_contraste`, `GHS_3_fond` : Local intensity et protections réglés, mais **Stretch factor à 0 et SP à choisir sur ton image** (l'icône ne fait rien tant que tu ne l'as pas réglée). Leurs descriptions donnent les repères de niveau : fond vers 0,20–0,25 après le 1er étirement, 0,12–0,14 (30–35 sur 255) dans l'image finale, jamais 0.
  - `Courbes` : légère courbe en S et saturation, à ajuster à l'œil.
- **Icônes de script** (process *Script*) : elles lancent directement le script, avec ses paramètres préréglés quand le script les lit.

  | Script | Lancement | Paramètres préréglés | Empreinte MD5 |
  |---|---|---|---|
  | Statistical Stretch | glisser sur l'image | oui (Target Median 0,25, Linked, Blackpoint Sigma 5…), dialogue ouvert | oui |
  | Star Stretch | glisser sur l'image d'étoiles | oui (Stretch Amount 5, Color Boost 1,0) | oui |
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

## Sources

- SPFC, MGC et DBE n'ont pas de modèle `.xpsm` public : leurs icônes sont construites à partir de la liste de paramètres du code d'AutoIntegrate, au format des paramètres communs avec SPCC (modèle réel) ; courbes de filtres et de capteur tirées du même code et de l'icône SPCC de theAstroShed (`spfc_curves.json`).

- [theAstroShed, icônes de process](https://github.com/jamiesmith/pixinsight-icons) : fichiers `.xpsm` générés par PixInsight 1.9.3, utilisés comme modèles (noms de paramètres, versions, valeurs d'énumération) ; formules Foraxx identiques ; formules de Bill Blanshan V3 (`FromLukeAndBill.xpsm`).
- [AutoIntegrate](https://github.com/jarmoruuth/AutoIntegrate) : opérateur `Selection` de MorphologicalTransformation et masque circulaire 5×5 ; formules de Bill Blanshan V2 ; paramètres de MultiscaleGradientCorrection.
- Les modèles de SPCC (*Average Spiral Galaxy*), GradientCorrection, GHS, CurvesTransformation, NarrowbandNormalization et l'usage de NoOperation comme icône-note avec description viennent aussi des fichiers de theAstroShed.
