import { Star } from "lucide-react";
import SectionTitle from "@/components/shared/section-title";
import Reveal from "@/components/shared/reveal";
import { getSiteSettings } from "@/lib/site-settings";

export default async function GoogleReviewSection() {
  const { googleReviewUrl } = await getSiteSettings();

  return (
    <section id="avaliacoes" className="section-py bg-[#352B28]">
      <div className="container-maflo">
        <div className="flex flex-col items-center gap-8 text-center">
          <Reveal>
            <div className="flex items-center gap-1" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={22}
                  className="text-[#C58B66] fill-[#C58B66]"
                  strokeWidth={1}
                />
              ))}
            </div>
          </Reveal>

          <SectionTitle
            eyebrow="07 — Avaliações"
            title="Sua opinião importa para nós."
            subtitle="Se você viveu a experiência Maflô, deixe sua avaliação no Google e ajude outras pessoas a nos encontrar."
            align="center"
            light
          />

          <Reveal delay={0.2}>
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Avaliar a Maflô no Google"
              className="btn-outline-white"
            >
              Avaliar no Google
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
