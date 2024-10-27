'use client';

import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-green-800 flex items-center justify-center z-50">
      <motion.div
        animate={{
          rotate: 360,
          y: [0, -20, 0]
        }}
        transition={{
          rotate: {
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          },
          y: {
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="relative w-20 h-20"
      >
        <div className="w-20 h-20 bg-white rounded-full border-4 border-black" />
        <div className="absolute inset-0 bg-[url('/football-pattern.png')] bg-cover opacity-50 rounded-full" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-white text-xl font-bold absolute -bottom-12"
      >
        Loading...
      </motion.p>
    </div>
  );
}