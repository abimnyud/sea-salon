import type { Metadata } from "next";
import { Inter, Nunito, Sora } from "next/font/google";
import "@/styles/./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "SEA Salon - Beauty and Elegance Redefined",
  description: "Beauty and Elegance Redefined",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${sora.variable} ${nunito.variable} bg-seashell`}
      >
        <Providers>
          <div className="font-sans">{children}</div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
