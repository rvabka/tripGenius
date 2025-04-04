"use client"

import type React from "react"

import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes } from "react"

type MotionButtonProps = HTMLMotionProps<"button">
type HTMLButtonProps = ButtonHTMLAttributes<HTMLButtonElement>
type ButtonProps = Omit<HTMLButtonProps, keyof MotionButtonProps> & {
  className?: string
  children: React.ReactNode
}

export function ClerkStyleButton({ children, className, ...props }: ButtonProps) {
  const motionProps = {
    initial: { scale: 1 },
    whileHover: {
      scale: 1.02,
      boxShadow: "0 0 0 1px rgba(255, 105, 0, 0.2), 0 4px 20px rgba(255, 105, 0, 0.25)",
    },
    whileTap: {
      scale: 0.98,
    },
    transition: { duration: 0.3 },
  }

  return (
    <div className="relative inline-block">
      <div className="absolute inset-0 rounded-md blur-[6px] bg-[#ff6900]/0 transition-all duration-300 group-hover:bg-[#ff6900]/30" />

      <motion.button
        className={cn(
          "relative group rounded-md bg-[#ff6900] text-white font-medium px-6 py-3",
          "shadow-md transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-[#ff6900]/50 focus:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          className,
        )}
        {...motionProps}
        {...props}
      >
        <motion.div
          className="absolute inset-0 rounded-md opacity-0 bg-gradient-to-r from-[#ff8c00]/40 via-[#ff6900]/0 to-[#ff8c00]/40"
          initial={{ opacity: 0 }}
          whileHover={{
            opacity: 1,
          }}
          transition={{ duration: 0.3 }}
        />
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      </motion.button>
    </div>
  )
}

