import React, { useEffect, useState } from "react";
import { AlertTriangle, Check, Clock, X, Loader } from "lucide-react";
import PendingDataCard from "./PendingDataCard";

const PendingDataPage = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filter, setFilter] = useState("pending");

  // Fetch all data initially
  useEffect(() => {
    fetchAllData();
  }, []);

  // Apply filters when filter or allData changes
  useEffect(() => {
    if (allData.length > 0) {
      handleFilterChange(filter);
    }
  }, [filter, allData]);

  const fetchAllData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tempData/search`);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setAllData(data);
      setError("");
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleFilterChange = async (newFilter) => {
    setFilterLoading(true);
    setFilter(newFilter);
    
    // Simulate API delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const filtered = allData.filter(item => item.status === newFilter);
    setFilteredData(filtered);
    setFilterLoading(false);
  };

  const handleStatusChange = (id, newStatus) => {
    // Update both all data and filtered data
    const updatedAllData = allData.map(item =>
      item._id === id ? { ...item, status: newStatus } : item
    );
    setAllData(updatedAllData);
    setFilteredData(prev => prev.filter(item => item._id !== id));
  };

  const getStats = () => {
    return {
      total: allData.length,
      pending: allData.filter(item => item.status === "pending").length,
      approved: allData.filter(item => item.status === "approved").length,
      declined: allData.filter(item => item.status === "declined").length
    };
  };

  const stats = getStats();

  const LoadingOverlay = ({ message }) => (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <Loader className="h-6 w-6 animate-spin text-orange-primary" />
        <span className="text-sm text-gray-600">{message}</span>
      </div>
    </div>
  );

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingOverlay message="Loading data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full relative">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {filterLoading && <LoadingOverlay message="Updating filters..." />}
        {stats.total > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2">
              <Clock className="text-blue-500" />
              <h3 className="text-lg font-medium">Total Entries</h3>
            </div>
            <p className="mt-2 text-3xl font-bold">{stats.total}</p>
          </div>
        )}
        {stats.pending > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" />
              <h3 className="text-lg font-medium">Pending Review</h3>
            </div>
            <p className="mt-2 text-3xl font-bold">{stats.pending}</p>
          </div>
        )}
        {stats.approved > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2">
              <Check className="text-green-500" />
              <h3 className="text-lg font-medium">Approved</h3>
            </div>
            <p className="mt-2 text-3xl font-bold">{stats.approved}</p>
          </div>
        )}
        {stats.declined > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2">
              <X className="text-red-500" />
              <h3 className="text-lg font-medium">Declined</h3>
            </div>
            <p className="mt-2 text-3xl font-bold">{stats.declined}</p>
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2">
        {stats.pending > 0 && (
          <button
            disabled={filterLoading}
            className={`px-4 py-2 rounded-lg ${
              filter === "pending"
                ? "bg-gradient-to-r from-orange-primary to-orange-secondary text-white"
                : "bg-gray-100 hover:bg-gray-200"
            } ${filterLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => handleFilterChange("pending")}
          >
            <div className="flex items-center gap-2">
              {filterLoading && filter === "pending" && (
                <Loader className="h-4 w-4 animate-spin" />
              )}
              <span>Pending ({stats.pending})</span>
            </div>
          </button>
        )}
        {stats.approved > 0 && (
          <button
            disabled={filterLoading}
            className={`px-4 py-2 rounded-lg ${
              filter === "approved"
                ? "bg-gradient-to-r from-orange-primary to-orange-secondary text-white"
                : "bg-gray-100 hover:bg-gray-200"
            } ${filterLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => handleFilterChange("approved")}
          >
            <div className="flex items-center gap-2">
              {filterLoading && filter === "approved" && (
                <Loader className="h-4 w-4 animate-spin" />
              )}
              <span>Approved ({stats.approved})</span>
            </div>
          </button>
        )}
        {stats.declined > 0 && (
          <button
            disabled={filterLoading}
            className={`px-4 py-2 rounded-lg ${
              filter === "declined"
                ? "bg-gradient-to-r from-orange-primary to-orange-secondary text-white"
                : "bg-gray-100 hover:bg-gray-200"
            } ${filterLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => handleFilterChange("declined")}
          >
            <div className="flex items-center gap-2">
              {filterLoading && filter === "declined" && (
                <Loader className="h-4 w-4 animate-spin" />
              )}
              <span>Declined ({stats.declined})</span>
            </div>
          </button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Data Cards Section */}
      <div className="grid grid-cols-1 gap-6 relative">
        {filterLoading && <LoadingOverlay message="Updating results..." />}
        
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <PendingDataCard
              key={item._id}
              dataItem={item}
              onStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              {filter === "pending" && (
                <>
                  <AlertTriangle className="h-12 w-12 text-yellow-500" />
                  <p className="text-lg text-gray-600">No pending items requiring review</p>
                </>
              )}
              {filter === "approved" && (
                <>
                  <Check className="h-12 w-12 text-green-500" />
                  <p className="text-lg text-gray-600">No approved items to display</p>
                </>
              )}
              {filter === "declined" && (
                <>
                  <X className="h-12 w-12 text-red-500" />
                  <p className="text-lg text-gray-600">No declined items to display</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingDataPage;