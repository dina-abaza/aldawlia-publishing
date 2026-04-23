"use client";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }) {
  const pathname = usePathname();

  return (
    <LazyMotion features={domAnimation}>
      {/* تأكدي من وجود onExitComplete لإعادة ضبط السكرول لأعلى الصفحة */}
      <AnimatePresence onExitComplete={() => window.scrollTo(0, 0)}>
        <m.div
          key={pathname} // ده المحرك الأساسي للحركة عند التنقل
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }} // الصفحة القديمة تطلع لفوق شوية وهي بتختفي
          transition={{ 
            duration: 0.4, 
            ease: [0.22, 1, 0.36, 1] // توقيت احترافي (Cubic Bezier) لحركة أنعم
          }}
        >
          {children}
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  );
}