import { Inter } from "next/font/google";
import "./sheet.css";
import "./dark.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const rvLogo = "https://rvitm.edu.in/wp-content/uploads/2026/01/Logo-1-with-white-bg-300x300-1-150x150.png";
const rvLogoLarge = "https://rvitm.edu.in/wp-content/uploads/2026/01/Logo-1-with-white-bg-300x300-1.png";

export const metadata = {
  title: "Placements 26 | RVITM",
  description: "A searchable placement tracker for company domains, stipends, PPOs, requirements, JDs and related dates.",
  icons: {
    icon: [{ url: rvLogo, type: "image/png", sizes: "150x150" }],
    shortcut: rvLogo,
    apple: [{ url: rvLogoLarge, type: "image/png", sizes: "300x300" }],
  },
};

export const viewport = {
  themeColor: "#0b0b0d",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
