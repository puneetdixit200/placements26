import "./globals.css";

export const metadata = {
  title: "Placements 26 | RVITM",
  description: "A searchable placement tracker for company domains, stipends, PPOs, requirements, JDs and related dates.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
