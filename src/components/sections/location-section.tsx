import { MapPin, Clock, MessageCircle, Navigation } from "lucide-react";
import SectionTitle from "@/components/shared/section-title";
import Reveal from "@/components/shared/reveal";
import SectionDivider from "@/components/shared/section-divider";
import { address } from "@/lib/constants";
import { getSiteSettings } from "@/lib/site-settings";

export default async function LocationSection() {
  const { businessHours, socialLinks, mapsEmbedUrl } = await getSiteSettings();
  const whatsappLink = socialLinks.find((s) => s.platform === "whatsapp")?.url ?? "#";

  return (
    <section id="localizacao" className="section-py bg-[#FAF8F6]">
      <div className="container-maflo">
        <SectionDivider className="mb-20" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="flex flex-col gap-10">
            <SectionTitle
              eyebrow="09 — Localização"
              title="Nos encontre."
              align="left"
            />

            <Reveal delay={0.1}>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="text-[#C58B66] mt-0.5 shrink-0"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-sans text-sm text-muted uppercase tracking-widest mb-1">
                      Endereço
                    </p>
                    <address className="not-italic font-heading text-xl text-[#352B28] leading-relaxed">
                      {address.street}
                      <br />
                      {address.neighborhood}
                      <br />
                      {address.city}
                    </address>
                    <div className="flex flex-wrap gap-3 mt-4">
                      <a
                        href={address.googleMapsRouteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Traçar rota no Google Maps"
                        className="inline-flex items-center gap-2 font-sans text-sm font-medium px-4 py-2 rounded-md border border-[#C58B66] text-[#C58B66] hover:bg-[#C58B66] hover:text-white transition-colors duration-300"
                      >
                        <Navigation size={15} strokeWidth={1.5} aria-hidden="true" />
                        Google Maps
                      </a>
                      <a
                        href={address.wazeRouteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Traçar rota no Waze"
                        className="inline-flex items-center gap-2 font-sans text-sm font-medium px-4 py-2 rounded-md border border-[#C58B66] text-[#C58B66] hover:bg-[#C58B66] hover:text-white transition-colors duration-300"
                      >
                        <Navigation size={15} strokeWidth={1.5} aria-hidden="true" />
                        Waze
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex items-start gap-3">
                <Clock
                  size={18}
                  className="text-[#C58B66] mt-0.5 shrink-0"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-1 w-full">
                  <p className="font-sans text-sm text-muted uppercase tracking-widest mb-2">
                    Horários
                  </p>
                  <dl className="flex flex-col gap-2">
                    {businessHours.map((h) => (
                      <div
                        key={h.day}
                        className="flex items-center justify-between gap-4 py-2 border-b border-[#E8E2DD]"
                      >
                        <dt className="font-sans text-sm text-[rgba(53,43,40,0.65)]">{h.day}</dt>
                        <dd className="font-heading text-base text-[#352B28]">{h.hours}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Entrar em contato via WhatsApp"
                className="btn-primary self-start flex items-center gap-2"
              >
                <MessageCircle size={18} strokeWidth={1.5} aria-hidden="true" />
                Falar pelo WhatsApp
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="w-full">
            <div className="relative w-full overflow-hidden rounded-xl border border-[#E8E2DD] shadow-maflo">
              <div className="aspect-[4/3]">
                <iframe
                  src={mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "grayscale(20%) contrast(1.05)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização da Maflô Cafeteria no Google Maps"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-maflo flex items-center gap-2">
                <MapPin size={14} className="text-[#C58B66]" strokeWidth={2} aria-hidden="true" />
                <span className="font-sans text-xs font-medium text-[#352B28]">
                  Maflô Cafeteria
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
