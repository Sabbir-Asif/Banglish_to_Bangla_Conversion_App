import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Calendar,
    Share2,
    FileText,
    User,
    Plus,
    X,
    Settings,
    LayoutGrid,
    Filter,
    Tags,
    Users,
    Clock,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { AuthContext } from '../Authentication/AuthProvider';
import axios from 'axios';
import DocumentSearch from './DocumentSearch';

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [showFilters, setShowFilters] = useState(false);
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
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents/search?owner=${user._id}`);
            // Ensure the response data is an array and set it as documents
            const ownedDocuments = Array.isArray(response.data) ? response.data : [];
            setDocuments(ownedDocuments);
        } catch (error) {
            console.error('Error fetching documents:', error);
            setError('Failed to fetch documents');
        } finally {
            setIsLoading(false);
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
            <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-[#FFF7F4] via-white to-[#FFF0E9]">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-[#FFF7F4] via-white to-[#FFF0E9]">
            {/* Header */}
            <div className="border-b bg-white/80 px-8 py-4 backdrop-blur-lg">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Documents</h1>
                                <div className="flex items-center gap-2">
                                    <span className="flex h-2 w-2 rounded-full bg-green-500" />
                                    <p className="text-sm text-gray-600">{documents.length} documents available</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2 text-gray-700 transition-all hover:bg-gray-100"
                            >
                                <Filter className="h-4 w-4" />
                                Filters
                            </button>

                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-white shadow-lg transition-all hover:brightness-110"
                            >
                                <Plus className="h-4 w-4" />
                                New Document
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Search Bar */}
                    {/* <div className="relative">
                        <DocumentSearch onSearch={handleSearch} isLoading={isSearching} />
                    </div> */}

                    {/* Document Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {documents.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-lg">
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
                                    <FileText className="h-10 w-10 text-orange-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">No documents found</h3>
                                <p className="mt-2 text-gray-500">Try adjusting your search filters or create a new document</p>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="mt-6 flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-2 text-orange-600 transition-all hover:bg-orange-100"
                                >
                                    <Plus className="h-4 w-4" />
                                    Create Document
                                </button>
                            </div>
                        ) : (
                            documents.map((doc) => (
                                <div
                                    key={doc._id}
                                    onClick={() => navigate(`/home/document/${doc._id}`)}
                                    className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">{doc.title}</h3>
                                                <p className="mt-1 line-clamp-2 text-sm text-gray-500">{doc.caption}</p>
                                            </div>
                                            <span className={`ml-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${doc.status === 'Published'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {doc.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                                                <User className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {doc.owner?.displayName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {doc.isCollaborator ? 'Collaborator' : 'Owner'}
                                                </p>
                                            </div>
                                        </div>

                                        {doc.tags?.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {doc.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between border-t pt-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(doc.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex gap-2">
                                                {doc.pdfUrl && doc.pdfUrl !== 'xyz' && (
                                                    <button
                                                        className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Share2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Create Document Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                        <div className="border-b p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Create New Document</h3>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleCreateDocument} className="p-6">
                            {error && (
                                <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            <div className="space-y-6">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={newDocument.title}
                                        onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                                        className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        Caption
                                    </label>
                                    <input
                                        type="text"
                                        value={newDocument.caption}
                                        onChange={(e) => setNewDocument({ ...newDocument, caption: e.target.value })}
                                        className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        value={newDocument.tags}
                                        onChange={(e) => setNewDocument({ ...newDocument, tags: e.target.value })}
                                        placeholder="Enter tags separated by commas"
                                        className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        Collaborators
                                    </label>
                                    <input
                                        type="text"
                                        value={newDocument.collaborators}
                                        onChange={(e) => setNewDocument({ ...newDocument, collaborators: e.target.value })}
                                        placeholder="Enter email addresses separated by commas"
                                        className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-white shadow-lg transition-all hover:brightness-110"
                                >
                                    Create Document
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