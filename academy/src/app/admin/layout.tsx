import Link from "next/link";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/LogoutButton";
import { getSessionProfile } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { profile } = await getSessionProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-accent">
              Admin
            </span>
          </div>
          <nav className="flex items-center gap-6 text-xs font-medium">
            <Link href="/admin/kurse" className="text-ink2 transition hover:text-ink">Kurse</Link>
            <Link href="/admin/nutzer" className="text-ink2 transition hover:text-ink">Nutzer</Link>
            <Link href="/dashboard" className="text-ink2 transition hover:text-ink">Zur Academy</Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </div>
  );
}
