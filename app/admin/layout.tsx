"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderOpen,
  Tags,
  Image,
  Mail,
  Settings,
  ChevronLeft,
} from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderOpen },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Media Library", href: "/admin/media", icon: Image },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Don't show admin layout for sign-in page
  if (pathname.startsWith("/admin/sign-in")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#05070A] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[#1E293B] bg-[#0E141D]">
        {/* Logo */}
        <div className="p-5 border-b border-[#1E293B]">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F59E0B] flex items-center justify-center font-bold text-[#05070A] text-xs">
              I.Y
            </div>
            <div>
              <div className="text-sm font-semibold">ENGINEERING</div>
              <div className="text-[9px] tracking-[0.15em] text-[#64748B] uppercase">
                Admin Panel
              </div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                    : "text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#101722]"
                )}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Back to site */}
        <div className="p-4 border-t border-[#1E293B]">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#F59E0B] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 border-b border-[#1E293B] bg-[#0E141D]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            {/* Mobile menu placeholder */}
            <div className="lg:hidden">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center font-bold text-[#05070A] text-xs">
                  I.Y
                </div>
              </Link>
            </div>
            <h2 className="text-sm font-medium text-[#94A3B8]">Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-[#64748B] hover:text-[#F59E0B] transition-colors hidden sm:block"
            >
              View Site →
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
