# Modifier les icônes de process : le générateur

Tout est produit par `sh docs/process-icons/build/build.sh` ; ne jamais éditer à la main les `.xpsm`, `icones-*.md`.

## Fichiers

| Fichier | Rôle |
|---|---|
| `docs/process-icons/make_workflows.py` | Listes d'étapes `lrgb` et `lhargb` (et narrowband), réglages des icônes. |
| `docs/process-icons/layout.py` | `PHASE` (colonne P1 à P7), `OPT` (options), `role()` (core / opt / alternative), `WHEN` (texte « quand l'utiliser » d'une option), `CONTAINERS` (conteneurs C_ du chemin principal). |
| `docs/process-icons/short_desc.py` | Descriptions courtes : `S[base] = (PRÉRÉGLÉ, À RÉGLER, [SI ...])`, variantes par workflow dans `V[(prefix, base)]` (prefix `LRGB`, `LHA`, `NB`…). |
| `docs/process-icons/make_icons.py` | Construction des instances : `instance(cls, name, values, texts, post)` à partir d'un modèle réel (`build/templates.json`), `build(cls, version, name, params)` pour une classe sans modèle, `pixelmath(...)`. |
| `docs/process-icons/scripts/*.js` | Scripts de l'utilisateur (installés dans `src/scripts/clodoweg/`). |
| `docs/process-icons/build/kb_icons.py` | Écrit `docs/kb/icones-<workflow>.md` (LRGB, LHaRGB, RGB-SHO, SHO-sans-RGB, HOO) depuis les xpsm. |
| `docs/process-icons/workflows/Conteneurs-LRGB.xpsm`, `Conteneurs-LHaRGB.xpsm` | Les fichiers que l'utilisateur charge dans PixInsight. |

## Briques de `make_workflows.py`

- Une étape = `(item, description)` ; `item = (nom, xml)`. Le nom de base (`GHS_1_premier`) sert de clé partout (layout, short_desc).
- `SCRIPTS[nom] = (chemin, md5, [(param, valeur)], L_DRAG ou L_GLOBAL)` ; `script(nom, '')` crée l'icône Script.
- `note(nom, texte)` : icône NoOperation (icône-note), sauf si `nom` est dans `SCRIPTS`.
- `pm(nom, expr_R_ou_unique, expr_G, expr_B, symbols=..., new_image=..., new_id=...)` : PixelMath.
- `M.instance('Classe', nom, {param: valeur})`, `M.build('Classe', 256, nom, [(id, valeur, 'v'|'t')])`.
- `ghs(nom, b, hp, lp, sf, sp)`, `curves(...)`, `M.bxt`, `M.nxt`, `M.sxt`, `M.spfc`, `M.mgc`.
- `cont(nom, [items])` ou `_cont` : ProcessContainer ; `fermer(icone, 'vue1, vue2')` : script Fermer_vues réglé.
- `pick(steps, base)`, `insert_after(steps, base, items)`, `insert_before(...)` : placer une icône dans une liste.
- `lum_block()` (GHS, MAS, SXT_RGB_etire, GHS_3_fond), `mas()`, `finish_block(galaxie=True)`, `sharp_mmt()`, `sharp_usm()`, `finition_saturee()`, `stars_end(...)`, `gradient_block(...)`, `pre_block()` : blocs communs.
- Mode rapide : `prep_rapide`, `lineaire_rapide(etapes)`, `rgb_etire_rapide`, `lrgb_rapide`, `fin_rapide` (R_C_Fin_rapide et R_C_Etoiles_fond_rapide) ; turbo : `turbo_debut`.

## LRGB : demander avant de toucher

Depuis le 5 octobre 2026 : si un changement toucherait aussi `Conteneurs-LRGB.xpsm`, donner d'abord à l'utilisateur la liste des impacts sur le LRGB ; il décide (voir CLAUDE.md). Changement LHaRGB seul : `lhargb`, `V[('LHA', base)]` dans `short_desc.py`, ou une copie de script ; contrôle `git diff --stat` vide sur `Conteneurs-LRGB.xpsm` et `icones-LRGB.md` après `build.sh`, sauf changement LRGB accepté.

## Ajouter ou modifier une icône (check-list)

1. Réglage vérifié par des sources (règle de CLAUDE.md) ; identifiants de paramètres et version de classe relevés dans la PCL (`https://gitlab.com/api/v4/projects/pixinsight%2FPCL/repository/files/<chemin>/raw?ref=master`) ou dans le code du script.
2. `make_workflows.py` : l'item dans `lrgb` et/ou `lhargb`, à sa place ; nouveau script → entrée `SCRIPTS` + fichier dans `scripts/`.
3. `layout.py` : `PHASE[base]` ; si option : `OPT` et `WHEN[base]` ; si dans un conteneur du chemin principal : `CONTAINERS`.
4. `short_desc.py` : `S[base]` (et `V` si le texte change selon le workflow). Mettre aussi à jour les descriptions des icônes et conteneurs qui la citent.
5. `sh docs/process-icons/build/build.sh`, puis contrôle de `docs/kb/icones-*.md` ; scripts JS : `node --check` ou le vérificateur de syntaxe.
6. Mettre à jour les fichiers de `docs/kb/` concernés (workflows, outils), `docs/sources.md`, CLAUDE.md si l'état change.
7. Commit + push sur main.

## Scripts avec fenêtre de réglages (tous les scripts, demande de l'utilisateur, 5 octobre 2026)

Règle : chaque script a une fenêtre, mise à jour à chaque changement du script.
- Fichier commun `scripts/clodoweg_ui.jsh` (inclus par `#include "clodoweg_ui.jsh"`, à copier avec les scripts) : `cwParam`, `cwBool`, `cwWantsDialog()`, `cwDefaultView(id)`, `cwApplyOnCopy(view, fn)`, `cwRun(titre, fn)`, et `CWDialog(titre, aide, libellé le plus long)` avec `numeric`, `check`, `edit`, `viewList`, `combo`, `info`, `group`/`endGroup`, `button`, `onExport`, `validate`, `finish(texte OK)`.
- Lancement : `cwWantsDialog()` est faux si l'icône est glissée sur une image (`Parameters.isViewTarget`) ou si le paramètre `dialogue = false` (ajouté par `no_dialog()` du générateur à tout script de la fiche placé dans un conteneur) : exécution directe, comme avant. Sinon (double-clic puis Apply Global, menu Script) : fenêtre pré-remplie avec les paramètres de l'icône ; triangle = `Parameters.set` puis `newInstance()`.
- Lancé par la fenêtre, un `executeOn(view)` modifie l'image sans étape d'annulation ni rafraîchissement (retour de l'utilisateur) : les scripts qui changent les pixels d'une image passent par `cwApplyOnCopy(view, fn, blend)` : copie cachée sans masque (PixelMath `$T` sur view), `fn(copie)`, puis résultat recalculé par un PixelMath EXÉCUTÉ SUR view (`createNewImage`, expression = copie ou `blend(id)`), recopié entre `beginProcess` / `image.assign` / `endProcess`. Schéma validé sur Etoiles_grosses ; la recopie directe de la copie traitée ne s'affichait pas et n'avait pas de Ctrl+Z (Sharp_MMT, retour de l'utilisateur). `cwMaskBlend(view)` : mélange `m*copie + (1-m)*$T` selon le masque attaché (Sharp_MMT, sous Masque_L). Sharp_MMT passe toujours par ce chemin, glissé ou non (sans cela, pas de Ctrl+Z dans C_Sharp_MMT glissé, retour de l'utilisateur, 8 octobre 2026). Exceptions, laissées en `executeOn` direct : Binning_x2 (géométrie et solution astrométrique), LPS_UnClic (moteur LPS), Lineaire_auto (icônes avec SPCC, qui a besoin de la solution astrométrique), GC_Solver_auto et ImageSolver_Date (métadonnées).
- Moteur v8 (GC_Solver_auto, ImageSolver_Date, qui incluent ImageSolver) : `#define CLODOWEG_V8` AVANT `#include "clodoweg_ui.jsh"` ; le fichier commun saute alors pjsr/Sizer.jsh, TextAlign.jsh, NumericControl.jsh (sinon « Identifier 'HorizontalSizer' has already been declared », retour de l'utilisateur), écrit l'alignement `TextAlignment.Right` et définit CWDialog en `class extends Dialog`. Pas de `numeric()` dans ces deux scripts.
- Vérification locale : préprocesseur minimal + `node --check` pour chaque script (les deux variantes du fichier commun).
- Etoiles_grosses.js a sa propre fenêtre (première version validée par l'utilisateur), même logique.
- Description de l'icône : texte de lancement `LAUNCH_DLG` (tout script dont le chemin contient `/clodoweg/`).

## Contraintes PixInsight

- Un conteneur de process natifs (MAS, SXT, BXT, GHS…) se GLISSE sur l'image : lancé par le rond Apply Global, PixInsight refuse (« Cannot execute instance in the global context », retour de l'utilisateur). Se lancent en Apply Global seulement les icônes faites de scripts : R_C_Preparation_rapide et T_Turbo_debut (avec Solver_auto), R_Gradient_auto_rapide, R_Lineaire_rapide. Les conteneurs portent une description (texte de lancement LAUNCH['cont'] ou LAUNCH['cont_global'] dans `short_desc.py`).

- Conteneur fait de scripts qui choisissent leurs vues (narrowband R_C_Lineaire_rapide : Lineaire_auto + Fermer_vues) : texte de lancement `LAUNCH['cont_scripts']` (Apply Global), choisi par `shorten()` sur le nom de base. Ne pas généraliser à « tout conteneur de scripts » : C_Sharp_MMT et C_P3_rapide (LHaRGB) se glissent.
- `layout.when()` : texte `WHEN_NB` en narrowband, sinon `WHEN` ; les icônes R_ et T_ l'utilisent aussi (`WHEN` peut ne pas avoir l'entrée d'un rapide narrowband).
- Deux icônes du même nom dans un fichier : PixInsight refuse (« Duplicate instance identifier », RGB + SHO, Opt_ImageSolver_seul en P2 et en P7, retour de l'utilisateur, 8 octobre 2026). `build.sh` s'arrête maintenant sur un identifiant en double ; une option déjà placée ne se remet pas dans un autre bloc.
- Un script ne peut pas lancer une instance Script ; un ProcessContainer peut enchaîner des scripts. `ProcessInstance.fromIcon(id)` exécute une icône de process natif.
- `#engine v8` (ImageSolver) casse l'ancien code (`PixelMath.prototype.RGB`, LinearPatternSubtraction.jsh).
- ImageSolver échoue sur l'image glissée dans un conteneur : conteneurs avec Solver_auto en Apply Global.
- Jamais de guillemets dans un paramètre de Script. Pas d'espace dans les noms.
- Instance native : `<instance class="X" version="256">`, `<parameter id="p" value="v"/>`, enums par identifiant d'élément (ex. `RelativeDimensions`). Paramètre absent : valeur par défaut (supposé, non vérifié).
- IntegerResample et Resample mettent à jour la solution astrométrique.
- Retours à la ligne des descriptions écrits `&#10;` (fait par `save()`) : un CR (fichier converti en CRLF par git sous Windows) s'affiche mal dans PixInsight, lignes inversées et vides en haut (test de l'utilisateur, 5 octobre 2026 : LF, `&#10;`, `<br>` et U+2028 marchent ; CR et CRLF non). `.gitattributes` force LF pour .xpsm et .js.
- PixelMath écrit DIRECTEMENT dans l'image cible (createNewImage = false) avec des références à des images cachées : « *** Error: Unknown error » sur RGB_stars glissée (Saturation_grosses, retour de l'utilisateur, 5 octobre 2026). Toujours calculer le résultat dans une nouvelle image cachée (PixelMath exécuté sur la vue, createNewImage) puis `view.beginProcess(); view.image.assign(...); view.endProcess();`, aussi quand l'icône est glissée. Fait dans Saturation_grosses et Etoiles_grosses.
- Options retirées des galaxies : `SUPPR_GALAXIES` (fin de make_workflows.py) filtre lrgb et lhargb après toutes les insertions (Etoiles_grosses, Etoiles_plafond, gardées en narrowband) ; les autres options supprimées n'ont plus de code.
- Mode Turbo : `TURBO` (make_workflows.py) = icônes T_ rangées dans le groupe P#_turbo de leur colonne. `turbo_debut(steps)` : conteneur des étapes de C_Preparation_rapide, Gradient_auto_rapide et Lineaire_rapide (mêmes items, pas de conteneur imbriqué), inséré après C_Preparation_rapide (colonne P1), Apply Global (contient Solver_auto).
- Script lancé sur une vue cible (icône glissée ou conteneur glissé) : la vue cible est déjà « en cours de traitement » ; `targetView.beginProcess()` y échoue (« The image is already being processed », CombineHaToRGB, retour de l'utilisateur). Saturation_grosses (beginProcess sur RGB_stars) marche pourtant chez l'utilisateur en LRGB (retour du 5 octobre 2026) : ne pas le changer sans problème signalé. Sur la vue cible, si l'erreur apparaît : modifier `view.image` directement, sans beginProcess (à vérifier).

## Ctrl+Z dans les rapides narrowband (revue du code, 8 octobre 2026, demande de l'utilisateur)

Aucun test dans PixInsight. Règle : process natif lancé sur une vue (executeOn, hors fenêtre de script) ou recopie par cwApplyOnCopy (beginProcess / assign / endProcess) = étape d'historique, annulable ; fermeture (Fermer_vues, forceClose) = jamais annulable.
- R_Gradient_auto_rapide : GradientCorrection par executeOn, annulable image par image.
- R_C_MAS_canaux_rapide : MAS par executeOn (Lineaire_auto), annulable canal par canal.
- R_C_Palette_rapide : NBN_SHO annulable sur SHO_etire ; S, H, O restent ouverts.
- R_C_RGB_etoiles_rapide : SCNR vert (Etoiles_auto, executeOn) annulable sur RGB_stars ; MAS et SXT faits sur RGB, fermé ensuite.
- R_C_Fin_rapide, R_C_Etoiles_fond_rapide (glissés) : natifs + Sharp_MMT (cwApplyOnCopy aussi quand il est glissé, depuis le 8 octobre 2026 : C_Sharp_MMT n'avait pas de Ctrl+Z, retour de l'utilisateur) et Fond_desature par cwApplyOnCopy, Fond_auto par executeOn : annulables (plusieurs Ctrl+Z, une étape par process) ; Export_TIFF travaille sur une copie.
- R_C_Preparation_rapide, T_Turbo_debut, R_C_Lineaire_rapide : masters fermés (Combiner_RGB, Fermer_vues) : pas de retour arrière, recharger les masters. LPS_UnClic : écriture faite par le moteur LinearPatternSubtraction.jsh, annulation non vérifiée.

## Dossier de l'objet (8 octobre 2026)

`scripts/clodoweg_objet.jsh` (commun à Renommer_auto et Export_TIFF) : `cwObjectDirFromWindows()` (dossier des masters ouverts, dossiers génériques sautés), `cwSaveObjectDir` / `cwSavedObjectDir` (réglage PixInsight `clodoweg/objectDir`, `Settings` + `DataType_String`). Renommer_auto retient le dossier au début du traitement ; Export_TIFF le relit si aucune image ouverte n'a de fichier (narrowband : masters fermés par les rapides ; avant : export dans le dossier personnel sous le nom de la vue, retour de l'utilisateur). LRGB et LHaRGB : même résultat (L reste ouverte), changement accepté par l'utilisateur (« oui »).
- Revue du 8 octobre 2026 (demande de l'utilisateur : « vérifie s'il y en a d'autres comme ça dans tous les process », après Sharp_MMT) : un executeOn direct sur l'image finale, sans fenêtre, peut ne pas donner de Ctrl+Z. Passés en cwApplyOnCopy dans tous les cas : Sharp_MMT, Fond_auto (P7, R_C_Etoiles_fond_rapide), Etoiles_auto (SCNR_etoiles_vert / violet, R_C_RGB_etire_rapide, R_C_RGB_etoiles_rapide), Nettoyage_sans_etoiles, Gradient_auto (R_Gradient_auto_rapide, turbos). Déjà bons : Fond_desature, Saturation_grosses, Etoiles_grosses, Export_TIFF (copie). Laissés en executeOn direct (non testés) : Lineaire_auto (lance des icônes natives, dont SXT et des PixelMath qui créent des images), Binning_x2 et Crop_appliquer (géométrie et astrométrie), LPS_UnClic (moteur PixInsight), Masque_auto (crée le masque, ne touche pas l'image). Process natifs des conteneurs glissés : historique normal de PixInsight.
