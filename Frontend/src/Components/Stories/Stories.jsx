import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import StoriesCard from './StoriesCard';

const Stories = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: 'Published',
    tags: '',
    startDate: '',
    endDate: ''
  });

  const fetchDocuments = async (queryParams) => {
    try {
      const response = await fetch(`http://localhost:3000/api/documents/search?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch documents');
      const data = await response.json();
      setDocuments(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      fetchDocuments(queryParams);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleReset = () => {
    setFilters({
      searchTerm: '',
      status: 'Published',
      tags: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stories..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                />
              </div>
              <input
                type="text"
                placeholder="Tags (comma separated)"
                className="px-4 py-2 border rounded-lg"
                value={filters.tags}
                onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="date"
                className="flex-1 px-4 py-2 border rounded-lg"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                placeholder="Start Date"
              />
              <input
                type="date"
                className="flex-1 px-4 py-2 border rounded-lg"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                placeholder="End Date"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 flex items-center gap-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
              
              <button
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <X className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-600">No stories found</h3>
            <p className="text-gray-400 mt-2">Try adjusting your search terms or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <StoriesCard key={doc._id} document={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;