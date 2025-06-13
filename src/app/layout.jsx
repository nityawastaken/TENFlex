import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "TENFlex",
  description: "Freelance Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950">
        <Navbar />
        <main className="min-h-screen pt-0">{children}</main> {/* pt-6 for less top margin */}
        <Footer />
      </body>
    </html>
  );
}