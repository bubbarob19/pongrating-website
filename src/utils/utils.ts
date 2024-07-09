export function parseRank(rank: string): string {
    return rank.replace(/_/g, ' ');
}