import Link from "next/link";

export default function Logo({ href = "/dashboard" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-baseline gap-1.5 text-ink">
      <span className="text-lg font-black tracking-tight">
        virral<span className="text-accent">.</span>
      </span>
      <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink2">
        Academy
      </span>
    </Link>
  );
}
