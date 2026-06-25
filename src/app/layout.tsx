import type { Metadata, Viewport } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Balloon Pop Kids",
  description:
    "Jogo educativo para crianças de 3 a 8 anos. Estoure balões e aprenda letras, números, cores e animais!",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BalloonPop",
  },
  applicationName: "Balloon Pop Kids",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0EA5E9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${fredoka.variable} h-full`}>
      <body className="min-h-full flex flex-col font-fredoka bg-sky-300 text-gray-900 overflow-hidden select-none touch-manipulation">
        {children}
      </body>
    </html>
  );
}
