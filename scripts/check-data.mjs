import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const read = async (file) => JSON.parse(await readFile(file, "utf8"));
const books = await read("src/data/books.json");
const bible = await read("src/data/bible.json");
assert.equal(books.length, 66);
assert.equal(new Set(books.map((b) => b.book)).size, 66);
let chapterCount = 0,
  verseCount = 0;
for (const book of books) {
  assert.equal(Object.keys(bible[book.book]).length, book.chapters, book.name);
  for (let chapter = 1; chapter <= book.chapters; chapter++) {
    const verses = bible[book.book][chapter];
    assert.ok(verses.length > 0);
    verses.forEach((verse, i) => {
      assert.equal(verse.number, i + 1, `${book.name} ${chapter}`);
      assert.ok(verse.text.trim());
    });
    chapterCount++;
    verseCount += verses.length;
  }
}
assert.equal(chapterCount, 1189);
assert.equal(verseCount, 31101);
assert.equal(
  bible["1-peter"][5].length,
  14,
  "The old source omitted this chapter",
);
assert.equal(bible.psalms[119].length, 176);
assert.equal(bible.revelation[22].at(-1).number, 21);
assert.equal(bible.genesis[1][0].text, "태초에 하나님이 천지를 창조하시니라");
console.log(
  `Verified ${books.length} books, ${chapterCount} chapters, ${verseCount} verses, consecutive chapter/verse numbering and source-regression checks.`,
);
