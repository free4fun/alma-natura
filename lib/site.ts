export const siteMetadata = {
  siteUrl: process.env.SITE_URL || "http://localhost:3000",
  description:
    "Prácticas basadas en la naturaleza para la introspección personal con un marco simple y cercano.",
};

export const contactEmail = "contacto@almanatura.uy";

import type { IconName } from "@/components/Icon";

export const socialLinks: Array<{ label: string; href: string; icon: IconName }> = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/almanatura/",
    icon: "instagram",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/almanatura/",
    icon: "linkedin",
  },
];
