import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Providers from "./providers"; 
import Navbar from "./components/navbar"; 
import NavBottom from "./components/navbottom"; 
import Footer from "./components/footer";
import TopBanner from "./components/TopBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "مكتبة إلكترونية",
  description: "منصة لإدارة وبيع الكتب الرقمية",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  applicationName: "E-Library",
  keywords: ["كتب", "مكتبة", "رقمية", "قراءة"],
  openGraph: {
    type: "website",
    title: "مكتبة إلكترونية",
    description: "اكتشف واشترِ الكتب الرقمية بسهولة",
    url: "/",
    images: [{ url: "/logo2.png", width: 512, height: 512, alt: "E-Library" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "مكتبة إلكترونية",
    description: "كتب رقمية للجميع",
    images: ["/logo2.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function ShopLayout({ children }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <Providers>
          <TopBanner/>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <NavBottom />
          <Footer />
        </Providers>
    </div>
  );
}