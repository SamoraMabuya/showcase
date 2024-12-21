import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Header from "@/components/Header";
import { QueryProviders } from "@/lib/QueryProviders";
import Hydration from "@/lib/Hydration";
import SideDrawer from "@/components/Drawer/SideDrawer";
import { ThemeProvider } from "@/lib/ThemeProvider";
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
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <QueryProviders>
          <Hydration>
            <ThemeProvider>
              <Header />
              <SideDrawer />
              <main className="min-h-screen flex flex-col items-center">
                {children}
              </main>
            </ThemeProvider>
          </Hydration>
        </QueryProviders>
      </body>
    </html>
  );
}
