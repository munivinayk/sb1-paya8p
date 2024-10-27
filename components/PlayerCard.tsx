'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getCountryFlag } from '@/lib/utils';
import { Check, X, HelpCircle, Smartphone, Eye, Timer } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PlayerCardProps {
  player: {
    name: string;
    buzzwords: string[];
    clues: string[];
    facts: {
      nationality: string;
      position: string;
      club: string;
      number: number;
      image_url: string;
      club_logo_url: string;
    };
  };
  onCorrectGuess: () => void;
  onWrongGuess: (isFirstTry: boolean) => void;
  onHintUsed: () => void;
  onRevealComplete: () => void;
  hintsRemaining: number;
  isActive: boolean;
  wrongGuesses: number;
  timeExpired: boolean;
  currentPlayer: string;
  nextPlayer?: string;
  mode?: 'single' | 'two';
}

const TIMER_DURATION = 60; // 60 seconds

const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-orange-500'
  ];
  
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export default function PlayerCard({
  player,
  onCorrectGuess,
  onWrongGuess,
  onHintUsed,
  onRevealComplete,
  hintsRemaining,
  isActive,
  wrongGuesses,
  timeExpired,
  currentPlayer,
  nextPlayer,
  mode = 'single'
}: PlayerCardProps) {
  const [showHints, setShowHints] = useState(false);
  const [showPlayerReveal, setShowPlayerReveal] = useState(false);
  const [revealMessage, setRevealMessage] = useState('');
  const [showPassPhone, setShowPassPhone] = useState(false);
  const [showPlayerName, setShowPlayerName] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [showWrongAlert, setShowWrongAlert] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && !showPlayerReveal) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setRevealMessage("Time's Up!");
            setShowPlayerReveal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, showPlayerReveal]);

  useEffect(() => {
    if (!showPlayerReveal) {
      setTimeLeft(TIMER_DURATION);
    }
  }, [showPlayerReveal]);

  const handleHintClick = () => {
    if (hintsRemaining > 0) {
      setShowHints(!showHints);
      if (!showHints) {
        onHintUsed();
      }
    }
  };

  const handleGuess = (correct: boolean) => {
    if (!isActive) return;

    if (correct) {
      setRevealMessage('Correct Answer!');
      setShowPlayerReveal(true);
      setShowPlayerName(true);
      onCorrectGuess();
    } else {
      if (wrongGuesses === 0) {
        setShowWrongAlert(true);
        onWrongGuess(true);
      } else {
        setRevealMessage('Wrong Answer! No more chances.');
        setShowPlayerReveal(true);
        setShowPlayerName(true);
        onWrongGuess(false);
      }
    }
  };

  const handleContinue = () => {
    if (mode === 'two' && !showPassPhone) {
      setShowPassPhone(true);
    } else {
      setShowPlayerReveal(false);
      setShowPassPhone(false);
      setShowHints(false);
      setShowPlayerName(false);
      onRevealComplete();
    }
  };

  const togglePlayerName = () => {
    setShowPlayerName(!showPlayerName);
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className={`h-12 w-12 ${getAvatarColor(currentPlayer)}`}>
                <AvatarFallback className="text-white font-bold">
                  {getInitials(currentPlayer)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-bold text-lg">{currentPlayer}'s Turn</span>
                <span className="text-sm text-gray-500">Guessing Player</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlayerName}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPlayerName ? 'Hide Name' : 'Show Name'}
            </Button>
            <div className="text-sm">
              Hints: {hintsRemaining} remaining
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
          <Timer className="w-4 h-4" />
          <span className="font-mono">{formatTime(timeLeft)}</span>
          <Progress value={(timeLeft / TIMER_DURATION) * 100} className="flex-1" />
        </div>

        {showPlayerName && (
          <div className="bg-blue-100 p-2 rounded text-center font-bold">
            {player.name}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {player.buzzwords.map((word, index) => (
              <div key={index} className="bg-blue-100 p-2 rounded text-center">
                {word}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {player.clues.map((clue, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded">
                {index + 1}. {clue}
              </div>
            ))}
          </div>

          <AnimatePresence>
            {showHints && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <Image
                    src={getCountryFlag(player.facts.nationality)}
                    alt={player.facts.nationality}
                    width={24}
                    height={24}
                  />
                  <span>{player.facts.nationality}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Image
                    src={player.facts.club_logo_url}
                    alt={player.facts.club}
                    width={24}
                    height={24}
                  />
                  <span>{player.facts.club}</span>
                </div>
                <div>Position: {player.facts.position}</div>
                <div>Number: {player.facts.number}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => handleGuess(false)}
            disabled={!isActive || showPlayerReveal}
          >
            <X className="w-6 h-6 text-red-500" />
          </Button>
          <Button
            variant="outline"
            onClick={handleHintClick}
            disabled={hintsRemaining === 0 || !isActive || showPlayerReveal}
          >
            <HelpCircle className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            onClick={() => handleGuess(true)}
            disabled={!isActive || showPlayerReveal}
          >
            <Check className="w-6 h-6 text-green-500" />
          </Button>
        </div>
      </Card>

      <AlertDialog open={showWrongAlert} onOpenChange={setShowWrongAlert}>
        <AlertDialogContent>
          <AlertDialogTitle>Wrong Answer!</AlertDialogTitle>
          <AlertDialogDescription>
            You have one more chance to guess correctly.
          </AlertDialogDescription>
          <Button onClick={() => setShowWrongAlert(false)}>Try Again</Button>
        </AlertDialogContent>
      </AlertDialog>

      <AnimatePresence>
        {showPlayerReveal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-lg text-center space-y-4"
            >
              {!showPassPhone ? (
                <>
                  <div className="text-2xl font-bold">{revealMessage}</div>
                  <Image
                    src={player.facts.image_url}
                    alt={player.name}
                    width={200}
                    height={200}
                    className="mx-auto rounded-lg"
                  />
                  <div className="text-xl">{player.name}</div>
                </>
              ) : (
                <>
                  <Smartphone className="w-16 h-16 mx-auto text-blue-500" />
                  <h2 className="text-2xl font-bold">Pass the phone to</h2>
                  <p className="text-3xl font-bold text-blue-600">{nextPlayer}</p>
                </>
              )}
              <Button 
                onClick={handleContinue}
                className="w-full py-6 text-lg"
              >
                {showPassPhone ? "I'm Ready" : "Continue"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}