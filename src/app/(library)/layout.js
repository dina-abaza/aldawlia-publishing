import "../globals.css";
import Providers from "./providers"; 
import Navbar from "./components/navbar"; 
import SubNavbar from "./components/SubNavbar";
import NavBottom from "./components/navbottom"; 
import Footer from "./components/footer";
import TopBanner from "./components/TopBanner";
import PageTransition from "./components/pageTransition"
import LanguageProvider from "./components/LanguageProvider";

export const metadata = {
  title: "مكتبة إلكترونية",
  description: "استكشف آلاف الكتب الرقمية",
};

export default function ShopLayout({ children }) {
  return (
    <div className="antialiased bg-gray-50 flex flex-col min-h-screen">
      <LanguageProvider>
        <Providers>
          <TopBanner/>
          <Navbar />
          <SubNavbar />
          <main className="flex-grow">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <NavBottom />
          <Footer />
        </Providers>
      </LanguageProvider>
    </div>
  );
}