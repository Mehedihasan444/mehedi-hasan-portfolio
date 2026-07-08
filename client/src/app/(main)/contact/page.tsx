import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/contact-section";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Mehedi Hasan for freelance projects, collaborations, or full-time opportunities.",
  openGraph: {
    title: "Contact - Mehedi Hasan",
    description: "Get in touch for projects, collaborations, or opportunities.",
  },
};

export default function ContactPage() {
  return <ContactSection />;
}
