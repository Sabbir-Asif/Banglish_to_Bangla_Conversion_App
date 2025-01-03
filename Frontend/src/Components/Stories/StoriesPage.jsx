import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const StoriesPage = () => {
    const { id } = useParams();
    const [document, setDocument] = useState(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/documents/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setDocument(data);
                } else {
                    console.error("Error fetching document");
                }
            } catch (error) {
                console.error("Failed to fetch document:", error);
            }
        };

        fetchDocument();
    }, [id]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDownloadClick = () => {
        if (document.pdfUrl) {
            window.location.href = document.pdfUrl;
        }
    };

    if (!document) {
        return <div className="text-center p-4">Story not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-primary">{document.title}</h1>
            <p className="text-sm text-gray-500 mt-2">{formatDate(document.createdAt)}</p>

                <div>
                    <p className="font-semibold">{document.owner?.displayName || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">{document.owner?.email}</p>
                </div>

            <div className="mt-6">
                <h3 className="text-xl font-bold">Content</h3>
                <p className="mt-4">{document.banglaContent}</p>

                <div className="mt-6">
                    <div className="badge badge-secondary">{document.status}</div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {document.tags?.map((tag, index) => (
                            <div key={index} className="badge badge-outline">{tag}</div>
                        ))}
                    </div>
                </div>
            </div>

            {document.pdfUrl && (
                <div className="mt-6">
                    <button onClick={handleDownloadClick} className="btn btn-primary btn-sm">
                        Download
                    </button>
                </div>
            )}
        </div>
    );
};

export default StoriesPage;
