import React, { useState } from 'react';
import { Eye, Clock, CheckCircle, XCircle } from 'lucide-react';

const DatasetValue = ({ stats, recentSubmissions }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const handleViewData = (submission) => {
    setSelectedData(submission);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.pending > 0 && (
              <div className="bg-base-200 p-6 rounded-lg">
                <div className="flex items-center gap-4">
                  <Clock className="text-warning w-8 h-8" />
                  <div>
                    <h3 className="text-2xl font-bold">{stats.pending}</h3>
                    <p className="text-base-content/60">Pending</p>
                  </div>
                </div>
              </div>
            )}
            {stats.approved > 0 && (
              <div className="bg-base-200 p-6 rounded-lg">
                <div className="flex items-center gap-4">
                  <CheckCircle className="text-success w-8 h-8" />
                  <div>
                    <h3 className="text-2xl font-bold">{stats.approved}</h3>
                    <p className="text-base-content/60">Approved</p>
                  </div>
                </div>
              </div>
            )}
            {stats.declined > 0 && (
              <div className="bg-base-200 p-6 rounded-lg">
                <div className="flex items-center gap-4">
                  <XCircle className="text-error w-8 h-8" />
                  <div>
                    <h3 className="text-2xl font-bold">{stats.declined}</h3>
                    <p className="text-base-content/60">Declined</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Recent Submissions</h3>
            <div className="space-y-4">
              {recentSubmissions.map((submission) => (
                <div key={submission._id} className="bg-base-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{new Date(submission.createdAt).toLocaleDateString()}</p>
                      <p className="text-sm text-base-content/60">{submission.data.length} entries</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className={`badge ${
                        submission.status === 'approved' ? 'badge-success' :
                        submission.status === 'declined' ? 'badge-error' :
                        'badge-warning'
                      }`}>
                        {submission.status}
                      </span>
                      <button
                        onClick={() => handleViewData(submission)}
                        className="btn btn-ghost btn-sm"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modalOpen && selectedData && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Dataset Details</h3>
                  <button onClick={() => setModalOpen(false)} className="btn btn-sm btn-ghost">×</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Banglish</th>
                        <th>English</th>
                        <th>Bangla</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedData.data.map((item, index) => (
                        <tr key={index}>
                          <td>{item.banglish}</td>
                          <td>{item.english}</td>
                          <td>{item.bangla}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetValue;