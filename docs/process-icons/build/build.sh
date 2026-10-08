#!/bin/sh
# Régénère toutes les icônes et docs/kb/icones-*.md.
# Usage : sh docs/process-icons/build/build.sh   (depuis n'importe où)
set -e
cd "$(dirname "$0")/.."
B=build
export TEMPLATES=$B/templates.json SRC_V3=$B/FromLukeAndBill.xpsm ALL_XPSM=$B/all.x
python3 make_workflows.py workflows
rm -rf __pycache__ $B/__pycache__
for f in workflows/*.xpsm; do
  python3 -c "import sys,xml.dom.minidom; xml.dom.minidom.parse(sys.argv[1])" "$f" || { echo "XML invalide : $f"; exit 1; }
  # identifiants en double : PixInsight refuse le fichier (« Duplicate instance identifier »)
  python3 -c "import sys,re,collections; t=open(sys.argv[1]).read(); d=[k for k,n in collections.Counter(re.findall(r'<(?:instance|icon) [^>]*?id=\"([^\"]+)\"', t)).items() if n > 1]; d and sys.exit('identifiants en double : ' + ', '.join(d))" "$f" || { echo "Doublon : $f"; exit 1; }
done
python3 $B/kb_icons.py workflows ../kb
echo "OK : icônes et docs/kb/icones-*.md régénérés."
