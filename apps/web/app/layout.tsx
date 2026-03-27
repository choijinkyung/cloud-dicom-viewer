import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cloud DICOM Viewer",
  description: "Worklist and viewer platform for imaging workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
