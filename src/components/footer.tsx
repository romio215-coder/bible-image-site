import Link from "next/link";
import { Brand } from "./brand";
export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Brand />
        <p>일상에 스며드는 한 줄의 빛.</p>
        <div className="footer-links">
          <Link href="/search">검색</Link>
          <Link href="/bookmarks">저장한 말씀</Link>
          <Link href="/notes">묵상</Link>
          <Link href="/settings">설정</Link>
        </div>
      </div>
      <div className="footer-source">
        <p>66권 · 1,189장 · 31,101절</p>
        <Link href="/about">
          성경전서 개역한글판 · 대한성서공회 · 출처와 이용 안내 ↗
        </Link>
        <p>개인 기록은 이 브라우저에 저장됩니다.</p>
      </div>
    </footer>
  );
}
