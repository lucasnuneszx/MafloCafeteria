"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SectionTitle from "@/components/shared/section-title";
import Reveal from "@/components/shared/reveal";
import { galleryImages } from "@/lib/constants";

export default function GallerySection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const navigate = (direction: "prev" | "next") => {
    if (selectedIndex === null) return;
    const total = galleryImages.length;
    setSelectedIndex(
      direction === "next"
        ? (selectedIndex + 1) % total
        : (selectedIndex - 1 + total) % total
    );
  };

  const scrollCarousel = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-gallery-card]");
    const step = card ? card.offsetWidth + 16 : track.clientWidth * 0.8;
    track.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: "smooth",
    });
  };

  const selected = selectedIndex !== null ? galleryImages[selectedIndex] : null;

  return (
    <section id="galeria" className="section-py bg-gradient-to-b from-white via-white to-[#FAF8F6]">
      <div className="container-maflo">
        <div className="flex flex-col items-center gap-4 mb-14">
          <SectionTitle
            eyebrow="03 — Galeria"
            title="Cada detalhe tem intenção."
            align="center"
          />
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {galleryImages.map((img, index) => (
              <Reveal
                key={img.id}
                delay={index * 0.05}
                variant="scaleIn"
                className="shrink-0 snap-start w-[72%] sm:w-[42%] lg:w-[28%]"
              >
                <button
                  data-gallery-card
                  className="relative w-full overflow-hidden rounded-lg bg-[#E8E2DD] group cursor-pointer border-none p-0 aspect-[3/4]"
                  onClick={() => openLightbox(index)}
                  aria-label={`Ver foto: ${img.alt}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 72vw, (max-width: 1024px) 42vw, 28vw"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#352B28]/0 group-hover:bg-[#352B28]/30 transition-all duration-300 flex items-center justify-center">
                    <Expand
                      size={20}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </div>
                </button>
              </Reveal>
            ))}
          </div>

          {/* Carousel controls */}
          <button
            onClick={() => scrollCarousel("prev")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 items-center justify-center p-2.5 rounded-full bg-white text-[#352B28] shadow-maflo border border-[#E8E2DD] hover:bg-[#C58B66] hover:text-white transition-colors duration-300"
            aria-label="Fotos anteriores"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollCarousel("next")}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 items-center justify-center p-2.5 rounded-full bg-white text-[#352B28] shadow-maflo border border-[#E8E2DD] hover:bg-[#C58B66] hover:text-white transition-colors duration-300"
            aria-label="Próximas fotos"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Lightbox */}
        <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
          <DialogContent
            className="max-w-4xl w-full bg-[#1a1512] border-none p-0 overflow-hidden"
            aria-modal
          >
            <AnimatePresence mode="wait">
              {selected && (
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="relative"
                >
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={selected.src}
                      alt={selected.alt}
                      fill
                      className="object-contain"
                      sizes="90vw"
                      quality={90}
                    />
                  </div>

                  {/* Caption */}
                  <p className="px-6 py-3 font-sans text-xs text-white/50 text-center">
                    {selected.alt}
                  </p>

                  {/* Navigation */}
                  <button
                    onClick={() => navigate("prev")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors duration-300"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => navigate("next")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors duration-300"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Close */}
                  <button
                    onClick={closeLightbox}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors duration-300"
                    aria-label="Fechar galeria"
                  >
                    <X size={18} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
