import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
})

export const metadata: Metadata = {
  metadataBase: new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "localhost:3000"}`),
  title: "Camilo Meza Ytuarte — Motion design for SaaS",
  description:
    "Motion design for SaaS companies: launch videos, product animation and social cuts. Motion design para empresas SaaS.",
  openGraph: {
    title: "Camilo Meza Ytuarte — Motion design for SaaS",
    description: "Launch videos and product animation for SaaS companies.",
  },
}

export const viewport: Viewport = { themeColor: "#07070a" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${serif.variable} antialiased`}
    >
      <body className="min-h-full bg-[#07070a] text-white">{children}</body>
    </html>
  )
}
