// UserManagement.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Authentication/AuthProvider';
import { Search, Users, Shield, User } from 'lucide-react';

const UserManagement = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load users');
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchUsers();
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/search?email=${searchQuery}`);
            if (!response.ok) throw new Error('Search failed');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError('Search failed');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) throw new Error('Failed to update role');
            
            const updatedUser = await response.json();
            setUsers(users.map(user => 
                user._id === userId ? updatedUser : user
            ));
            setSuccess('Role updated successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to update role');
            setTimeout(() => setError(''), 3000);
        }
    };

    const filteredUsers = users.filter(user => 
        activeTab === 'all' || user.role === activeTab
    );

    return (
        <div className="bg-white rounded-lg shadow p-6 min-h-screen w-full">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Users className="text-blue-500" />
                        <h3 className="font-semibold">Total Users</h3>
                    </div>
                    <p className="text-2xl font-bold mt-2">{users.length}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Shield className="text-purple-500" />
                        <h3 className="font-semibold">Admins</h3>
                    </div>
                    <p className="text-2xl font-bold mt-2">
                        {users.filter(u => u.role === 'admin').length}
                    </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                        <User className="text-green-500" />
                        <h3 className="font-semibold">Regular Users</h3>
                    </div>
                    <p className="text-2xl font-bold mt-2">
                        {users.filter(u => u.role === 'user').length}
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="flex gap-2">
                    <button 
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === 'all' 
                                ? 'bg-gradient-to-r from-orange-primary to-orange-secondary text-white' 
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Users
                    </button>
                    <button 
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === 'admin' 
                                ? 'bg-gradient-to-r from-orange-primary to-orange-secondary text-white' 
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => setActiveTab('admin')}
                    >
                        Admins
                    </button>
                    <button 
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === 'user' 
                                ? 'bg-gradient-to-r from-orange-primary to-orange-secondary text-white' 
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => setActiveTab('user')}
                    >
                        Users
                    </button>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by email"
                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 w-full md:w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                    {success}
                </div>
            )}

            {/* Users Table */}
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                                <tr 
                                    key={user._id} 
                                    className={user.email === currentUser.email ? 'bg-blue-50' : ''}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {user.imageUrl && (
                                                <img
                                                    className="h-8 w-8 rounded-full mr-3"
                                                    src={user.imageUrl}
                                                    alt=""
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {user.displayName}
                                                </div>
                                                {user.email === currentUser.email && (
                                                    <div className="text-sm text-gray-500">
                                                        (You)
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.role === 'admin' 
                                                ? 'bg-purple-100 text-purple-800' 
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.email === currentUser.email ? (
                                            <span className="text-gray-400 italic">
                                                Cannot modify own role
                                            </span>
                                        ) : (
                                            <select
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && !loading && (
                        <div className="text-center py-8 text-gray-500">
                            No users found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserManagement;

