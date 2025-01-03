import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Mail, MapPin, Calendar, BookOpen, 
  ArrowLeft, Globe, Twitter, Loader2 
} from 'lucide-react';
import StoriesCard from '../Stories/StoriesCard';

const WriterDetails = () => {
  const { id } = useParams();
  const [writer, setWriter] = useState(null);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWriterDetails = async () => {
      try {
        setIsLoading(true);
        const [writerRes, storiesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`),
          fetch(`${import.meta.env.VITE_API_URL}/api/documents/search?owner=${id}`)
        ]);

        if (!writerRes.ok) throw new Error('Failed to fetch writer details');
        if (!storiesRes.ok) throw new Error('Failed to fetch stories');

        const [writerData, storiesData] = await Promise.all([
          writerRes.json(),
          storiesRes.json()
        ]);

        setWriter(writerData);
        setStories(storiesData.filter(story => story.status === 'Published'));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWriterDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-orange-50 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-[#FF8938] animate-spin" />
      </div>
    );
  }

  if (error || !writer) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Writer not found'}</p>
          <Link 
            to="/home/writer"
            className="text-[#FF8938] hover:text-[#E6A623] underline"
          >
            Back to Writers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 to-white">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/home/writer"
          className="inline-flex items-center text-gray-600 hover:text-[#FF8938] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-poppins">Back to Writers</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Writer Profile */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {writer.imageUrl ? (
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#FF8938] ring-offset-4">
                  <img
                    src={writer.imageUrl}
                    alt={writer.displayName || writer.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FF8938] to-[#E6A623] flex items-center justify-center text-white text-4xl font-bold ring-4 ring-[#FF8938] ring-offset-4">
                  {(writer.displayName || writer.username).charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Writer Info */}
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 font-exo">
                  {writer.displayName || writer.username}
                </h1>
                {writer.displayName && (
                  <p className="text-gray-500 font-poppins">@{writer.username}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3 text-[#FF8938]" />
                    <span className="font-poppins">{writer.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <BookOpen className="w-5 h-5 mr-3 text-[#FF8938]" />
                    <span className="font-poppins">
                      {stories.length} Published {stories.length === 1 ? 'Story' : 'Stories'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stories Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-exo flex items-center">
            <BookOpen className="w-6 h-6 mr-3 text-[#FF8938]" />
            Published Stories
          </h2>
          
          {stories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <StoriesCard key={story._id} document={story} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-500 font-poppins">
                No published stories yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriterDetails;