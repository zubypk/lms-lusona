import { QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AppearanceProvider } from "@/components/appearance/provider";
import { BuildBanner } from "@/components/brand/build-banner";
import { WelcomeSplash } from "@/components/brand/welcome-splash";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { TooltipProvider } from "@/components/ui/misc";
import { queryClient } from "@/lib/query-client";
import appCss from "../styles.css?url";

const APP_NAME = "AEC Learning Management System";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Atomic Energy Commission College LMS on lms.lusona.org — classes, assignments, quizzes, attendance and results for Rawalpindi / Islamabad.",
      },
      { name: "theme-color", content: "#12385A" },
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
            __html: `try{var t=localStorage.getItem("lms.theme");var b=localStorage.getItem("lms.background");if(t)document.documentElement.dataset.theme=t;if(b)document.documentElement.dataset.bg=b;}catch(e){}`,
          }}
        />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <AppearanceProvider>
              <TooltipProvider>
                <WelcomeSplash />
                <BuildBanner />
                <Outlet />
                <Toaster position="top-right" richColors closeButton />
              </TooltipProvider>
            </AppearanceProvider>
          </QueryClientProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
