import { GeistSans } from "geist/font/sans";
import "./globals.css";
import SideDrawer from "@/components/Drawer";
import Header from "@/components/Header";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";

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
    <ReactQueryClientProvider>
      <html lang="en" className={GeistSans.className}>
        <body className="bg-background text-foreground">
          <Header />
          <SideDrawer />
          <main className="min-h-screen flex flex-col items-center">
            {children}
          </main>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
