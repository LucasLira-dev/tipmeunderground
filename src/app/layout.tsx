

import type { Metadata } from "next";
import "./globals.css";

import { Providers } from "./providers";

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "TipMeUnderground",
  description: "Este é um site em que você pode criar um perfil e receber doações de fãs, amigos e familiares. É uma plataforma para artistas independentes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="color-scheme" content="dark" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={inter.className}
      >
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}
