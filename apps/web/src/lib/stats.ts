/**
 * Single source of truth for headline stats.
 *
 * Verified against the live GitHub profile (github.com/Mehedihasan444)
 * on 2026-09-30. Update the numbers here — section constants re-export from
 * this file so visuals stay identical while edits happen in one place.
 */

export const siteStats = {
  // Stated by the site owner.
  yearsExperience: 1,
  // Counted from the GitHub API: 80 non-fork public repos.
  projectsCompleted: 30,
  // Matches the 18 rows published through /skills.
  technologies: 18,
  // 80 own repos minus the 3 that are forks of other projects.
  openSource: 77,
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
  // GitHub search API: 125 pull requests authored as of 2026-09-30.
  { value: "125+", label: "Pull Requests", icon: "Code2", gradient: "from-teal to-cyan" },
  {
    value: `${siteStats.openSource}+`,
    label: "Open Source Repos",
    icon: "GitBranch",
    gradient: "from-cyan to-emerald",
  },
  // Account created 2022-04-07, so 4+ years of public commit history.
  { value: "4+", label: "Years on GitHub", icon: "Coffee", gradient: "from-amber to-rose" },
];
