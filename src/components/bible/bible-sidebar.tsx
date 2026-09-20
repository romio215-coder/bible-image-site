"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, Check } from "lucide-react";
import { bookGroups, books, type Chapter } from "@/lib/bible";
import { useUserData } from "@/lib/user-store";
export function BibleSidebar({
  chapter,
  onNavigate,
}: {
  chapter: Chapter;
  onNavigate?: () => void;
}) {
  const [testament, setTestament] = useState(chapter.testament);
  const [chosen, setChosen] = useState(chapter.book);
  const user = useUserData();
  const groups =
    testament === "old" ? bookGroups.slice(0, 4) : bookGroups.slice(4);
  return (
    <div className="bible-sidebar-inner">
      <div className="sidebar-title">
        <BookOpen size={19} />
        <h2>성경 목록</h2>
      </div>
      <div className="testament-tabs" aria-label="구약 또는 신약">
        <button
          aria-pressed={testament === "old"}
          onClick={() => setTestament("old")}
        >
          구약 <span>39</span>
        </button>
        <button
          aria-pressed={testament === "new"}
          onClick={() => setTestament("new")}
        >
          신약 <span>27</span>
        </button>
      </div>
      <p className="sidebar-help">책을 펼쳐 읽을 장을 선택하세요.</p>
      <div className="book-groups">
        {groups.map((group) => (
          <section key={group.name}>
            <h3>{group.name}</h3>
            {group.books.map((name) => {
              const book = books.find((b) => b.name === name)!;
              return (
                <div key={name}>
                  <button
                    className={`book-option ${chosen === book.book ? "active" : ""}`}
                    onClick={() =>
                      setChosen(chosen === book.book ? "" : book.book)
                    }
                    aria-expanded={chosen === book.book}
                  >
                    <span>{name}</span>
                    <ChevronDown size={16} />
                  </button>
                  {chosen === book.book && (
                    <div className="chapter-picker">
                      <div className="chapter-picker-caption">
                        장 선택 <span>{book.chapters}장</span>
                      </div>
                      <div className="chapter-grid">
                        {Array.from(
                          { length: book.chapters },
                          (_, i) => i + 1,
                        ).map((n) => (
                          <Link
                            prefetch={false}
                            key={n}
                            onClick={onNavigate}
                            href={`/bible/${book.book}/${n}`}
                            className={`${chapter.book === book.book && chapter.chapter === n ? "current" : ""} ${user.read[`${book.book}/${n}`] ? "is-read" : ""}`}
                            aria-label={`${book.name} ${n}장${user.read[`${book.book}/${n}`] ? " 읽음" : ""}`}
                            aria-current={
                              chapter.book === book.book &&
                              chapter.chapter === n
                                ? "page"
                                : undefined
                            }
                          >
                            {n}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        ))}
      </div>
      <Link href="/reading-plan" className="sidebar-bottom">
        <Check size={15} />
        <span>{Object.keys(user.read).length} / 1,189장 읽음</span>
      </Link>
    </div>
  );
}
