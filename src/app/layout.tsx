import type { Metadata, Viewport } from "next";
import { site } from "@/data/content";
import { behaviors } from "@/lib/behaviors";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — ${site.role}`,
  description:
    "Cloud & DevOps Engineer in Germany. AWS and Azure, Terraform, Kubernetes, Argo CD and GitOps. AWS Certified Solutions Architect – Associate.",
  keywords: [
    "DevOps Engineer",
    "Cloud Engineer",
    "AWS",
    "Terraform",
    "Kubernetes",
    "Argo CD",
    "GitOps",
    "Platform Engineer",
    "Germany",
    "Bamberg",
    "Mohasin Mudassar",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.name} — ${site.role}`,
    description:
      "3+ years building and operating cloud platforms on AWS and Azure with Terraform, Kubernetes and GitOps. Open to Cloud/DevOps roles in Germany.",
    siteName: site.name,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: "Cloud & DevOps Engineer — AWS, Terraform, Kubernetes, GitOps.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05070f",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  url: site.url,
  address: { "@type": "PostalAddress", addressLocality: "Bamberg", addressCountry: "DE" },
  sameAs: [site.github, site.linkedin],
  knowsAbout: ["AWS", "Azure", "Terraform", "Kubernetes", "Argo CD", "GitOps", "CI/CD", "Observability"],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Otto-Friedrich-Universität Bamberg" },
    { "@type": "CollegeOrUniversity", name: "COMSATS University Islamabad" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js-reveal')`,
          }}
        />
        <noscript>
          {/* Without JS the reveal animation never fires — show everything. */}
          <style>{`.reveal{opacity:1 !important;transform:none !important}.bar i{width:70% !important}`}</style>
        </noscript>
      </head>
      <body>
        <div className="bg-layer" aria-hidden="true" />
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script dangerouslySetInnerHTML={{ __html: behaviors }} />
      </body>
    </html>
  );
}
