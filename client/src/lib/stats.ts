/**
 * Single source of truth for headline stats.
 *
 * about/hero/achievements previously duplicated the same numbers
 * (1+ years, 10+ projects, 18+ technologies, 5 open-source).
 * Update the numbers here — section constants re-export from this file
 * so visuals stay identical while edits happen in one place.
 */

export const siteStats = {
  yearsExperience: 1,
  projectsCompleted: 10,
  technologies: 18,
  openSource: 5,
} as const;

export const aboutStats = [
  { end: siteStats.yearsExperience, suffix: "+", label: "Years Experience" },
  { end: siteStats.projectsCompleted, suffix: "+", label: "Projects Completed" },
  { end: siteStats.technologies, suffix: "+", label: "Technologies" },
  { end: siteStats.openSource, suffix: "+", label: "Open Source" },
];

export const heroStats = [
  { value: `${siteStats.yearsExperience}+`, label: "Years Exp." },
  { value: `${siteStats.projectsCompleted}+`, label: "Projects" },
  { value: `${siteStats.technologies}+`, label: "Technologies" },
  { value: "Open", label: "to Work" },
];

export const achievementMetrics = [
  {
    value: `${siteStats.projectsCompleted}+`,
    label: "Projects Shipped",
    icon: "Zap",
    gradient: "from-emerald to-teal",
  },
  { value: "100+", label: "Problems Solved", icon: "Code2", gradient: "from-teal to-cyan" },
  {
    value: `${siteStats.openSource}+`,
    label: "Open Source Repos",
    icon: "GitBranch",
    gradient: "from-cyan to-emerald",
  },
  { value: "1K+", label: "Cups of Coffee", icon: "Coffee", gradient: "from-amber to-rose" },
];
