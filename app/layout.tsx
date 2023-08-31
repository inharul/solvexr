import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import styles from "../styles/app.module.css";
import Header from "@/components/Header";
import { AnswerProvider } from "@/store/answers";
import { StorageProvider } from "@/store/storage";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SolveR",
  description: "learning nextjs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <div className={styles.app}>
          {/* <Sidebar /> */}
          <AnswerProvider>
            <StorageProvider>
              <main className={styles.main}>{children}</main>
            </StorageProvider>
          </AnswerProvider>
        </div>
      </body>
    </html>
  );
}
