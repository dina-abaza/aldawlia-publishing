"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function BannerCarousel() {
  const slides = useMemo(
    () => [
      { src: "/bannerhome1.webp", title: "Slide 1" },
      { src: "/bannerhome2.jpeg", title: "Slide 2" },
      { src: "/bannerhome3.webp", title: "Slide 3" },
      { src: "/bannerhome4.webp", title: "Slide 4" },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const stopAutoPlay = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
  };

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [index]);

  const goTo = (i) => {
    stopAutoPlay();
    setIndex(i);
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-gray-50 rounded-b-2xl md:rounded-b-[2.5rem] shadow-sm h-[250px] md:h-[45vw] md:max-h-[550px]"
    >
      <AnimatePresence initial={false}>
        {slides.map((slide, i) => (
          i === index && (
            <motion.div
              key={slide.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full z-0"
            >
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                className="object-cover object-top"
                priority={i === 0}
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <div className="absolute inset-0 bg-black/5" />
            </motion.div>
          )
        ))}
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-500 h-1.5 rounded-full ${
              i === index
                ? "w-8 bg-white shadow-lg"
                : "w-1.5 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}