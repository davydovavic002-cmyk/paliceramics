"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useDemoControls } from "@/context/DemoControlsContext";
import { getRevealProps } from "@/lib/motionUtils";

interface MotionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function MotionReveal({ children, className, delay, y }: MotionRevealProps) {
  const { motionLevel } = useDemoControls();
  const reveal = getRevealProps(motionLevel, { delay, y });

  if (!reveal) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} {...reveal}>
      {children}
    </motion.div>
  );
}
