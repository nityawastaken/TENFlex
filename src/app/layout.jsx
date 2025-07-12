
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { UserProvider } from "@/app/contexts/UserContext"; 
import { ThemeProvider } from "@/app/contexts/ThemeContext";

export const metadata = {
  title: "TENFlex",
  description: "Freelance Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black dark:bg-black dark:text-white">
        <ThemeProvider>
        <Navbar />
        <main className="min-h-screen pt-0">
          <UserProvider>
            {" "}
            {/* ✅ wrap entire app here */}
            {children}
          </UserProvider>
        </main>{" "}
        {/* pt-6 for less top margin */}
        <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
