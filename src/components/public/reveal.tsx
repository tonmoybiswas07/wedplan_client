"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={false}
      whileInView={reduce ? undefined : { y: [8, 0] }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}
