import { Header } from "./header";
import { Footer } from "./footer";
export function PageShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main-content" className="content-page">
        <span className="eyebrow">WORDLIGHT BIBLE</span>
        <h1>{title}</h1>
        {intro && <p className="page-intro">{intro}</p>}
        {children}
      </main>
      <Footer />
    </>
  );
}
