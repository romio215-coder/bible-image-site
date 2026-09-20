import Link from "next/link";
import { Header } from "@/components/header";
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="not-found">
        <span className="eyebrow">WORDLIGHT BIBLE</span>
        <h1>해당 성경 구절을 찾을 수 없습니다.</h1>
        <p>성경책과 장·절 번호를 확인해주세요.</p>
        <Link href="/bible/genesis/1" className="button primary">
          성경 읽기로 돌아가기
        </Link>
      </main>
    </>
  );
}
