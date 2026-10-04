# Icônes de process PixInsight

Icônes prêtes à charger, avec les réglages de la fiche `docs/pixinsight-workflow.html`. Ce sont des **valeurs de départ** à ajuster sur tes images.

## Charger

1. Prends le fichier voulu dans `workflows/` (`Conteneurs-LRGB.xpsm`, `Conteneurs-LHaRGB.xpsm`, `Conteneurs-RGB-SHO.xpsm`, `Conteneurs-SHO-sans-RGB.xpsm`, `Conteneurs-HOO.xpsm`), ou le fichier de ta photo fabriqué par le préparateur de la page (« Préparer ma photo »).
2. PixInsight : clic droit sur l'espace de travail › *Process Icons* › *Load Process Icons*.
3. Copie une fois tous les scripts de `scripts/` dans `src/scripts/clodoweg/` de PixInsight.

## Organisation

- Une colonne par phase (P1 Préparation … P7 Étoiles), avec une icône-titre en haut.
- Dans chaque colonne : `P#_Nom` (chemin principal, `E##_`), `P#_options` (`Opt_`), `P#_rapide` (`R_`, LRGB et LHaRGB) et `P#_turbo` (`T_`, LRGB).
- Dans le chemin principal, les suites d'étapes sans réglage sont regroupées en conteneurs (`C_…`).
- Chaque icône a une description courte : LANCEMENT, PRÉRÉGLÉ, À RÉGLER, SI … ->.
- LRGB et LHaRGB : L et RGB étirées avec leurs étoiles, LRGB, puis `SXT_LRGB` (Unscreen) ; les images inutiles sont fermées au fur et à mesure. Ordre détaillé : sections « Mode rapide » et workflows de la page.
- SPCC et SPFC sont configurés pour le QHY600 et les filtres Antlia V Pro ; GHS_1 et DBE se règlent sur l'image.

Icônes non testées par l'auteur dans PixInsight 1.9.5 : si l'une ne se charge pas, signale-la.

## Scripts (`scripts/`)

| Script | Rôle |
|---|---|
| `Renommer_auto.js` | renomme les masters L, R, G, B, H, O, S d'après FILTER |
| `LPS_UnClic.js` | LinearPatternSubtraction sans dialogue sur tous les masters mono ouverts |
| `Combiner_RGB.js` | R, G, B → `RGB`, en-tête du rouge copié ; ferme les masters (`garder` : R en LHaRGB) |
| `GC_Solver_auto.js` | GradientCorrection et/ou ImageSolver sur toutes les images (icônes Solver_auto et GC_Solver_auto_rapide) |
| `ImageSolver_Date.js` | date ajoutée si absente, puis ImageSolver avec les réglages du matériel |
| `Masque_auto.js` | Masque_L (crée et attache masque_L), Masque_retirer |
| `Etoiles_auto.js` | saturation et SCNR des étoiles (et étirement si amount > 0) |
| `Fond_auto.js` | fond de chaque canal amené à 0,12 (0,14 : Fond_auto_clair) |
| `Fond_desature.js` | retire la teinte et le violet du fond |
| `Nettoyage_sans_etoiles.js` | restes de halos des étoiles brillantes après SXT |
| `Export_TIFF.js` | TIFF 16 bits sRGB nommé d'après le dossier des masters ; ferme L ensuite (`fermer`) |
| `Fermer_vues.js` | ferme les vues listées (`views`) |
| `Turbo_1.js`, `Turbo_2_debut.js` | mode Turbo ; fichiers générés par `make_workflows.py` |

## Régénérer

`sh docs/process-icons/build/build.sh` : icônes, `preparer-data.json` et page. Générateurs : `make_workflows.py` (étapes par workflow, conteneurs rapides et Turbo), `layout.py` (phases, rôles, conteneurs), `short_desc.py` (descriptions), `make_icons.py` (instances). Le dossier `build/` contient les modèles d'instances (`templates.json`, `all.x`, `FromLukeAndBill.xpsm`, issus des icônes de theAstroShed, licence Apache 2.0 dans `LICENSE-theAstroShed-icons`), le préparateur (`prep_build.py`), la conversion page ↔ artifact (`page.py`) et un audit des réglages (`audit_icons.py`).

## Sources

- [theAstroShed, icônes de process](https://github.com/jamiesmith/pixinsight-icons) : fichiers `.xpsm` de PixInsight 1.9.3 utilisés comme modèles (paramètres, versions, énumérations, format des conteneurs) ; formules Foraxx ; formules de Bill Blanshan V3.
- [AutoIntegrate](https://github.com/jarmoruuth/AutoIntegrate) : paramètres de SPFC, MGC et DBE (pas de modèle `.xpsm` public), courbes de filtres et de capteur (`spfc_curves.json`), MorphologicalTransformation, formules de Bill Blanshan V2.
- Scripts SetiAstro : chemins et empreintes MD5 de l'archive `SetiAstroScripts09.19.2026.zip`. Liste complète : `docs/sources.md`.
