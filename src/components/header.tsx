import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { Brand } from "./brand";
const links = [
  ["/bible", "성경 읽기"],
  ["/search", "성경 검색"],
  ["/topics", "주제별 말씀"],
  ["/daily", "오늘의 말씀"],
  ["/people", "성경 인물"],
  ["/events", "성경 사건"],
  ["/timeline", "성경 연대표"],
  ["/reading-plan", "통독 계획"],
  ["/bookmarks", "저장한 말씀"],
  ["/notes", "묵상 메모"],
  ["/settings", "설정과 백업"],
  ["/about", "출처와 이용 안내"],
];
export function Header({ reader = false }: { reader?: boolean }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav aria-label="주 메뉴">
          <Link href="/bible" aria-current={reader ? "page" : undefined}>
            성경 읽기
          </Link>
          <Link href="/topics">주제별 말씀</Link>
          <Link href="/daily">오늘의 말씀</Link>
          <Link href="/reading-plan">통독</Link>
        </nav>
        <div className="header-actions">
          <Link
            className="icon-button"
            href="/search"
            aria-label="성경 전체 검색"
          >
            <Search size={19} />
          </Link>
          <details className="main-menu">
            <summary aria-label="전체 메뉴">
              <Menu size={21} />
            </summary>
            <nav aria-label="전체 메뉴 항목">
              {links.map(([href, label]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
