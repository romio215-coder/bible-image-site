"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Sun,
  Moon,
  Search,
  X,
  Check,
} from "lucide-react";
import {
  type Chapter,
  type Verse,
  translation,
  neighborChapter,
  chapterPath,
} from "@/lib/bible";
import {
  useUserData,
  setSettings,
  updateUserData,
  toggleRead,
  type Settings,
} from "@/lib/user-store";
import { BibleSidebar } from "./bible-sidebar";
import { VerseCard } from "@/components/verse-card/verse-card";
import { Dialog } from "@/components/dialog";

export function BibleReader({
  chapter,
  initialVerse,
  initialEnd,
}: {
  chapter: Chapter;
  initialVerse?: number;
  initialEnd?: number;
}) {
  const user = useUserData();
  const router = useRouter();
  const { dark, fontSize, serif, lineHeight, showNumbers, wide } =
    user.settings;
  const [selected, setSelected] = useState<Verse | null>(
    chapter.verses.find((v) => v.number === initialVerse) ?? null,
  );
  const [endVerse, setEndVerse] = useState(initialEnd ?? initialVerse ?? 1);
  const [rangeMode, setRangeMode] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileCardOpen, setMobileCardOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const previous = neighborChapter(chapter.book, chapter.chapter, -1);
  const next = neighborChapter(chapter.book, chapter.chapter, 1);
  const normalized = query.trim();
  const found = normalized
    ? chapter.verses.filter((v) => v.text.includes(normalized))
    : [];
  function applySettings(value: Partial<Settings>) {
    try {
      setSettings(value);
    } catch (error) {
      setFeedback((error as Error).message);
    }
  }
  function select(verse: Verse) {
    if (rangeMode && selected) {
      setEndVerse(Math.max(selected.number, verse.number));
      setSelected(chapter.verses[Math.min(selected.number, verse.number) - 1]);
      setRangeMode(false);
    } else {
      setSelected(verse);
      setEndVerse(verse.number);
    }
    if (!rangeMode && window.matchMedia("(max-width: 1100px)").matches)
      setMobileCardOpen(true);
  }
  useEffect(() => {
    try {
      updateUserData((s) => ({
        ...s,
        last: { book: chapter.book, chapter: chapter.chapter },
      }));
      localStorage.setItem(
        "wordlight:offline-chapter",
        JSON.stringify(chapter),
      );
    } catch {
      /* Explicit save actions separately report storage failures. */
    }
    if (initialVerse)
      document
        .getElementById(`verse-${initialVerse}`)
        ?.scrollIntoView({ block: "center" });
  }, [chapter, initialVerse]);
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelected(null);
        setSearchOpen(false);
        setQuery("");
        setRangeMode(false);
      }
      if (
        document.querySelector("dialog[open]") ||
        (event.target as HTMLElement)?.closest(
          "input,textarea,select,[contenteditable]",
        )
      )
        return;
      if (event.key === "ArrowLeft" && previous)
        router.push(chapterPath(previous));
      if (event.key === "ArrowRight" && next) router.push(chapterPath(next));
      if ((event.ctrlKey || event.metaKey) && event.key === "f") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [previous, next, router]);
  return (
    <div className={`reader-root ${dark ? "dark-reader" : ""}`}>
      <div className="reader-topbar">
        <div>
          <BookOpen size={17} />
          <span>성경 읽기</span>
          <ChevronRight size={13} />
          <strong>
            {chapter.name} {chapter.chapter}장
          </strong>
        </div>
        <Link href="/reading-plan" className="reader-sample-badge">
          {Object.keys(user.read).length} / 1,189장
        </Link>
      </div>
      <div className={`reader-layout ${wide ? "wide-reader" : ""}`}>
        <aside className="desktop-sidebar" aria-label="성경 탐색">
          <BibleSidebar chapter={chapter} />
        </aside>
        <main id="main-content" className="reader-main">
          <div className="reader-toolbar">
            <button className="book-select" onClick={() => setPickerOpen(true)}>
              {chapter.name} {chapter.chapter}장 <ChevronDown size={16} />
            </button>
            <div className="reader-tools">
              <button
                className="icon-button"
                aria-label="현재 장에서 찾기"
                aria-expanded={searchOpen}
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={19} />
              </button>
              <button
                className="icon-button"
                aria-label="읽기 설정"
                onClick={() => setSettingsOpen(true)}
              >
                <SlidersHorizontal size={19} />
              </button>
              <button
                className="icon-button"
                aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"}
                onClick={() => applySettings({ dark: !dark })}
              >
                {dark ? <Sun size={19} /> : <Moon size={19} />}
              </button>
            </div>
          </div>
          {searchOpen && (
            <div className="chapter-search">
              <label htmlFor="chapter-query">현재 장에서 찾기</label>
              <div>
                <input
                  id="chapter-query"
                  autoFocus
                  value={query}
                  placeholder="단어나 문장을 입력하세요"
                  onChange={(event) => setQuery(event.target.value)}
                />
                <button
                  className="icon-button"
                  aria-label="검색 닫기"
                  onClick={() => {
                    setQuery("");
                    setSearchOpen(false);
                  }}
                >
                  <X size={18} />
                </button>
              </div>
              {normalized && (
                <p role="status">
                  {found.length
                    ? `${found.length}개 구절을 찾았습니다.`
                    : "일치하는 구절이 없습니다."}
                </p>
              )}
              <Link href={`/search?q=${encodeURIComponent(query)}`}>
                성경 전체에서 찾기 →
              </Link>
            </div>
          )}
          <article
            className={`chapter-article ${serif ? "serif-text" : "sans-text"}`}
            style={
              {
                "--verse-size": `${fontSize}px`,
                "--verse-leading": lineHeight,
              } as CSSProperties
            }
          >
            <header className="chapter-heading">
              <span className="eyebrow">
                {chapter.english} · CHAPTER{" "}
                {String(chapter.chapter).padStart(2, "0")}
              </span>
              <h1>
                {chapter.name} <span>{chapter.chapter}장</span>
              </h1>
              <div className="chapter-heading-line" />
              <h2>{chapter.title}</h2>
              <p>구절을 누르면 저장·묵상·말씀카드를 이용할 수 있어요.</p>
            </header>
            {selected && (
              <div className="selection-bar">
                <span>
                  {selected.number}
                  {endVerse !== selected.number ? `–${endVerse}` : ""}절 선택
                </span>
                <button
                  onClick={() => setRangeMode(!rangeMode)}
                  aria-pressed={rangeMode}
                >
                  {rangeMode ? "마지막 구절을 눌러주세요" : "여러 절 선택"}
                </button>
                <button
                  className="mobile-only"
                  onClick={() => setMobileCardOpen(true)}
                >
                  말씀카드
                </button>
                <button
                  aria-label="선택 해제"
                  onClick={() => {
                    setSelected(null);
                    setRangeMode(false);
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <div className="verses">
              {chapter.verses.map((verse) => (
                <button
                  key={verse.number}
                  id={`verse-${verse.number}`}
                  className={`verse ${selected && verse.number >= selected.number && verse.number <= endVerse ? "selected" : ""} ${normalized && verse.text.includes(normalized) ? "search-match" : ""}`}
                  aria-label={`${showNumbers ? `${verse.number} ` : ''}${verse.text} (${chapter.name} ${chapter.chapter}장 ${verse.number}절)`}
                  aria-pressed={
                    !!selected &&
                    verse.number >= selected.number &&
                    verse.number <= endVerse
                  }
                  onClick={() => select(verse)}
                >
                  <span className="verse-number" aria-hidden={!showNumbers}>
                    {showNumbers ? verse.number : ""}
                  </span>
                  <span>{verse.text}</span>
                  <span className="verse-action" aria-hidden="true">
                    ＋
                  </span>
                </button>
              ))}
            </div>
            <div className="chapter-end">
              <span>✧</span>
              <p>오늘의 말씀을 마음에 담으셨나요?</p>
              <button
                className="button secondary"
                aria-pressed={!!user.read[`${chapter.book}/${chapter.chapter}`]}
                onClick={() => {
                  try {
                    toggleRead(chapter.book, chapter.chapter);
                    setFeedback("읽기 기록을 변경했습니다.");
                  } catch (error) {
                    setFeedback((error as Error).message);
                  }
                }}
              >
                <Check size={17} />
                {user.read[`${chapter.book}/${chapter.chapter}`]
                  ? "읽음 완료 · 취소하기"
                  : "이 장 읽음 표시"}
              </button>
              <p role="status">{feedback}</p>
            </div>
          </article>
          <footer className="reader-copyright">
            <span>{translation} · 대한성서공회</span>
            <Link href="/about">본문 출처와 이용 안내 ↗</Link>
          </footer>
          <div className="chapter-navigation">
            {previous ? (
              <Link href={chapterPath(previous)}>
                <ChevronLeft size={17} /> 이전 장
              </Link>
            ) : (
              <span>첫 장</span>
            )}
            <span>
              {chapter.name} <strong>{chapter.chapter}</strong> /{" "}
              {chapter.chapters}
            </span>
            {next ? (
              <Link href={chapterPath(next)}>
                다음 장 <ChevronRight size={17} />
              </Link>
            ) : (
              <span>마지막 장</span>
            )}
          </div>
        </main>
        <aside className="desktop-verse-panel" aria-label="선택한 말씀">
          <VerseCard
            key={`${selected?.number}-${endVerse}`}
            chapter={chapter}
            verse={selected}
            endVerse={endVerse}
          />
        </aside>
      </div>
      <Dialog
        title="성경 선택"
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        className="picker-dialog"
      >
        <BibleSidebar
          chapter={chapter}
          onNavigate={() => setPickerOpen(false)}
        />
      </Dialog>
      <Dialog
        title="읽기 설정"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      >
        <div className="settings-content">
          <label htmlFor="font-size">
            글자 크기 <span>{fontSize}px</span>
          </label>
          <input
            id="font-size"
            type="range"
            min="18"
            max="28"
            step="2"
            value={fontSize}
            onChange={(event) =>
              applySettings({ fontSize: Number(event.target.value) })
            }
          />
          <span className="settings-label">본문 글꼴</span>
          <div className="segmented">
            <button
              aria-pressed={serif}
              onClick={() => applySettings({ serif: true })}
            >
              명조
            </button>
            <button
              aria-pressed={!serif}
              onClick={() => applySettings({ serif: false })}
            >
              고딕
            </button>
          </div>
          <label className="setting-row">
            줄 간격
            <select
              value={lineHeight}
              onChange={(e) => applySettings({ lineHeight: +e.target.value })}
            >
              <option value="1.8">좁게</option>
              <option value="2.05">보통</option>
              <option value="2.4">넓게</option>
            </select>
          </label>
          <label className="setting-row">
            절 번호 표시
            <input
              type="checkbox"
              checked={showNumbers}
              onChange={(e) => applySettings({ showNumbers: e.target.checked })}
            />
          </label>
          <label className="setting-row">
            넓은 본문
            <input
              type="checkbox"
              checked={wide}
              onChange={(e) => applySettings({ wide: e.target.checked })}
            />
          </label>
          <p
            className={serif ? "font-preview serif-text" : "font-preview"}
            style={{ fontSize }}
          >
            태초에 하나님이 천지를 창조하시니라
          </p>
          <p className="settings-note">읽기 설정은 이 기기에 저장됩니다.</p>
        </div>
      </Dialog>
      <Dialog
        title="선택한 말씀"
        open={mobileCardOpen}
        onClose={() => setMobileCardOpen(false)}
        className="mobile-card-dialog"
      >
        <VerseCard
          key={`${selected?.number}-${endVerse}`}
          chapter={chapter}
          verse={selected}
          endVerse={endVerse}
        />
      </Dialog>
    </div>
  );
}
