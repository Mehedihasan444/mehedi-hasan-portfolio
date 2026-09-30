import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/providers";
import { Toaster } from "@/components/ui/sonner";
import {
  SITE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SOCIAL_LINKS,
  EMAIL,
  PHONE,
} from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#059669",
};

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s | Mehedi Hasan",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Full Stack Developer",
    "Software Engineer",
    "AI Engineer",
    "Machine Learning Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript Developer",
    "Backend Engineer",
    "Bangladesh Software Engineer",
    "Remote Full Stack Developer",
    "Open Source Developer",
    "Mehedi Hasan",
    "Dhaka Developer",
    "Node.js Developer",
    "PostgreSQL Developer",
    "Prisma ORM",
    "MongoDB Developer",
    "Express.js Developer",
    "Web Developer Bangladesh",
  ],
  authors: [{ name: "Mehedi Hasan", url: SITE_URL }],
  creator: "Mehedi Hasan",
  publisher: "Mehedi Hasan",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Mehedi Hasan",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mehedi Hasan — Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: "@MEHEDIH60833052",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  category: "technology",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mehedi Hasan",
  url: SITE_URL,
  image: `${SITE_URL}/mehedi_hasan.webp`,
  jobTitle: "Full Stack Developer",
  description: SITE_DESCRIPTION,
  email: EMAIL,
  telephone: PHONE,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dhaka",
    addressCountry: "Bangladesh",
    addressRegion: "Dhaka",
  },
  sameAs: [SOCIAL_LINKS.github, SOCIAL_LINKS.linkedin, SOCIAL_LINKS.twitter],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "MongoDB",
    "Prisma",
    "Mongoose",
    "Redux",
    "Tailwind CSS",
    "Docker",
    "Git",
    "Python",
    "Java",
    "REST APIs",
    "GraphQL",
    "Full Stack Development",
    "Software Engineering",
  ],
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Daffodil International University",
  },
  nationality: {
    "@type": "Country",
    name: "Bangladesh",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
        <Toaster position="bottom-right" />
        <Script
          id="schema-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
