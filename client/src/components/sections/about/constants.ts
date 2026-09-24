import { aboutStats } from "@/lib/stats";

// Single source of truth lives in src/lib/stats.ts — re-exported here
// so existing `import { stats } from "./about/constants"` keeps working.
export const stats = aboutStats;

export const values = [
  {
    icon: "Code2",
    title: "Clean Code Advocate",
    desc: "Passionate about writing maintainable, efficient, and scalable code that stands the test of time",
    gradient: "from-emerald/20 to-teal/10",
    color: "text-emerald",
  },
  {
    icon: "Lightbulb",
    title: "Innovation Driven",
    desc: "Always exploring emerging technologies and pushing boundaries to deliver exceptional results",
    gradient: "from-teal/20 to-cyan/10",
    color: "text-teal",
  },
  {
    icon: "Microscope",
    title: "Detail Oriented",
    desc: "Pixel-perfect implementation with meticulous attention to performance and user experience",
    gradient: "from-cyan/20 to-emerald/10",
    color: "text-cyan",
  },
  {
    icon: "Puzzle",
    title: "Problem Solver",
    desc: "Analytical mindset focused on breaking down complex problems into elegant solutions",
    gradient: "from-emerald/20 to-cyan/10",
    color: "text-violet-soft",
  },
];
