import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import StoriesCard from './StoriesCard';

const Stories = () => {
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all published documents on component mount
    const fetchDocuments = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/api/documents?status=Published');
            if (!response.ok) throw new Error('Failed to fetch documents');
            const data = await response.json();
            const publishedDocs = data.filter((doc) => doc.status === 'Published');

            setDocuments(publishedDocs);
            setFilteredDocuments(publishedDocs);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    // Handle search input and filter results
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchTerm(query);

        if (!query.trim()) {
            setFilteredDocuments(documents); // Reset to all documents if search is cleared
            return;
        }

        const regex = new RegExp(query, 'i');
        const filtered = documents.filter(
            (doc) =>
                regex.test(doc.title) ||
                regex.test(doc.caption) ||
                regex.test(doc.banglishContent) ||
                regex.test(doc.banglaContent) ||
                (doc.tags && doc.tags.some((tag) => regex.test(tag)))
        );
        setFilteredDocuments(filtered);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Search Bar */}
            <div className="mb-8">
                <div className="form-control">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Search stories..."
                            className="input input-bordered w-full"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <button className="btn btn-square btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="min-h-screen flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            )}

            {/* Error Message */}
            {!loading && error && (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* No Results */}
            {!loading && !error && filteredDocuments.length === 0 && (
                <div className="text-center py-10">
                    <h3 className="text-2xl font-semibold text-gray-600">No stories found</h3>
                    <p className="text-gray-400 mt-2">Try adjusting your search terms</p>
                </div>
            )}

            {/* Stories Grid */}
            {!loading && !error && filteredDocuments.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocuments.map((doc) => (
                        <StoriesCard key={doc._id} document={doc} />
                    ))}
                </div>
            )}
        </div>
  );
};

export default Stories;
