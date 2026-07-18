import type { CardStackItem } from "@/components/ui/card-stack";

export const testimonials = [
  {
    name: "Client Feedback",
    role: "Product Owner",
    company: "Web Development Project",
    avatar: "CF",
    content:
      "Outstanding work on the project. The attention to detail and commitment to quality was evident throughout the entire development process. Delivered ahead of schedule with exceptional results that exceeded all expectations.",
    rating: 5,
    gradient: "from-emerald to-teal",
  },
  {
    name: "Team Collaboration",
    role: "Engineering Lead",
    company: "Open Source Project",
    avatar: "TC",
    content:
      "A highly skilled developer who brings both technical expertise and creative problem-solving to every project. Great communication and a genuine passion for building quality software that makes a real impact.",
    rating: 5,
    gradient: "from-teal to-cyan",
  },
  {
    name: "Project Delivery",
    role: "Startup Founder",
    company: "SaaS Platform",
    avatar: "PD",
    content:
      "Mehedi transformed our idea into a production-ready application with clean architecture, beautiful UI, and excellent performance. His expertise in full-stack development is top-notch.",
    rating: 5,
    gradient: "from-cyan to-emerald",
  },
];

export const testimonialCards: CardStackItem[] = testimonials.map((t, i) => ({
  id: i,
  title: t.name,
  description: t.content,
  tag: `${t.role} · ${t.company}`,
}));
