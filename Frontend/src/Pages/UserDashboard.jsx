import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Components/Authentication/AuthProvider';
import DatasetValue from '../Components/UserDashboard/DatasetValue';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    declined: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tempData/search?user=${user._id}`);
        const data = await response.json();
        
        const stats = data.reduce((acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {});

        setStats({
          pending: stats.pending || 0,
          approved: stats.approved || 0,
          declined: stats.declined || 0
        });

        setRecentSubmissions(data.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchUserStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FFF7F4] via-white to-[#FFF0E9] p-4 md:p-8 overflow-scroll">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-4xl md:text-5xl font-bold font-exo">
            Welcome, {user?.displayName}
          </h2>
          <p className="text-gray-600 font-poppins">
            Track your dataset submissions and their status
          </p>
        </div>

        <div className="mb-8">
            <DatasetValue stats={stats} recentSubmissions={recentSubmissions} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;