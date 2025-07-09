import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { UserProvider } from "@/app/contexts/UserContext";
import Providers from "./Providers";

export const metadata = {
  title: "TENFlex",
  description: "Freelance Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950">
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-0">
            <UserProvider>{children}</UserProvider>
          </main>{" "}
          {/* pt-6 for less top margin */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
