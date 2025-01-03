import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Components/Authentication/AuthProvider';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, Clock, CheckCircle, XCircle, Activity, FileText, ChevronRight, BarChart2 } from 'lucide-react';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  
  const colors = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28'];
  
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

    const fetchUserDocuments = async () => {
      try {
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
      <div className="flex justify-center items-center w-full min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const statusData = [
    { name: 'Pending', value: stats.pending },
    { name: 'Approved', value: stats.approved },
    { name: 'Declined', value: stats.declined }
  ];

  const documentData = [
    { name: 'Documents', value: userDocuments.length }
  ];

  const handleViewData = (submission) => {
    setSelectedData(submission);
    setModalOpen(true);
  };

  const totalSubmissions = stats.pending + stats.approved + stats.declined;
  const approvalRate = totalSubmissions ? ((stats.approved / totalSubmissions) * 100).toFixed(1) : 0;

  return (
    <div className="flex h-screen w-full flex-col bg-gradient-to-br from-[#FFF7F4] via-white to-[#FFF0E9] p-8 overflow-scroll">
      <div className="w-full mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col items-start space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {user?.displayName}
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your submissions
          </p>
        </div>

        {/* Overall Stats Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Overall Statistics</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col space-y-1">
              <span className="text-3xl font-bold text-blue-600">{totalSubmissions}</span>
              <span className="text-sm text-gray-600">Total Submissions</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-3xl font-bold text-green-600">{stats.approved}</span>
              <span className="text-sm text-gray-600">Approved ({approvalRate}%)</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-3xl font-bold text-yellow-600">{stats.pending}</span>
              <span className="text-sm text-gray-600">Pending</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-3xl font-bold text-red-600">{stats.declined}</span>
              <span className="text-sm text-gray-600">Declined</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col space-y-1">
                <span className="text-3xl font-bold text-indigo-600">{userDocuments.length}</span>
                <span className="text-sm text-gray-600">Total Documents</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-3xl font-bold text-purple-600">
                  {(totalSubmissions / (userDocuments.length || 1)).toFixed(1)}
                </span>
                <span className="text-sm text-gray-600">Avg. Submissions per Document</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Submission Status</h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
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
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Documents Overview</h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={documentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
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
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Submissions</h2>
          </div>
          <div className="space-y-4">
            {recentSubmissions.map((submission) => (
              <div 
                key={submission._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-full ${
                      submission.status === 'approved' ? 'bg-green-100' :
                      submission.status === 'declined' ? 'bg-red-100' :
                      'bg-yellow-100'
                    }`}>
                      {submission.status === 'approved' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : submission.status === 'declined' ? (
                        <XCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {submission.data.length} entries
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleViewData(submission)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {modalOpen && selectedData && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl m-4 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Dataset Details</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Banglish</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">English</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bangla</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedData.data.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.banglish}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.english}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.bangla}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;