import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Matrix Game of Life",
  description: "Conway's Game of Life with Wolfram Cellular Automaton in Matrix style",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`bg-black min-h-screen ${inter.className}`}>
        <div className="fixed inset-0 bg-black opacity-95 z-0"></div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
