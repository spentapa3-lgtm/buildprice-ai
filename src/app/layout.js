import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "BuildPrice AI",
  description: "AI Powered Construction Materials Price Tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        <Navbar />

        {children}

      </body>
    </html>
  );
}