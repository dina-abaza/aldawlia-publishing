import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Providers from "./providers"; 
import Navbar from "./components/navbar"; 
import NavBottom from "./components/navbottom"; 
import Footer from "./components/footer";
import TopBanner from "./components/TopBanner";
import PageTransition from "./components/pageTransition"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // إضافة لضمان ثبات الخط أثناء التحميل
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "مكتبة إلكترونية",
  description: "استكشف آلاف الكتب الرقمية",
};

export default function ShopLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning> 
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
        suppressHydrationWarning
      >
          <Providers>
            <TopBanner/>
            <Navbar />
            <main className="min-h-screen">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <NavBottom />
            <Footer />
          </Providers>
      </body>
    </html>
  );
}