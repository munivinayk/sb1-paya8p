'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

interface TossResultProps {
  winner: string;
  onContinue: () => void;
}

export default function TossResult({ winner, onContinue }: TossResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-8 text-center max-w-sm w-full"
      >
        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
        <h2 className="text-2xl font-bold mb-4">Coin Toss Result</h2>
        <p className="text-xl mb-2">
          <span className="text-green-600 font-bold">{winner}</span> won the toss!
        </p>
        <p className="text-gray-600 mb-6">and will play first</p>
        <Button 
          onClick={onContinue}
          className="w-full py-6 text-lg"
        >
          Start Game
        </Button>
      </motion.div>
    </motion.div>
  );
}