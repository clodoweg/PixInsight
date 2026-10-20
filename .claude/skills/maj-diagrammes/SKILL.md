---
name: maj-diagrammes
description: Met à jour les diagrammes des workflows (docs/Diagrammes-workflows.html) pour qu'ils correspondent aux icônes de process actuelles (docs/process-icons/workflows/Conteneurs-*.xpsm), et vérifie qu'aucune icône ne manque. À utiliser quand l'utilisateur demande de mettre à jour, refaire ou vérifier les diagrammes, ou après un changement d'icônes fait hors de build.sh.
---

# Mise à jour des diagrammes d'après les icônes

Demande de l'utilisateur (20 octobre 2026) : « je veux aussi un skill qui met a jour les diagrammes en fonction de mes icones ».

Réponds en français, en textes courts et simples (règles de `CLAUDE.md`).

## Chaîne de fabrication

`workflows/Conteneurs-*.xpsm` (les icônes) -> `build/kb_icons.py` -> `docs/kb/icones-*.md` -> `build/diagrammes/diagrammes.py` (modèle `build/diagrammes/modele.html`) -> `docs/Diagrammes-workflows.html`.

`build.sh` fait toute la chaîne, mais il RÉGÉNÈRE d'abord les xpsm depuis le générateur (`make_workflows.py`). Ce skill part des xpsm tels qu'ils sont dans le dépôt, sans les refaire.

## 1. Préparer

1. `git pull -q origin main` (d'autres sessions modifient le dépôt).
2. Les icônes de l'utilisateur sont celles des xpsm du dépôt. S'il a changé des icônes dans PixInsight sans que le dépôt le sache (fichier .xpsm enregistré sur son PC), elles ne peuvent pas être lues ici : demande-lui le fichier, ou ce qu'il a changé, pour le reporter dans le générateur (règles de `CLAUDE.md` : descriptions, LRGB / LHaRGB à demander avant).

## 2. Régénérer depuis les icônes actuelles

Depuis `docs/process-icons` :

```sh
cd docs/process-icons
python3 build/kb_icons.py workflows ../kb
python3 build/diagrammes/diagrammes.py ../Diagrammes-workflows.html
rm -rf __pycache__ build/__pycache__
```

Si le générateur a changé depuis le dernier build (`git status` montre `make_workflows.py`, `layout.py`, `short_desc.py` ou `make_icons.py` modifiés), lance plutôt `sh docs/process-icons/build/build.sh` (toute la chaîne).

## 3. Vérifier que les diagrammes suivent les icônes

1. Pour chaque workflow (LRGB, LHaRGB, RGB-SHO, SHO-sans-RGB, HOO), compare les noms d'icônes des xpsm avec ceux de la page :

```sh
cd docs/process-icons
for f in LRGB LHaRGB RGB-SHO SHO-sans-RGB HOO; do
  python3 - "$f" <<'EOF'
import re, sys
f = sys.argv[1]
xp = set(re.findall(r'<icon id="((?:E\d+|Opt|R|T)_[^"]+)"', open('workflows/Conteneurs-%s.xpsm' % f).read()))
md = set(re.findall(r'^#### (\S+) — ', open('../kb/icones-%s.md' % f).read(), re.M))
page = open('../Diagrammes-workflows.html').read()
manque_md = sorted(xp - md)
manque_page = sorted(n for n in md if n not in page)
print(f, 'icônes :', len(xp), '| absentes de la fiche :', manque_md or 'aucune', '| absentes du diagramme :', manque_page or 'aucune')
EOF
done
```

   Testé le 20 octobre 2026 : toutes les icônes présentes (LRGB 63, LHaRGB 77, RGB-SHO 82, SHO-sans-RGB 70, HOO 72). Si le motif `<icon id=…>` ne trouve rien (format du xpsm changé), lis un xpsm pour l'adapter. Une icône absente : regarde pourquoi dans `kb_icons.py` ou `diagrammes.py` (phase, groupe `P#_Nom` / `P#_options` / `P#_rapide` / `P#_turbo`) et corrige le script, pas la page à la main.
2. Contrôle l'ordre : dans chaque phase, les `E##_` du diagramme dans l'ordre des numéros ; options et rapides dans leur colonne.
3. Ouvre la page avec Chromium sans fenêtre et regarde la capture (Read) : `/opt/pw-browsers/chromium-*/chrome-linux/chrome --headless --no-sandbox --disable-gpu --window-size=1400,900 --screenshot=<scratchpad>/diag.png file://$PWD/../Diagrammes-workflows.html` (le module Python playwright n'est pas installé) ; pas de case vide, pas de texte coupé.
4. `git diff --stat` : seuls `docs/kb/icones-*.md` et `docs/Diagrammes-workflows.html` doivent changer (plus les scripts de `build/` si tu les as corrigés). Un xpsm modifié par ce skill = erreur : ne le committe pas.

## 4. Publier

Si des fichiers ont changé : mets à jour `docs/kb/generateur.md` si un script de `build/` a été corrigé ; commit en français avec les lignes d'attribution de la session, puis `git push origin main` (et la branche de la session si elle en donne une).

## 5. Rapport à l'utilisateur

Court : workflows mis à jour, nombre d'icônes par workflow, ce qui a changé dans les diagrammes (icônes ajoutées, retirées, déplacées), problème trouvé et corrigé. Rappelle que la page est `docs/Diagrammes-workflows.html` (à ouvrir dans un navigateur après `maj_pc.bat` / `maj_mac.command`, qui font le git pull).
