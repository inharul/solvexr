import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import styles from "../styles/app.module.css";
import Header from "@/components/Header";
import { AnswerProvider } from "@/store/answers";
import { StorageProvider } from "@/store/storage";
import { CssVarsProvider } from "@mui/joy";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SolvexR",
  description: "learning nextjs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <CssVarsProvider defaultMode="dark" defaultColorScheme={"dark"}>
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
      </CssVarsProvider>
    </html>
  );
}
