import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SoftDrive — Secure Cloud Storage",
    template: "%s | SoftDrive",
  },
  description:
    "Professional cloud storage for modern businesses. Secure, fast, and enterprise-grade file management.",
  keywords: ["cloud storage", "file management", "secure storage", "business"],
  authors: [{ name: "SoftDrive" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://softdrive.app",
    siteName: "SoftDrive",
    title: "SoftDrive — Secure Cloud Storage",
    description: "Professional cloud storage for modern businesses.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoftDrive — Secure Cloud Storage",
    description: "Professional cloud storage for modern businesses.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
