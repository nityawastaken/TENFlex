import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TENFLEX - Your gateway to growth and success",
  keywords: [
    "TENFLEX",
    "growth",
    "success",
    "business",
    "entrepreneurship",
    "innovation",
    "community",
  ],
  description: "TENFLEX is your gateway to growth and success, connecting entrepreneurs and innovators to resources, insights, and a vibrant community.",
};

export default function RootLayout({ children }) {

  
  return (
    <html lang="en" className="bg-black">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {children}
      </body>
    </html>
  );
}
