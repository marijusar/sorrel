export type Tier = {
  name: string;
  tagline: string;
  features: string[];
  featured?: boolean;
};

export const TIERS: Tier[] = [
  {
    name: "Starter",
    tagline: "One app, one category.",
    features: ["Track up to 100 stores", "Weekly change detection", "Email alert on every match"],
  },
  {
    name: "Growth",
    tagline: "Outbound every week.",
    features: ["Track up to 500 stores", "Daily change detection", "Email alert on every match"],
    featured: true,
  },
  {
    name: "Scale",
    tagline: "Agencies and app portfolios.",
    features: [
      "Track up to 2,000 stores",
      "Daily change detection",
      "Email alert on every match",
      "CSV export and webhooks",
    ],
  },
];
