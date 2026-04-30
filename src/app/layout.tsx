import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/Context/AuthContext";
import { Toaster } from "react-hot-toast";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fare",
  description: "Ride Simplified",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
         <SessionWrapper>
          {children}
          </SessionWrapper>
        </AuthProvider>
        
        {/* 2. ADD THE TOASTER HERE */}
        <Toaster position="bottom-center" reverseOrder={false} />
        
      </body>
    </html>
  );
}