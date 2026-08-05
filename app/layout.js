import { Cinzel, Fira_Code, Spectral } from "next/font/google";
import "./sheet.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-spectral",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata = {
  title: "Placements 26 | RVITM",
  description: "A searchable placement tracker for company domains, stipends, PPOs, requirements, JDs and related dates.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${spectral.variable} ${firaCode.variable}`}>
        {children}
      </body>
    </html>
  );
}
