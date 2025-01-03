import React, { useEffect, useState } from 'react';
import WriterCard from './WriterCard';
import { Loader } from './Loader';

const WriterPage = () => {
    const [writers, setWriters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWriters = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/users');
                if (response.ok) {
                    const data = await response.json();
                    setWriters(data);
                } else {
                    console.error('Error fetching writers');
                }
            } catch (error) {
                console.error('Failed to fetch writers:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWriters();
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-primary mb-6">Writers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {writers.map((writer) => (
                    <WriterCard key={writer._id} writer={writer} />
                ))}
            </div>
        </div>
    );
};

export default WriterPage;
