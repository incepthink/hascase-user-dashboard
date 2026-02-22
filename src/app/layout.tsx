import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Quantico } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const quantico = Quantico({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quantico",
});

export const metadata: Metadata = {
  title: "Hashcase Loyalty User Dashboard",
  description: "Hashcase Loyalty User Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${quantico.variable}`}>
        <Navbar />
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
