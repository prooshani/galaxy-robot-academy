import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Lora, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { SiteFooter } from "@/components/SiteFooter";
import { MissionsProvider } from "./contexts/MissionsContext";
import { SubmissionsProvider } from "./contexts/SubmissionsContext";
import { UserProvider } from "./contexts/UserContext";
import { RoleGuard } from "@/components/RoleGuard";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });
const serif = Lora({ subsets: ["latin"], style: ["italic"], weight: ["500", "600"], variable: "--font-lora", display: "swap" });

export const metadata: Metadata = {
  title: "Galaxy Robot Academy",
  description: "Mission control for young engineers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${display.variable} ${mono.variable} ${serif.variable} antialiased`}>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <MissionsProvider>
          <UserProvider>
            <SubmissionsProvider>
              <RoleGuard>
                <NavBar />
                {children}
                <SiteFooter />
              </RoleGuard>
            </SubmissionsProvider>
          </UserProvider>
        </MissionsProvider>
      </body>
    </html>
  );
}
