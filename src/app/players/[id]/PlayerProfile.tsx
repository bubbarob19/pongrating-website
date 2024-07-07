'use client';

import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceArea
} from 'recharts';
import { format, parseISO } from 'date-fns';
import {apiRequest} from "@/utils/api";
import CustomTooltip from "@/components/CustomTooltip";

const rankColors: { [key: string]: string } = {
    NEWBIE: '#808080', // Gray
    PUPIL: '#008000', // Green
    SPECIALIST: '#00FFFF', // Cyan
    EXPERT: '#0000FF', // Blue
    CANDIDATE_MASTER: '#800080', // Purple
    MASTER: '#FFA500', // Orange
    GRANDMASTER: '#FF0000', // Red
};

const PlayerProfile = ({ id }: { id: string }) => {
    const [player, setPlayer] = useState<Player | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apiRequest<Player>('api/players/' + id);
                setPlayer(data);
                setLoading(false);
            } catch (err) {
                if (err instanceof Error) {
                    setError("Player not found");
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

    if (!player) {
        return <div>Error: player is null? check with dev</div>
    }

    // Prepare data for the chart
    const eloHistory = player.matchHistory.map((match) => {
        const elo = match.winnerId === player.id
            ? match.winnerNewDisplayElo
            : match.loserNewDisplayElo;
        const eloChange = match.winnerId === player.id
            ? "+" + match.winnerEloChange
            : "-" + match.loserEloChange;
        return {
            date: parseISO(match.date).getTime(), // Convert date to timestamp
            displayElo: elo,
            eloChange: eloChange
        };
    }); // Ensure the matches are in chronological order

    const indexedEloHistory: EloHistoryEntry[] = eloHistory.map((entry, index) => ({
        ...entry,
        index: index,
        eloChange: entry.eloChange,
        date: entry.date,
    }));

    // Determine the y-axis domain
    const peakElo = Math.max(...eloHistory.map((entry) => entry.displayElo));
    const yAxisMax = peakElo <= 1000 ? 1500 : peakElo <= 1500 ? 2000 : peakElo <= 2000 ? 2500 : peakElo <= 2500 ? 3000 : 3500;

    // Define the rank ranges and their colors
    const rankRanges = [
        { min: 0, max: 1200, color: rankColors.NEWBIE },
        { min: 1200, max: 1400, color: rankColors.PUPIL },
        { min: 1400, max: 1600, color: rankColors.SPECIALIST },
        { min: 1600, max: 1800, color: rankColors.EXPERT },
        { min: 1800, max: 2000, color: rankColors.CANDIDATE_MASTER },
        { min: 2000, max: 2400, color: rankColors.MASTER },
        { min: 2400, max: 3000, color: rankColors.GRANDMASTER },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold">{player.firstName} {player.lastName}</h1>
            <p className="mt-4">ELO: {player.elo}</p>
            <p className="mt-4">Display ELO: {player.displayElo}</p>
            <p className="mt-4">Rank: {player.rank}</p>
            <p className="mt-4">Wins: {player.wins}</p>
            <p className="mt-4">Losses: {player.losses}</p>
            <h2 className="text-2xl font-bold mt-6">ELO History</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={indexedEloHistory}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="index"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                    />
                    <YAxis domain={[0, yAxisMax]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {rankRanges.map((range, index) => (
                        <ReferenceArea
                            key={index}
                            y1={range.min}
                            y2={range.max}
                            strokeOpacity={0.3}
                            fill={range.color}
                        />
                    ))}
                    <Line
                        type="monotone"
                        dataKey="displayElo"
                        name={"Elo"}
                        stroke="#8884d8"
                        dot={{ r: 6 }}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
            <h2 className="text-2xl font-bold mt-6">Match History</h2>
            <div className="overflow-x-auto w-full max-w-4xl mt-4">
                <table className="table-auto w-full border border-black">
                    <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2 border border-black">Date</th>
                        <th className="px-4 py-2 border border-black">Winner</th>
                        <th className="px-4 py-2 border border-black">Loser</th>
                        <th className="px-4 py-2 border border-black">Winner Score</th>
                        <th className="px-4 py-2 border border-black">Loser Score</th>
                        <th className="px-4 py-2 border border-black">Winner ELO Change</th>
                        <th className="px-4 py-2 border border-black">Loser ELO Change</th>
                    </tr>
                    </thead>
                    <tbody>
                    {player.matchHistory.slice().reverse().map((match, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                            <td className="border px-4 py-2">{format(parseISO(match.date), 'dd MMM yyyy')}</td>
                            <td className="border px-4 py-2">{match.winnerName}</td>
                            <td className="border px-4 py-2">{match.loserName}</td>
                            <td className="border px-4 py-2 text-center">{match.winnerScore}</td>
                            <td className="border px-4 py-2 text-center">{match.loserScore}</td>
                            <td className="border px-4 py-2 text-center">{match.winnerEloChange}</td>
                            <td className="border px-4 py-2 text-center">{match.loserEloChange}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlayerProfile;