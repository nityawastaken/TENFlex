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
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Apply dark mode immediately before React hydration
                  document.body.classList.add('dark-mode');
                  
                  // Check localStorage for theme preference
                  var savedTheme = localStorage.getItem('theme');
                  if (savedTheme === 'light') {
                    document.body.classList.remove('dark-mode');
                  } else {
                    document.body.classList.add('dark-mode');
                  }
                } catch (e) {
                  // Fallback to dark mode
                  document.body.classList.add('dark-mode');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="dark text-white" style={{ background: 'transparent' }}>
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-0">
            <UserProvider>
              {children}
            </UserProvider>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
