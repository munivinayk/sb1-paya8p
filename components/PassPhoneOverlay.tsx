'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';

interface PassPhoneOverlayProps {
  nextPlayer: string;
  onContinue: () => void;
}

export default function PassPhoneOverlay({ nextPlayer, onContinue }: PassPhoneOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-lg p-8 text-center max-w-sm w-full"
      >
        <Smartphone className="w-16 h-16 mx-auto mb-4 text-blue-500" />
        <h2 className="text-2xl font-bold mb-4">Pass the phone to</h2>
        <p className="text-3xl font-bold text-blue-600 mb-6">{nextPlayer}</p>
        <Button 
          onClick={onContinue}
          className="w-full py-6 text-lg"
        >
          I'm Ready
        </Button>
      </motion.div>
    </motion.div>
  );
}