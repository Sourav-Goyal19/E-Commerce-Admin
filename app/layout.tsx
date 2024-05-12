import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import NextAuthProvider from "./Providers";
// import { ReduxProvider } from "@/redux/Provider";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  axios.defaults.withCredentials = true;
  return (
    <html lang="en" className="">
      <body className={inter.className}>
        <NextAuthProvider>
          {/* <ReduxProvider> */}
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
          </ThemeProvider>
          <Toaster />
          {/* </ReduxProvider> */}
        </NextAuthProvider>
      </body>
    </html>
  );
}
