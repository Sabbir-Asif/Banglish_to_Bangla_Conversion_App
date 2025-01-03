import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StoriesCard from '../Stories/StoriesCard';
import { Loader } from './Loader';

const WriterDetails = () => {
    const { id } = useParams();
    const [writer, setWriter] = useState(null);
    const [stories, setStories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWriterDetails = async () => {
            try {
                const writerResponse = await fetch(`http://localhost:3000/api/users/${id}`);
                const writerData = await writerResponse.json();
                setWriter(writerData);

                const storiesResponse = await fetch(`http://localhost:3000/api/documents/search?owner=${id}`);
                const storiesData = await storiesResponse.json();
                setStories(storiesData.filter(story => story.status === 'Published'));
            } catch (error) {
                console.error('Failed to fetch writer details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWriterDetails();
    }, [id]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center">
                <img
                    src={writer?.imageUrl || '/default-avatar.png'}
                    alt={writer?.username}
                    className="h-24 w-24 rounded-full mr-6"
                />
                <div>
                    <h2 className="text-3xl font-bold">{writer?.username}</h2>
                    <p className="text-sm text-gray-500">{writer?.email}</p>
                </div>
            </div>

            <h3 className="text-2xl font-bold mt-6">Published Stories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                {stories.map((document) => (
                    <StoriesCard key={document._id} document={document} />
                ))}
            </div>
        </div>
    );
};

export default WriterDetails;
