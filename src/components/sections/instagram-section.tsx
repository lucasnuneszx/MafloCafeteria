"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionTitle from "@/components/shared/section-title";
import Reveal from "@/components/shared/reveal";
import InstagramIcon from "@/components/icons/instagram-icon";
import { galleryImages } from "@/lib/constants";

const instagramPosts = galleryImages.slice(0, 8);

export default function InstagramSection({ instagramLink }: { instagramLink: string }) {
  return (
    <section id="instagram" className="section-py bg-gradient-to-b from-white via-white to-[#FAF8F6]">
      <div className="container-maflo">
        <div className="flex flex-col items-center gap-6 mb-12">
          <SectionTitle
            eyebrow="08 — Instagram"
            title="Siga a Maflô."
            subtitle="Acompanhe o dia a dia do espaço, novidades do menu e os bastidores de quem faz o café acontecer."
            align="center"
          />
          <Reveal delay={0.3}>
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Seguir Maflô no Instagram"
              className="btn-outline flex items-center gap-2"
            >
                          <InstagramIcon size={16} strokeWidth={1.5} aria-hidden={true} />
              Seguir no Instagram
            </a>
          </Reveal>
        </div>

        {/* Grid: 4x2 desktop, 2x4 tablet, 2x4 mobile with horizontal scroll on xs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver post no Instagram: ${post.alt}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative aspect-square overflow-hidden rounded-md bg-[#E8E2DD] group block"
            >
              <Image
                src={post.src}
                alt={post.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#352B28]/0 group-hover:bg-[#352B28]/40 transition-all duration-300 flex items-center justify-center">
                                  <InstagramIcon
                  size={22}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  strokeWidth={1.5}
                  aria-hidden={true}
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
