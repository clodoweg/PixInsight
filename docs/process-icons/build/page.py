"""Page de la fiche : le dépôt garde une version « enveloppée » (doctype, head, body), l'artifact claude.ai la version source.
  python3 page.py unwrap ../../pixinsight-workflow.html source.html   -> source (à publier comme artifact)
  python3 page.py wrap source.html ../../pixinsight-workflow.html     -> version du dépôt"""
import sys

HEAD = ('<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n')
RESET = '\n<style>body { margin: 0; } img { max-width: 100%; }</style>\n</head>\n<body>\n'


def wrap(src):
    i = src.index('</style>') + 8
    return HEAD + src[:i] + RESET + src[i:].strip('\n') + '\n</body>\n</html>\n'


def unwrap(page):
    assert page.startswith(HEAD)
    body = page[len(HEAD):]
    i = body.index(RESET)
    rest = body[i + len(RESET):]
    rest = rest[:rest.rindex('\n</body>\n</html>')]
    return body[:i] + '\n' + rest + '\n'


mode, a, b = sys.argv[1:4]
s = open(a, encoding='utf-8').read()
out = wrap(s) if mode == 'wrap' else unwrap(s)
if mode == 'unwrap':
    assert wrap(out) == s, 'aller-retour imparfait'
open(b, 'w', encoding='utf-8').write(out)
