"use client";
import { useEffect, useId, useRef, useState } from "react";
import {
  Copy,
  Check,
  Image as ImageIcon,
  Download,
  Heart,
  Share2,
  NotebookPen,
} from "lucide-react";
import { type Chapter, type Verse, versePath } from "@/lib/bible";
import {
  useUserData,
  toggleBookmark,
  saveNote,
  type SavedVerse,
} from "@/lib/user-store";
import { drawCard, cardBlob, saveBlob } from "@/lib/card-canvas";
import {
  cardThemes,
  backgroundCategories,
  recommendedThemes,
} from "@/lib/card-themes";
import Image from "next/image";

export function VerseCard({
  chapter,
  verse,
  endVerse,
}: {
  chapter: Chapter;
  verse: Verse | null;
  endVerse?: number;
}) {
  const user = useUserData();
  const [theme, setTheme] = useState(
    chapter.book === "genesis" || chapter.book === "psalms"
      ? "nature"
      : "olive",
  );
  const [ratio, setRatio] = useState("4:5");
  const [font, setFont] = useState<"serif" | "sans" | "handwriting">("serif");
  const [category, setCategory] = useState("recommended");
  const [backgroundPage, setBackgroundPage] = useState(0);
  const availableThemes =
    category === "recommended"
      ? recommendedThemes(chapter.book, chapter.chapter, verse?.number ?? 1)
      : cardThemes.filter(
          (item) => category === "all" || item.category === category,
        );
  const pageCount = Math.ceil(availableThemes.length / 12);
  const visibleThemes = availableThemes.slice(
    backgroundPage * 12,
    backgroundPage * 12 + 12,
  );
  const [fontSize, setFontSize] = useState(72);
  const [format, setFormat] = useState<"png" | "webp">("png");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const end = endVerse ?? verse?.number ?? 1;
  const id = `${chapter.book}/${chapter.chapter}/${verse?.number ?? 1}-${end}`;
  const [noteDraft, setNote] = useState<string | null>(null);
  const note = noteDraft ?? user.notes.find((n) => n.id === id)?.note ?? "";
  const noteId = useId();
  const reference = `${chapter.name} ${chapter.chapter}:${verse?.number ?? 1}${end !== verse?.number && verse ? `–${end}` : ""}`;
  const text = verse
    ? chapter.verses
        .filter((v) => v.number >= verse.number && v.number <= end)
        .map((v) => v.text)
        .join(" ")
    : "";
  const bookmarked = user.bookmarks.some((v) => v.id === id);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [readyKey, setReadyKey] = useState("");
  const key = JSON.stringify({ text, reference, theme, ratio, font, fontSize });
  useEffect(() => {
    if (!text) return;
    let active = true;
    const temporary = document.createElement("canvas");
    drawCard(temporary, { text, reference, theme, ratio, font, fontSize })
      .then(() => {
        if (!active || !canvas.current) return;
        canvas.current.width = temporary.width;
        canvas.current.height = temporary.height;
        canvas.current.getContext("2d")?.drawImage(temporary, 0, 0);
        setReadyKey(key);
        setFeedback("");
      })
      .catch((error) => {
        if (active) setFeedback(error.message);
      });
    return () => {
      active = false;
    };
  }, [text, reference, theme, ratio, font, fontSize, key]);
  const ready = key === readyKey;
  function record(): SavedVerse {
    return {
      id,
      book: chapter.book,
      name: chapter.name,
      chapter: chapter.chapter,
      verse: verse!.number,
      endVerse: end,
      text,
      updatedAt: new Date().toISOString(),
    };
  }
  function act(action: () => void, message: string) {
    try {
      action();
      setFeedback(message);
    } catch (error) {
      setFeedback((error as Error).message);
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(`${text}\n${reference}`);
      setFeedback("말씀을 복사했습니다.");
    } catch {
      setFeedback("복사할 수 없습니다. 본문을 직접 선택해 복사해주세요.");
    }
  }
  async function download() {
    if (!canvas.current || !ready) return;
    setBusy(true);
    try {
      const blob = await cardBlob(canvas.current, format);
      saveBlob(
        blob,
        `${chapter.name}-${chapter.chapter}장-${verse!.number}${end !== verse!.number ? `-${end}` : ""}절.${blob.type === "image/webp" ? "webp" : "png"}`,
      );
      setFeedback("말씀카드를 다운로드했습니다.");
    } catch (error) {
      setFeedback((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function share() {
    const url = new URL(versePath(chapter, verse!.number), location.origin);
    if (end !== verse!.number) url.searchParams.set("end", String(end));
    try {
      if (navigator.canShare && navigator.share && canvas.current && ready) {
        const blob = await cardBlob(canvas.current, "png");
        const file = new File(
          [blob],
          `${chapter.name}-${chapter.chapter}-${verse!.number}.png`,
          { type: "image/png" },
        );
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: reference,
            text: reference,
          });
          return;
        }
      }
      if (navigator.share)
        await navigator.share({
          title: reference,
          text: `${text}\n${reference}`,
          url: url.href,
        });
      else {
        await navigator.clipboard.writeText(
          `${text}\n${reference}\n${url.href}`,
        );
        setFeedback("공유 링크와 말씀을 복사했습니다.");
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError")
        setFeedback(
          "공유하지 못했습니다. 말씀 복사 또는 이미지 저장을 이용해주세요.",
        );
    }
  }
  return (
    <div className="verse-panel">
      <div className="panel-heading">
        <ImageIcon size={18} />
        <h2>마음에 담는 말씀</h2>
      </div>
      {verse ? (
        <>
          <div className="selected-reference">
            <span className="eyebrow">SELECTED VERSE</span>
            <h3>{reference}</h3>
          </div>
          <canvas
            ref={canvas}
            className="card-canvas"
            role="img"
            aria-label={`${reference} 말씀카드: ${text}`}
            style={{ aspectRatio: ratio.replace(":", "/") }}
          />
          {!ready && (
            <p className="panel-note">
              {feedback || "말씀카드를 준비하고 있습니다…"}
            </p>
          )}
          <div className="background-library">
            <label>
              배경 테마
              <select
                aria-label="배경 테마"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setBackgroundPage(0);
                }}
              >
                {backgroundCategories.map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <p className="background-caption">
              선택: {cardThemes.find((item) => item.id === theme)?.label} ·{" "}
              {availableThemes.length}개 배경
            </p>
            <div className="background-grid" aria-label="카드 배경 선택">
              {visibleThemes.map((item) => (
                <button
                  key={item.id}
                  className="background-option"
                  style={{
                    background: `linear-gradient(${item.colors.join(",")})`,
                    color: item.text,
                  }}
                  aria-label={item.label}
                  aria-pressed={theme === item.id}
                  onClick={() => setTheme(item.id)}
                >
                  {item.thumbnail && (
                    <Image
                      src={item.thumbnail}
                      alt=""
                      fill
                      sizes="80px"
                      unoptimized
                    />
                  )}
                  <span>{item.label}</span>
                  {theme === item.id && (
                    <Check size={16} className="background-check" />
                  )}
                </button>
              ))}
            </div>
            {pageCount > 1 && (
              <div className="background-pagination">
                <button
                  disabled={backgroundPage === 0}
                  onClick={() => setBackgroundPage((p) => p - 1)}
                >
                  이전 배경
                </button>
                <span aria-live="polite">
                  {backgroundPage + 1} / {pageCount}
                </span>
                <button
                  disabled={backgroundPage + 1 >= pageCount}
                  onClick={() => setBackgroundPage((p) => p + 1)}
                >
                  다음 배경
                </button>
              </div>
            )}
          </div>
          <div className="card-controls">
            <label>
              이미지 비율
              <select value={ratio} onChange={(e) => setRatio(e.target.value)}>
                <option>1:1</option>
                <option>4:5</option>
                <option>9:16</option>
              </select>
            </label>
            <label>
              카드 글꼴
              <select
                value={font}
                onChange={(e) =>
                  setFont(e.target.value as "serif" | "sans" | "handwriting")
                }
              >
                <option value="serif">명조</option>
                <option value="sans">고딕</option>
                <option value="handwriting">손글씨</option>
              </select>
            </label>
            <label>
              저장 형식
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as "png" | "webp")}
              >
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
            </label>
            <label>
              글자 크기
              <select
                value={fontSize}
                onChange={(e) => setFontSize(+e.target.value)}
              >
                <option value="60">작게</option>
                <option value="72">보통</option>
                <option value="84">크게</option>
              </select>
            </label>
          </div>
          <button
            className="button primary full-width"
            disabled={!ready || busy}
            onClick={download}
          >
            <Download size={16} /> {busy ? "저장 중…" : "말씀카드 다운로드"}
          </button>
          <div className="verse-actions">
            <button
              onClick={() =>
                act(
                  () => toggleBookmark(record()),
                  bookmarked ? "저장을 해제했습니다." : "말씀을 저장했습니다.",
                )
              }
              aria-pressed={bookmarked}
            >
              <Heart size={17} fill={bookmarked ? "currentColor" : "none"} />
              {bookmarked ? "저장됨" : "저장"}
            </button>
            <button onClick={copy}>
              <Copy size={17} />
              복사
            </button>
            <button onClick={share}>
              <Share2 size={17} />
              공유
            </button>
            <button
              onClick={() => setNoteOpen(!noteOpen)}
              aria-expanded={noteOpen}
            >
              <NotebookPen size={17} />
              묵상
            </button>
          </div>
          {noteOpen && (
            <div className="note-editor">
              <label htmlFor={noteId}>묵상 메모</label>
              <textarea
                id={noteId}
                value={note}
                maxLength={10000}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
                placeholder="이 말씀이 오늘 나에게 어떤 의미인가요?"
              />
              <button
                className="button secondary full-width"
                onClick={() =>
                  act(
                    () => saveNote(record(), note),
                    note.trim()
                      ? "묵상을 기기에 저장했습니다."
                      : "묵상을 삭제했습니다.",
                  )
                }
              >
                묵상 저장
              </button>
            </div>
          )}
          <p className="copy-feedback" role="status">
            {feedback}
          </p>
          <p className="panel-note">
            카드는 내 기기에서 만들어집니다.
            <br />
            말씀과 묵상 기록도 이 브라우저에만 저장됩니다.
          </p>
        </>
      ) : (
        <div className="panel-empty">
          <span className="empty-quote">“</span>
          <h3>마음에 닿는 구절이 있나요?</h3>
          <p>
            본문에서 구절을 선택하면
            <br />
            이곳에 말씀카드가 나타납니다.
          </p>
          <div className="empty-card-lines">
            <span />
            <span />
            <span />
          </div>
          <span className="eyebrow">READ. PAUSE. REFLECT.</span>
        </div>
      )}
    </div>
  );
}
