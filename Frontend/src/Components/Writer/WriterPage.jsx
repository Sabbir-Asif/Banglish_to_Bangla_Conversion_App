import React, { useEffect, useState, useMemo } from 'react';
import { Users, Search, Loader2 } from 'lucide-react';
import WriterCard from './WriterCard';

const WriterPage = () => {
  const [writers, setWriters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWriters = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
        if (!response.ok) throw new Error('Failed to fetch writers');
        const data = await response.json();
        setWriters(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWriters();
  }, []);

  const filteredWriters = useMemo(() => {
    if (!searchTerm) return writers;
    
    const searchLower = searchTerm.toLowerCase();
    return writers.filter(writer => 
      writer.username.toLowerCase().includes(searchLower) ||
      writer.displayName?.toLowerCase().includes(searchLower) ||
      writer.email.toLowerCase().includes(searchLower)
    );
  }, [writers, searchTerm]);

  if (error) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-[#FF8938] hover:text-[#E6A623] underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-[#FF8938] mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 font-exo">
              Popular Writers
              {!isLoading && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredWriters.length})
                </span>
              )}
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search writers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-[#FF8938] focus:ring-2 focus:ring-[#FF8938]/20 outline-none transition-all font-poppins"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Writers Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-8 h-8 text-[#FF8938] animate-spin" />
          </div>
        ) : (
          <>
            {filteredWriters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWriters.map((writer) => (
                  <WriterCard key={writer._id} writer={writer} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 font-poppins">
                  No writers found matching your search.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WriterPage;