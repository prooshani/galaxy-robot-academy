import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { MissionsProvider } from "./contexts/MissionsContext";
import { SubmissionsProvider } from "./contexts/SubmissionsContext";
import { UserProvider } from "./contexts/UserContext";
import { RoleGuard } from "@/components/RoleGuard";

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
      <body className="antialiased">
        <MissionsProvider>
          <UserProvider>
            <SubmissionsProvider>
              <RoleGuard>
                <NavBar />
                {children}
              </RoleGuard>
            </SubmissionsProvider>
          </UserProvider>
        </MissionsProvider>
      </body>
    </html>
  );
}
