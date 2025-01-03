import React from 'react';
import { Link } from 'react-router-dom';

const WriterCard = ({ writer }) => {
    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="card-body">
                <div className="flex items-center">
                    <img
                        src={writer.imageUrl || '/default-avatar.png'}
                        alt={writer.username}
                        className="h-16 w-16 rounded-full mr-4"
                    />
                    <div>
                        <h3 className="card-title text-xl font-bold">{writer.username}</h3>
                        <p className="text-sm text-gray-500">{writer.email}</p>
                    </div>
                </div>
                <div className="card-actions justify-end mt-4">
                    <Link to={`${writer._id}`} className="btn btn-primary btn-sm">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default WriterCard;
