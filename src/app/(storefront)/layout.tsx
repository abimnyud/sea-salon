"use client";

import Navbar from "@/components/navbar/navbar";
import "@/styles/./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-6">
      <Navbar />
      <div className="pt-24">{children}</div>
      <footer className="container font-medium w-full text-sm text-cetacean/70 text-center py-12">
        Made with ⭐️ by{" "}
        <a
          href="https://www.abimanyu.dev"
          target="_blank"
          className="underline underline-offset-2"
          rel="noopener noreferrer"
        >
          Abimanyu
        </a>
      </footer>
    </div>
  );
}
