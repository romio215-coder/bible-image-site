import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { searchBible } from "@/lib/bible-server";
import { books, versePath } from "@/lib/bible";
export const metadata = { title: "성경 검색", robots: { index: false } };
type Params = { q?: string; book?: string; testament?: string; page?: string };
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const p = await searchParams;
  const q = typeof p.q === "string" ? p.q.slice(0, 200).trim() : "";
  const book = books.some((b) => b.book === p.book) ? p.book! : "";
  const testament =
    p.testament === "old" || p.testament === "new" ? p.testament : "";
  const results = searchBible(q, book, testament);
  const pages = Math.max(1, Math.ceil(results.length / 30));
  const page = Math.min(pages, Math.max(1, parseInt(p.page ?? "1", 10) || 1));
  const href = (n: number) =>
    `/search?${new URLSearchParams({ q, book, testament, page: String(n) })}`;
  return (
    <PageShell
      title="말씀을 찾아보세요"
      intro="단어, 문장 또는 ‘요한복음 3:16’처럼 장절로 검색할 수 있어요."
    >
      <form className="search-form" action="/search">
        <label className="sr-only" htmlFor="global-search">
          검색어
        </label>
        <input
          id="global-search"
          name="q"
          defaultValue={q}
          placeholder="사랑, 두려워하지 말라, 요한복음 3:16"
          maxLength={200}
          required
        />
        <button className="button primary">검색</button>
        <label>
          성경 구분
          <select name="testament" defaultValue={testament}>
            <option value="">전체 성경</option>
            <option value="old">구약</option>
            <option value="new">신약</option>
          </select>
        </label>
        <label>
          성경책
          <select name="book" defaultValue={book}>
            <option value="">모든 책</option>
            {books.map((b) => (
              <option key={b.book} value={b.book}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
      </form>
      {q ? (
        <>
          <p className="result-count">
            “{q}” 검색 결과 {results.length.toLocaleString()}절
          </p>
          <div className="verse-results">
            {results.slice((page - 1) * 30, page * 30).map((v) => (
              <Link
                key={`${v.book}-${v.chapter}-${v.number}`}
                href={versePath(v, v.number)}
              >
                <strong>
                  {v.name} {v.chapter}:{v.number}
                </strong>
                <p>{v.text}</p>
                <span>본문과 말씀카드 보기 →</span>
              </Link>
            ))}
          </div>
          {!results.length && (
            <div className="empty-state">
              검색 결과가 없습니다. 짧은 단어나 다른 표현을 입력해보세요.
            </div>
          )}
          {pages > 1 && (
            <nav className="pagination" aria-label="검색 결과 페이지">
              {page > 1 && <Link href={href(page - 1)}>이전</Link>}
              <span>
                {page} / {pages}
              </span>
              {page < pages && <Link href={href(page + 1)}>다음</Link>}
            </nav>
          )}
        </>
      ) : (
        <div className="empty-state">찾고 싶은 말씀을 입력해보세요.</div>
      )}
    </PageShell>
  );
}
