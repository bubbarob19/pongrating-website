import dynamic from 'next/dynamic';

const PlayerProfile = dynamic(() => import('./PlayerProfile'), { ssr: false });

const PlayerProfilePage = ({ params }: { params: { id: string } }) => {
    return <PlayerProfile id={params.id} />;
};

export default PlayerProfilePage;