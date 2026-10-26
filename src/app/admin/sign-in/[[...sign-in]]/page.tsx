"use client";

import { useState, useEffect, type FormEvent, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import Logo from "@/components/icons/logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const easeOut = [0.22, 1, 0.36, 1] as const;

// Each item gets its own explicit initial/animate with a manual delay,
// rather than relying on Framer Motion's variant propagation — the card
// itself needs an independent `animate` (via useAnimation) for the shake
// effect, and mixing that with inherited variants on its children silently
// breaks the inheritance chain, leaving them stuck invisible.
const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut, delay } },
});

function FloralMotif({ className }: { className?: string }) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      animate={{ rotate: [0, 4, 0] }}
      transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M20,180 Q100,140 150,50" stroke="currentColor" strokeWidth="0.75" />
      <path d="M70,145 Q60,125 50,135 Q65,140 70,145 Z" fill="currentColor" />
      <path d="M100,120 Q115,100 125,110 Q110,115 100,120 Z" fill="currentColor" />
      <path d="M125,90 Q115,70 105,80 Q120,85 125,90 Z" fill="currentColor" />
      <path d="M142,65 Q157,45 167,55 Q152,60 142,65 Z" fill="currentColor" />
      <circle cx="150" cy="50" r="3" fill="currentColor" />
    </motion.svg>
  );
}

export default function SignInPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const cardControls = useAnimation();
  const isLoading = fetchStatus === "fetching";

  // Subtle 3D tilt that follows the cursor across the card.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  useEffect(() => {
    cardControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut, delay: 0.1 },
    });
  }, [cardControls]);

  async function triggerShake() {
    await cardControls.start({
      x: [0, -10, 10, -8, 8, -4, 4, 0],
      transition: { duration: 0.5, ease: easeOut },
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGlobalError(null);

    const formData = new FormData(e.currentTarget);
    const identifier = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const { error } = await signIn.password({ identifier, password });
    if (error) {
      triggerShake();
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/admin");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url);
          }
        },
      });
    } else {
      setGlobalError(
        "Não foi possível concluir o login. Verifique as credenciais ou fale com o suporte."
      );
      triggerShake();
    }
  }

  return (
    <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-2 overflow-hidden bg-[#1a1512] lg:bg-[#FAF8F6]">
      {/* Full-bleed photo backdrop — always present so no breakpoint ever
          shows a bare page; on lg+ it's replaced by the crisp dedicated panel below. */}
      <div className="absolute inset-0 lg:hidden">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 14, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/images/ambiente-salao.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center blur-[2px] scale-105"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[#1a1512]/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1512]/40 via-transparent to-[#1a1512]/80" />
        <FloralMotif className="absolute -right-24 -top-20 w-[420px] h-[420px] text-[#C58B66] opacity-[0.15] pointer-events-none select-none" />
      </div>

      {/* Visual side (lg+) */}
      <div className="relative hidden lg:block overflow-hidden bg-[#1a1512]">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 12, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/images/ambiente-salao.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-70"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1512] via-[#1a1512]/50 to-[#1a1512]/20" />
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none select-none">
          <FloralMotif className="absolute -right-20 -top-16 w-[520px] h-[520px] text-[#C58B66]" />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <Logo variant="light" height={56} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: easeOut }}
            className="flex flex-col gap-4 max-w-md"
          >
            <p className="font-heading text-4xl xl:text-5xl leading-tight text-white">
              Onde o café encontra
              <br />
              <em className="not-italic text-[#C58B66]">o conceito.</em>
            </p>
            <p className="font-sans text-sm text-white/60 leading-relaxed">
              Painel de gestão da Maflô Cafeteria — agenda, reservas e financeiro em um só lugar.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form side */}
      <div className="relative flex items-center justify-center overflow-hidden px-6 py-16">
        {/* Ambient light accents (visible on both the cream and the photo backdrop) */}
        <motion.div
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#C58B66]/20 lg:bg-[#C58B66]/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-[#C58B66]/20 lg:bg-[#C58B66]/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* One unified card — logo, heading and form together, so it reads
            the same whether the backdrop is the photo or the cream panel. */}
        <div
          className="relative z-10 w-full max-w-sm"
          style={{ perspective: 1200 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Pulsing glow halo behind the card */}
          <motion.div
            aria-hidden="true"
            animate={{ opacity: [0.35, 0.65, 0.35] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-1.5 rounded-[1.5rem] bg-gradient-to-br from-[#C58B66]/50 via-[#C58B66]/10 to-[#C58B66]/50 blur-2xl pointer-events-none"
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={cardControls}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative overflow-hidden rounded-2xl border border-white/10 lg:border-[#E8E2DD] bg-white/95 backdrop-blur-2xl p-8 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.35)] lg:shadow-[0_20px_60px_rgba(53,43,40,0.1)]"
          >
            {/* Shimmering top accent */}
            <div className="absolute top-0 left-0 right-0 h-[3px] overflow-hidden">
              <motion.div
                animate={{ x: ["-120%", "220%"] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "linear", repeatDelay: 1.2 }}
                className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#C58B66] to-transparent"
              />
            </div>

            {/* Corner floral watermark */}
            <FloralMotif className="absolute -bottom-10 -left-10 w-40 h-40 text-[#C58B66] opacity-[0.07] pointer-events-none select-none" />

            <motion.div {...reveal(0.15)} className="relative flex lg:hidden justify-center mb-5">
              <Logo variant="dark" height={56} />
            </motion.div>

            <motion.div {...reveal(0.2)} className="relative flex flex-col items-center gap-3 text-center">
              <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#C58B66]/10">
                <motion.span
                  className="absolute inset-0 rounded-full border border-[#C58B66]/50"
                  animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <Lock size={22} className="text-[#C58B66]" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h1 className="font-heading text-3xl text-[#352B28]">Área administrativa</h1>
              <p className="font-sans text-sm text-[rgba(53,43,40,0.6)]">
                Acesso restrito à equipe Maflô.
              </p>
            </motion.div>

            <motion.div
              {...reveal(0.3)}
              className="relative h-px w-full bg-gradient-to-r from-transparent via-[#E8E2DD] to-transparent my-6"
            />

            <form onSubmit={handleSubmit} className="relative flex flex-col gap-5">
            <motion.div {...reveal(0.35)}>
              <Label htmlFor="email">E-mail</Label>
              <div className="relative mt-1 rounded-lg transition-shadow duration-300 focus-within:shadow-[0_0_0_4px_rgba(197,139,102,0.15)]">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(53,43,40,0.35)]"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="pl-9"
                  placeholder="voce@maflo.com"
                />
              </div>
              <AnimatePresence>
                {errors?.fields?.identifier && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="font-sans text-xs text-red-600 mt-1"
                  >
                    {errors.fields.identifier.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div {...reveal(0.4)}>
              <Label htmlFor="password">Senha</Label>
              <div className="relative mt-1 rounded-lg transition-shadow duration-300 focus-within:shadow-[0_0_0_4px_rgba(197,139,102,0.15)]">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(53,43,40,0.35)]"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="pl-9"
                />
              </div>
              <AnimatePresence>
                {errors?.fields?.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="font-sans text-xs text-red-600 mt-1"
                  >
                    {errors.fields.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {globalError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="font-sans text-xs text-red-600 -mt-1"
                >
                  {globalError}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              {...reveal(0.45)}
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="btn-primary justify-center mt-1 disabled:opacity-70"
            >
              {isLoading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="inline-flex"
                >
                  <Loader2 size={16} />
                </motion.span>
              ) : (
                <>
                  Entrar
                  <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
                </>
              )}
            </motion.button>
          </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
