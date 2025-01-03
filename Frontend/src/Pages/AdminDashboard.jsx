import React, { useState } from 'react';
import PendingDataPage from "../Components/AdminDashboard/PendingDataPage";
import UserManagement from "../Components/AdminDashboard/UserManagement";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dataset');

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-center my-8 md:my-10">
                    Admin Dashboard
                </h2>
                
                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="tabs tabs-boxed">
                        <button 
                            className={`tab tab-lg ${activeTab === 'dataset' ? 'tab-active' : ''}`}
                            onClick={() => setActiveTab('dataset')}
                        >
                            Dataset Management
                        </button>
                        <button 
                            className={`tab tab-lg ${activeTab === 'users' ? 'tab-active' : ''}`}
                            onClick={() => setActiveTab('users')}
                        >
                            User Management
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-base-100 rounded-box shadow-xl">
                    <div className="p-4 md:p-6">
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