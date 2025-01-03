import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDashboard = () => {
    const [datasets, setDatasets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDatasets = async () => {
            try {
                const response = await axios.get('/api/tempData'); // Replace with your backend endpoint
                setDatasets(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load datasets");
            } finally {
                setLoading(false);
            }
        };

        fetchUserDatasets();
    }, []);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#F0F8FF] via-white to-[#F5F5F5] p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center space-y-4 mb-8">
                    <h2 className="text-4xl md:text-5xl font-bold font-exo">
                        User Dashboard
                    </h2>
                    <p className="text-gray-600 font-poppins">
                        View your uploaded datasets and their status
                    </p>
                </div>

                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : datasets.length === 0 ? (
                    <div className="text-center text-gray-500">No datasets found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2">#</th>
                                    <th className="border border-gray-300 px-4 py-2">Banglish</th>
                                    <th className="border border-gray-300 px-4 py-2">English</th>
                                    <th className="border border-gray-300 px-4 py-2">Bangla</th>
                                    <th className="border border-gray-300 px-4 py-2">Status</th>
                                    <th className="border border-gray-300 px-4 py-2">Last Modified</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datasets.map((dataset, index) => (
                                    <tr key={dataset._id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                        <td className="border border-gray-300 px-4 py-2">{dataset.data[0].banglish}</td>
                                        <td className="border border-gray-300 px-4 py-2">{dataset.data[0].english}</td>
                                        <td className="border border-gray-300 px-4 py-2">{dataset.data[0].bangla}</td>
                                        <td
                                            className={`border border-gray-300 px-4 py-2 ${
                                                dataset.status === 'approved'
                                                    ? 'text-green-600'
                                                    : dataset.status === 'declined'
                                                    ? 'text-red-600'
                                                    : 'text-yellow-600'
                                            }`}
                                        >
                                            {dataset.status}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {new Date(dataset.lastModified).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
