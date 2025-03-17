import type { Metadata } from "next";
import { Toaster } from "sonner";

import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://arugula-agent.vercel.app/"),
  title: "Leaf Legacy – Smart Cannabis Cultivation Made Simple",
  description:
    "Leaf Legacy is the ultimate tool for cannabis growers, providing real-time insights, growth tracking, and AI-powered recommendations. Optimize your cultivation and nurture every leaf to its full potential.",
  icons: {
    icon: [
      {
        url:
          process.env.NODE_ENV === "development"
            ? "/cannabis-icon-dev.svg"
            : "/cannabis-icon.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const LIGHT_THEME_COLOR = "hsl(0 0% 100%)";
const DARK_THEME_COLOR = "hsl(240deg 10% 3.92%)";
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider signInFallbackRedirectUrl="/grows">
      <html
        lang="en"
        // `next-themes` injects an extra classname to the body element to avoid
        // visual flicker before hydration. Hence the `suppressHydrationWarning`
        // prop is necessary to avoid the React hydration mismatch warning.
        // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
        suppressHydrationWarning
      >
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: THEME_COLOR_SCRIPT,
            }}
          />
        </head>
        <body className="min-h-screen bg-background antialiased">
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
