import { User } from "@prisma/client";

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  logo: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type CurrentPlan = {
  planId: PlanName;
  currency: string; // usd
  interval: string; // monthly
  name: string;
  base: number;
  extraUsageRate?: number | undefined;
};

export type NavigationItem = {
  name: string;
  href: string;
  admin?: boolean;
};
