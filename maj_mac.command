#!/bin/bash
# maj_mac.command : met a jour le depot PixInsight puis copie les scripts clodoweg dans PixInsight (Mac).
# Double-clic dans le Finder suffit (equivalent de maj_pc.bat). La toute premiere fois seulement,
# le Mac demande ton mot de passe pour donner a ton compte le droit d'ecrire dans le dossier clodoweg ;
# ensuite plus jamais.
# Le depot est le dossier ou se trouve ce fichier (pas de chemin a regler).

DEPOT="$(cd "$(dirname "$0")" && pwd)"
SOURCE="$DEPOT/docs/process-icons/scripts"
CIBLE="/Applications/PixInsight/src/scripts/clodoweg"

erreur() { echo "$1"; read -r -p "Appuie sur Entree pour fermer." _; exit 1; }

echo "=== git pull dans $DEPOT ==="
cd "$DEPOT" || erreur "Dossier $DEPOT introuvable."
git pull || erreur "git pull a echoue : rien n'est copie."

[ -d "/Applications/PixInsight/src/scripts" ] || erreur "PixInsight introuvable dans /Applications/PixInsight."

# test d'ecriture dans le dossier cible (sans mot de passe)
test_ecriture() { mkdir -p "$CIBLE" 2>/dev/null && touch "$CIBLE/_cw_test.tmp" 2>/dev/null && rm -f "$CIBLE/_cw_test.tmp"; }
if ! test_ecriture; then
  # une seule fois : le dossier clodoweg devient a ton compte
  echo "Premiere fois : mot de passe administrateur pour donner les droits sur $CIBLE..."
  sudo mkdir -p "$CIBLE" && sudo chown -R "$(id -un)" "$CIBLE" || erreur "Droits refuses."
  test_ecriture || erreur "Pas le droit d'ecrire dans $CIBLE."
fi

echo "=== copie de $SOURCE vers $CIBLE ==="
cp -R "$SOURCE/" "$CIBLE/" || erreur "La copie a echoue."
echo "Termine. Relance PixInsight si des scripts ont change."
exit 0
