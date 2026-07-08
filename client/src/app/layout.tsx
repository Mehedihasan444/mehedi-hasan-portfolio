import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/providers";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ClientAnimations } from "@/components/animations/client-animations";
import { PageTransition } from "@/providers/page-transition";
import { Toaster } from "@/components/ui/sonner";
import { LoadingScreen } from "@/components/layout/loading-screen";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const siteUrl = "https://mehedi-hasan.dev";
const siteTitle = "Mehedi Hasan — Full Stack Developer & Software Engineer";
const siteDescription =
  "Full Stack Developer & Software Engineer based in Dhaka, Bangladesh. Specializing in React, Next.js, Node.js, TypeScript, and modern web technologies. Building scalable, high-performance applications.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#059669",
};

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s | Mehedi Hasan",
  },
  description: siteDescription,
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
  authors: [{ name: "Mehedi Hasan", url: siteUrl }],
  creator: "Mehedi Hasan",
  publisher: "Mehedi Hasan",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Mehedi Hasan",
    title: siteTitle,
    description: siteDescription,
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
    title: siteTitle,
    description: siteDescription,
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
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  category: "technology",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mehedi Hasan",
  url: siteUrl,
  image: `${siteUrl}/profile.jpg`,
  jobTitle: "Full Stack Developer",
  description: siteDescription,
  email: "mehedihasan67705251@gmail.com",
  telephone: "+8801767705251",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dhaka",
    addressCountry: "Bangladesh",
    addressRegion: "Dhaka",
  },
  sameAs: [
    "https://github.com/Mehedihasan444",
    "https://linkedin.com/in/mehedi-hasan-893500301",
    "https://twitter.com/MEHEDIH60833052",
  ],
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <ClientAnimations />
        <Providers>
          <SmoothScrollProvider>
            <LoadingScreen />
            <Navbar />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </SmoothScrollProvider>
        </Providers>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
