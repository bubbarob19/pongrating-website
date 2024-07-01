'use client';

import { useEffect, useState } from 'react';
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

    useEffect(() => {
        if (id) {
            const fetchPlayer = async () => {
                const url = `http://localhost:8080/api/players/${id}`;
                console.log(`Fetching player data from: ${url}`);
                try {
                    const res = await fetch(url);
                    if (!res.ok) {
                        throw new Error(`HTTP error! Status: ${res.status}`);
                    }
                    const data = await res.json();
                    setPlayer(data);
                } catch (error) {
                    console.error('Failed to fetch player data:', error);
                }
            };
            fetchPlayer();
        }
    }, [id]);

    if (!player) return <div>Loading...</div>;

    // Prepare data for the chart
    let currentElo = player.displayElo;
    const eloHistory = player.matchHistory.map((match) => {
        const elo = match.winnerId === player.id
            ? match.winnerNewDisplayElo
            : match.loserNewDisplayElo;
        currentElo = elo;
        return {
            date: parseISO(match.date).getTime(), // Convert date to timestamp
            displayElo: elo,
        };
    }).reverse(); // Ensure the matches are in chronological order

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
                    data={eloHistory}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={(time) => format(new Date(time), 'dd MMM yyyy')}
                    />
                    <YAxis domain={[0, yAxisMax]} />
                    <Tooltip
                        labelFormatter={(label) => format(new Date(label), 'dd MMM yyyy')}
                    />
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
                    {player.matchHistory.map((match, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                            <td className="border px-4 py-2">{format(parseISO(match.date), 'dd MMM yyyy')}</td>
                            <td className="border px-4 py-2">{match.winnerId}</td>
                            <td className="border px-4 py-2">{match.loserId}</td>
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