import React, { useContext, useEffect, useState } from 'react';
import { BarChart, Database, CheckCircle, XCircle, Clock } from 'lucide-react';
import { AuthContext } from '../Components/Authentication/AuthProvider';

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
        console.log(data);
        
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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FFF7F4] via-white to-[#FFF0E9] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-4xl md:text-5xl font-bold font-exo">
            Welcome, {user?.displayName}
          </h2>
          <p className="text-gray-600 font-poppins">
            Track your dataset submissions and their status
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <Clock className="w-8 h-8 text-yellow-500" />
                <div>
                  <h3 className="text-2xl font-bold">{stats.pending}</h3>
                  <p className="text-gray-600">Pending Submissions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="text-2xl font-bold">{stats.approved}</h3>
                  <p className="text-gray-600">Approved Datasets</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <XCircle className="w-8 h-8 text-red-500" />
                <div>
                  <h3 className="text-2xl font-bold">{stats.declined}</h3>
                  <p className="text-gray-600">Declined Submissions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-2xl font-bold mb-4">Recent Submissions</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Entries</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((submission) => (
                    <tr key={submission._id}>
                      <td>{new Date(submission.createdAt).toLocaleDateString()}</td>
                      <td>{submission.data.length} entries</td>
                      <td>
                        <span className={`badge ${
                          submission.status === 'approved' ? 'badge-success' :
                          submission.status === 'declined' ? 'badge-error' :
                          'badge-warning'
                        }`}>
                          {submission.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;