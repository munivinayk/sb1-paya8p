'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConfettiExplosion from 'react-confetti-explosion';
import { useEffect, useState } from 'react';

export default function WinnerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const player = searchParams.get('player');
  const score = searchParams.get('score');
  const [isExploding, setIsExploding] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsExploding(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {isExploding && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <ConfettiExplosion
            force={0.8}
            duration={3000}
            particleCount={200}
            width={1600}
          />
        </div>
      )}
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-yellow-400 mb-8"
      >
        <Trophy size={120} />
      </motion.div>

      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-bold text-white mb-4 text-center"
      >
        Congratulations {player}!
      </motion.h1>

      <motion.p
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-2xl text-white mb-8 text-center"
      >
        You won with {score} points!
      </motion.p>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex gap-4"
      >
        <Button
          onClick={() => router.push('/')}
          size="lg"
          className="bg-white text-blue-600 hover:bg-blue-50"
        >
          Play Again
        </Button>
      </motion.div>
    </div>
  );
}