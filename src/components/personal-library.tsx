"use client";
import { useState } from "react";
import Link from "next/link";
import { allChapters, books, chapterPath } from "@/lib/bible";
import {
  useUserData,
  toggleBookmark,
  saveNote,
  updateUserData,
  exportData,
  validateData,
  type UserData,
} from "@/lib/user-store";
import { saveBlob } from "@/lib/card-canvas";
import { koreaDate } from "@/lib/collections";

export function PersonalLibrary({
  mode,
}: {
  mode: "bookmarks" | "notes" | "reading-plan" | "settings";
}) {
  const user = useUserData();
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState("");
  const [draft, setDraft] = useState("");
  const [days, setDays] = useState(365);
  const [backup, setBackup] = useState<UserData | null>(null);
  const count = Object.keys(user.read).length;
  function action(fn: () => void, success: string) {
    try {
      fn();
      setMessage(success);
    } catch (error) {
      setMessage((error as Error).message);
    }
  }
  const day = user.plan
    ? Math.max(
        1,
        Math.floor(
          (Date.parse(koreaDate()) - Date.parse(user.plan.start)) / 86400000,
        ) + 1,
      )
    : 1;
  const target = user.plan
    ? Math.min(
        1189,
        Math.ceil((Math.min(day, user.plan.days) * 1189) / user.plan.days),
      )
    : 0;
  const todayStart = user.plan
    ? Math.floor(((Math.min(day, user.plan.days) - 1) * 1189) / user.plan.days)
    : 0;
  const todays = user.plan ? allChapters.slice(todayStart, target) : [];
  return (
    <>
      <p className="device-notice">
        기록은 이 브라우저에 저장됩니다. 설정에서 백업하면 다른 기기로 옮길 수
        있어요.
      </p>
      {mode === "bookmarks" && (
        <>
          <p className="result-count">저장한 말씀 {user.bookmarks.length}개</p>
          {!user.bookmarks.length && (
            <div className="empty-state">
              아직 저장한 말씀이 없습니다.
              <br />
              <Link href="/bible/genesis/1">
                성경을 읽고 마음에 드는 구절을 저장해보세요 →
              </Link>
            </div>
          )}
          <div className="saved-list">
            {user.bookmarks.map((v) => (
              <article key={v.id}>
                <Link
                  href={`/bible/${v.book}/${v.chapter}/${v.verse}?end=${v.endVerse}`}
                >
                  <h2>
                    {v.name} {v.chapter}:{v.verse}
                    {v.endVerse !== v.verse ? `–${v.endVerse}` : ""}
                  </h2>
                  <p>{v.text}</p>
                </Link>
                <button
                  className="text-link"
                  onClick={() =>
                    action(() => toggleBookmark(v), "저장을 해제했습니다.")
                  }
                >
                  저장 해제
                </button>
              </article>
            ))}
          </div>
        </>
      )}
      {mode === "notes" && (
        <>
          {!user.notes.length && (
            <div className="empty-state">
              아직 묵상 메모가 없습니다.
              <br />
              <Link href="/bible/genesis/1">
                구절을 선택하고 묵상을 남겨보세요 →
              </Link>
            </div>
          )}
          <div className="saved-list">
            {user.notes.map((v) => (
              <article key={v.id}>
                <Link
                  href={`/bible/${v.book}/${v.chapter}/${v.verse}?end=${v.endVerse}`}
                >
                  <h2>
                    {v.name} {v.chapter}:{v.verse}
                    {v.endVerse !== v.verse ? `–${v.endVerse}` : ""}
                  </h2>
                </Link>
                <p className="note-date">
                  {new Date(v.updatedAt).toLocaleDateString("ko-KR")}
                </p>
                {editing === v.id ? (
                  <div className="note-editor">
                    <label htmlFor="edit-note">묵상 수정</label>
                    <textarea
                      id="edit-note"
                      rows={5}
                      maxLength={10000}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                    />
                    <button
                      className="button secondary"
                      onClick={() =>
                        action(() => {
                          saveNote(v, draft);
                          setEditing("");
                        }, "묵상을 저장했습니다.")
                      }
                    >
                      수정 저장
                    </button>
                    <button className="button" onClick={() => setEditing("")}>
                      취소
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="note-body">{v.note}</p>
                    <button
                      className="text-link"
                      onClick={() => {
                        setEditing(v.id);
                        setDraft(v.note);
                      }}
                    >
                      수정
                    </button>
                    <button
                      className="text-link danger"
                      onClick={() => {
                        if (confirm("이 묵상 메모를 삭제할까요?"))
                          action(() => saveNote(v, ""), "묵상을 삭제했습니다.");
                      }}
                    >
                      삭제
                    </button>
                  </>
                )}
              </article>
            ))}
          </div>
        </>
      )}
      {mode === "reading-plan" && (
        <>
          <section className="progress-card">
            <span className="eyebrow">MY READING JOURNEY</span>
            <h2>
              {((count / 1189) * 100).toFixed(1)}
              <small>%</small>
            </h2>
            <progress
              max={1189}
              value={count}
              aria-label="전체 성경 통독 진행률"
            />
            <p>{count} / 1,189장 읽음</p>
          </section>
          <section className="plan-card">
            <h2>나의 통독 계획</h2>
            {user.plan ? (
              <>
                <p>
                  {user.plan.start}부터 {user.plan.days}일 · {day}일째
                </p>
                <p>
                  오늘까지의 목표 {target}장 · 현재 {count}장
                </p>
                <h3>오늘 읽을 말씀</h3>
                <div className="today-chapters">
                  {todays.map((c) => (
                    <Link href={chapterPath(c)} key={`${c.book}/${c.chapter}`}>
                      {user.read[`${c.book}/${c.chapter}`] ? "✓ " : ""}
                      {c.name} {c.chapter}장
                    </Link>
                  ))}
                </div>
                <button
                  className="text-link"
                  onClick={() =>
                    action(
                      () => updateUserData((s) => ({ ...s, plan: null })),
                      "계획을 종료했습니다. 읽은 기록은 유지됩니다.",
                    )
                  }
                >
                  계획 종료
                </button>
              </>
            ) : (
              <>
                <p>
                  성경 순서대로 매일 나누어 읽습니다. 기존 읽은 기록은
                  유지됩니다.
                </p>
                <label>
                  통독 기간
                  <select
                    value={days}
                    onChange={(e) => setDays(+e.target.value)}
                  >
                    <option value={90}>90일</option>
                    <option value={180}>180일</option>
                    <option value={365}>365일</option>
                  </select>
                </label>
                <button
                  className="button primary"
                  onClick={() =>
                    action(
                      () =>
                        updateUserData((s) => ({
                          ...s,
                          plan: { start: koreaDate(), days },
                        })),
                      "통독 계획을 시작했습니다.",
                    )
                  }
                >
                  오늘부터 시작
                </button>
              </>
            )}
          </section>
          <h2 className="section-subtitle">권별 읽은 기록</h2>
          <div className="book-progress">
            {books.map((b) => {
              const completed = Object.keys(user.read).filter((key) =>
                key.startsWith(`${b.book}/`),
              ).length;
              return (
                <Link key={b.book} href={`/bible/${b.book}/1`}>
                  <span>{b.name}</span>
                  <span>
                    {completed} / {b.chapters}
                  </span>
                  <progress
                    max={b.chapters}
                    value={completed}
                    aria-label={`${b.name} 진행률`}
                  />
                </Link>
              );
            })}
          </div>
        </>
      )}
      {mode === "settings" && (
        <>
          <section className="plan-card">
            <h2>기록 백업</h2>
            <p>
              즐겨찾기·묵상·읽은 장·설정을 파일로 내려받습니다. 브라우저
              데이터를 삭제하기 전에 백업해주세요.
            </p>
            <button
              className="button primary"
              onClick={() =>
                action(
                  () =>
                    saveBlob(
                      new Blob([exportData()], { type: "application/json" }),
                      `말씀빛-백업-${koreaDate()}.json`,
                    ),
                  "백업 파일을 내려받았습니다.",
                )
              }
            >
              백업 다운로드
            </button>
          </section>
          <section className="plan-card">
            <h2>백업 가져오기</h2>
            <p>
              백업과 현재 기록을 합칩니다. 같은 묵상은 최근 수정본을 유지하며,
              현재 읽기 설정은 바꾸지 않습니다.
            </p>
            <label className="file-label">
              백업 JSON 파일
              <input
                type="file"
                accept="application/json,.json"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setBackup(null);
                  try {
                    if (file.size > 10_000_000)
                      throw new Error("백업 파일은 10MB 이하여야 합니다.");
                    setBackup(validateData(JSON.parse(await file.text())));
                    setMessage("백업 내용을 확인한 뒤 합치기를 눌러주세요.");
                  } catch (error) {
                    setMessage((error as Error).message);
                  }
                }}
              />
            </label>
            {backup && (
              <>
                <p>
                  말씀 {backup.bookmarks.length}개 · 묵상 {backup.notes.length}
                  개 · 읽은 장 {Object.keys(backup.read).length}개
                </p>
                <button
                  className="button secondary"
                  onClick={() =>
                    action(() => {
                      updateUserData((s) => {
                        const bookmarks = new Map(
                          s.bookmarks.map((v) => [v.id, v]),
                        );
                        backup.bookmarks.forEach((v) => {
                          if (
                            !bookmarks.has(v.id) ||
                            bookmarks.get(v.id)!.updatedAt < v.updatedAt
                          )
                            bookmarks.set(v.id, v);
                        });
                        const notes = new Map(s.notes.map((v) => [v.id, v]));
                        backup.notes.forEach((v) => {
                          if (
                            !notes.has(v.id) ||
                            notes.get(v.id)!.updatedAt < v.updatedAt
                          )
                            notes.set(v.id, v);
                        });
                        return {
                          ...s,
                          bookmarks: [...bookmarks.values()],
                          notes: [...notes.values()],
                          read: { ...backup.read, ...s.read },
                        };
                      });
                      setBackup(null);
                    }, "백업을 합쳤습니다.")
                  }
                >
                  백업 합치기
                </button>
              </>
            )}
          </section>
          <section className="plan-card">
            <h2>다른 기기와 동기화</h2>
            <p>
              현재는 비회원 모드입니다. 계정과 자동 동기화는 Supabase 프로젝트
              연결 후 사용할 수 있습니다.
            </p>
            <Link href="/about">데이터 저장 및 출처 안내 →</Link>
          </section>
        </>
      )}
      <p className="save-status" role="status">
        {message}
      </p>
    </>
  );
}
