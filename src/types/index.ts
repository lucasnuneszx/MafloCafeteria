// src/types/index.ts

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface SocialLink {
  platform: "instagram" | "whatsapp";
  url: string;
  label: string;
}

export interface BusinessHours {
  day: string;
  hours: string;
}

export interface AgendaItem {
  id: number;
  dayLabel: string;
  title: string;
  description: string | null;
  timeLabel: string | null;
  isToday: boolean;
}
