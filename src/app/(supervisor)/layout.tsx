import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { memberNav, supervisorNav } from "@/config/navigation";

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar navItems={[...memberNav, ...supervisorNav]} />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      <Footer />
    </>
  );
}
