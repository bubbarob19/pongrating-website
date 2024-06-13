import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type Match = {
    date: string; // Assuming date is returned as a string in ISO format
    winnerId: string;
    loserId: string;
    winnerScore: number;
    loserScore: number;
    winnerEloChange: number;
    loserEloChange: number;
};

type Player = {
    id: string;
    firstName: string;
    lastName: string;
    elo: number;
    displayElo: number;
    rank: string;
    matchHistory: Match[];
};

const PlayerProfile = () => {
    const router = useRouter();
    const { id } = router.query;
    const [player, setPlayer] = useState<Player | null>(null);

    useEffect(() => {
        if (id) {
            const fetchPlayer = async () => {
                const res = await fetch(`http://localhost:8080/api/players/${id}`);
                const data = await res.json();
                setPlayer(data);
            };
            fetchPlayer();
        }
    }, [id]);

    if (!player) return <div>Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold">{player.firstName} {player.lastName}</h1>
            <p className="mt-4">ELO: {player.elo}</p>
            <p>Display ELO: {player.displayElo}</p>
            <p>Rank: {player.rank}</p>
            <h2 className="text-2xl font-bold mt-4">Match History</h2>
            <table className="table-auto mt-4">
                <thead>
                <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Winner</th>
                    <th className="px-4 py-2">Loser</th>
                    <th className="px-4 py-2">Winner Score</th>
                    <th className="px-4 py-2">Loser Score</th>
                    <th className="px-4 py-2">Winner ELO Change</th>
                    <th className="px-4 py-2">Loser ELO Change</th>
                </tr>
                </thead>
                <tbody>
                {player.matchHistory.map((match, index) => (
                    <tr key={index}>
                        <td className="border px-4 py-2">{new Date(match.date).toLocaleDateString()}</td>
                        <td className="border px-4 py-2">{match.winnerId}</td>
                        <td className="border px-4 py-2">{match.loserId}</td>
                        <td className="border px-4 py-2">{match.winnerScore}</td>
                        <td className="border px-4 py-2">{match.loserScore}</td>
                        <td className="border px-4 py-2">{match.winnerEloChange}</td>
                        <td className="border px-4 py-2">{match.loserEloChange}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PlayerProfile;