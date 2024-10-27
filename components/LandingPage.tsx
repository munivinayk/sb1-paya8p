'use client';

import { useState } from 'react';
import { Users, User, Gamepad2, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

export default function LandingPage() {
  const [mode, setMode] = useState<'select' | 'single' | 'two' | 'rules'>('select');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [selectedMode, setSelectedMode] = useState<'single' | 'two'>('single');
  const router = useRouter();

  const handleStart = () => {
    if (mode === 'single') {
      router.push('/game?mode=single&player1=' + encodeURIComponent(player1));
    } else {
      const winner = Math.random() < 0.5 ? player1 : player2;
      router.push(
        '/game?mode=two' +
        '&player1=' + encodeURIComponent(player1) +
        '&player2=' + encodeURIComponent(player2) +
        '&starter=' + encodeURIComponent(winner)
      );
    }
  };

  const handleModeSelect = (selectedMode: 'single' | 'two') => {
    setSelectedMode(selectedMode);
    setMode('rules');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-green-800">
          Guess The Footballer
        </h1>

        {mode === 'select' && (
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full py-8 text-lg"
              onClick={() => handleModeSelect('single')}
            >
              <User className="mr-2 h-6 w-6" />
              Single Player
            </Button>
            <Button
              variant="outline"
              className="w-full py-8 text-lg"
              onClick={() => handleModeSelect('two')}
            >
              <Users className="mr-2 h-6 w-6" />
              Two Players
            </Button>
          </div>
        )}

        {mode === 'rules' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <Card className="p-6 bg-green-50">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <ScrollText className="mr-2 h-5 w-5" />
                How to Play
              </h2>
              <div className="space-y-3 text-sm">
                <p>🎯 <strong>Goal:</strong> Guess the football player based on clues and hints.</p>
                <p>⏱️ <strong>Time Limit:</strong> 60 seconds per round</p>
                <p>🎮 <strong>Scoring:</strong></p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Correct guess on first try: 2 points</li>
                  <li>Correct guess on second try: 1 point</li>
                  <li>Using all hints: -0.5 points</li>
                </ul>
                <p>💡 <strong>Hints:</strong> 5 hints available per player</p>
                <p>🏆 <strong>Victory:</strong> First to 10 points or most points after 10 rounds</p>
                {selectedMode === 'two' && (
                  <p>👥 <strong>Two Player Mode:</strong> Players take turns guessing</p>
                )}
              </div>
            </Card>

            <Button
              className="w-full py-6 text-lg"
              onClick={() => setMode(selectedMode)}
            >
              Continue
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setMode('select')}
            >
              Back
            </Button>
          </motion.div>
        )}

        {(mode === 'single' || mode === 'two') && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Player 1 Name
              </label>
              <Input
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                placeholder="Enter name"
                className="w-full"
              />
            </div>

            {mode === 'two' && (
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Player 2 Name
                </label>
                <Input
                  value={player2}
                  onChange={(e) => setPlayer2(e.target.value)}
                  placeholder="Enter name"
                  className="w-full"
                />
              </div>
            )}

            <Button
              className="w-full py-6 text-lg"
              onClick={handleStart}
              disabled={!player1 || (mode === 'two' && !player2)}
            >
              <Gamepad2 className="mr-2 h-6 w-6" />
              Start Game
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setMode('rules')}
            >
              Back
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}