import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { memberNav, boardNav } from "@/config/navigation";

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar navItems={[...memberNav, ...boardNav]} />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      <Footer />
    </>
  );
}
