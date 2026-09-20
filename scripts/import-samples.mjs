// Only these two public-domain sample chapters belong to STEP 1.
import { mkdir, writeFile } from "node:fs/promises";
const samples = [
  {
    book: "genesis",
    name: "창세기",
    english: "GENESIS",
    testament: "old",
    chapter: 1,
    chapters: 50,
    title: "천지 창조",
    source: "GEN01",
    count: 31,
  },
  {
    book: "john",
    name: "요한복음",
    english: "JOHN",
    testament: "new",
    chapter: 3,
    chapters: 21,
    title: "거듭남과 영원한 생명",
    source: "JHN03",
    count: 36,
  },
];
await mkdir("src/data", { recursive: true });
for (const sample of samples) {
  const url = `https://ebible.org/kor/${sample.source}.htm`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Source returned ${response.status}`);
  const html = await response.text();
  const verses = [
    ...html.matchAll(
      /<span class="verse" id="V(\d+)">.*?<\/span>([\s\S]*?)(?=<\/div>|<span class="verse")/g,
    ),
  ].map((match) => ({
    number: Number(match[1]),
    text: match[2]
      .replace(/<[^>]*>/g, "")
      .replace(/&#160;|&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim(),
  }));
  if (
    verses.length !== sample.count ||
    verses.some((v, i) => v.number !== i + 1 || !v.text)
  )
    throw new Error(`Invalid chapter ${sample.book}`);
  const { source, count, ...meta } = sample;
  void source;
  void count;
  await writeFile(
    `src/data/${sample.book}-${sample.chapter}.json`,
    JSON.stringify({ ...meta, sourceUrl: url, verses }, null, 2) + "\n",
  );
  console.log(`${sample.name} ${sample.chapter}: ${verses.length} verses`);
}
