import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import ConceptSection from "@/components/sections/concept-section";
import ExperienceSection from "@/components/sections/experience-section";
import GallerySection from "@/components/sections/gallery-section";
import EventBookingSection from "@/components/sections/event-booking-section";
import AgendaSection from "@/components/sections/agenda-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import GoogleReviewSection from "@/components/sections/google-review-section";
import InstagramSection from "@/components/sections/instagram-section";
import LocationSection from "@/components/sections/location-section";
import CookieBanner from "@/components/shared/cookie-banner";
import { getSiteSettings } from "@/lib/site-settings";

// Content on this page (agenda, site settings) is DB-backed and
// editable from /admin — this must live on the page/route file itself.
// Next.js only reads route segment config (revalidate, dynamic, etc.) from
// page.tsx/layout.tsx/route.ts, never from an imported component module.
export const revalidate = 300;

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <ConceptSection />
        <ExperienceSection />
        <GallerySection />
        <EventBookingSection whatsappNumber={settings.whatsappNumber} />
        <AgendaSection />
        <TestimonialsSection />
        <GoogleReviewSection />
        <InstagramSection instagramLink={settings.socialLinks.find((s) => s.platform === "instagram")?.url ?? "#"} />
        <LocationSection />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
