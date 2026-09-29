# Icônes de process PixInsight

Icônes prêtes à charger, avec les réglages de la fiche `docs/pixinsight-workflow.html`. Ce sont des **valeurs de départ** : ajuste-les sur tes images.

## Charger les icônes

1. Télécharge le fichier `.xpsm` voulu.
2. Dans PixInsight : clic droit sur l'espace de travail › *Process Icons* › *Load Process Icons* (ou *Merge Process Icons* pour les ajouter à tes icônes existantes), puis choisis le fichier.
3. Double-clique sur une icône pour ouvrir le process avec ses réglages, ou glisse-la sur une image pour l'appliquer directement.

Les fichiers n'ont pas été testés dans PixInsight avant publication : ils ont été construits à partir d'icônes réelles générées par PixInsight 1.9.3 (voir Sources), en ne changeant que les valeurs. Si une icône ne se charge pas, signale-le.

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
| `NBN_SHO` / `NBN_HOO` | NarrowbandNormalization, palette SHO ou HOO, valeurs par défaut, sur l'image combinée étirée sans étoiles |
| `CC_auto_WBPP` | Auto detect, Hot sigma 2,5, Cold désactivé ; à sélectionner comme modèle dans WBPP |

Les process qui dépendent de ton matériel ou de ton image (WBPP, SPCC, SPFC, DBE, MGC, GHS) sont dans les fichiers par workflow ci-dessous.

## Un fichier par workflow (dossier `workflows/`)

Chaque fichier contient **tous les process du workflow, dans l'ordre**, numérotés (`LRGB_01_WBPP`, `LRGB_02_CC_auto`…) et disposés en colonnes de haut en bas. **Chaque icône porte une description détaillée** : réglages, vues attendues, quand l'appliquer et pourquoi. Pour la lire dans PixInsight, survole l'icône ou ouvre-la (champ *Description*).

| Fichier | Icônes | Contenu |
|---|---|---|
| `Workflow-LRGB.xpsm` | 29 | Prétraitement, combinaison RGB, gradient, BXT Correct Only, SPCC, BXT, SXT linéaire, NXT, GHS, LRGBCombination, finition, étoiles |
| `Workflow-LHaRGB.xpsm` | 34 | LRGB + soustraction du continuum, Ha dans le rouge et dans L, NBRGBCombination en alternative |
| `Workflow-RGB-SHO.xpsm` | 40 | Masters narrowband, LinearFit, combinaison SHO simple, BXT, SXT, extraction des canaux, palettes (NarrowbandNormalization, Foraxx, NBColourMapper), étoiles RGB |
| `Workflow-SHO-sans-RGB.xpsm` | 39 | Idem sans RGB, avec étoiles narrowband (NB to RGB Star Combination, étoiles HOO synthétiques, CorrectMagentaStars) |
| `Workflow-HOO.xpsm` | 37 | Extraction dual-band pour caméra couleur, combinaison HOO, NarrowbandNormalization HOO, Foraxx HOO, variante Hubble, Ha en luminance |

**Trois sortes d'icônes :**

- **Process réglés** : s'appliquent directement (PixelMath, BlurXTerminator, NoiseXTerminator, StarXTerminator, LRGBCombination, LinearFit, SCNR, LHE, HDRMT, MorphologicalTransformation, CurvesTransformation, GradientCorrection, NarrowbandNormalization SHO et HOO, CosmeticCorrection).
- **Process à compléter sur ton image ou ton matériel** :
  - `SPCC` : réglé sur *Average Spiral Galaxy* avec neutralisation du fond, mais il contient les filtres Astrodon E-series et le capteur Sony IMX571 de l'auteur du modèle. **Remplace-les par les tiens.**
  - `GHS_1_premier`, `GHS_2_contraste`, `GHS_3_fond` : Local intensity et protections réglés, mais **Stretch factor à 0 et SP à choisir sur ton image** (l'icône ne fait rien tant que tu ne l'as pas réglée).
  - `Courbes` : légère courbe en S et saturation, à ajuster à l'œil.
- **Icônes-notes** (process *NoOperation*, sans effet) : pour les étapes qui ne peuvent pas être enregistrées de façon portable, la description donne tous les réglages. Ce sont WBPP, DynamicCrop, ImageSolver, SPFC + MGC (base MARS), DBE, et les scripts SetiAstro et CorrectMagentaStars (le chemin et l'empreinte du script dépendent de ton installation).

ChannelCombination et ChannelExtraction sont remplacés par des icônes PixelMath équivalentes (par exemple `$T[1]` pour extraire le canal vert).

Les fichiers ont été générés par `make_workflows.py` (dans ce dossier) à partir des modèles vérifiés.

## Sources

- [theAstroShed, icônes de process](https://github.com/jamiesmith/pixinsight-icons) : fichiers `.xpsm` générés par PixInsight 1.9.3, utilisés comme modèles (noms de paramètres, versions, valeurs d'énumération) ; formules Foraxx identiques ; formules de Bill Blanshan V3 (`FromLukeAndBill.xpsm`).
- [AutoIntegrate](https://github.com/jarmoruuth/AutoIntegrate) : opérateur `Selection` de MorphologicalTransformation et masque circulaire 5×5 ; formules de Bill Blanshan V2 ; paramètres de MultiscaleGradientCorrection.
- Les modèles de SPCC (*Average Spiral Galaxy*), GradientCorrection, GHS, CurvesTransformation, NarrowbandNormalization et l'usage de NoOperation comme icône-note avec description viennent aussi des fichiers de theAstroShed.
