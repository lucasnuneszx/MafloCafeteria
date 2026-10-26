"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Logo from "@/components/icons/logo";
import { heroStagger, fadeUp, fadeIn } from "@/lib/motion-variants";
import { getLenis } from "@/lib/lenis";

export default function Hero() {
  const handleScroll = (href: string) => {
    const el = document.querySelector<HTMLElement>(href);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(el, { offset: -64 });
    } else {
      el.scrollIntoView({ behavior: "auto" });
    }
  };

  return (
    <section
      id="inicio"
      className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-gradient-to-b from-[#F4EFEA] via-[#F4EFEA] to-[#FAF8F6]"
      aria-label="Seção principal — Maflô Cafeteria"
    >
      {/* Delicate botanical line-art background elements for premium feel */}
      <div className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none select-none flex items-center justify-center overflow-hidden">
        {/* Left organic shape */}
        <svg
          className="absolute -left-20 -bottom-20 w-[500px] h-[500px] text-[#C58B66]"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20,100 C40,40 100,20 180,60 C140,120 110,180 20,100 Z"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            d="M50,120 C70,70 110,50 160,80"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
        </svg>

        {/* Right elegant branch */}
        <svg
          className="absolute -right-32 -top-12 w-[600px] h-[600px] text-[#C58B66]"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main branch curve */}
          <path
            d="M20,180 Q100,140 150,50"
            stroke="currentColor"
            strokeWidth="0.75"
          />
          {/* Leaves/petals */}
          <path d="M70,145 Q60,125 50,135 Q65,140 70,145 Z" fill="currentColor" />
          <path d="M100,120 Q115,100 125,110 Q110,115 100,120 Z" fill="currentColor" />
          <path d="M125,90 Q115,70 105,80 Q120,85 125,90 Z" fill="currentColor" />
          <path d="M142,65 Q157,45 167,55 Q152,60 142,65 Z" fill="currentColor" />
          
          <circle cx="150" cy="50" r="3" fill="currentColor" />
        </svg>
      </div>

      {/* Content */}
      <div className="container-maflo relative z-10 flex flex-1 flex-col items-center justify-center text-center gap-8 pt-20">
        <motion.div
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6 max-w-4xl"
        >
          {/* Real Brand Logo showcase */}
          <motion.div variants={fadeUp} className="mb-4">
            <Logo variant="dark" height={160} />
          </motion.div>

          {/* H1 */}
          <motion.h1
            variants={fadeUp}
            className="text-hero text-[#352B28]"
          >
            Onde o café encontra
            <br />
            <em className="not-italic text-[#C58B66]">o conceito.</em>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="font-sans text-base md:text-lg text-[#352B28]/85 max-w-lg leading-relaxed font-medium"
          >
            Grãos selecionados, métodos autorais e um espaço pensado para durar na memória.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center gap-3 mt-2"
          >
            <button
              onClick={() => handleScroll("#conceito")}
              className="btn-primary min-w-[200px]"
            >
              Conheça a experiência
            </button>
            <button
              onClick={() => handleScroll("#galeria")}
              className="btn-outline min-w-[200px] bg-white/40"
            >
              Ver galeria
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.2 }}
        className="relative z-10 flex flex-col items-center gap-2 pb-8 pt-4"
        aria-hidden="true"
      >
        <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#352B28]/50">
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-[#352B28]/50" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
