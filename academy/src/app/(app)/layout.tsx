import Link from "next/link";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/LogoutButton";
import { getSessionProfile } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { profile } = await getSessionProfile();
  if (!profile) redirect("/login");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Logo />
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-xs font-medium text-ink2 transition hover:text-ink">
              Meine Kurse
            </Link>
            {profile.role === "admin" && (
              <Link href="/admin" className="text-xs font-semibold text-accent transition hover:text-accenth">
                Admin
              </Link>
            )}
            <span className="hidden text-xs text-ink3 sm:inline">{profile.full_name || profile.email}</span>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </div>
  );
}
