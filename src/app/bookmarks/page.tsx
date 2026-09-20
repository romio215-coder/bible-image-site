import { PageShell } from "@/components/page-shell";
import { PersonalLibrary } from "@/components/personal-library";
export const metadata = { title: "저장한 말씀", robots: { index: false } };
export default function Page() {
  return (
    <PageShell title="마음에 담은 말씀">
      <PersonalLibrary mode="bookmarks" />
    </PageShell>
  );
}
