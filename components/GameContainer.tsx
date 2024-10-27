'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PlayerCard from './PlayerCard';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from '@/components/ui/alert-dialog';
import { motion } from 'framer-motion';
import { Home, RotateCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import players from '@/data/players.json';

interface GameContainerProps {
  mode: 'single' | 'two';
  player1: string;
  player2?: string;
  starter?: string;
}

export default function GameContainer({ mode, player1, player2, starter }: GameContainerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentPlayer, setCurrentPlayer] = useState(starter || player1);
  const [scores, setScores] = useState({ [player1]: 0, ...(player2 ? { [player2]: 0 } : {}) });
  const [hintsRemaining, setHintsRemaining] = useState({ [player1]: 5, ...(player2 ? { [player2]: 5 } : {}) });
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [timeExpired, setTimeExpired] = useState(false);
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [usedPlayers, setUsedPlayers] = useState<number[]>([]);
  const [questionsPlayed, setQuestionsPlayed] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(() => {
    const randomIndex = Math.floor(Math.random() * players.players.length);
    return randomIndex;
  });

  const checkGameEnd = useCallback(() => {
    const maxScore = Math.max(...Object.values(scores));
    const winners = Object.entries(scores).filter(([_, score]) => score === maxScore);
    
    if (maxScore >= 10 || questionsPlayed >= 10) {
      const winnerNames = winners.map(([name]) => name).join(' & ');
      router.push(`/winner?player=${encodeURIComponent(winnerNames)}&score=${maxScore}`);
      return true;
    }
    return false;
  }, [scores, questionsPlayed, router]);

  const handleCorrectGuess = useCallback(() => {
    setScores(prev => ({
      ...prev,
      [currentPlayer]: prev[currentPlayer] + (wrongGuesses === 0 ? 2 : 1)
    }));
    setQuestionsPlayed(prev => prev + 1);
  }, [currentPlayer, wrongGuesses]);

  const handleWrongGuess = useCallback((isFirstTry: boolean) => {
    if (isFirstTry) {
      setWrongGuesses(1);
      toast({
        title: "Wrong answer!",
        description: "One more chance remaining.",
        variant: "destructive"
      });
    } else {
      setQuestionsPlayed(prev => prev + 1);
    }
  }, [toast]);

  const handleHintUsed = useCallback(() => {
    if (hintsRemaining[currentPlayer] === 1) {
      setScores(prev => ({
        ...prev,
        [currentPlayer]: Math.max(0, prev[currentPlayer] - 0.5)
      }));
    }
    setHintsRemaining(prev => ({
      ...prev,
      [currentPlayer]: prev[currentPlayer] - 1
    }));
  }, [currentPlayer, hintsRemaining]);

  const nextTurn = useCallback(() => {
    if (!checkGameEnd()) {
      setWrongGuesses(0);
      setTimeExpired(false);

      if (mode === 'two') {
        setCurrentPlayer(prev => prev === player1 ? player2! : player1);
      }

      // Get unused players
      const availablePlayers = players.players
        .map((_, index) => index)
        .filter(index => !usedPlayers.includes(index));

      if (availablePlayers.length === 0) {
        setUsedPlayers([]); // Reset used players if all have been used
        const randomIndex = Math.floor(Math.random() * players.players.length);
        setCurrentPlayerIndex(randomIndex);
      } else {
        const randomIndex = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
        setCurrentPlayerIndex(randomIndex);
        setUsedPlayers(prev => [...prev, randomIndex]);
      }
    }
  }, [mode, player1, player2, usedPlayers, checkGameEnd]);

  const handleTimeExpired = useCallback(() => {
    setTimeExpired(true);
    setQuestionsPlayed(prev => prev + 1);
  }, []);

  const handleHomeClick = useCallback(() => {
    setShowQuitDialog(true);
  }, []);

  const handleQuit = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleResume = useCallback(() => {
    setShowQuitDialog(false);
  }, []);

  const handleReload = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-green-500 p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between mb-4">
          <Button variant="ghost" onClick={handleHomeClick}>
            <Home className="w-6 h-6" />
          </Button>
          <Button variant="ghost" onClick={handleReload}>
            <RotateCcw className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex justify-between mb-4">
          <div className="text-white">
            {player1}: {scores[player1]}
          </div>
          {mode === 'two' && (
            <div className="text-white">
              {player2}: {scores[player2!]}
            </div>
          )}
        </div>

        <div className="text-center text-white mb-4">
          Questions: {questionsPlayed}/10
        </div>

        <PlayerCard
          player={players.players[currentPlayerIndex]}
          onCorrectGuess={handleCorrectGuess}
          onWrongGuess={handleWrongGuess}
          onHintUsed={handleHintUsed}
          onRevealComplete={nextTurn}
          hintsRemaining={hintsRemaining[currentPlayer]}
          isActive={true}
          wrongGuesses={wrongGuesses}
          timeExpired={timeExpired}
          currentPlayer={currentPlayer}
          nextPlayer={mode === 'two' ? (currentPlayer === player1 ? player2 : player1) : undefined}
          mode={mode}
        />
      </div>

      <AlertDialog open={showQuitDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Do you want to quit?</AlertDialogTitle>
          <AlertDialogDescription>
            Your progress will be lost if you quit the game.
          </AlertDialogDescription>
          <div className="flex justify-end space-x-2">
            <AlertDialogAction onClick={handleResume}>Resume</AlertDialogAction>
            <AlertDialogAction onClick={handleQuit}>Quit</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}