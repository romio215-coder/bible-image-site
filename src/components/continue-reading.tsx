"use client";
import Link from "next/link";
import { books, chapterPath } from "@/lib/bible";
import { useUserData } from "@/lib/user-store";
export function ContinueReading() {
  const { last } = useUserData();
  return (
    <Link
      href={last ? chapterPath(last) : "/bible/genesis/1"}
      className="button primary"
    >
      {last
        ? `${books.find((b) => b.book === last.book)?.name} ${last.chapter}장 계속 읽기`
        : "성경 읽기 시작"}{" "}
      →
    </Link>
  );
}
