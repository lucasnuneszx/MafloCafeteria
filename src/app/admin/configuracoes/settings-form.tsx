"use client";

import { useTransition, type FormEvent } from "react";
import { motion } from "framer-motion";
import { MessageCircle, MapPin, Star, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSiteSettings } from "@/lib/actions/settings";
import { useToast } from "@/app/admin/ui-provider";

const easeOut = [0.22, 1, 0.36, 1] as const;

interface Settings {
  whatsappNumber: string;
  instagramUrl: string;
  mapsEmbedUrl: string;
  googleReviewUrl: string;
  hoursWeekday: string;
  hoursSaturday: string;
  hoursSunday: string;
}

function Section({
  icon: Icon,
  title,
  description,
  delay,
  children,
}: {
  icon: typeof MessageCircle;
  title: string;
  description: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: easeOut }}
      className="rounded-2xl border border-[#E8E2DD] bg-white p-6 sm:p-8 shadow-maflo"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#C58B66]/10 text-[#C58B66]">
          <Icon size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="font-heading text-xl text-[#352B28]">{title}</h2>
          <p className="font-sans text-sm text-[rgba(53,43,40,0.55)]">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

export default function SettingsForm({ settings }: { settings: Settings }) {
  const [isPending, startTransition] = useTransition();
  const showToast = useToast();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await updateSiteSettings(formData);
        showToast("Configurações salvas — o site atualiza em até 5 minutos.");
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Não foi possível salvar.", "error");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Section icon={MessageCircle} title="Contato" description="WhatsApp e Instagram exibidos no site." delay={0}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="whatsappNumber">Número do WhatsApp</Label>
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              defaultValue={settings.whatsappNumber}
              required
              className="mt-1"
              placeholder="5511999999999"
            />
            <p className="font-sans text-xs text-[rgba(53,43,40,0.45)] mt-1">
              Só números, com DDI (55) e DDD.
            </p>
          </div>
          <div>
            <Label htmlFor="instagramUrl">Link do Instagram</Label>
            <Input
              id="instagramUrl"
              name="instagramUrl"
              type="url"
              defaultValue={settings.instagramUrl}
              required
              className="mt-1"
            />
          </div>
        </div>
      </Section>

      <Section icon={MapPin} title="Localização" description="Mapa incorporado na seção de contato do site." delay={0.08}>
        <div>
          <Label htmlFor="mapsEmbedUrl">URL do Google Maps (incorporar)</Label>
          <Input
            id="mapsEmbedUrl"
            name="mapsEmbedUrl"
            type="url"
            defaultValue={settings.mapsEmbedUrl}
            required
            className="mt-1"
          />
          <p className="font-sans text-xs text-[rgba(53,43,40,0.45)] mt-1">
            No Google Maps: Compartilhar → Incorporar um mapa → copiar o link de dentro do{" "}
            <code>src=&quot;...&quot;</code>.
          </p>
        </div>
      </Section>

      <Section icon={Star} title="Avaliações" description="Link para avaliar a Maflô no Google." delay={0.16}>
        <div>
          <Label htmlFor="googleReviewUrl">Link de avaliação no Google</Label>
          <Input
            id="googleReviewUrl"
            name="googleReviewUrl"
            type="url"
            defaultValue={settings.googleReviewUrl}
            required
            className="mt-1"
          />
        </div>
      </Section>

      <Section icon={Clock} title="Horário de funcionamento" description="Exibido no site e no rodapé." delay={0.24}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="hoursWeekday">Segunda a sexta</Label>
            <Input id="hoursWeekday" name="hoursWeekday" defaultValue={settings.hoursWeekday} required className="mt-1" placeholder="08h — 20h" />
          </div>
          <div>
            <Label htmlFor="hoursSaturday">Sábado</Label>
            <Input id="hoursSaturday" name="hoursSaturday" defaultValue={settings.hoursSaturday} required className="mt-1" placeholder="09h — 19h" />
          </div>
          <div>
            <Label htmlFor="hoursSunday">Domingo</Label>
            <Input id="hoursSunday" name="hoursSunday" defaultValue={settings.hoursSunday} required className="mt-1" placeholder="10h — 17h" />
          </div>
        </div>
      </Section>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isPending}
        className="btn-primary self-start"
      >
        {isPending ? "Salvando…" : "Salvar configurações"}
      </motion.button>
    </form>
  );
}
