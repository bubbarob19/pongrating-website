import React from 'react';
import { TooltipProps } from 'recharts';
import { format } from 'date-fns';

interface CustomTooltipProps extends TooltipProps<number, string> {
    payload?: { payload: EloHistoryEntry }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const date = format(new Date(data.date), 'dd MMM yyyy');
        const eloChange = data.eloChange;

        return (
            <div className="custom-tooltip bg-white border border-gray-300 p-2">
                <p className="label">{`Date: ${date}`}</p>
                <p className="intro">{`ΔElo: ${eloChange}`}</p>
            </div>
        );
    }

    return null;
};

export default CustomTooltip;