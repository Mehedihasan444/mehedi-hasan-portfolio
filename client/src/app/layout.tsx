import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/providers";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mehedi Hasan - Full Stack Developer",
    template: "%s | Mehedi Hasan",
  },
  description:
    "Full Stack Developer specializing in React, Next.js, Node.js, and TypeScript. Building scalable web applications with modern technologies.",
  keywords: [
    "Full Stack Developer",
    "Software Engineer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "Node.js Developer",
    "Bangladesh Software Engineer",
    "Remote Full Stack Developer",
    "Open Source Developer",
  ],
  authors: [{ name: "Mehedi Hasan" }],
  creator: "Mehedi Hasan",
  metadataBase: new URL("https://mehedi-hasan.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Mehedi Hasan",
    title: "Mehedi Hasan - Full Stack Developer",
    description: "Full Stack Developer specializing in React, Next.js, Node.js, and TypeScript.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mehedi Hasan - Full Stack Developer",
    description: "Full Stack Developer specializing in React, Next.js, Node.js, and TypeScript.",
    creator: "@MEHEDIH60833052",
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Mehedi Hasan",
              url: "https://mehedi-hasan.dev",
              jobTitle: "Full Stack Developer",
              email: "mehedihasan67705251@gmail.com",
              telephone: "+8801767705251",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Dhaka",
                addressCountry: "Bangladesh",
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
                "Node.js",
                "PostgreSQL",
                "Prisma",
                "MongoDB",
                "Express.js",
              ],
            }),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <Providers>
          <SmoothScrollProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </SmoothScrollProvider>
        </Providers>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
