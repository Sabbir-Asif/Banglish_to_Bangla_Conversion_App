import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Share2, FileText, User, Plus, X } from 'lucide-react';
import { AuthContext } from '../Authentication/AuthProvider';
import axios from 'axios';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    isPublic: '',
    tags: '',
    startDate: '',
    endDate: ''
  });
  const [newDocument, setNewDocument] = useState({
    title: '',
    caption: '',
    tags: '',
    collaborators: ''
  });

  useEffect(() => {
    if (user?._id) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      // Fetch owned documents
      const ownedResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents/search?owner=${user._id}`);
      const ownedDocuments = Array.isArray(ownedResponse.data) ? ownedResponse.data : [];
  
      // Fetch collaborated documents
      const collaboratedResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents/search?collaborator=${user._id}`);
      const collaboratedDocuments = Array.isArray(collaboratedResponse.data) ? collaboratedResponse.data : [];
  
      // Combine both sets of documents and remove duplicates
      const allDocuments = [...ownedDocuments, ...collaboratedDocuments];
      const uniqueDocuments = allDocuments.filter(
        (doc, index, self) => self.findIndex((d) => d._id === doc._id) === index
      );
  
      setDocuments(uniqueDocuments);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      setError('Failed to fetch documents');
    }
  };
  
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    const queryParams = new URLSearchParams();
    queryParams.append('owner', user._id);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents/search?${queryParams}`);
      setDocuments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error:', error);
      setError('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (!newDocument.title || !newDocument.caption) {
        setError('Title and caption are required');
        return;
      }

      const collaboratorEmails = newDocument.collaborators
        ? newDocument.collaborators.split(',').map(email => email.trim()).filter(Boolean)
        : [];

      const collaboratorIds = [];
      for (const email of collaboratorEmails) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/search?email=${email}`);
          if (response.data.length > 0) {
            collaboratorIds.push(response.data[0]._id);
          }
        } catch (error) {
          console.error(`Error finding user with email ${email}:`, error);
        }
      }

      const documentData = {
        owner: user._id,
        collaborators: collaboratorIds,
        status: 'Draft',
        title: newDocument.title,
        caption: newDocument.caption,
        tags: newDocument.tags ? newDocument.tags.split(',').map(tag => tag.trim()) : [],
        banglishContent: '',
        banglaContent: '',
        isPublic: false,
        pdfUrl: 'xyz'
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/documents`, documentData);
      setShowCreateModal(false);
      setNewDocument({ title: '', caption: '', tags: '', collaborators: '' });
      navigate(`/home/document/${response.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create document');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-orange-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-base-200 p-6 font-poppins">
      <div className="w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-exo font-bold text-orange-primary">Documents</h1>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary bg-orange-primary hover:bg-orange-secondary border-none gap-2"
          >
            <Plus className="w-4 h-4" />
            New Document
          </button>
        </div>

        {/* Search and Filters */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="input input-bordered w-full"
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                  />
                </div>
                <select
                  className="select select-bordered"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">All Status</option>
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
                <select
                  className="select select-bordered"
                  value={filters.isPublic}
                  onChange={(e) => setFilters({...filters, isPublic: e.target.value})}
                >
                  <option value="">All Visibility</option>
                  <option value="true">Public</option>
                  <option value="false">Private</option>
                </select>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  className="input input-bordered flex-1"
                  value={filters.tags}
                  onChange={(e) => setFilters({...filters, tags: e.target.value})}
                />
                <input
                  type="date"
                  className="input input-bordered"
                  value={filters.startDate}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                />
                <input
                  type="date"
                  className="input input-bordered"
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => {
                    setFilters({
                      searchTerm: '',
                      status: '',
                      isPublic: '',
                      tags: '',
                      startDate: '',
                      endDate: ''
                    });
                    fetchDocuments();
                  }}
                  className="btn btn-ghost gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
                <button 
                  type="submit" 
                  className="btn bg-orange-primary hover:bg-orange-secondary text-white border-none gap-2"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.length === 0 ? (
            <div className="col-span-full card bg-base-100 p-12 text-center">
              <img 
                src="https://gist.githubusercontent.com/AntonioErdeljac/dd4ddba7133cdddc5acfd7a07772c786/raw/101828e5f69c44ec70af4a259c5bd91fbc3269c6/blank-document.svg"
                alt="No documents" 
                className="w-32 h-32 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold">No documents found</h3>
              <p className="text-gray-500">Try adjusting your search filters</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div 
                key={doc._id} 
                onClick={() => navigate(`/home/document/${doc._id}`)}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="card-title text-lg font-semibold text-gray-900 line-clamp-1">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">{doc.caption}</p>
                    </div>
                    <div className={`badge ${
                      doc.status === 'Published' 
                        ? 'badge-success text-white'
                        : 'badge-warning text-white'
                    }`}>
                      {doc.status}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <User className="w-4 h-4 text-orange-primary" />
                    <span className="text-sm">
                      {doc.isCollaborator 
                        ? `Shared by ${doc.owner?.displayName}`
                        : `Owned by ${doc.owner?.displayName}`
                      }
                    </span>
                  </div>

                  {doc.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {doc.tags.map((tag, index) => (
                        <span key={index} className="badge badge-outline text-cream-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      {doc.pdfUrl && doc.pdfUrl !== 'xyz' && (
                        <a 
                          href={doc.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-circle btn-ghost btn-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FileText className="w-4 h-4" />
                        </a>
                      )}
                      <button 
                        className="btn btn-circle btn-ghost btn-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Document Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create New Document</h3>
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleCreateDocument}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  value={newDocument.title}
                  onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Caption</span>
                </label>
                <input
                  type="text"
                  value={newDocument.caption}
                  onChange={(e) => setNewDocument({ ...newDocument, caption: e.target.value })}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tags (comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={newDocument.tags}
                  onChange={(e) => setNewDocument({ ...newDocument, tags: e.target.value })}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Collaborator Emails (comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={newDocument.collaborators}
                  onChange={(e) => setNewDocument({ ...newDocument, collaborators: e.target.value })}
                  className="input input-bordered"
                />
              </div>

              <div className="modal-action">
                <button type="submit" className="btn bg-orange-primary hover:bg-orange-secondary text-white border-none">
                  Create
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;