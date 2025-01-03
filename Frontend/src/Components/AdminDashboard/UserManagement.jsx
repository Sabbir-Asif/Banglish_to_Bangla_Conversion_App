import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Authentication/AuthProvider';

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
            const response = await fetch('http://localhost:3000/api/users');
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
            const response = await fetch(`http://localhost:3000/api/users/search?email=${searchQuery}`);
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
            const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
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
        <div className="space-y-6">
            {/* Top Controls */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                {/* Tab Buttons */}
                <div className="tabs tabs-boxed">
                    <button 
                        className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Users
                    </button>
                    <button 
                        className={`tab ${activeTab === 'admin' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('admin')}
                    >
                        Admins
                    </button>
                    <button 
                        className={`tab ${activeTab === 'user' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('user')}
                    >
                        Users
                    </button>
                </div>

                {/* Search Bar */}
                <div className="join">
                    <input
                        type="text"
                        placeholder="Search by email"
                        className="input input-bordered join-item w-full md:w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button 
                        className="btn btn-primary join-item"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{success}</span>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                /* Users Table */
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        {/* Table Head */}
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user._id} className={user.email === currentUser.email ? 'bg-base-200' : ''}>
                                    <td className="flex items-center gap-3">
                                        {user.imageUrl && (
                                            <div className="avatar">
                                                <div className="w-8 rounded-full">
                                                    <img 
                                                        src={user.imageUrl} 
                                                        alt={user.displayName}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <span className="font-medium">
                                            {user.displayName}
                                            {user.email === currentUser.email && (
                                                <span className="badge badge-sm badge-ghost ml-2">You</span>
                                            )}
                                        </span>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div className={`badge ${
                                            user.role === 'admin' ? 'badge-primary' : 'badge-secondary'
                                        }`}>
                                            {user.role}
                                        </div>
                                    </td>
                                    <td>
                                        {user.email === currentUser.email ? (
                                            <div className="text-sm text-gray-500 italic">
                                                Cannot modify own role
                                            </div>
                                        ) : (
                                            <select
                                                className="select select-bordered select-sm w-full max-w-xs"
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

                    {/* Empty State */}
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