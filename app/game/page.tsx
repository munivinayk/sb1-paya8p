'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import GameContainer from '@/components/GameContainer';
import LoadingScreen from '@/components/LoadingScreen';
import TossResult from '@/components/TossResult';

export default function GamePage() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');
  // Ensure mode is typed correctly as 'single' | 'two'
  const mode = modeParam === 'two' ? 'two' : 'single';
  const player1 = searchParams.get('player1');
  const player2 = searchParams.get('player2');
  const starter = searchParams.get('starter');
  
  const [loading, setLoading] = useState(true);
  const [showToss, setShowToss] = useState(false);

  useEffect(() => {
    // Show loading screen for 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
      setShowToss(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!mode || !player1 || (mode === 'two' && (!player2 || !starter))) {
    return <div>Invalid game parameters</div>;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (showToss && mode === 'two') {
    return (
      <TossResult
        winner={starter!}
        onContinue={() => setShowToss(false)}
      />
    );
  }

  return (
    <GameContainer
      mode={mode}
      player1={player1}
      player2={player2}
      starter={starter}
    />
  );
}