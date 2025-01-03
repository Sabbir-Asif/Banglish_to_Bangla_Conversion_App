import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';

const DocumentEditor = () => {
  const { id } = useParams();
  const [socket, setSocket] = useState(null);
  const [document, setDocument] = useState(null);
  const [content, setContent] = useState({ banglish: '', bangla: '' });
  const [collaborators, setCollaborators] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    // Join the document room
    if (newSocket) {
      newSocket.emit('join-document', id);

      // Listen for changes from other collaborators
      newSocket.on('receive-changes', (data) => {
        if (data.userId !== currentUser._id) {
          setContent(prevContent => ({
            ...prevContent,
            [data.field]: data.content
          }));
        }
      });

      // Listen for document saved event
      newSocket.on('document-saved', (updatedDocument) => {
        setDocument(updatedDocument);
      });
    }

    return () => newSocket.disconnect();
  }, [id]);

  // Fetch document data from backend
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

  // Save document function
  const saveDocument = async (newContent) => {
    setIsSaving(true); // Set saving status
    try {
      await axios.patch(`http://localhost:3000/api/documents/${id}`, {
        banglishContent: newContent.banglish,
        banglaContent: newContent.bangla
      });

      // Emit save document event to backend
      socket.emit('save-document', {
        documentId: id,
        content: newContent
      });
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving document:', error);
      setIsSaving(false);
    }
  };

  const handleContentChange = (field, value) => {
    const newContent = {
      ...content,
      [field]: value
    };
    setContent(newContent);

    // Emit changes to other users in real-time
    socket.emit('document-change', {
      documentId: id,
      userId: currentUser._id,
      field,
      content: value
    });

    // Automatically save the content periodically
    if (!isSaving) {
      saveDocument(newContent);
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

  // Button click to manually trigger save
  const handleSaveButtonClick = () => {
    saveDocument(content);
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
            </div>
          </div>
        )}
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

      {/* Save Button */}
      <div className="mt-4">
        <button
          onClick={handleSaveButtonClick}
          className={`btn btn-success ${isSaving ? 'loading' : ''}`}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default DocumentEditor;
