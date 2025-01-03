import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Authentication/AuthProvider';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: '',
    caption: '',
    tags: '',
    collaborators: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?._id) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents/search?owner=${user._id}`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('Failed to fetch documents');
    }
  };

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Validate required fields
      if (!newDocument.title || !newDocument.caption) {
        setError('Title and caption are required');
        return;
      }

      const collaboratorEmails = newDocument.collaborators
        ? newDocument.collaborators
            .split(',')
            .map(email => email.trim())
            .filter(email => email !== '')
        : [];

      // Get collaborator IDs
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
      setDocuments([...documents, response.data]);
      setShowCreateModal(false);
      setNewDocument({ title: '', caption: '', tags: '', collaborators: '' });
      navigate(`/home/document/${response.data._id}`);
    } catch (error) {
      console.error('Error creating document:', error);
      setError(error.response?.data?.message || 'Failed to create document');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Documents</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          Create New Document
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div
            key={doc._id}
            onClick={() => navigate(`/home/document/${doc._id}`)}
            className="card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
          >
            <div className="card-body">
              <h2 className="card-title">{doc.title}</h2>
              <p className="text-sm text-gray-600">{doc.caption}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {doc.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="badge badge-primary badge-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-sm">Status: {doc.status}</p>
                <p className="text-sm">
                  Collaborators: {doc.collaborators.length}
                </p>
              </div>
            </div>
          </div>
        ))}
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
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, title: e.target.value })
                  }
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
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, caption: e.target.value })
                  }
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
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, tags: e.target.value })
                  }
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Collaborator Emails (comma-separated)
                  </span>
                </label>
                <input
                  type="text"
                  value={newDocument.collaborators}
                  onChange={(e) =>
                    setNewDocument({
                      ...newDocument,
                      collaborators: e.target.value,
                    })
                  }
                  className="input input-bordered"
                />
              </div>

              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
                <button
                  type="button"
                  className="btn"
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