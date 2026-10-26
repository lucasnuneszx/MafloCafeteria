import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import "./globals.css";
import { address } from "@/lib/constants";
import { getSiteSettings } from "@/lib/site-settings";
import SmoothScroll from "@/components/shared/smooth-scroll";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maflo.com.br"),
  title: "Maflô Cafeteria Conceito | Onde o café encontra o conceito",
  description:
    "Cafeteria de conceito com métodos especiais, curadoria autoral e ambiente exclusivo. Descubra a experiência Maflô.",
  keywords: [
    "cafeteria conceito",
    "café especial",
    "coffee shop premium",
    "Maflô",
    "métodos especiais",
    "café autoral",
  ],
  openGraph: {
    title: "Maflô Cafeteria Conceito",
    description: "Onde o café encontra o conceito.",
    url: "https://maflo.com.br",
    siteName: "Maflô Cafeteria Conceito",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maflô Cafeteria Conceito",
    description: "Onde o café encontra o conceito.",
  },
  robots: { index: true, follow: true },
};

function buildJsonLd(whatsappNumber: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: "Maflô Cafeteria Conceito",
    description:
      "Cafeteria de conceito com métodos especiais, curadoria autoral e ambiente exclusivo.",
    url: "https://maflo.com.br",
    telephone: `+${whatsappNumber}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${address.street}, ${address.neighborhood}`,
      addressLocality: "Salvador",
      addressRegion: "BA",
      postalCode: address.cep,
      addressCountry: "BR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday"],
        opens: "10:00",
        closes: "17:00",
      },
    ],
    servesCuisine: "Coffee",
    priceRange: "$$",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const jsonLd = buildJsonLd(settings.whatsappNumber);

  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#FAF8F6] text-[#352B28] antialiased">
        <ClerkProvider
          signInUrl="/admin/sign-in"
          signInFallbackRedirectUrl="/admin"
          afterSignOutUrl="/"
          localization={ptBR}
        >
          <SmoothScroll />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
