import React, { useState, useEffect } from 'react';
import { Search, X, Calendar, User, Tag } from 'lucide-react';
import StoriesCard from './StoriesCard';

const Stories = () => {
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTag, setActiveTag] = useState(null);

    const fetchDocuments = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/documents?status=Published`);
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

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchTerm(query);
        filterDocuments(query, activeTag);
    };

    const filterDocuments = (query, tag) => {
        let filtered = documents;
        
        if (query.trim()) {
            const regex = new RegExp(query, 'i');
            filtered = filtered.filter(
                (doc) =>
                    regex.test(doc.title) ||
                    regex.test(doc.caption) ||
                    regex.test(doc.banglishContent) ||
                    regex.test(doc.banglaContent) ||
                    (doc.tags && doc.tags.some((tag) => regex.test(tag)))
            );
        }

        if (tag) {
            filtered = filtered.filter(doc => doc.tags && doc.tags.includes(tag));
        }

        setFilteredDocuments(filtered);
    };

    const handleTagClick = (tag) => {
        const newTag = tag === activeTag ? null : tag;
        setActiveTag(newTag);
        filterDocuments(searchTerm, newTag);
    };

    const getAllTags = () => {
        const tagSet = new Set();
        documents.forEach(doc => {
            doc.tags?.forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet);
    };

    return (
        <div className="flex h-screen overflow-y-scroll w-full flex-col bg-gradient-to-br from-[#FFF7F4] via-white to-[#FFF0E9]">
            <div className="container mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-orange-primary mb-4 font-exo">Featured Stories</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto font-poppins">
                        Discover inspiring stories and experiences shared by our community
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-8 max-w-4xl mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search stories..."
                            className="w-full px-6 py-4 border border-gray-200 rounded-lg pl-12 focus:outline-none focus:ring-2 focus:ring-orange-secondary font-poppins"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        {searchTerm && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    filterDocuments('', activeTag);
                                }}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                            >
                                <X className="text-gray-400 hover:text-orange-primary" />
                            </button>
                        )}
                    </div>

                    {/* Tags Filter */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {getAllTags().map((tag) => (
                            <button
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    activeTag === tag
                                        ? 'bg-orange-primary text-white'
                                        : 'bg-white text-gray-600 hover:bg-orange-secondary hover:text-white'
                                } font-poppins`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="w-16 h-16 border-4 border-orange-secondary border-t-orange-primary rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="text-center py-12">
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
                            {error}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredDocuments.length === 0 && (
                    <div className="text-center py-16">
                        <h3 className="text-2xl font-bold text-gray-700 mb-2 font-exo">No stories found</h3>
                        <p className="text-gray-500 font-poppins">Try adjusting your search or filter criteria</p>
                    </div>
                )}

                {/* Stories Grid */}
                {!loading && !error && filteredDocuments.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDocuments.map((doc) => (
                            <StoriesCard key={doc._id} document={doc} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Stories;