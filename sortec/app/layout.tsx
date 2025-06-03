import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mi Aplicación | SORTEC S.A.C",
  description: "Tu mejor plataforma de sorteos tecnológicos",
  icons: "images/favicon.ico", // ✅ Favicon con URL absoluta
  keywords: [
    "sorteos tecnológicos",
    "ganar tecnología gratis",
    "rifas online",
    "sorteos en vivo",
    "gadgets gratis",
    "tecnología gratis",
    "participar en sorteos",
    "sorteo de celulares",
    "sorteo de laptops",
    "concurso de tecnología",
    "sorteos gaming",
    "regalos tecnológicos",
    "cómo ganar sorteos",
    "sorteos seguros",
    "participar en rifas online",
    "premios de tecnología",
    "eventos de sorteos",
    "ganar en sorteos",
    "tecnología en vivo",
    "noticias de sorteos",
    "sorteos con premios reales",
    "concursos online",
    "plataforma de sorteos",
    "cómo participar en sorteos",
    "mejores sorteos online",
    "juegos de sorteos",
    "sorteo de consolas",
    "PS5 sorteos",
    "Xbox Series X sorteos",
    "PC gaming sorteos",
    "Apple sorteos",
    "Samsung sorteos",
    "Huawei sorteos",
    "iPhone gratis",
    "participa y gana",
    "eventos de premios",
    "gana un celular",
    "gana un laptop",
    "tecnología sin costo",
    "rifas y sorteos",
    "mejores sorteos del año",
    "sorteos en América Latina",
    "rifas en España",
    "concursos en México",
    "concursos en Perú",
    "concursos en Argentina",
    "sorteos en Chile",
    "tecnología gratis en Europa",
    "eventos tecnológicos",
    "comunidad de sorteos",
    "sorteos confiables",
    "plataforma segura de sorteos",
    "tecnología para todos",
    "participa en eventos de tecnología",
    "gana productos electrónicos",
    "tecnología sin pagar",
    "los mejores concursos tecnológicos",
    "ganar premios online",
    "productos Apple gratis",
    "concurso de gadgets",
    "eventos con premios tecnológicos",
    "televisores en sorteos",
    "dispositivos inteligentes gratis",
    "cómo ganar concursos online",
    "gadgets en oferta",
    "premios exclusivos en sorteos",
    "concursos internacionales",
    "participar en giveaways",
    "giveaway de tecnología",
    "concursos y sorteos oficiales",
    "certificados en sorteos",
    "los mejores sorteos del mundo",
    "eventos de gaming",
    "sorteos de accesorios gamer",
    "cómo ganar productos tecnológicos",
    "dinámica de sorteos",
    "mejores páginas de sorteos",
    "ranking de sorteos confiables",
    "app para sorteos online",
    "plataforma de rifas en vivo",
    "cómo ganar un iPhone",
    "sorteos de drones",
    "gana un smartwatch",
    "regalos para gamers",
    "evento de gaming con premios",
    "accesorios de tecnología gratis",
    "lo último en sorteos tecnológicos",
    "participa en premios exclusivos",
    "televisores en giveaway",
    "recompensas digitales",
    "premios en criptomonedas",
    "sorteos en redes sociales",
    "sorteo de Steam Deck",
    "ganar en eventos de tecnología",
    "cómo participar en giveaways",
    "playstation 5 giveaway",
    "cómo ganar premios tecnológicos",
    "dinero en sorteos",
    "eventos de influencers con sorteos",
    "empresas de sorteos confiables",
    "rifas con productos de alta tecnología"
  ], // ✅ Reducimos palabras clave para mejorar SEO
  authors: [{ name: "SORTEC SAC" }],
  robots: "index, follow", // ✅ Permitir que los motores de búsqueda indexen la página
  openGraph: {
    title: "Mi Aplicación | SORTEC",
    description: "Tu mejor plataforma de sorteos tecnológicos",
    url: "https://sortsortech.azurewebsites.net/",
    type: "website",
    images: [
      {
        url: "/images/ImagenSortec.png", // ✅ URL absoluta
        width: 1200,
        height: 630,
        alt: "Imagen de Mi Aplicación || SORTEC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image", // ✅ Para que Twitter muestre imagen grande
    site: "@sortsortech", // Reemplaza con el usuario de Twitter de la empresa
    title: "Mi Aplicación | SORTEC",
    description: "Tu mejor plataforma de sorteos tecnológicos",
    images: ["/images/ImagenSortec.png"], // ✅ URL absoluta
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        {/* ✅ Metaetiquetas SEO y sociales */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#007bff" />
        <meta property="og:title" content="Mi Aplicación | SORTEC" />
        <meta property="og:description" content="Tu mejor plataforma de sorteos tecnológicos" />
        <meta property="og:url" content="https://sortsortech.azurewebsites.net/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/ImagenSortec.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Imagen de Mi Aplicación || SORTEC" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mi Aplicación | SORTEC" />
        <meta name="twitter:description" content="Tu mejor plataforma de sorteos tecnológicos" />
        <meta name="twitter:image" content="/images/ImagenSortec.png" />

        {/* ✅ Script de Cloudflare Web Analytics */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "0695065947cf43c588ff5e641727fba2"}'>
        </script>
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

