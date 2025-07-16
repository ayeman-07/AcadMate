import type { Metadata } from "next";
import {
  Montserrat,
  Space_Grotesk,
  Open_Sans,
  Text_Me_One,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // ✅ Add this
import BackgroundGridPattern from "@/components/ui/BackgroundGridPattern";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-space-grotesk",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-open-sans",
});

const textMeOne = Text_Me_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-text-me-one",
});

export const metadata: Metadata = {
  title: "AcadMate - College Management System",
  description: "A comprehensive college management system built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${spaceGrotesk.variable} ${openSans.variable} ${textMeOne.variable}  antialiased bg-black`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1f2937",
              color: "#fff",
            },
          }}
        />
        <BackgroundGridPattern />
      </body>
    </html>
  );
}
