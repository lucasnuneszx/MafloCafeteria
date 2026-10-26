"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { fadeUp } from "@/lib/motion-variants";
import type { Testimonial } from "@/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  delay?: number;
}

export default function TestimonialCard({ testimonial, delay = 0 }: TestimonialCardProps) {
  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        ...fadeUp,
        visible: {
          ...fadeUp.visible as object,
          transition: {
            ...(fadeUp.visible as { transition?: object })?.transition,
            delay,
          },
        },
      }}
      className="flex flex-col gap-6 p-8 bg-white border border-[#E8E2DD] rounded-xl shadow-maflo"
    >
      <Quote
        size={22}
        className="text-[#C58B66]"
        strokeWidth={1.5}
        aria-hidden="true"
      />

      <blockquote className="font-sans text-base italic leading-relaxed text-[rgba(53,43,40,0.8)] flex-1">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <footer className="flex flex-col gap-0.5 border-t border-[#E8E2DD] pt-4">
        <cite className="font-heading not-italic text-base font-500 text-[#352B28]">
          {testimonial.author}
        </cite>
        {testimonial.role && (
          <p className="font-sans text-xs text-muted tracking-wide">{testimonial.role}</p>
        )}
      </footer>
    </motion.article>
  );
}
