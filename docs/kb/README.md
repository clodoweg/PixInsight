# Base de connaissances PixInsight (pour Claude)

Source de référence pour répondre aux questions de l'utilisateur et modifier ses icônes de process. L'utilisateur ne la lit pas : elle doit être exacte, à jour et facile à chercher (grep).

## Où chercher

| Question | Fichier |
|---|---|
| Que fait l'icône X, ses réglages exacts, sa place, sa description | `icones-LRGB.md`, `icones-LHaRGB.md` (GÉNÉRÉS depuis les xpsm : toujours à jour) |
| Ordre des étapes, pourquoi, mode rapide, images fermées, finition, standards couleur et étoiles | `workflows.md` |
| Réglages d'un outil, symptôme → correction, méthode | `outils.md` |
| GHS en détail, réduction d'étoiles Blanshan, masques, règles d'or | `techniques.md` |
| Outils et dépôts à installer, WBPP, phase linéaire commune | `preparation.md` (dépôts : `../depots-pixinsight.txt`) |
| Narrowband (RGB + SHO, SHO, HOO), peu utilisé | `narrowband.md` |
| Modifier ou ajouter une icône : fichiers, fonctions, check-list, contraintes PixInsight | `generateur.md` |
| D'où vient une valeur, ce qui n'est pas vérifié | `../sources.md` |

## Utilisateur

PixInsight 1.9.5 sur PC Windows ; CDK17 (2 939 mm) + QHY600 (IMX455, 3,76 µm, 0,264″/px) ; filtres Antlia V Pro LRGB et Antlia 3 nm ; RC Astro (BXT, NXT, SXT), GHS. Une centaine de galaxies, masters déjà empilés. Utilise seulement `Conteneurs-LRGB.xpsm` et `Conteneurs-LHaRGB.xpsm`. Préférences : voir CLAUDE.md.

## Règles de mise à jour

- Toute modification d'icône : générateur, puis `build.sh` (régénère `icones-*.md`), puis le fichier thématique concerné ici, puis `sources.md`.
- Une valeur non vérifiée est marquée « non vérifié » ici et dans `sources.md`.
- Ordre de priorité si deux fichiers divergent : `icones-*.md` (ce que font vraiment les icônes) > `workflows.md` / `outils.md` > ancienne fiche HTML.
