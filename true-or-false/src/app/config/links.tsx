export interface Link {
  name: string;
  href: string;
  method?: string;
  target?: string;
  tooltip?: string;
}

export const links: Link[] = [
  {
    name: "Home",
    href: "/",
    tooltip: "Home",
  },
  {
    name: "About the data",
    href: "/about",
    tooltip: "About",
  },
  {
    name: "Contact",
    href: "/contact",
    tooltip: "Contact",
  },
  {
    name: "Analysis",
    href: "/analysis",
    tooltip: "Dataset analysis",
  },
  {
    name: "by Title",
    href: "/analysis/title",
    tooltip: "Analysis by title",
  },
  {
    name: "by Content",
    href: "/analysis/content",
    tooltip: "Analysis by content",
  }
];