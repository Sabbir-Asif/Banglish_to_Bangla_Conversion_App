// PendingDataCard.js
import React, { useState } from 'react';
import { Eye, Check, X } from 'lucide-react';

const PendingDataCard = ({ dataItem, onStatusChange }) => {
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
            for (const entry of dataItem.data) {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trainData`, {
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
    
            const updateResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/tempData/${dataItem._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'approved' }),
            });
    
            if (!updateResponse.ok) {
                throw new Error('Failed to update tempData status');
            }
    
            onStatusChange && onStatusChange(dataItem._id, 'approved');
        } catch (error) {
            console.error('Error during approval:', error);
        }
    };

    const handleDecline = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/tempData/${dataItem._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'declined' }),
            });

            onStatusChange && onStatusChange(dataItem._id, 'declined');
        } catch (error) {
            console.error('Error declining data:', error);
        }
    };

    const missingValues = calculateMissingValues(dataItem.data);
    const canBeApproved = Object.values(missingValues).every((value) => value === 0);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                        <img 
                            src={dataItem.user.imageUrl} 
                            alt={dataItem.user.displayName}
                            className="h-12 w-12 rounded-full"
                        />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {dataItem.user.displayName}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {new Date(dataItem.lastModified).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        dataItem.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : dataItem.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {dataItem.status.charAt(0).toUpperCase() + dataItem.status.slice(1)}
                    </span>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <span className="text-sm font-medium text-gray-500">Missing Banglish</span>
                        <p className="mt-1 text-2xl font-semibold text-gray-900">
                            {missingValues.banglish || 0}
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <span className="text-sm font-medium text-gray-500">Missing English</span>
                        <p className="mt-1 text-2xl font-semibold text-gray-900">
                            {missingValues.english || 0}
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <span className="text-sm font-medium text-gray-500">Missing Bangla</span>
                        <p className="mt-1 text-2xl font-semibold text-gray-900">
                            {missingValues.bangla || 0}
                        </p>
                    </div>
                </div>

                {canBeApproved && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700 font-medium">
                            ✓ All required fields are present. This data can be approved.
                        </p>
                    </div>
                )}

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        View Data
                    </button>
                    <button
                        onClick={handleApproval}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                        disabled={!canBeApproved}
                    >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                    </button>
                    <button
                        onClick={handleDecline}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Decline
                    </button>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg font-medium text-gray-900">Data Details</h3>
                                <div className="mt-4">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Banglish</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">English</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bangla</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {dataItem.data.map((entry, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.banglish}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.english}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.bangla}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingDataCard;
