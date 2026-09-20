import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
import { OfflineRegistration } from "@/components/offline-registration";
import { publicOrigin } from "@/lib/site";
import { ThemeSync } from "@/components/theme-sync";

export const metadata: Metadata = {
  title: {
    default: "말씀빛 Bible — 오늘, 말씀과 함께",
    template: "%s | 말씀빛 Bible",
  },
  description:
    "성경 66권을 읽고 마음에 닿는 말씀을 이미지 카드로 간직하세요. 검색, 묵상, 통독 기록을 함께하는 말씀빛 Bible.",
  metadataBase: new URL(publicOrigin() ?? "http://127.0.0.1:3000"),
  robots: { index: !!publicOrigin(), follow: !!publicOrigin() },
  appleWebApp: {
    capable: true,
    title: "말씀빛 Bible",
    statusBarStyle: "default",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <a className="skip-link" href="#main-content">
          본문으로 건너뛰기
        </a>
        {children}
        <OfflineRegistration />
        <ThemeSync />
      </body>
    </html>
  );
}
