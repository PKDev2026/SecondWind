import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AppLayoutShell from "./AppLayoutShell"; // We will create this next

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Second Wind | Job OS",
  description: "Lightweight Personal ATS & AI Career Copilot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-slate-100 antialiased`}>
        <AuthProvider>
          {/* Move the sidebar layout logic to a shell that can see the current route */}
          <AppLayoutShell>{children}</AppLayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}