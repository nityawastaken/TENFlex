import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
       <ToastContainer position="top-right" autoClose={3000} />
        {children}
      </body>
    </html>
  );
}
