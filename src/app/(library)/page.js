import CategoryGrid from "./components/categoriesgrid";
import BannerCarousel from "./components/BannerCarousel";
import QuickAccessLinks from "./components/QuickAccessLinks";
import HikmaResume from "./components/hikma resume";
import IslamicResume from "./components/islamic resume";
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <BannerCarousel />
      </div>
      <div>
        <CategoryGrid />
      </div>
      <HikmaResume />
      <IslamicResume />
      {/* 🔹 روابط الوصول السريع للأكثر طلباً وتفضيلاً */}
      <QuickAccessLinks />
    </main>
  );
}
