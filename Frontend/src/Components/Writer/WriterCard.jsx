import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, BookOpen, ArrowRight } from 'lucide-react';

const WriterCard = ({ writer }) => {
  const { _id, imageUrl, username, displayName, email, storiesCount = 0 } = writer;

  const initials = displayName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || username?.charAt(0).toUpperCase() || '?';

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-[#FF8938] ring-offset-2">
              <img
                src={writer.imageUrl || '/default-avatar.png'}
                alt={writer.username}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 truncate font-exo">
              {writer.username}
            </h3>
            <div className="flex flex-col items-start text-gray-500 mt-1">
                <h3 className="text-lg font-bold text-gray-900 font-exo">
                  {displayName || username}
                </h3>
                <div className='flex items-center'>
                <Mail className="w-4 h-4 mr-1" />
                <p className="text-sm truncate font-poppins">{writer.email}</p>
                </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Link
            to={`${writer._id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#FF8938] bg-orange-50 rounded-lg hover:bg-[#FF8938] hover:text-white transition-colors duration-200"
          >
            View Profile
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WriterCard;

