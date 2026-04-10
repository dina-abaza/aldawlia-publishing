"use client";
import { motion } from "framer-motion";

// الـ Container الأساسي للحركات اللي بتظهر ورا بعض (Stagger)
export const MotionScroll = ({ children, className }) => (
  <motion.div
    initial="initial"
    whileInView="whileInView"
    viewport={{ once: true, amount: 0.2 }}
    transition={{ staggerChildren: 0.15 }}
    className={className}
  >
    {children}
  </motion.div>
);

// للأجزاء اللي بتظهر بـ Fade In
export const FadeInItem = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
);