# PixInsight : mes icônes de process

Icônes de process PixInsight pour mes galaxies (LRGB, LHaRGB) et mes nébuleuses (RGB + SHO, SHO sans RGB, HOO), avec leur générateur et la base de connaissances de Claude.

## Les 3 skills à utiliser avec Claude

À taper dans une session Claude Code ouverte sur ce dépôt. Aucun ne change les icônes tout seul : ils informent et proposent, puis tu choisis.

| Commande | Quand l'utiliser | Ce que tu obtiens |
|---|---|---|
| `/veille` | De temps en temps (tous les 3 à 6 mois), pour savoir ce qui est sorti | Rapport des nouveautés de l'année (PixInsight, autres logiciels, méthodes publiées), comparées à ta façon de faire, avec des propositions numérotées. Rapport dans `docs/veille/`. Variantes : `/veille narrowband`, `/veille étoiles`, `/veille 6 mois` |
| `/maj-kb` | Pour vérifier que la base de Claude est toujours juste (après une mise à jour d'outil, ou avant de toucher un réglage) | Sources revérifiées, nouvelles versions des outils, liens morts corrigés, et un rapport en 4 parties : vérifié, nouveau, diverge, à décider. Variante sur un sujet : `/maj-kb GHS`, `/maj-kb BXT` |
| `/maj-diagrammes` | Après un changement d'icônes, ou si les diagrammes te semblent faux | Page `docs/Diagrammes-workflows.html` refaite d'après les icônes actuelles, avec la vérification qu'aucune icône ne manque |

Ensuite, réponds simplement à Claude avec ce que tu veux garder (par exemple « 1, 3, 5 » après une veille).

## Mettre à jour le PC ou le Mac

- **PC** : double-clic sur `maj_pc.bat` (récupère le dépôt et copie les scripts dans PixInsight).
- **Mac** : double-clic sur `maj_mac.command` (dans le Terminal : `./maj_mac.command`).
- Puis, dans PixInsight, recharge le fichier d'icônes du workflow : `docs/process-icons/workflows/Conteneurs-LRGB.xpsm`, `Conteneurs-LHaRGB.xpsm`, `Conteneurs-RGB-SHO.xpsm`, `Conteneurs-SHO-sans-RGB.xpsm` ou `Conteneurs-HOO.xpsm`.
- Une icône de script refusée après une mise à jour : double-clic dessus, efface le champ MD5, enregistre l'icône.

## Où trouver quoi

- `docs/Diagrammes-workflows.html` : les diagrammes de tous les workflows (à ouvrir dans un navigateur).
- `docs/veille/` : les rapports de veille.
- `docs/depots-pixinsight.txt` : les dépôts à ajouter dans PixInsight (Resources › Updates › Manage Repositories).
- `docs/kb/` et `docs/sources.md` : la base de connaissances de Claude et ses sources.
- `docs/process-icons/scripts/` : les scripts clodoweg (liste et rôle de chacun dans `docs/process-icons/README.md`).
- `docs/process-icons/` : le générateur des icônes (c'est Claude qui le modifie).
