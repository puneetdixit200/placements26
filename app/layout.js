import "./sheet.css";

export const metadata = {
  title: "Placements 26 | RVITM",
  description: "A searchable spreadsheet-style tracker for company timelines, packages, JDs, eligibility and verified placement outcomes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
