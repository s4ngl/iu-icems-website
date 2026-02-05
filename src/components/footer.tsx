import Link from "next/link";
import { siteConfig } from "@/config/site";
import { publicNav } from "@/config/navigation";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        {/* Brand & mission */}
        <div>
          <h2 className="text-lg font-bold text-foreground">{siteConfig.name}</h2>
          <p className="mt-2 text-sm">{siteConfig.description}</p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Quick Links</h3>
          <ul className="space-y-1">
            {publicNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Contact</h3>
          <p className="text-sm">
            Email:{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="underline transition-colors hover:text-foreground"
            >
              {siteConfig.email}
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-border px-4 py-4 text-center text-xs">
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
