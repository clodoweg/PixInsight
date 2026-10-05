#!/bin/sh
# Régénère toutes les icônes, les données du préparateur et la page du dépôt.
# Usage : sh docs/process-icons/build/build.sh   (depuis n'importe où)
set -e
cd "$(dirname "$0")/.."
B=build
export TEMPLATES=$B/templates.json SRC_V3=$B/FromLukeAndBill.xpsm ALL_XPSM=$B/all.x
python3 make_workflows.py workflows
rm -rf __pycache__ $B/__pycache__
SRC=$(mktemp)
python3 $B/page.py unwrap ../pixinsight-workflow.html "$SRC"
python3 $B/prep_build.py "$SRC" preparer-data.json
python3 $B/page.py wrap "$SRC" ../pixinsight-workflow.html
rm -f "$SRC"
for f in workflows/*.xpsm; do
  python3 -c "import sys,xml.dom.minidom; xml.dom.minidom.parse(sys.argv[1])" "$f" || { echo "XML invalide : $f"; exit 1; }
done
python3 $B/kb_icons.py workflows ../kb
python3 -c "import html.parser; html.parser.HTMLParser().feed(open('../pixinsight-workflow.html').read())"
echo "OK : icônes, preparer-data.json, page et docs/kb/icones-*.md régénérés."
