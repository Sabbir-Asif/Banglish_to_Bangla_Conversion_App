import React, { useState, useEffect } from 'react';
import PendingDataPage from "../Components/AdminDashboard/PendingDataPage";
import UserManagement from "../Components/AdminDashboard/UserManagement";
import { Shield, Users } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dataset');

    return (
        <div className="h-screen w-full overflow-y-scroll bg-gradient-to-br from-[#FFF7F4] via-white to-[#FFF0E9] p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center space-y-4 mb-8">
                    <h2 className="text-4xl md:text-5xl font-bold font-exo">
                        Admin Dashboard
                    </h2>
                    <p className="text-gray-600 font-poppins">
                        Manage your datasets and users in one place
                    </p>
                </div>
                
                <div className="flex justify-center mb-8">
                    <div className="tabs tabs-boxed bg-white/50 backdrop-blur-sm">
                        <button 
                            className={`tab tab-lg gap-2 ${activeTab === 'dataset' ? 'tab-active bg-gradient-to-r from-orange-primary to-orange-secondary text-white' : ''}`}
                            onClick={() => setActiveTab('dataset')}
                        >
                            <Shield size={20} />
                            Dataset Management
                        </button>
                        <button 
                            className={`tab tab-lg gap-2 ${activeTab === 'users' ? 'tab-active bg-gradient-to-r from-orange-primary to-orange-secondary text-white' : ''}`}
                            onClick={() => setActiveTab('users')}
                        >
                            <Users size={20} />
                            User Management
                        </button>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body p-4 md:p-6">
                        {activeTab === 'dataset' ? (
                            <PendingDataPage />
                        ) : (
                            <UserManagement />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;