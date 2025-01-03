import React, { useState, useEffect, useContext } from 'react';
import { AlertCircle, CheckCircle, Clock, Search, Filter } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../Components/Authentication/AuthProvider';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const [datasets, setDatasets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchUserDatasets();
        }
    }, [user]);

    /**
     * Fetches datasets associated with the logged-in user's ID.
     * Updates the datasets state with the received data,
     * handles any errors by setting an appropriate error message,
     * and manages the loading state.
     */
    const fetchUserDatasets = async () => {
        try {
            // First get temp data (pending/review submissions)
            const tempResponse = await axios.get(`http://localhost:3000/api/tempData/search`, {
                params: { userId: user._id }
            });

            // Then get approved data from the main DataTable
            const approvedResponse = await axios.get('http://localhost:3000/api/tempData/search?status=approved', {
                params: { userId: user._id }
            });

            // Ensure we're working with arrays and handle potential null/undefined values
            const tempData = Array.isArray(tempResponse.data) 
                ? tempResponse.data.map(entry => ({
                    _id: entry._id,
                    status: entry.status,
                    lastModified: entry.lastModified,
                    data: Array.isArray(entry.data) ? entry.data : [entry.data]
                }))
                : [];

            const approvedData = Array.isArray(approvedResponse.data)
                ? approvedResponse.data.map(entry => ({
                    _id: entry._id,
                    status: 'approved',
                    lastModified: entry.updatedAt,
                    data: [{
                        banglish: entry.banglish || '',
                        english: entry.english || '',
                        bangla: entry.bangla || ''
                    }]
                }))
                : [];

            // For debugging
            console.log('Temp Response:', tempResponse.data);
            console.log('Approved Response:', approvedResponse.data);

            // Combine all datasets
            const allDatasets = [...tempData, ...approvedData];
            setDatasets(allDatasets);
            setError(null);
        } catch (error) {
            console.error('Error fetching datasets:', error);
            setError('Failed to fetch your datasets. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'declined':
                return <AlertCircle className="text-red-500" size={20} />;
            case 'pending':
                return <Clock className="text-yellow-500" size={20} />;
            default:
                return null;
        }
    };

    const filteredDatasets = datasets.filter(dataset => {
        if (!dataset.data || !Array.isArray(dataset.data)) return false;
        
        const matchesSearch = dataset.data.some(entry => {
            if (!entry) return false;
            return (
                (entry.banglish || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (entry.english || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (entry.bangla || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        const matchesStatus = statusFilter === 'all' || dataset.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (!user) {
        return (
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <AlertCircle className="mx-auto text-yellow-500 mb-2" size={24} />
                <p className="text-yellow-700">Please log in to view your datasets.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-4 bg-red-50 rounded-lg">
                <AlertCircle className="mx-auto text-red-500 mb-2" size={24} />
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search in your datasets..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-primary/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={20} className="text-gray-400" />
                    <select
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-primary/20"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="declined">Declined</option>
                    </select>
                </div>
            </div>

            {/* Datasets List */}
            {filteredDatasets.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No datasets found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredDatasets.map((dataset) => (
                        <div
                            key={dataset._id}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(dataset.status)}
                                    <span className="capitalize font-medium text-gray-700">
                                        {dataset.status}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date(dataset.lastModified).toLocaleDateString()}
                                </span>
                            </div>
                            
                            <div className="space-y-4">
                                {dataset.data.map((entry, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Banglish</p>
                                            <p>{entry.banglish}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">English</p>
                                            <p>{entry.english}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Bangla</p>
                                            <p>{entry.bangla}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;