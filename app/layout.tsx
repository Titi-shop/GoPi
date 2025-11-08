import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GoPi - Ứng dụng chạy xe",
  description: "Ứng dụng định vị và bản đồ cho tài xế GoPi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-zinc-50 dark:bg-black text-black dark:text-white`}>
        {children}
      </body>
    </html>
  );
}
