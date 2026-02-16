import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import CartToast from "@/components/CartToast";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { siteMetadata } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: "Alma Natura",
    template: "%s | Alma Natura",
  },
  description: siteMetadata.description,
  openGraph: {
    title: "Alma Natura",
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: "Alma Natura",
    locale: "es_AR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <Script
          id="perf-measure-patch"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const perf = window.performance;
    if (!perf || !perf.measure) return;
    if (window.__perfMeasurePatched) return;
    const originalMeasure = perf.measure.bind(perf);
    perf.measure = function(name, startOrOptions, endMark) {
      try {
        if (typeof endMark === 'number' && endMark < 0) return;
        if (startOrOptions && typeof startOrOptions === 'object' && typeof startOrOptions.end === 'number' && startOrOptions.end < 0) return;
        if (startOrOptions && typeof startOrOptions === 'object') {
          return originalMeasure(name, startOrOptions);
        }
        return originalMeasure(name, startOrOptions, endMark);
      } catch {
        return;
      }
    };
    window.__perfMeasurePatched = true;
  } catch {}
})();`,
          }}
        />
      </head>
      <body
        className={`${jakarta.variable} antialiased font-sans bg-background text-text`}
      >
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-16 pb-8 md:pt-28 md:pb-16">
              {children}
            </main>
            <Footer />
          </div>
          <CartToast />
        </CartProvider>
      </body>
    </html>
  );
}
