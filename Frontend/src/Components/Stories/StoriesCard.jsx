import React from 'react';
import { Calendar, User, ExternalLink, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StoriesCard = ({ document }) => {
    const navigate = useNavigate();
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <div className="flex justify-evenly group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ">
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-orange-primary transition-colors duration-300 font-exo">
                        {truncateText(document.title, 60)}
                    </h2>
                    <div className="px-3 py-1 text-xs font-medium bg-orange-primary/10 text-orange-primary rounded-full">
                        {document.status}
                    </div>
                </div>

                {/* Caption */}
                <p className="text-gray-600 mb-4 font-poppins">
                    {truncateText(document.caption, 120)}
                </p>

                {/* Meta Information */}
                <div className="flex flex-col space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-2" />
                        <span className="font-poppins">{document.owner?.displayName || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="font-poppins">{formatDate(document.createdAt)}</span>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {document.tags?.map((tag, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 text-xs font-medium bg-cream-primary/10 text-cream-primary rounded-full font-poppins"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => navigate(`/home/stories/${document._id}`)}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-primary rounded-lg hover:bg-orange-secondary transition-colors duration-300"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Read Story
                    </button>
                    
                    {document.pdfUrl && (
                        <a
                            href={document.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-2 text-sm font-medium text-orange-primary bg-orange-primary/10 rounded-lg hover:bg-orange-primary hover:text-white transition-colors duration-300"
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View PDF
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoriesCard;