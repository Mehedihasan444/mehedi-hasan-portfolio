export interface ProjectItem {
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  tech: string[];
  github: string;
  demo: string | null;
  status: string;
  image: string;
  featured: boolean;
  year: string;
}

export const projects: ProjectItem[] = [
  {
    title: "MarketSphere",
    slug: "marketsphere",
    description:
      "A multivendor e-commerce platform with product management, cart system, payment integration, and vendor dashboards.",
    longDescription:
      "Full-featured marketplace with real-time inventory, order management, analytics dashboards, and Stripe payment processing.",
    tech: ["React", "Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    github: "https://github.com/Mehedihasan444/marketsphere-frontend",
    demo: null,
    status: "In Development",
    image: "/projects/marketsphere.webp",
    featured: true,
    year: "2024",
  },
  {
    title: "Tech Tips & Tricks Hub",
    slug: "tech-tips-tricks-hub",
    description:
      "A content platform for sharing technical tutorials, tips, and tricks. Features blog posts, code snippets, and community interaction.",
    longDescription:
      "Rich content management with Markdown, syntax highlighting, upvotes, and a community engagement layer.",
    tech: ["React", "Next.js", "TypeScript", "MongoDB", "Mongoose"],
    github: "https://github.com/Mehedihasan444/tech-tips-and-tricks-hub-frontend",
    demo: null,
    status: "Completed",
    image: "/projects/techtips.webp",
    featured: false,
    year: "2024",
  },
  {
    title: "Car Rental Reservation",
    slug: "car-rental-reservation-system",
    description:
      "A full-stack car rental platform with vehicle browsing, booking management, payment processing, and comprehensive admin dashboard.",
    longDescription:
      "Complete fleet management system with date-range booking, real-time availability, and admin controls.",
    tech: ["React", "TypeScript", "Node.js", "Express", "MongoDB"],
    github: "https://github.com/Mehedihasan444/Car-Rental-Reservation-System-Frontend",
    demo: null,
    status: "Completed",
    image: "/projects/carrental.webp",
    featured: false,
    year: "2023",
  },
];
