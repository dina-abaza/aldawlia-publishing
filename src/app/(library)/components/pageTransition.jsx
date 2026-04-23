"use client";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }) {
  const pathname = usePathname();

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative w-full">
        <AnimatePresence mode="popLayout" onExitComplete={() => window.scrollTo(0, 0)}>
          <m.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.3, 
              ease: "easeInOut"
            }}
            className="w-full"
          >
            {children}
          </m.div>
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}