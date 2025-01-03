import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import debounce from 'lodash/debounce';

const DocumentEditor = () => {
  const { id } = useParams();
  const [socket, setSocket] = useState(null);
  const [document, setDocument] = useState(null);
  const [content, setContent] = useState({ banglish: '', bangla: '' });
  const [collaborators, setCollaborators] = useState([]);
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  // Join document room when socket is ready
  useEffect(() => {
    if (socket) {
      socket.emit('join-document', id);

      socket.on('receive-changes', (data) => {
        if (data.userId !== currentUser._id) {
          setContent(prevContent => ({
            ...prevContent,
            [data.field]: data.content
          }));
        }
      });
    }
  }, [socket, id]);

  // Fetch document data
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/documents/${id}`);
        setDocument(response.data);
        setContent({
          banglish: response.data.banglishContent,
          bangla: response.data.banglaContent
        });
        setCollaborators(response.data.collaborators);
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchDocument();
  }, [id]);

  // Debounced save function
  const saveDocument = useCallback(
    debounce(async (newContent) => {
      try {
        await axios.patch(`http://localhost:3000/api/documents/${id}`, {
          banglishContent: newContent.banglish,
          banglaContent: newContent.bangla
        });
      } catch (error) {
        console.error('Error saving document:', error);
      }
    }, 1000),
    [id]
  );

  const handleContentChange = (field, value) => {
    const newContent = {
      ...content,
      [field]: value
    };
    setContent(newContent);

    // Emit changes to other users
    socket.emit('document-change', {
      documentId: id,
      userId: currentUser._id,
      field,
      content: value
    });

    // Save changes to database
    saveDocument(newContent);
  };

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:3000/api/users/search?email=${newCollaborator}`);
      if (response.data.length > 0) {
        const newCollaboratorId = response.data[0]._id;
        const updatedDocument = await axios.patch(`${import.meta.env.VITE_API_URL}/api/documents/${id}`, {
          collaborators: [...collaborators.map(c => c._id), newCollaboratorId]
        });
        setCollaborators(updatedDocument.data.collaborators);
        setNewCollaborator('');
        setShowCollaboratorModal(false);
      }
    } catch (error) {
      console.error('Error adding collaborator:', error);
    }
  };

  const handleUpdateDocument = async (updates) => {
    try {
      const response = await axios.patch(`http://localhost:3000/api/documents/${id}`, updates);
      setDocument(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  if (!document) return <div className="loading loading-lg"></div>;

  return (
    <div className="p-6">
      {/* Document Header */}
      <div className="mb-6">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={document.title}
              onChange={(e) => setDocument({ ...document, title: e.target.value })}
              className="input input-bordered w-full text-2xl font-bold"
            />
            <input
              type="text"
              value={document.caption}
              onChange={(e) => setDocument({ ...document, caption: e.target.value })}
              className="input input-bordered w-full"
            />
            <input
              type="text"
              value={document.tags.join(', ')}
              onChange={(e) => setDocument({ ...document, tags: e.target.value.split(',').map(tag => tag.trim()) })}
              className="input input-bordered w-full"
              placeholder="Tags (comma-separated)"
            />
            <select
              value={document.status}
              onChange={(e) => setDocument({ ...document, status: e.target.value })}
              className="select select-bordered w-full"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateDocument(document)}
                className="btn btn-primary"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="btn"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{document.title}</h1>
              <p className="text-gray-600">{document.caption}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {document.tags.map((tag, index) => (
                  <span key={index} className="badge badge-primary">{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Edit Details
              </button>
              <button
                onClick={() => setShowCollaboratorModal(true)}
                className="btn btn-secondary"
              >
                Add Collaborator
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Collaborators */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Collaborators</h2>
        <div className="flex flex-wrap gap-2">
          <div className="badge badge-success gap-2">
            {document.owner.displayName} (Owner)
          </div>
          {collaborators.map((collaborator) => (
            <div key={collaborator._id} className="badge badge-info gap-2">
              {collaborator.displayName}
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Banglish Content</span>
          </label>
          <textarea
            value={content.banglish}
            onChange={(e) => handleContentChange('banglish', e.target.value)}
            className="textarea textarea-bordered h-96"
            placeholder="Write in Banglish..."
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Bangla Content</span>
          </label>
          <textarea
            value={content.bangla}
            onChange={(e) => handleContentChange('bangla', e.target.value)}
            className="textarea textarea-bordered h-96"
            placeholder="Write in Bangla..."
          />
        </div>
      </div>

      {/* Add Collaborator Modal */}
      {showCollaboratorModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Add Collaborator</h3>
            <form onSubmit={handleAddCollaborator}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Collaborator Email</span>
                </label>
                <input
                  type="email"
                  value={newCollaborator}
                  onChange={(e) => setNewCollaborator(e.target.value)}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowCollaboratorModal(false)}
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

export default DocumentEditor;