import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Components/Authentication/AuthProvider';
import DatasetValue from '../Components/UserDashboard/DatasetValue';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    declined: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [userDocuments, setUserDocuments] = useState([]);
  
  const colors = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28']; // Pie chart colors
  
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        // Fetch temp data
        const response = await fetch(`http://localhost:3000/api/tempData/search?user=${user._id}`);
        const data = await response.json();
        
        // Calculate stats for temp data
        const stats = data.reduce((acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {});

        setStats({
          pending: stats.pending || 0,
          approved: stats.approved || 0,
          declined: stats.declined || 0
        });

        setRecentSubmissions(data.slice(0, 5));  // Get the 5 most recent submissions
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    const fetchUserDocuments = async () => {
      try {
        // Fetch documents owned by the current user
        const response = await fetch(`http://localhost:3000/api/documents/search?owner=${user._id}`);
        const data = await response.json();
        setUserDocuments(data);
      } catch (error) {
        console.error('Error fetching user documents:', error);
      }
    };

    if (user?._id) {
      fetchUserStats();
      fetchUserDocuments();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Pie chart data for status distribution
  const statusData = [
    { name: 'Pending', value: stats.pending },
    { name: 'Approved', value: stats.approved },
    { name: 'Declined', value: stats.declined }
  ];

  // Pie chart data for documents
  const documentData = [
    { name: 'Documents', value: userDocuments.length }
  ];

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

        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pie charts for dataset and documents */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-primary mb-4">Dataset Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  fill="#8884d8"
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-primary mb-4">Document Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={documentData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  fill="#82ca9d"
                  label
                >
                  {documentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mb-8">
          <DatasetValue stats={stats} recentSubmissions={recentSubmissions} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
