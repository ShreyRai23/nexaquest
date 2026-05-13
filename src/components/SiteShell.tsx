import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dots">
      <Navbar />
      <main className="pt-6">{children}</main>
      <Footer />
    </div>
  );
}
