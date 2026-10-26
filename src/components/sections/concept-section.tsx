"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionTitle from "@/components/shared/section-title";
import Reveal from "@/components/shared/reveal";
import SectionDivider from "@/components/shared/section-divider";

export default function ConceptSection() {
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  // Subtle parallax: moves image slightly slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section id="conceito" className="section-py bg-gradient-to-b from-[#FAF8F6] via-[#FAF8F6] to-white">
      <div className="container-maflo">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text column */}
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            <SectionTitle
              eyebrow="01 — Conceito"
              title="O café como linguagem."
              align="left"
            />

            <div className="flex flex-col gap-5">
              <Reveal delay={0.25}>
                <p className="text-body font-sans">
                  A Maflô nasceu do desejo de tratar o café como linguagem — cada xícara é
                  resultado de curadoria, tempo e técnica. Um espaço para desacelerar.
                </p>
              </Reveal>
              <Reveal delay={0.35}>
                <p className="text-body font-sans">
                  Trabalhamos com grãos de origem única, selecionados de pequenos produtores que
                  partilham o mesmo cuidado com o processo. Do cultivo à extração, cada etapa é
                  tratada com intenção.
                </p>
              </Reveal>
              <Reveal delay={0.45}>
                <p className="text-body font-sans">
                  Nosso espaço foi projetado para acolher — seja o trabalho silencioso, a conversa
                  que rende, ou simplesmente o prazer de existir por um momento.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.55}>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-3xl text-[#C58B66]">12+</span>
                  <span className="font-sans text-xs text-muted uppercase tracking-wide">
                    Origens de grão
                  </span>
                </div>
                <div className="w-px h-10 bg-[#E8E2DD]" aria-hidden="true" />
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-3xl text-[#C58B66]">8</span>
                  <span className="font-sans text-xs text-muted uppercase tracking-wide">
                    Métodos especiais
                  </span>
                </div>
                <div className="w-px h-10 bg-[#E8E2DD]" aria-hidden="true" />
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-3xl text-[#C58B66]">100%</span>
                  <span className="font-sans text-xs text-muted uppercase tracking-wide">
                    Autoral
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Image column with parallax */}
          <div
            ref={imageRef}
            className="relative order-1 lg:order-2 overflow-hidden rounded-xl"
            style={{ aspectRatio: "4/5" }}
          >
            {/* Floral watermark behind image */}
            <div className="absolute -top-8 -right-8 z-0 floral-watermark" aria-hidden="true">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="80" stroke="#C58B66" strokeWidth="0.8" />
                <circle cx="100" cy="100" r="50" stroke="#C58B66" strokeWidth="0.8" />
                <circle cx="100" cy="100" r="20" fill="#C58B66" opacity="0.3" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <ellipse
                    key={angle}
                    cx="100"
                    cy="100"
                    rx="8"
                    ry="35"
                    fill="#C58B66"
                    opacity="0.4"
                    transform={`rotate(${angle} 100 100)`}
                  />
                ))}
              </svg>
            </div>

            <motion.div
              style={{ y }}
              className="absolute inset-0 z-10"
            >
              <Image
                src="/images/concept-photo.png"
                alt="Barista da Maflô preparando V60 com chaleira de cobre — detalhe do método artesanal"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={85}
              />
            </motion.div>
          </div>
        </div>

        {/* Divider */}
        <SectionDivider className="mt-20 lg:mt-28" />
      </div>
    </section>
  );
}
