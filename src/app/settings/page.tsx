import { PageShell } from "@/components/page-shell";
import { PersonalLibrary } from "@/components/personal-library";
export const metadata = { title: "설정과 백업", robots: { index: false } };
export default function Page() {
  return (
    <PageShell title="설정과 내 기록">
      <PersonalLibrary mode="settings" />
    </PageShell>
  );
}
