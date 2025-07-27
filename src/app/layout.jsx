import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { UserProvider } from "@/app/contexts/UserContext";
import Link from "next/link";
import Providers from "./Providers";

export const metadata = {
  title: "TENFlex",
  description: "Freelance Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black dark:bg-black dark:text-white">
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-0">
            <UserProvider>{children}</UserProvider>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
