import { Mail, MapPin, Clock, type LucideIcon } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/icons";

export const socialLinks = [
  {
    icon: GithubIcon,
    label: "GitHub",
    href: "https://github.com/Mehedihasan444",
    color: "hover:text-white",
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    href: "https://linkedin.com/in/mehedi-hasan-893500301",
    color: "hover:text-[#0a66c2]",
  },
  {
    icon: TwitterIcon,
    label: "Twitter / X",
    href: "https://twitter.com/MEHEDIH60833052",
    color: "hover:text-[#1d9bf0]",
  },
];

export interface ContactInfoItem {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string | null;
}

export const contactInfo: ContactInfoItem[] = [
  {
    icon: Mail,
    label: "Email",
    value: "mehedihasan67705251@gmail.com",
    href: "mailto:mehedihasan67705251@gmail.com",
  },
  { icon: MapPin, label: "Location", value: "Dhaka, Bangladesh 🇧🇩", href: null },
  { icon: Clock, label: "Timezone", value: "Asia/Dhaka (UTC+6)", href: null },
];

export const availabilityTags = ["Freelance", "Remote", "Full-time"] as const;
