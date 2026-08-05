import { Inter } from "next/font/google";
import "./sheet.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Placements 26 | RVITM",
  description: "A searchable placement tracker for company domains, stipends, PPOs, requirements, JDs and related dates.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
