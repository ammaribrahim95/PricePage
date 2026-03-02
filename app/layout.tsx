import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialFloat from "@/components/SocialFloat";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pawstrophe Digital — Your Digital Growth Partner",
    template: "%s | Pawstrophe Digital",
  },
  description:
    "Premium digital engineering studio based in Malaysia. We build high-converting websites for SMEs. From RM 2,500.",
  keywords: [
    "web design Malaysia",
    "SME website",
    "Pawstrophe Digital",
    "web development KL",
    "affordable website Malaysia",
  ],
  openGraph: {
    title: "Pawstrophe Digital — Your Digital Growth Partner",
    description:
      "Premium digital engineering studio. We build high-converting websites for Malaysian SMEs.",
    type: "website",
    locale: "en_MY",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <link rel="icon" href="/img/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/img/favicon.ico" />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
        <Footer />

        {/* Social Speed Dial */}
        <SocialFloat />
      </body>
    </html>
  );
}
