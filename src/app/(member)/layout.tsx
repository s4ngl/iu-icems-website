import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { memberNav } from "@/config/navigation";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar navItems={memberNav} />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      <Footer />
    </>
  );
}
