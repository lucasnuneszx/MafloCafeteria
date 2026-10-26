// src/components/sections/testimonials-section.tsx
import SectionTitle from "@/components/shared/section-title";
import TestimonialCard from "@/components/shared/testimonial-card";
import SectionDivider from "@/components/shared/section-divider";
import { testimonials } from "@/lib/constants";

export default function TestimonialsSection() {
  return (
    <section id="depoimentos" className="section-py bg-gradient-to-b from-[#FAF8F6] via-[#FAF8F6] to-white">
      <div className="container-maflo">
        <SectionDivider className="mb-20" />

        <div className="flex flex-col items-center gap-14">
          <SectionTitle
            eyebrow="06 — Depoimentos"
            title="O que dizem quem frequenta."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
