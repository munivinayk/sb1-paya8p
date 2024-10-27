'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import Link from 'next/link';

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h1 className="text-2xl font-bold mt-4">Leaderboard</h1>
        </div>
        
        <div className="space-y-4">
          {/* Add leaderboard implementation here */}
          <p className="text-center text-gray-600">Coming soon!</p>
        </div>

        <div className="flex justify-center">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}