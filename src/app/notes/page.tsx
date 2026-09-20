import { PageShell } from "@/components/page-shell";
import { PersonalLibrary } from "@/components/personal-library";
export const metadata = { title: "묵상 메모", robots: { index: false } };
export default function Page() {
  return (
    <PageShell title="말씀 곁에 남긴 생각">
      <PersonalLibrary mode="notes" />
    </PageShell>
  );
}
