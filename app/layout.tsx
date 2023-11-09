import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next Mines",
  description: "A minesweeper game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
