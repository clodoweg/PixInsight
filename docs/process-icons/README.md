# Icônes de process PixInsight

Icônes prêtes à charger, réglages expliqués dans `docs/kb/`. Ce sont des **valeurs de départ** à ajuster sur tes images.

## Charger

1. Prends le fichier voulu dans `workflows/` (`Conteneurs-LRGB.xpsm`, `Conteneurs-LHaRGB.xpsm`, `Conteneurs-RGB-SHO.xpsm`, `Conteneurs-SHO-sans-RGB.xpsm`, `Conteneurs-HOO.xpsm`).
2. PixInsight : clic droit sur l'espace de travail › *Process Icons* › *Load Process Icons*.
3. Copie une fois tous les scripts de `scripts/` dans `src/scripts/clodoweg/` de PixInsight.

## Organisation

- Une colonne par phase (P1 Préparation … P7 Étoiles), avec une icône-titre en haut.
- Dans chaque colonne : `P#_Nom` (chemin principal, `E##_`), `P#_options` (`Opt_`), `P#_rapide` (`R_`) et `P#_turbo` (`T_`, plusieurs rapides à la suite).
- Dans le chemin principal, les suites d'étapes sans réglage sont regroupées en conteneurs (`C_…`).
- Chaque icône a une description courte : LANCEMENT, PRÉRÉGLÉ, À RÉGLER, SI … ->.
- LRGB et LHaRGB : L sans étoiles étirée par GHS, RGB étiré par MAS avec ses étoiles puis SXT (RGB_stars), LRGB sur les deux images sans étoiles, étoiles remises à la fin ; les images inutiles sont fermées au fur et à mesure. Ordre détaillé : `docs/Diagrammes-workflows.html`.
- SPCC et SPFC sont configurés pour le QHY600 et les filtres Antlia V Pro ; GHS_1 et DBE se règlent sur l'image.

Icônes non testées par Claude dans PixInsight 1.9.5 : si l'une ne se charge pas, signale-la.

## Scripts (`scripts/`)

Tous à copier dans `src/scripts/clodoweg/` de PixInsight (`maj_pc.bat` le fait). Chaque script a une fenêtre de réglages (double-clic sur l'icône, puis Apply Global) ; glissé sur une image ou dans un conteneur, il s'exécute directement.

| Script | Rôle |
|---|---|
| `clodoweg_ui.jsh` | fenêtres de réglages et fonctions communes à tous les scripts (à copier avec eux) |
| `clodoweg_objet.jsh` | dossier de l'objet (dossier des masters), commun à Renommer_auto et Export_TIFF |
| `Renommer_auto.js` | renomme les masters L, R, G, B, H, O, S d'après FILTER, le nom du fichier ou de la vue (V -> G) ; ferme les vues *autocrop* en doublon |
| `LPS_UnClic.js` | LinearPatternSubtraction sans dialogue sur tous les masters mono ouverts |
| `Combiner_RGB.js` | R, G, B → `RGB`, en-tête du rouge copié ; ferme les masters (`garder` pour en garder) |
| `GC_Solver_auto.js` | ImageSolver sur toutes les images, ou les images couleur seulement (icône Solver_auto) |
| `ImageSolver_Date.js` | date ajoutée si absente, puis ImageSolver avec les réglages du matériel (catalogue en ligne Gaia DR2) |
| `Crop_commun.js` | crop commun : image minimum Crop_ref + DynamicCrop (`mode=reference`), puis même crop sur toutes les images (`mode=appliquer`) |
| `Binning_x2.js` | binning logiciel 2×2 de toutes les images ouvertes (solution astrométrique gardée) |
| `Gradient_auto.js` | GradientCorrection seule sur toutes les images (R_Gradient_auto_rapide), ou GraXpert avec `outil=graxpert` (R_Gradient_auto_graxpert_rapide) |
| `Lineaire_auto.js` | lance des icônes du chemin principal sur des vues données (rapides et turbos) |
| `Stat_canaux.js` | Statistical Stretch sur plusieurs canaux mono (S, H, O) en un clic |
| `Etoiles_auto.js` | sur l'image d'étoiles : SCNR vert (SCNR_etoiles_vert), anti-violet (SCNR_etoiles_violet), saturation, étirement si amount > 0 |
| `Etoiles_NB_auto.js` | étoiles RGB plausibles à partir des étoiles narrowband (SHO sans RGB, HOO) |
| `Saturation_grosses.js` | sature seulement les grosses étoiles presque blanches de RGB_stars |
| `Etoiles_grosses.js` | réduit seulement les grosses étoiles de l'image d'étoiles, avant la recombinaison |
| `Masque_auto.js` | masque de luminance masque_L : attacher, retirer, créer sans attacher (couleur = RGB pour les conteneurs), mélanger |
| `Sharp_MMT.js` | accentuation finale MultiscaleMedianTransform (C_Sharp_MMT) |
| `Nettoyage_sans_etoiles.js` | restes de halos des étoiles brillantes après SXT |
| `Fond_desature.js` | retire la teinte et le violet du fond |
| `Fond_auto.js` | fond de chaque canal amené à 0,12, neutre |
| `Look_Lightroom.js` | retouche finale façon Camera Raw / Lightroom (Exposition, Tons clairs, Blancs, Température…) |
| `Export_TIFF.js` | TIFF 16 bits sRGB nommé d'après le dossier des masters (aucune vue fermée) |
| `Fermer_vues.js` | ferme les vues listées (`views`, `*` = toutes) |

## Régénérer

`sh docs/process-icons/build/build.sh` : icônes et `docs/kb/icones-*.md`. Générateurs : `make_workflows.py` (étapes par workflow, conteneurs rapides), `layout.py` (phases, rôles, conteneurs), `short_desc.py` (descriptions), `make_icons.py` (instances). Le dossier `build/` contient les modèles d'instances (`templates.json`, `all.x`, `FromLukeAndBill.xpsm`, issus des icônes de theAstroShed, licence Apache 2.0 dans `LICENSE-theAstroShed-icons`), la référence des icônes (`kb_icons.py`) et un audit des réglages (`audit_icons.py`).

## Sources

- [theAstroShed, icônes de process](https://github.com/jamiesmith/pixinsight-icons) : fichiers `.xpsm` de PixInsight 1.9.3 utilisés comme modèles (paramètres, versions, énumérations, format des conteneurs) ; formules Foraxx ; formules de Bill Blanshan V3.
- [AutoIntegrate](https://github.com/jarmoruuth/AutoIntegrate) : paramètres de SPFC, MGC et DBE (pas de modèle `.xpsm` public), courbes de filtres et de capteur (`spfc_curves.json`), MorphologicalTransformation, formules de Bill Blanshan V2.
- Scripts SetiAstro : chemins et empreintes MD5 de l'archive `SetiAstroScripts09.19.2026.zip`. Liste complète : `docs/sources.md`.
