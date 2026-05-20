import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AtendeAI",
  description: "Plataforma SaaS de atendimento inteligente com IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
