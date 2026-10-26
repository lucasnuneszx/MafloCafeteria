"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionTitle from "@/components/shared/section-title";
import Reveal from "@/components/shared/reveal";
import { getLenis } from "@/lib/lenis";

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.97, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0.7, 1]);

  return (
    <section id="experiencia" className="section-py bg-gradient-to-b from-[#FAF8F6] via-[#FAF8F6] to-white" ref={sectionRef}>
      <div className="container-maflo">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text block */}
          <div className="flex flex-col gap-6">
            <SectionTitle
              eyebrow="02 — Experiência"
              title="Um convite ao silêncio produtivo."
              align="left"
            />
            <Reveal delay={0.15}>
              <p className="text-body font-sans">
                Do primeiro gole ao último detalhe da mesa, cada gesto aqui foi pensado para
                acolher. Atendimento próximo, ambiente sereno, um convite ao silêncio produtivo.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="text-body font-sans">
                Não vendemos pressa. Nosso espaço foi projetado para que você encontre o ritmo
                certo — seja para trabalhar com foco, conversar com calma ou simplesmente estar.
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <button
                onClick={() => {
                  const el = document.querySelector<HTMLElement>("#localizacao");
                  if (!el) return;
                  const lenis = getLenis();
                  if (lenis) {
                    lenis.scrollTo(el, { offset: -64 });
                  } else {
                    el.scrollIntoView({ behavior: "auto" });
                  }
                }}
                className="btn-primary self-start mt-2 border-none cursor-pointer"
              >
                Como nos encontrar
              </button>
            </Reveal>
          </div>

          {/* Image with scroll-driven scale, kept in its original portrait format */}
          <Reveal variant="scaleIn" delay={0.1}>
            <motion.div
              style={{ scale, opacity }}
              className="relative w-full max-w-md mx-auto lg:max-w-none overflow-hidden rounded-2xl"
            >
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src="/images/ambiente-salao.jpg"
                  alt="Salão da Maflô com pergolado de flores brancas sobre as mesas, iluminação em fitas de LED e mobiliário de madeira"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  quality={85}
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-[#352B28]/10" />
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
