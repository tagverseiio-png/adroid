import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/components/ModalContext";
import LeadModal from "@/components/LeadModal";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Adroit Design | Corporate & Commercial Interior Solutions",
  description: "Integrated Corporate & Commercial Interior Design, Design & Build and Turnkey Project Solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        <ModalProvider>
          {children}
          <LeadModal />
        </ModalProvider>
      </body>
    </html>
  );
}
