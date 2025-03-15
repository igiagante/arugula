import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { Toaster } from "sonner";

import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import ChatContainer from "./(chat)/chat";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://arugula-agent.vercel.app/"),
  title: "Leaf Legacy – Smart Cannabis Cultivation Made Simple",
  description:
    "Leaf Legacy is the ultimate tool for cannabis growers, providing real-time insights, growth tracking, and AI-powered recommendations. Optimize your cultivation and nurture every leaf to its full potential.",
  icons: {
    icon: [{ url: "/cannabis-icon.svg", type: "image/svg+xml" }],
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
  const user = await currentUser();
  const isAuthenticated = !!user;

  return (
    <ClerkProvider>
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
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {isAuthenticated ? (
                <SidebarProvider>
                  <div className="flex w-full">
                    <AppSidebar className="w-64 shrink-0" />
                    <main className="flex-1">{children}</main>
                    <Separator orientation="vertical" className="h-full" />
                    <ChatContainer className="w-64 shrink-0" />
                  </div>
                </SidebarProvider>
              ) : (
                <main className="flex-1">{children}</main>
              )}
              <Toaster />
            </ThemeProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
