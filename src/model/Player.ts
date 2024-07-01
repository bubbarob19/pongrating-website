type Player = {
    id: string;
    firstName: string;
    lastName: string;
    elo: number;
    displayElo: number;
    wins: number;
    losses: number;
    rank: string;
    matchHistory: Match[];
};