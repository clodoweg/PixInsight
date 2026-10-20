---
name: maj-kb
description: Met à jour la base de connaissances (docs/kb/ et docs/sources.md) à partir des sources déjà notées, et cherche des sources plus récentes (nouvelles versions d'outils, tutoriels, annonces). À utiliser quand l'utilisateur demande de vérifier, rafraîchir ou mettre à jour la base, les sources, ou de chercher du nouveau sur un outil (BXT, NXT, SXT, GHS, MAS, SPCC, NarrowbandNormalization, scripts SetiAstro…). Argument facultatif : un sujet (« narrowband », « GHS », « BXT »…) ; sans argument : la section « Non vérifié » et les sources les plus anciennes.
---

# Mise à jour de la base de connaissances par les sources

Demande de l'utilisateur (20 octobre 2026) : « crée un skill qui met a jour la base de connaissance en fonction des sources, et qui cheche aussi s'il existe des sources plus recentes ».

Réponds en français, en textes courts et simples (règles de `CLAUDE.md`).

## 0. Préparer

1. `git pull -q origin main` (d'autres sessions modifient le dépôt).
2. Lis `docs/kb/README.md`, puis `docs/sources.md` en entier.
3. Choisis le périmètre :
   - avec un argument (ex. « GHS ») : les rubriques de `docs/sources.md` et les fichiers de `docs/kb/` qui en parlent (`grep -n -i` sur le mot) ;
   - sans argument : la section « Non vérifié » de `docs/sources.md`, puis les rubriques des outils réellement utilisés par les icônes (voir `docs/kb/icones-*.md`).
   Si le périmètre est grand (plus d'une dizaine de sources), fais-le par rubrique et dis à l'utilisateur ce qui reste.

## 1. Revérifier les sources déjà notées

Pour chaque source du périmètre :

1. Ouvre-la (WebFetch ; code de script : dépôt GitHub ou archive de l'auteur). Page inaccessible → garde-la avec *(résumé)* et dis-le.
2. Compare avec ce que dit `docs/kb/` (valeur, ordre des étapes, formule, URL, nom de paramètre).
3. Classe le résultat : **confirmé**, **changé** (la source dit autre chose qu'avant), **disparu** (lien mort : cherche la nouvelle adresse).

## 2. Chercher des sources plus récentes

Pour chaque outil du périmètre, cherche (WebSearch, mode `standard` d'abord, `extended` si le résultat est maigre ou ancien) :

- **nouvelle version** de l'outil et ses notes de version : PixInsight (pixinsight.com, forum « Announcements »), RC Astro (BXT, NXT, SXT : rc-astro.com, pages de versions), GHS (ghsastro.co.uk), scripts SetiAstro (GitHub setiastro), MAS, SPCC, MGC / MARS, NarrowbandNormalization, Toolbox ;
- **documentation officielle** plus récente que celle notée ;
- **tutoriels reconnus** publiés après la date notée (Adam Block, Ron Brecher, Dave Cosgrove, theAstroShed, Seti Astro, Pixinsight.com tutorials…), puis les forums.

Mots de recherche utiles : nom de l'outil + « release notes », « new version », « 2026 », nom du paramètre.

Pour chaque nouveauté trouvée : lis-la, note ce qui change pour l'utilisateur (PixInsight 1.9.5 sur PC Windows, CDK17 + QHY600, filtres Antlia : voir `CLAUDE.md`).

## 3. Recouper

Règles de `CLAUDE.md` « Valider avec des sources avant d'insérer » :

- deux sources quand c'est possible ; officiel d'abord, puis tutoriel, puis forum ;
- si elles divergent : le dire et donner la position de l'éditeur ;
- une valeur qui reste non vérifiée est marquée « non vérifié » dans `docs/kb/` et ajoutée à la section « Non vérifié » de `docs/sources.md`.

## 4. Mettre à jour la base (sans toucher aux icônes)

- `docs/sources.md` : pour chaque source revue, ajoute « (revue le JJ mois AAAA) » ; ajoute les nouvelles sources dans leur rubrique (type Officiel / Tutoriel / Forum, *(résumé)* si non ouverte) ; corrige les liens morts ; retire de « Non vérifié » ce qui est désormais vérifié (en disant par quelle source) ; mets à jour « Dernière mise à jour » en haut.
- `docs/kb/` : corrige le fichier thématique concerné (`outils.md`, `techniques.md`, `workflows.md`, `preparation.md`, `narrowband.md`, `generateur.md`). Ne modifie jamais les `icones-*.md` à la main : ils sont générés par `build.sh`.
- `docs/depots-pixinsight.txt` : ajoute un nouveau dépôt de mise à jour s'il en faut un (une URL par ligne).

**Les icônes ne changent pas dans ce skill.** Si une source nouvelle suggère un autre réglage, un autre ordre ou un nouvel outil pour une icône : liste-le dans le rapport comme proposition. Méthode de l'utilisateur : analyse et sources d'abord, puis il choisit, puis on modifie (avec la règle LRGB / LHaRGB de `CLAUDE.md` : lister les impacts et demander avant).

## 5. Publier

Si des fichiers ont changé : commit en français avec les lignes d'attribution de la session, puis `git push origin main` (et la branche de la session si `CLAUDE.md` ou la session en donne une). Pas de `build.sh` nécessaire tant que le générateur n'a pas changé.

## 6. Rapport à l'utilisateur

Court, en quatre parties :

1. **Vérifié** : ce qui est confirmé (nombre de sources, sujets).
2. **Nouveau** : versions ou sources récentes trouvées, avec la date et ce qu'elles changent.
3. **Diverge** : les désaccords entre sources, et la position de l'éditeur.
4. **Non vérifié / à décider** : ce qui reste non vérifié, et les changements d'icônes proposés (l'utilisateur choisit).
