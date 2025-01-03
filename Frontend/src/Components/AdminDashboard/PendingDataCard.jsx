import React, { useState } from 'react';

const PendingDataCard = ({ dataItem }) => {
    const [modalOpen, setModalOpen] = useState(false);

    const calculateMissingValues = (data) => {
        const missingFields = data.reduce((acc, item) => {
            Object.keys(item).forEach((key) => {
                if (!item[key]) acc[key] = (acc[key] || 0) + 1;
            });
            return acc;
        }, {});
        return missingFields;
    };

    const handleApproval = async () => {
        try {
            // Loop through each entry in dataItem.data
            for (const entry of dataItem.data) {
                const response = await fetch('http://localhost:3000/api/trainData', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        banglish: entry.banglish,
                        english: entry.english,
                        bangla: entry.bangla,
                    }),
                });
    
                if (!response.ok) {
                    throw new Error(`Failed to add entry: ${JSON.stringify(entry)}`);
                }
            }
    
            // Update the status of tempData
            const updateResponse = await fetch(`http://localhost:3000/api/tempData/${dataItem._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'approved' }),
            });
    
            if (!updateResponse.ok) {
                throw new Error('Failed to update tempData status');
            }
    
            alert('Data approved and moved to the training dataset.');
        } catch (error) {
            console.error('Error during approval:', error);
            alert('An error occurred while approving the data.');
        }
    };
    

    const handleDecline = async () => {
        try {
            await fetch(`http://localhost:3000/api/tempData/${dataItem._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'declined' }),
            });

            alert('Data declined.');
        } catch (error) {
            console.error('Error declining data:', error);
        }
    };

    const missingValues = calculateMissingValues(dataItem.data);
    const comment = Object.values(missingValues).every((value) => value === 0)
        ? 'Can be approved'
        : '';

    return (
        <div className="card bg-white shadow-lg p-4">
            <div className="flex justify-between">
                <div className="flex items-center gap-4">
                    <img src={dataItem.user.imageUrl} alt={dataItem.user.displayName} className="w-12 h-12 rounded-full" />
                    <div>
                        <h3 className="font-bold">{dataItem.user.displayName}</h3>
                        <p className="text-gray-500 text-sm">{new Date(dataItem.lastModified).toLocaleString()}</p>
                    </div>
                </div>
                <p className="text-gray-700">Status: {dataItem.status}</p>
            </div>

            <div className="mt-4">
                <p className="text-gray-700">Missing Values:</p>
                <ul>
                    <li>Banglish: {missingValues.banglish || 0}</li>
                    <li>English: {missingValues.english || 0}</li>
                    <li>Bangla: {missingValues.bangla || 0}</li>
                </ul>
                {comment && <p className="text-green-600 font-bold">Comment: {comment}</p>}
            </div>

            <div className="mt-4 flex gap-2">
                <button className="btn btn-primary" onClick={() => setModalOpen(true)}>View Data</button>
                <button className="btn btn-success" onClick={handleApproval}>Approve</button>
                <button className="btn btn-error" onClick={handleDecline}>Decline</button>
            </div>

            {modalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Data Details</h3>
                        <table className="table w-full mt-4">
                            <thead>
                                <tr>
                                    <th>Banglish</th>
                                    <th>English</th>
                                    <th>Bangla</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataItem.data.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{entry.banglish}</td>
                                        <td>{entry.english}</td>
                                        <td>{entry.bangla}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setModalOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingDataCard;