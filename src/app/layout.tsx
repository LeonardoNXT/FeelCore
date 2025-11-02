import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const aeonik = localFont({
  src: [
    {
      path: "../../public/fonts/aeonik-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap", // troca rápido, otimiza CLS
});

export const metadata: Metadata = {
  title: "FeelSystem",
  description:
    "O FeelSystem é uma plataforma inteligente de apoio psicológico desenvolvida pela NewArch. Conecte pacientes e psicólogos em um ambiente seguro, moderno e intuitivo. Registre emoções, acompanhe terapias em tempo real e receba insights personalizados com inteligência artificial. Tecnologia, empatia e inovação para transformar o cuidado com a mente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="light" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="https://feelsystem.vercel.app/app.png"
          type="image/png"
        />
      </head>
      <body className={`${aeonik.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
