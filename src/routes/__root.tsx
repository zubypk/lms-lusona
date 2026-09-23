import { QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AppearanceProvider } from "@/components/appearance/provider";
import { PageBackground } from "@/components/appearance/page-background";
import { MusicProvider } from "@/components/brand/campus-music";
import { BuildBanner } from "@/components/brand/build-banner";
import { TestFeedBanner } from "@/components/brand/test-feed";
import { WelcomeSplash } from "@/components/brand/welcome-splash";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { TooltipProvider } from "@/components/ui/misc";
import { queryClient } from "@/lib/query-client";
import appCss from "../styles.css?url";

const APP_NAME = "LMS";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { title: APP_NAME },
      {
        name: "description",
        content: "LMS test campus — Learning Management System preview. Full site coming soon.",
      },
      { name: "theme-color", content: "#12385A" },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "application-name", content: APP_NAME },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en" className="antialiased" data-theme="campus" data-bg="linen" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("lms.theme");var b=localStorage.getItem("lms.background");var dark={midnight:1,dark:1,ember:1,ocean:1,forest:1,aurora:1};if(t){document.documentElement.dataset.theme=t;var isDark=!!dark[t];document.documentElement.dataset.scheme=isDark?"dark":"light";document.documentElement.style.colorScheme=isDark?"dark":"light";document.documentElement.classList.toggle("dark",isDark);}if(b)document.documentElement.dataset.bg=b;}catch(e){}`,
          }}
        />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <AppearanceProvider>
                <PageBackground />
                <MusicProvider>
                  <div id="lms-shell">
                    <TooltipProvider>
                      <WelcomeSplash />
                      <TestFeedBanner />
                      <BuildBanner />
                      <Outlet />
                      <Toaster position="top-center" richColors closeButton />
                    </TooltipProvider>
                  </div>
                </MusicProvider>
              </AppearanceProvider>
          </QueryClientProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
