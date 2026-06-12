import Logo from "@/components/Logo";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <div className="mb-8">
        <Logo href="/" />
      </div>
      <div className="card w-full max-w-md p-8">{children}</div>
      <p className="mt-8 text-xs text-ink3">
        © {new Date().getFullYear()} virral ·{" "}
        <a href="https://virral.de/impressum.html" className="hover:text-ink2">
          Impressum
        </a>{" "}
        ·{" "}
        <a href="https://virral.de/datenschutz.html" className="hover:text-ink2">
          Datenschutz
        </a>
      </p>
    </main>
  );
}
