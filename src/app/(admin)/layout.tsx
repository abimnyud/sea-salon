import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SEA Salon Admin Dashboard",
  description: "Beauty and Elegance Redefined",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
