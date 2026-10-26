import { cache } from "react";
import { getDb } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import type { SocialLink, BusinessHours } from "@/types";

const DEFAULTS = {
  whatsappNumber: "5500000000000",
  instagramUrl: "https://instagram.com/maflocafeteria",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=R.+Marcos+Freire,+364+-+Caminho+das+%C3%81rvores,+Salvador+-+BA,+41820-780&t=&z=16&ie=UTF8&iwloc=&output=embed",
  googleReviewUrl: "https://share.google/ukZFHXFT9UAJK7aht",
  hoursWeekday: "08h — 20h",
  hoursSaturday: "09h — 19h",
  hoursSunday: "10h — 17h",
};

/**
 * Editable site content (contact links, business hours) — stored in the
 * single-row `site_settings` table so the team can change it from
 * /admin/configuracoes without needing a code change + redeploy.
 *
 * Wrapped in React's `cache()` for request-level memoization: every server
 * component that needs this (Footer, LocationSection, InstagramSection...)
 * can call it independently without causing extra DB round-trips within the
 * same render pass.
 */
export const getSiteSettings = cache(async () => {
  const db = getDb();
  const rows = await db.select().from(siteSettings).limit(1);
  const row = rows[0] ?? DEFAULTS;

  const whatsappNumber = row.whatsappNumber;

  const businessHours: BusinessHours[] = [
    { day: "Segunda a Sexta", hours: row.hoursWeekday },
    { day: "Sábado", hours: row.hoursSaturday },
    { day: "Domingo", hours: row.hoursSunday },
  ];

  const socialLinks: SocialLink[] = [
    { platform: "instagram", url: row.instagramUrl, label: "@maflocafeteria" },
    {
      platform: "whatsapp",
      url: `https://wa.me/${whatsappNumber}?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20Maflô.`,
      label: "WhatsApp",
    },
  ];

  return {
    whatsappNumber,
    instagramUrl: row.instagramUrl,
    mapsEmbedUrl: row.mapsEmbedUrl,
    googleReviewUrl: row.googleReviewUrl,
    hoursWeekday: row.hoursWeekday,
    hoursSaturday: row.hoursSaturday,
    hoursSunday: row.hoursSunday,
    businessHours,
    socialLinks,
  };
});
