# Modifier les icônes de process : le générateur

Tout est produit par `sh docs/process-icons/build/build.sh` ; ne jamais éditer à la main les `.xpsm`, `icones-*.md`, `scripts/Turbo_1.js`, `scripts/Turbo_2_debut.js`.

## Fichiers

| Fichier | Rôle |
|---|---|
| `docs/process-icons/make_workflows.py` | Listes d'étapes `lrgb` et `lhargb` (et narrowband), réglages des icônes, conteneurs rapides et Turbo, scripts Turbo générés. |
| `docs/process-icons/layout.py` | `PHASE` (colonne P1 à P7), `OPT` (options), `role()` (core / opt / alternative), `WHEN` (texte « quand l'utiliser » d'une option), `CONTAINERS` (conteneurs C_ du chemin principal). |
| `docs/process-icons/short_desc.py` | Descriptions courtes : `S[base] = (PRÉRÉGLÉ, À RÉGLER, [SI ...])`, variantes par workflow dans `V[(prefix, base)]` (prefix `LRGB`, `LHA`, `NB`…). |
| `docs/process-icons/make_icons.py` | Construction des instances : `instance(cls, name, values, texts, post)` à partir d'un modèle réel (`build/templates.json`), `build(cls, version, name, params)` pour une classe sans modèle, `pixelmath(...)`. |
| `docs/process-icons/scripts/*.js` | Scripts de l'utilisateur (installés dans `src/scripts/clodoweg/`). |
| `docs/process-icons/build/kb_icons.py` | Écrit `docs/kb/icones-LRGB.md` et `icones-LHaRGB.md` depuis les xpsm. |
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
- `lum_ghs_block`, `finish_block(galaxie=True)`, `stars_end(...)`, `gradient_block(...)`, `pre_block()` : blocs communs.
- Mode rapide : `prep_rapide`, `rgb_rapide`, `l_rapide`, `lrgb_rapide`, `fin_rapide` ; Turbo : conteneurs `Turbo_1`, `Turbo_2` et gabarits `TURBO1_JS`, `TURBO2_DEBUT_JS`.

## Ajouter ou modifier une icône (check-list)

1. Réglage vérifié par des sources (règle de CLAUDE.md) ; identifiants de paramètres et version de classe relevés dans la PCL (`https://gitlab.com/api/v4/projects/pixinsight%2FPCL/repository/files/<chemin>/raw?ref=master`) ou dans le code du script.
2. `make_workflows.py` : l'item dans `lrgb` et/ou `lhargb`, à sa place ; nouveau script → entrée `SCRIPTS` + fichier dans `scripts/`.
3. `layout.py` : `PHASE[base]` ; si option : `OPT` et `WHEN[base]` ; si dans un conteneur du chemin principal : `CONTAINERS`.
4. `short_desc.py` : `S[base]` (et `V` si le texte change selon le workflow). Mettre aussi à jour les descriptions des icônes et conteneurs qui la citent.
5. `sh docs/process-icons/build/build.sh`, puis contrôle de `docs/kb/icones-*.md` ; scripts JS : `node --check` ou le vérificateur de syntaxe.
6. Mettre à jour les fichiers de `docs/kb/` concernés (workflows, outils), `docs/sources.md`, CLAUDE.md si l'état change.
7. Commit + push sur main.

## Contraintes PixInsight

- Un script ne peut pas lancer une instance Script ; un ProcessContainer peut enchaîner des scripts. `ProcessInstance.fromIcon(id)` exécute une icône de process natif.
- `#engine v8` (ImageSolver) casse l'ancien code (`PixelMath.prototype.RGB`, LinearPatternSubtraction.jsh).
- ImageSolver échoue sur l'image glissée dans un conteneur : conteneurs avec Solver_auto en Apply Global.
- Scripts inclus dans Turbo : gardes `#ifndef CLODOWEG_TURBO`, noms de fonctions uniques.
- Jamais de guillemets dans un paramètre de Script. Pas d'espace dans les noms.
- Instance native : `<instance class="X" version="256">`, `<parameter id="p" value="v"/>`, enums par identifiant d'élément (ex. `RelativeDimensions`). Paramètre absent : valeur par défaut (supposé, non vérifié).
- IntegerResample et Resample mettent à jour la solution astrométrique.
- Retours à la ligne des descriptions écrits `&#10;` (fait par `save()`) : un CR (fichier converti en CRLF par git sous Windows) s'affiche mal dans PixInsight, lignes inversées et vides en haut (test de l'utilisateur, 5 octobre 2026 : LF, `&#10;`, `<br>` et U+2028 marchent ; CR et CRLF non). `.gitattributes` force LF pour .xpsm et .js.
