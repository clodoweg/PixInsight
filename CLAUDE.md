# Instructions pour Claude

Ce dépôt contient une fiche de référence PixInsight (`docs/pixinsight-workflow.html`) et la liste de ses sources (`docs/sources.md`). Réponds en français.

## Valider avec des sources avant d'insérer

Avant d'ajouter ou de modifier un contenu technique dans la fiche (réglage, valeur, ordre des étapes, formule, URL de dépôt) :

1. Cherche des sources et lis-les. Priorité : documentation officielle de l'éditeur ou de l'auteur de l'outil, puis tutoriels écrits reconnus, puis forums.
2. Recoupe avec au moins deux sources quand c'est possible. Si les sources divergent, dis-le dans la fiche et indique la position de l'éditeur.
3. N'insère une valeur non vérifiée qu'en le signalant clairement (« valeur de départ issue de la pratique ») et ajoute-la à la section « Non vérifié » de `docs/sources.md`.
4. Ajoute chaque source utilisée dans `docs/sources.md`, dans la bonne rubrique, avec son type (Officiel, Tutoriel, Forum). Marque *(résumé)* une page que tu n'as pas pu ouvrir toi-même.
5. Dans ta réponse, résume ce qui a été vérifié, ce qui diverge et ce qui ne l'est pas, avec les liens.

## Publication

- Travaille sur la branche `main`.
- Si la fiche existe aussi comme artifact claude.ai, garde les deux versions identiques.

## État du projet (mémoire pour reprendre dans une autre session)

Utilisateur : astrophotographe, PixInsight 1.9.5 sur macOS (Apple Silicon), CDK17 (2 939 mm) + QHY600 (IMX455, 3,76 µm, 0,264″/px en bin 1), filtres Antlia V Pro LRGB et Antlia 3 nm (Ha, OIII, SII), licences RC Astro (BXT AI4, NXT AI3, SXT AI11). Une centaine de photos à retraiter ; **masters déjà empilés, un par filtre et par cible**. Il préfère le **mode conteneurs** et des textes **courts et simples**.

### Fichiers
- `docs/pixinsight-workflow.html` : la fiche (workflows LRGB, LHaRGB, RGB + SHO, SHO sans RGB, HOO ; techniques GHS, Foraxx, continuum, réduction d'étoiles, **Masques** ; standards de couleur et d'étoiles ; 37 fiches outils). Chaque fiche outil commence par un encadré **« À régler »** (valeurs des icônes + « si… → … »), le détail est replié. En haut : section **« Préparer ma photo »** (préparateur : filtres → méthodes → options → conteneurs ; télécharge un `.xpsm`, ou un `.zip` dans l'artifact car `.xpsm` n'est pas autorisé par la capacité `downloads`).
- `docs/sources.md` : toutes les sources (règle ci-dessus) ; `docs/depots-pixinsight.txt` : dépôts.
- `docs/process-icons/` : `01`–`04` icônes unitaires (04 = matériel QHY600/Antlia) ; `workflows/Workflow-X` (chemin principal), `Options-X`, **`Conteneurs-X` = fichier unique conseillé** (chemin principal avec ProcessContainer + options rangées sous leur phase `P#_options`). Colonnes par phase P1 Préparation … P7 Étoiles ; noms `E01_…`, `Opt_…`, `C_…`.
- Générateurs : `make_icons.py` (01–03), `make_workflows.py` (workflows, 04, preparer-data.json), `layout.py` (phase et rôle de chaque étape : core / opt / alternatives grad:mgc|gc|dbe, str:ghs|stat, pal:nbn|foraxx|hubble ; conteneurs `CONTAINERS`), `short_desc.py` (descriptions courtes : LANCEMENT / PRÉRÉGLÉ / À RÉGLER / SI, paragraphes séparés par une ligne vide).
- **Tout régénérer : `sh docs/process-icons/build/build.sh`** (reproduit exactement les fichiers commités ; valide les XML).

### Conventions
- Vues narrowband nommées **H, O, S** partout (formules, icônes, texte) ; exceptions : valeurs de filtre MARS `Ha`/`OIII` dans MGC, libellés d'interface (Lightness = Ha, O3/S2 boost, Ha Stars…), raies physiques Hα/Hβ, noms HII, HaRGB, LHaRGB.
- Icônes de scripts = vraies instances Script (chemin `$PXI_SRCDIR/scripts/...`, MD5 de l'archive SetiAstro 19/09/2026 ; MD5 vide pour les scripts livrés avec PixInsight).
- ProcessContainer : format recopié des icônes de theAstroShed (instances imbriquées sans id, `enabled="true"`, pas de description). **Non testé dans PixInsight** par l'utilisateur à ce jour.
- Commits sur `main`, en français, avec les lignes d'attribution demandées par la session.

### Artifact claude.ai
- URL : https://claude.ai/artifact/1U1vcUpg8C4iwbDxUiKYPv (capacité `downloads` déclarée). Le garder identique au dépôt.
- Pour le mettre à jour depuis une nouvelle session : `python3 docs/process-icons/build/page.py unwrap docs/pixinsight-workflow.html <scratchpad>/workflow-pixinsight.html`, lire l'artifact (action `read`), puis publier ce fichier avec `url` = l'URL ci-dessus (ne pas repasser `capabilities`).

### En cours / prochaines étapes proposées (non commencées)

**Idées pour réduire encore le nombre d'icônes : voir `docs/idees-acceleration.md`** (A fait : WBPP et CosmeticCorrection passés en options dans `layout.py` ; ordre conseillé ensuite : B + D + renommage automatique, puis narrowband sans séparation des canaux, puis script « Traiter ma cible »).

1. **Masters déjà empilés** : mode sans WBPP/CosmeticCorrection ; vérifier si les masters d'une cible sont alignés entre eux (sinon ajouter StarAlignment, référence L ou H).
2. **Inventaire automatique** des ~100 cibles (script Python lisant les en-têtes XISF/FITS : cible, filtres, temps de pose → workflow, alertes, `.xpsm` par cible). En attente de l'utilisateur : exemple de nom de fichier, empilement en une seule passe WBPP ou non, en-tête d'un master.
3. **Deux vitesses** (rapide : conteneurs + Statistical Stretch + palette par défaut ; complet pour les meilleures).
4. **Traitement de nuit en série** avec ImageContainer, après test des conteneurs.
5. **Tableau de suivi** des 100 photos (page avec base de données).
6. Vérifier AutoIntegrate (mode lot, compatibilité 1.9.5) comme premier jet.
Points ouverts : voir la section « Non vérifié » de `docs/sources.md`.
