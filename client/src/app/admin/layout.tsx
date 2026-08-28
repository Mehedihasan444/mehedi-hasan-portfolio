"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Skills", href: "/admin/skills" },
  { label: "Experiences", href: "/admin/experiences" },
  { label: "Education", href: "/admin/education" },
  { label: "Certifications", href: "/admin/certifications" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Achievements", href: "/admin/achievements" },
  { label: "Blog", href: "/admin/blog" },
  { label: "Messages", href: "/admin/messages" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const token = localStorage.getItem("admin_token");
    if (!token && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-emerald h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  const handleLogout = () => {
    api.logout();
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-white/5 bg-[oklch(0.04_0.01_260)]">
        <div className="flex items-center justify-center gap-2 border-b border-white/5 px-6 py-5">
          <Link href="/" className="text-gradient text-lg font-bold">
            MH
          </Link>
          <span className="text-muted-foreground text-sm">Admin</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {sidebarLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all ${
                  active
                    ? "from-emerald/10 to-teal/10 bg-gradient-to-r text-white"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/5 p-4">
          <button
            onClick={handleLogout}
            className="text-muted-foreground w-full rounded-lg px-4 py-2 text-sm transition-colors hover:bg-white/5 hover:text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
