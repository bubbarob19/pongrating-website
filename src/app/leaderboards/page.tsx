'use client';

import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import {apiRequest} from '@/utils/api';
import {parseRank} from "@/utils/utils";

const rankColors: { [key: string]: string } = {
    NEWBIE: '#808080', // Gray
    PUPIL: '#008000', // Green
    SPECIALIST: '#00FFFF', // Cyan
    EXPERT: '#0000FF', // Blue
    CANDIDATE_MASTER: '#800080', // Purple
    MASTER: '#FFA500', // Orange
    GRANDMASTER: '#FF0000', // Red
};

const Leaderboards = () => {
    const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apiRequest<LeaderboardEntry[]>('api/leaderboards');
                setLeaderboardEntries(data);
                setLoading(false);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!leaderboardEntries || leaderboardEntries.length == 0) {
        return <div>Sorry! You can&apos;t see this unless you are logged in!</div>;
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen py-10">
            <div className="w-full max-w-6xl flex justify-between items-center mb-8">
                <Link href="/" className="text-blue-500 hover:text-blue-700">
                    <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                        Back to Home
                    </button>
                </Link>
                <h1 className="text-4xl font-bold">Leaderboards</h1>
                <div className="w-24"></div> {/* Placeholder to keep the title centered */}
            </div>
            <div className="overflow-x-auto w-full max-w-6xl">
                <table className="table-auto w-full border border-black">
                    <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2 border border-black">Player</th>
                        <th className="px-4 py-2 border border-black">ELO</th>
                        <th className="px-4 py-2 border border-black">Rank</th>
                        <th className="px-4 py-2 border border-black">Matches Played</th>
                        <th className="px-4 py-2 border border-black">W/L Ratio</th>
                        <th className="px-4 py-2 border border-black">Profile</th>
                    </tr>
                    </thead>
                    <tbody>
                    {leaderboardEntries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-100">
                            <td className="border px-4 py-2 bg-gray-50">{entry.name}</td>
                            <td className="border px-4 py-2 text-center bg-gray-50">{entry.elo}</td>
                            <td
                                className="border px-4 py-2 text-center"
                                style={{ backgroundColor: rankColors[entry.rank] || '#ffffff' }}
                            >
                                {parseRank(entry.rank)}
                            </td>
                            <td className="border px-4 py-2 text-center bg-gray-50">{entry.matchesPlayed}</td>
                            <td className="border px-4 py-2 text-center bg-gray-50">{Number(entry.winLossRatio).toFixed(2)}</td>
                            <td className="border px-4 py-2 text-center bg-gray-50">
                                <Link href={`/players/${entry.id}`} className="text-blue-500 hover:text-blue-700">
                                    View Profile
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboards;