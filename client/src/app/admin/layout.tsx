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
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount gate avoids SSR mismatch
    setMounted(true);
    let token: string | null = null;
    try {
      token = localStorage.getItem("admin_token");
    } catch {
      token = null;
    }
    if (!token && pathname !== "/admin/login") {
      router.push("/admin/login");
      return;
    }
    setAuthed(!!token || pathname === "/admin/login");
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!mounted || !authed) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        role="status"
        aria-label="Loading admin"
      >
        <div className="border-emerald h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  const handleLogout = () => {
    void api.logout();
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-white/5 bg-[#0a0f1e] md:flex">
        <div className="flex items-center justify-center gap-2 border-b border-white/5 px-6 py-5">
          <Link href="/" className="text-gradient text-lg font-bold">
            MH
          </Link>
          <span className="text-muted-foreground text-sm">Admin</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4" aria-label="Admin navigation">
          {sidebarLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
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

      <div className="flex flex-1 flex-col md:ml-64">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-[#050810]/90 p-4 backdrop-blur md:hidden">
          <span className="text-gradient font-bold">MH Admin</span>
          <button
            onClick={handleLogout}
            className="text-muted-foreground rounded-lg border border-white/10 px-3 py-1.5 text-xs"
          >
            Logout
          </button>
        </div>
        <nav
          className="flex gap-2 overflow-x-auto border-b border-white/5 p-3 md:hidden"
          aria-label="Admin navigation mobile"
        >
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${
                pathname === link.href
                  ? "bg-white/10 text-white"
                  : "text-muted-foreground bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
