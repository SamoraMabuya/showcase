import { QueryProviders } from "@/lib/QueryProviders";
import "./globals.css";
import { AppSidebar } from "@/components/AppSideBar";
import { SidebarProvider } from "@/components/ui/SideBar";
import Hydration from "@/lib/Hydration";
import { ThemeProvider } from "next-themes";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground ">
        <QueryProviders>
          <Hydration>
            <ThemeProvider>
              <SidebarProvider>
                <AppSidebar />
                <main className="min-h-screen flex flex-col w-screenw items-center container md:mx-0">
                  {children}
                </main>
              </SidebarProvider>
            </ThemeProvider>
          </Hydration>
        </QueryProviders>
      </body>
    </html>
  );
}
