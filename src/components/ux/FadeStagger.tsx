'use client'
import { motion } from 'framer-motion'

export const FadeStagger = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: '-80px' }}
    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
  >
    {children}
  </motion.div>
)

export const FadeItem = ({ children }: { children: React.ReactNode }) => (
  <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
    {children}
  </motion.div>
)









