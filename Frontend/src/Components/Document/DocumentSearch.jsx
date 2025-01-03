import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const DocumentSearch = ({ onSearch, isLoading }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    isPublic: '',
    owner: '',
    tags: '',
    startDate: '',
    endDate: ''
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    handleSearch();
  }, [debouncedFilters]);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    
    Object.entries(debouncedFilters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    onSearch(queryParams);
  };

  const handleReset = () => {
    setFilters({
      searchTerm: '',
      status: '',
      isPublic: '',
      owner: '',
      tags: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            />
          </div>
          
          <select
            className="px-4 py-2 border rounded-lg bg-white"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tags (comma separated)"
              className="w-full px-4 py-2 border rounded-lg"
              value={filters.tags}
              onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
            />
          </div>

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
            onClick={handleSearch}
            disabled={isLoading}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentSearch;