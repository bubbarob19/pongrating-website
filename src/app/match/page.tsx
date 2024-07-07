'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/utils/api';
import {getPlayerId} from "@/utils/auth";

const SubmitMatchPage = () => {
    const router = useRouter();

    const [opponentId, setOpponentId] = useState('');
    const [opponentScore, setOpponentScore] = useState('');
    const [playerScore, setPlayerScore] = useState('');
    const [players, setPlayers] = useState<Player[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const data = await apiRequest<Player[]>('api/players');
                setPlayers(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            }
        };

        fetchPlayers();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const playerId = getPlayerId();
            if (parseInt(playerScore) < 21 && parseInt(opponentScore) < 21) {
                setError('One of the scores must be >= 21.');
                return;
            }

            const matchData = {
                date: new Date(),
                winnerId: parseInt(playerScore) > parseInt(opponentScore) ? playerId : opponentId,
                loserId: parseInt(playerScore) < parseInt(opponentScore) ? playerId : opponentId,
                winnerScore: parseInt(playerScore) > parseInt(opponentScore) ? parseInt(playerScore) : parseInt(opponentScore),
                loserScore: parseInt(playerScore) < parseInt(opponentScore) ? parseInt(playerScore) : parseInt(opponentScore),
            };

            await apiRequest('api/matches/process-match', {
                method: 'POST',
                body: JSON.stringify(matchData),
                skipAuth: false,
            });

            // Display success message and navigate to home page
            localStorage.setItem('successMessage', 'Match submitted successfully!');
            router.push('/');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-8 rounded shadow-md w-80">
                <h2 className="text-2xl font-bold mb-4">Submit Match</h2>
                <form onSubmit={handleSubmit}>
                    <select
                        value={opponentId}
                        onChange={(e) => setOpponentId(e.target.value)}
                        required
                        className="w-full px-3 py-2 mb-3 border rounded"
                    >
                        <option value="" disabled>Select Opponent</option>
                        {players.map((player) => (
                            <option key={player.id} value={player.id}>
                                {player.firstName} {player.lastName}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Your Score"
                        value={playerScore}
                        onChange={(e) => setPlayerScore(e.target.value)}
                        required
                        className="w-full px-3 py-2 mb-3 border rounded"
                    />
                    <input
                        type="number"
                        placeholder="Opponent's Score"
                        value={opponentScore}
                        onChange={(e) => setOpponentScore(e.target.value)}
                        required
                        className="w-full px-3 py-2 mb-3 border rounded"
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit Match
                    </button>
                </form>

                {/* Error Message */}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default SubmitMatchPage;