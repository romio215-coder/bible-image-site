// Original, deterministic vector scenery; rasterized once, never per verse.
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
const categories = [
  ["sky", "하늘", 205],
  ["sea", "바다", 195],
  ["mountain", "산", 165],
  ["forest", "숲", 140],
  ["dawn", "새벽", 265],
  ["stars", "별", 230],
  ["desert", "광야", 30],
  ["path", "길", 100],
  ["flowers", "들꽃", 320],
  ["light", "빛", 40],
];
await mkdir("public/images/bible/illustrations", { recursive: true });
await mkdir("public/images/bible/thumbnails", { recursive: true });
const records = [];
for (const [category, label, hue] of categories) {
  for (let variant = 1; variant <= 20; variant++) {
    let state = (hue * 991 + variant * 7919) >>> 0;
    const random = () =>
      (state = (state * 1664525 + 1013904223) >>> 0) / 4294967296;
    const h = hue + (random() - 0.5) * 28;
    const color = (l, s = 30, shift = 0) => `hsl(${h + shift},${s}%,${l}%)`;
    const night = category === "stars";
    const top = color(night ? 10 : 28 + random() * 12);
    const bottom = color(night ? 27 : 66, 35, 25);
    let shapes = "";
    const circle = (x, y, r, fill, opacity = 1) =>
      `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="${opacity}"/>`;
    const sunX = 170 + random() * 740;
    shapes += circle(
      sunX,
      180 + random() * 170,
      50 + random() * 45,
      "#fff1cb",
      0.65,
    );
    if (night) {
      for (let i = 0; i < 130; i++)
        shapes += circle(
          random() * 1080,
          random() * 1100,
          0.8 + random() * 2,
          "#fff7db",
          0.3 + random() * 0.7,
        );
    }
    if (["sky", "dawn", "light"].includes(category)) {
      for (let i = 0; i < 9; i++) {
        const y = 200 + random() * 1150,
          x = -200 + random() * 900;
        shapes += `<ellipse cx="${x}" cy="${y}" rx="${180 + random() * 380}" ry="${15 + random() * 35}" fill="#fff4db" opacity=".12"/>`;
      }
    }
    if (category === "light") {
      for (let i = 0; i < 8; i++)
        shapes += `<path d="M ${sunX} 180 L ${-600 + i * 300} 1620 L ${-440 + i * 300} 1620 Z" fill="#fff1c4" opacity=".045"/>`;
    }
    // Independently varied landscape geometry, kept below the central verse area.
    for (let layer = 0; layer < 4; layer++) {
      const base = 1110 + layer * 120;
      let d = `M -100 1700 L -100 ${base}`;
      for (let x = -100; x <= 1180; x += 180) {
        const height =
          category === "mountain" ? 280 : category === "desert" ? 180 : 100;
        const y = base - random() * height;
        d +=
          category === "mountain"
            ? ` L ${x} ${y}`
            : ` Q ${x - 90} ${y - 60} ${x} ${y}`;
      }
      d += " L 1200 1700 Z";
      shapes += `<path d="${d}" fill="${color(36 - layer * 6, 26)}" opacity="${0.4 + layer * 0.17}"/>`;
    }
    if (category === "sea") {
      shapes += `<rect y="1090" width="1080" height="530" fill="${color(29, 38)}"/>`;
      for (let i = 0; i < 35; i++) {
        const y = 1100 + i * 15;
        shapes += `<path d="M ${-200 + random() * 200} ${y} Q 300 ${y - 16} 600 ${y} T 1250 ${y}" stroke="#d1e6dd" stroke-width="${1 + random() * 3}" opacity="${0.1 + random() * 0.2}" fill="none"/>`;
      }
    }
    if (["forest", "path"].includes(category)) {
      for (let i = 0; i < 20; i++) {
        const x = random() * 1080,
          y = 1290 + random() * 300,
          height = 90 + random() * 260;
        shapes += `<path d="M ${x} ${y - height} L ${x - height / 3} ${y} L ${x + height / 3} ${y} Z" fill="${color(15 + random() * 8, 22)}"/>`;
      }
    }
    if (category === "path")
      shapes += `<path d="M 470 1620 Q 730 1420 520 1150 Q 790 1430 740 1620" fill="#c3b995" opacity=".7"/>`;
    if (category === "flowers") {
      for (let i = 0; i < 38; i++) {
        const x = random() * 1080,
          y = 1330 + random() * 290,
          r = 5 + random() * 10;
        shapes += `<path d="M ${x} 1620 Q ${x + 20} ${y + 80} ${x} ${y}" stroke="#8baf8e" stroke-width="2" fill="none"/>`;
        for (let p = 0; p < 5; p++)
          shapes += circle(
            x + Math.cos(p * Math.PI * 0.4) * r,
            y + Math.sin(p * Math.PI * 0.4) * r,
            r * 0.7,
            ["#dbc9d9", "#ecd5b4", "#bdbbe1"][i % 3],
            0.8,
          );
        shapes += circle(x, y, r * 0.3, "#f7e6a7");
      }
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1620"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs><rect width="1080" height="1620" fill="url(#sky)"/>${shapes}</svg>`;
    const id = `${category}-${String(variant).padStart(2, "0")}`;
    const image = `/images/bible/illustrations/${id}.webp`;
    const thumbnail = `/images/bible/thumbnails/${id}.webp`;
    await sharp(Buffer.from(svg))
      .webp({ quality: 82 })
      .toFile(`public${image}`);
    await sharp(Buffer.from(svg))
      .resize(120, 180)
      .webp({ quality: 65 })
      .toFile(`public${thumbnail}`);
    records.push({
      id,
      label: `${label} ${String(variant).padStart(2, "0")}`,
      category,
      colors: [top, bottom],
      image,
      thumbnail,
      text: "#fffdf5",
    });
  }
}
await writeFile(
  "src/data/backgrounds.json",
  JSON.stringify(records, null, 2) + "\n",
);
console.log(`Generated ${records.length} backgrounds and thumbnails.`);
