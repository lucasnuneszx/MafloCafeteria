"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Variants, Target, Transition } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  variant?: "fadeUp" | "scaleIn" | "fadeIn";
  delay?: number;
  className?: string;
  once?: boolean;
}

const base = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  },
} satisfies Record<string, Variants>;

export default function Reveal({
  children,
  variant = "fadeUp",
  delay = 0,
  className,
  once = true,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const v = base[variant];
  const visibleBase = v.visible as { transition?: Transition } & Target;

  const selectedVariant: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.01 } },
      }
    : {
        hidden: v.hidden,
        visible: {
          ...visibleBase,
          transition: {
            ...(visibleBase.transition ?? {}),
            delay,
          },
        },
      };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={selectedVariant}
      className={className}
    >
      {children}
    </motion.div>
  );
}
