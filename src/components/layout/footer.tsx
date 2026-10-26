import Link from "next/link";
import { MessageCircle } from "lucide-react";
import Logo from "@/components/icons/logo";
import InstagramIcon from "@/components/icons/instagram-icon";
import { navLinks, address } from "@/lib/constants";
import { getSiteSettings } from "@/lib/site-settings";

export default async function Footer() {
  const { businessHours, socialLinks } = await getSiteSettings();

  return (
    <footer className="bg-[#352B28] text-[#FAF8F6]" aria-label="Rodapé">
      <div className="container-maflo py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-12 border-b border-white/10">
          <div className="lg:col-span-1 flex flex-col gap-5">
            <Logo variant="light" />
            <p className="font-sans text-sm leading-relaxed text-white/55 max-w-[220px]">
              Onde o café encontra o conceito. Experiência autoral, um grão por vez.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-sans text-xs tracking-widest uppercase text-[#C58B66] font-medium">
              Menu
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-sans text-sm text-white/65 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-sans text-xs tracking-widest uppercase text-[#C58B66] font-medium">
              Horários
            </h3>
            <ul className="flex flex-col gap-2" role="list">
              {businessHours.map((h) => (
                <li key={h.day} className="flex flex-col gap-0.5">
                  <span className="font-sans text-xs text-white/40 uppercase tracking-wide">
                    {h.day}
                  </span>
                  <span className="font-heading text-base text-white/85">{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-sans text-xs tracking-widest uppercase text-[#C58B66] font-medium">
              Contato
            </h3>
            <div className="flex flex-col gap-3">
              <address className="not-italic font-sans text-sm text-white/65 leading-relaxed">
                {address.street}
                <br />
                {address.neighborhood}
                <br />
                {address.city}
              </address>
              <div className="flex flex-col gap-2 mt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Seguir a Maflô no ${social.platform}`}
                    className="flex items-center gap-2 font-sans text-sm text-white/65 hover:text-[#C58B66] transition-colors duration-200"
                  >
                                    {social.platform === "instagram" ? (
                      <InstagramIcon size={15} strokeWidth={1.5} aria-hidden={true} />
                    ) : (
                      <MessageCircle size={15} strokeWidth={1.5} aria-hidden={true} />
                    )}
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-sans text-xs text-white/35">
            © {new Date().getFullYear()} Maflô Cafeteria Conceito. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacidade"
              className="font-sans text-xs text-white/35 hover:text-white/60 transition-colors duration-300"
            >
              Política de Privacidade
            </Link>
            <Link
              href="/termos"
              className="font-sans text-xs text-white/35 hover:text-white/60 transition-colors duration-300"
            >
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
