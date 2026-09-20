import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const slugs =
  "genesis exodus leviticus numbers deuteronomy joshua judges ruth 1-samuel 2-samuel 1-kings 2-kings 1-chronicles 2-chronicles ezra nehemiah esther job psalms proverbs ecclesiastes song-of-songs isaiah jeremiah lamentations ezekiel daniel hosea joel amos obadiah jonah micah nahum habakkuk zephaniah haggai zechariah malachi matthew mark luke john acts romans 1-corinthians 2-corinthians galatians ephesians philippians colossians 1-thessalonians 2-thessalonians 1-timothy 2-timothy titus philemon hebrews james 1-peter 2-peter 1-john 2-john 3-john jude revelation".split(
    " ",
  );
const expected = [
  50, 40, 27, 36, 34, 24, 21, 4, 31, 24, 22, 25, 29, 36, 10, 13, 10, 42, 150,
  31, 12, 8, 66, 52, 5, 48, 12, 14, 3, 9, 1, 4, 7, 3, 3, 3, 2, 14, 4, 28, 16,
  24, 21, 28, 16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1, 1,
  22,
];
if (!process.argv[2]) throw new Error("Pass the path of krv_holybible.jsonl");
const source = await readFile(process.argv[2], "utf8");
const raw = source.trim().split(/\r?\n/).map(JSON.parse);
const bible = {},
  books = [];
for (let index = 0; index < 66; index++) {
  const rows = raw.filter((row) => row.book === index + 1);
  if (!rows.length) throw new Error(`Missing book ${index + 1}`);
  const book = slugs[index];
  const name = rows[0].name_kr === "아가서" ? "아가" : rows[0].name_kr;
  const metadata = {
    book,
    name,
    english: book.toUpperCase().replaceAll("-", " "),
    code: rows[0].code,
    chapters: expected[index],
    testament: index < 39 ? "old" : "new",
  };
  books.push(metadata);
  bible[book] = {};
  for (const row of rows) {
    if (row.chapter < 1 || row.chapter > expected[index] || !row.text.trim())
      throw new Error(`Invalid row ${book}`);
    bible[book][row.chapter] ??= [];
    if (bible[book][row.chapter].some((v) => v.number === row.verse))
      throw new Error("Duplicate verse");
    bible[book][row.chapter].push({ number: row.verse, text: row.text });
  }
  for (let c = 1; c <= expected[index]; c++) {
    const verses = bible[book][c];
    if (!verses?.length) throw new Error(`Missing chapter ${book} ${c}`);
    verses.sort((a, b) => a.number - b.number);
    verses.forEach((v, i) => {
      if (v.number !== i + 1)
        throw new Error(`Missing verse ${book} ${c}:${i + 1}`);
    });
  }
}
const count = Object.values(bible).reduce(
  (n, book) => n + Object.keys(book).length,
  0,
);
if (count !== 1189 || raw.length !== 31101)
  throw new Error(`Unexpected totals ${count}/${raw.length}`);
await writeFile("src/data/books.json", JSON.stringify(books, null, 2) + "\n");
await writeFile("src/data/bible.json", JSON.stringify(bible) + "\n");
await writeFile(
  "src/data/source.json",
  JSON.stringify(
    {
      translation: "성경전서 개역한글판",
      attribution: "대한성서공회 (1961)",
      distributor: "crizin/bible-db; holybible.or.kr",
      source: "https://github.com/crizin/bible-db",
      commit: "4bcb50b3ead59d20b4a6b847f5c79ab4cdba6a2c",
      license: "Public Domain (배포처 NOTICE 기준)",
      licenseUrl:
        "https://github.com/crizin/bible-db/blob/4bcb50b3ead59d20b4a6b847f5c79ab4cdba6a2c/NOTICE",
      sha256: createHash("sha256").update(source).digest("hex"),
      imported: new Date().toISOString(),
      books: 66,
      chapters: count,
      verses: raw.length,
    },
    null,
    2,
  ) + "\n",
);
console.log({ books: 66, chapters: count, verses: raw.length });
