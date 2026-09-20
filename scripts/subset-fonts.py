"""Optional asset rebuild; normal npm builds use committed WOFF2 files."""
from pathlib import Path
import json
import sys

sys.path.insert(0, str(Path('.font-tools').resolve()))
from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
corpus = json.loads((root / 'src/data/bible.json').read_text(encoding='utf-8'))
critical = set(range(32, 127))
for path in (root / 'src').rglob('*.tsx'):
    critical.update(map(ord, path.read_text(encoding='utf-8')))
for book, chapter in [('genesis', '1'), ('john', '3')]:
    for verse in corpus[book][chapter]:
        critical.update(map(ord, verse['text']))
all_chars = set(critical)
for book in corpus.values():
    for chapter in book.values():
        for verse in chapter:
            all_chars.update(map(ord, verse['text']))

destination = root / 'public/fonts'
destination.mkdir(exist_ok=True, parents=True)
css = []
for kind in ['serif', 'sans', 'pen']:
    package = 'nanum-pen-script' if kind == 'pen' else f'noto-{kind}-kr'
    source = root / f'node_modules/@fontsource/{package}'
    family = f'WordLight {kind.title()}'
    original = source / f'files/{package}-korean-400-normal.woff2'
    supported = set(TTFont(original).getBestCmap())
    for label, characters in [('common', critical), ('bible', all_chars - critical)]:
        characters = sorted(characters & supported)
        font = TTFont(original)
        options = subset.Options()
        options.name_IDs = ['*']
        options.name_legacy = True
        options.name_languages = ['*']
        subsetter = subset.Subsetter(options=options)
        subsetter.populate(unicodes=characters)
        subsetter.subset(font)
        for record in font['name'].names:
            if record.nameID in [1, 4, 16]:
                record.string = family.encode(record.getEncoding())
            elif record.nameID == 6:
                record.string = (family.replace(' ', '-') + '-Regular').encode(record.getEncoding())
        filename = f'wordlight-{kind}-{label}.woff2'
        font.flavor = 'woff2'
        font.save(destination / filename)
        unicode_range = ','.join(f'U+{char:X}' for char in characters)
        css.append(f'@font-face{{font-family:"{family}";font-style:normal;font-weight:400;font-display:swap;src:url("/fonts/{filename}") format("woff2");unicode-range:{unicode_range};}}')
        print(filename, len(characters), (destination / filename).stat().st_size)
    (destination / f'OFL-{package}.txt').write_text((source / 'LICENSE').read_text(encoding='utf-8'), encoding='utf-8')
(root / 'src/app/fonts.css').write_text('\n'.join(css) + '\n', encoding='utf-8')
