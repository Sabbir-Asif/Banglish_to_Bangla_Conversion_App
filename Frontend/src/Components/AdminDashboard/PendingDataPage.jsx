import React, { useEffect, useState } from 'react';
import PendingDataCard from './PendingDataCard';

const PendingDataPage = () => {
    const [pendingData, setPendingData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPendingData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/tempData/search?status=pending');
                if (!response.ok) {
                    throw new Error('Failed to fetch pending data');
                }
                const data = await response.json();
                setPendingData(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPendingData();
    }, []);

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">Pending Data</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="grid grid-cols-1 gap-4">
                {pendingData.map((dataItem) => (
                    <PendingDataCard key={dataItem._id} dataItem={dataItem} />
                ))}
            </div>
        </div>
    );
};

export default PendingDataPage;