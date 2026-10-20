---
name: veille
description: Veille du traitement d'images astro. Prépare un rapport de toutes les nouveautés des 12 derniers mois (année glissante) dans PixInsight et les autres outils (modules, scripts, IA, logiciels concurrents, méthodes publiées), puis les compare à la façon de faire de l'utilisateur (ses icônes et workflows) et propose des changements. À utiliser quand l'utilisateur demande une veille, les nouveautés, « quoi de neuf », ou des idées pour améliorer son traitement. Argument facultatif : un thème (« narrowband », « étoiles », « bruit »…) ou une durée (« 6 mois »).
---

# Veille : nouveautés de l'année glissante et propositions

Demande de l'utilisateur (20 octobre 2026) : « fais moi aussi un skill veille qui me prepare un rapport de toute les nouveauté en terme de traitement sur la derniere année glissante, avec pixinsight ou d'autres outils, et ensuite en fonction de comment je fais, de me proposer des choses ».

Réponds en français, en textes courts et simples (règles de `CLAUDE.md`). Ce skill ne modifie aucune icône : il informe et propose ; l'utilisateur choisit ensuite (méthode de l'utilisateur, règle LRGB / LHaRGB de `CLAUDE.md`).

## 0. Préparer

1. `git pull -q origin main`.
2. Période : les 12 mois avant la date du jour (ou la durée donnée en argument). Note les deux dates.
3. Lis ce que fait l'utilisateur, pour pouvoir comparer :
   - `CLAUDE.md` (matériel, préférences fixes, workflows LRGB, LHaRGB, narrowband) ;
   - `docs/kb/README.md`, `docs/kb/workflows.md`, `docs/kb/narrowband.md` ;
   - les outils réellement utilisés : `grep -h "^#### " docs/kb/icones-*.md` (classes de process, scripts).
4. Lis la dernière veille dans `docs/veille/` (s'il y en a une) : ne répète pas ce qui y est déjà, dis seulement ce qui a changé depuis.
5. Lis `docs/sources.md` (rubriques « Revue du … » et « Versions ») : ce qui est déjà connu n'est pas une nouveauté.

## 1. Chercher (en parallèle)

Lance 3 ou 4 sous-agents (outil Agent, `general-purpose`, en arrière-plan) avec la période, le matériel de l'utilisateur et la consigne : WebSearch puis WebFetch, ne modifier aucun fichier, donner pour chaque nouveauté la date, l'URL, si la page a été ouverte ou vue seulement en résumé. Thèmes :

1. **PixInsight** : versions et builds (pixinsight.net, forum Announcements), nouveaux process (ex. MAS, MLDenoise), modules tiers (RC Astro BXT / NXT / SXT, GHS, Cosmic Photons, SetiAstro, Toolbox, VeraLux, EZ Processing…), nouveaux dépôts (`docs/depots-pixinsight.txt`).
2. **Autres outils** : Siril, GraXpert, Seti Astro Suite Pro, StarTools, Astro Pixel Processor, APP, Affinity / Photoshop / Lightroom (plugins astro), outils IA (débruitage, déconvolution, retrait d'étoiles, gradients), outils en ligne.
3. **Méthodes** : tutoriels et articles reconnus de la période (Adam Block, Cosgrove's Cosmos, Ron Brecher, Deep Space Place, theAstroShed, Warren Keller / Telescope Live, Seti Astro, Cuiv, Visible Dark, Chaotic Nebula, AstroBackyard…) : galaxies LRGB / LHaRGB, narrowband SHO / HOO, étoiles, couleur (SPCC), gradients (MARS), étirement, finition.
4. Selon l'argument : un thème précis creusé plus à fond.

Recherche en mode `standard`, puis `extended` pour ce qui est récent ou maigre.

## 2. Trier et comparer

Pour chaque nouveauté :

- **Quoi** : outil ou méthode, version, date, source (Officiel / Tutoriel / Forum).
- **Pour toi** : est-ce que l'utilisateur l'utilise déjà (icône, étape) ? Quel workflow est concerné (LRGB, LHaRGB, RGB + SHO, SHO sans RGB, HOO) ? Compatible avec PixInsight 1.9.5 sur PC Windows, CDK17 + QHY600, filtres Antlia ?
- **Intérêt** : fort / moyen / faible, en une phrase (gain de qualité, de temps, de simplicité).
- **Fiabilité** : recoupé par deux sources ? divergence ? position de l'éditeur ?

Écarte ce qui ne concerne pas l'utilisateur (caméra couleur seule, planétaire, matériel absent), mais cite-le en une ligne en fin de rapport.

## 3. Propositions

Classe les propositions par intérêt. Pour chacune :

- ce que ça changerait concrètement (icône à ajouter, réglage, option à tester, étape à remplacer) ;
- comment tester sans risque (en option, à comparer avec le chemin principal) ;
- coût (payant, temps de calcul, matériel) ;
- impact LRGB / LHaRGB s'il y en a (à signaler : demande obligatoire avant d'y toucher).

Rien n'est appliqué : l'utilisateur choisit dans sa réponse.

## 4. Écrire le rapport

Fichier `docs/veille/veille-AAAA-MM-JJ.md` (date du jour), en Markdown simple (pas de page HTML ni d'artifact : demande de l'utilisateur du 5 octobre 2026) :

1. Période et date ; résumé en 5 lignes.
2. Nouveautés PixInsight (tableau : quoi, date, pour toi, intérêt, source).
3. Nouveautés autres outils (même tableau).
4. Méthodes publiées (même tableau).
5. Propositions classées (numérotées, pour que l'utilisateur réponde « 1, 3, 5 »).
6. Hors sujet pour toi (une ligne chacun).
7. Sources (URL, ouverte ou résumé).

Puis :

- `docs/sources.md` : rubrique « Veille du JJ mois AAAA » avec les sources utilisées (type, *(résumé)* si non ouverte) ; ajoute à « Non vérifié » ce qui reste incertain.
- `docs/kb/` : versions et faits sûrs dans le fichier thématique (`outils.md`, `narrowband.md`, `workflows.md`, `preparation.md`) ; nouveaux dépôts dans `docs/depots-pixinsight.txt`.
- Commit en français avec les lignes d'attribution de la session, puis `git push origin main` (et la branche de la session si elle en donne une).

## 5. Réponse à l'utilisateur

Court : le résumé en 5 lignes, les propositions numérotées (une ligne chacune, avec intérêt et coût), le chemin du rapport complet (`docs/veille/veille-AAAA-MM-JJ.md`), et la question : « lesquelles veux-tu tester ? ».
