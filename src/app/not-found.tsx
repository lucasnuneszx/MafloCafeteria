// src/app/not-found.tsx
import Link from "next/link";
import Logo from "@/components/icons/logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F6] px-6 text-center gap-8">
      <Logo variant="dark" />

      <div className="flex flex-col gap-4 max-w-sm">
        <p className="text-eyebrow">404 — Página não encontrada</p>
        <h1 className="font-heading text-4xl text-[#352B28]">
          Esta página não existe.
        </h1>
        <p className="font-sans text-sm text-muted leading-relaxed">
          Mas ainda temos uma xícara esperando por você.
        </p>
      </div>

      <Link
        href="/"
        className="btn-primary"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
