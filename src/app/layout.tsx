
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/_components/Header";
import { NextAuthProvider } from "@/app/context"


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "アルバイト　勤怠管理",
  description: "アルバイト　勤怠管理",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="px-6 pb-10">
          <NextAuthProvider>
            <Header />
            <div className="mt-[75px]">
              {children}
            </div>
          </NextAuthProvider>
        </main>
      </body>
    </html>
  );
}
