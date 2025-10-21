import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Resumify - AI-Powered Resume Builder & Career Assistant",
  description:
    "Create and optimize your resume effortlessly with AI. Resumify helps you tailor your resume for every job, integrate with Google Docs, and send professional applications instantly.",
  metadataBase: new URL("https://resumify.vercel.app"), // Replace with your deployed domain
  openGraph: {
    title: "Resumify - AI-Powered Resume Builder & Career Assistant",
    description:
      "Tailor your resume for every job with AI. Connect your Google Docs, optimize your resume, and boost your career.",
    url: "https://resumify.vercel.app",
    siteName: "Resumify",
    images: [
      {
        url: "/og-image.png", // place your uploaded OG image here
        width: 1200,
        height: 630,
        alt: "Resumify - AI-Powered Resume Builder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resumify - AI-Powered Resume Builder & Career Assistant",
    description:
      "AI-powered resume builder that helps you craft and optimize resumes directly in Google Docs.",
    images: ["/og-image.png"],
    creator: "@resumify_ai", // optional
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {children}
        <Toaster />
        <Sonner />
      </body>
    </html>
  )
}
