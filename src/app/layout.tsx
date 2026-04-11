import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/layout/Nav";

export const metadata: Metadata = {
  title: "CommCoach",
  description: "A human-centered AI communication coach for workplace messaging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50">
        <Nav />
        <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
