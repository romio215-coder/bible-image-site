import { cardThemes } from "./card-themes";
export type CardOptions = {
  text: string;
  reference: string;
  theme: string;
  ratio: string;
  font: "serif" | "sans" | "handwriting";
  fontSize: number;
};
function linesFor(
  context: CanvasRenderingContext2D,
  text: string,
  width: number,
) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width <= width) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);
    line = "";
    // A single word can be longer than the card; split only such words.
    for (const char of word) {
      if (line && context.measureText(line + char).width > width) {
        lines.push(line);
        line = "";
      }
      line += char;
    }
  }
  if (line) lines.push(line.trim());
  return lines;
}
export async function drawCard(
  canvas: HTMLCanvasElement,
  options: CardOptions,
) {
  canvas.width = 1080;
  canvas.height =
    options.ratio === "9:16" ? 1920 : options.ratio === "4:5" ? 1350 : 1080;
  const ctx = canvas.getContext("2d");
  if (!ctx)
    throw new Error("이 브라우저에서는 이미지 생성을 지원하지 않습니다.");
  const theme = cardThemes.find((t) => t.id === options.theme) ?? cardThemes[0];
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, theme.colors[0]);
  gradient.addColorStop(1, theme.colors[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (theme.image) {
    const img = new Image();
    img.src = theme.image;
    await img.decode();
    const scale = Math.max(
      canvas.width / img.width,
      canvas.height / img.height,
    );
    ctx.drawImage(
      img,
      (canvas.width - img.width * scale) / 2,
      (canvas.height - img.height * scale) / 2,
      img.width * scale,
      img.height * scale,
    );
    ctx.fillStyle = "rgba(15,28,23,.46)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  const family =
    options.font === "handwriting"
      ? "WordLight Pen"
      : options.font === "serif"
        ? "WordLight Serif"
        : "WordLight Sans";
  await document.fonts.load(
    `400 56px "${family}"`,
    options.text + options.reference,
  );
  await document.fonts.ready;
  let size = options.fontSize;
  let lines: string[] = [];
  for (; size >= 20; size -= 2) {
    ctx.font = `400 ${size}px "${family}"`;
    lines = linesFor(ctx, options.text, canvas.width - 180);
    if (lines.length * size * 1.65 <= canvas.height - 430) break;
  }
  if (size < 20)
    throw new Error(
      "선택한 본문이 너무 깁니다. 구절을 줄이거나 세로 비율을 선택해주세요.",
    );
  ctx.fillStyle = theme.text;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const total = lines.length * size * 1.65;
  const y = (canvas.height - total) / 2;
  lines.forEach((line, i) => ctx.fillText(line, 540, y + i * size * 1.65));
  ctx.font = '400 34px "WordLight Sans"';
  ctx.fillText(options.reference, 540, y + total + 48);
  ctx.font = '400 30px "WordLight Sans"';
  ctx.fillText("오늘, 말씀과 함께", 540, 110);
  ctx.font = '400 28px "WordLight Sans"';
  ctx.fillText("말씀빛 BIBLE", 540, canvas.height - 72);
}
export async function cardBlob(
  canvas: HTMLCanvasElement,
  format: "png" | "webp",
) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("이미지 저장에 실패했습니다.")),
      `image/${format}`,
      0.92,
    ),
  );
}
export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
