"use client";
import React from "react";

const TopBanner = () => {
  const text =
    "مرحبا بكم في الدولية للتوزيع والنشر _ بيت الفكر، ومهد الإبداع، وجسر يصل الحرف بالتحليل والكتاب بالتنمية.";

  return (
    <div className="bg-sky-900 text-white py-3 overflow-hidden border-b-4 border-amber-600  select-none">
      <div className="marquee">
        <div className="marquee-content">
          <span>{text}</span>
        </div>
      </div>

      <style jsx>{`
        .marquee {
          overflow: hidden;
          width: 100%;
          direction: rtl;
          display: flex;
        }

        .marquee-content {
          display: inline-block;
          white-space: nowrap;
          width: max-content;
          /* الأنيميشن بياخد وقت أطول شوية عشان الجملة تلحق تتقرأ */
          animation: scroll-single 25s linear infinite;
        }

        .marquee-content span {
          display: inline-block;
          white-space: nowrap;
          padding: 0 20px;
          font-weight: bold;
          font-size: 16px;
          word-spacing: 8px; /* المسافات بين الكلمات اللي طلبتيها */
        }

        @keyframes scroll-single {
          0% {
            /* بتبدأ من خارج الشاشة تماماً جهة اليمين */
            transform: translateX(100vw);
          }
          100% {
            /* بتنتهي لما تختفي تماماً جهة اليسار */
            transform: translateX(-100%);
          }
        }

        .marquee-content:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default TopBanner;