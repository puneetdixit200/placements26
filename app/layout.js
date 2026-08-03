import "./globals.css";

export const metadata = {
  title: "Placements 26 | RVITM",
  description: "Verified company timelines, roles, packages, JDs and placement outcomes in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
