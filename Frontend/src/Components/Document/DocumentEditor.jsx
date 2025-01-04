import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    Volume2,
    VolumeX,
    Loader2,
    Download,
    Edit2,
    Save,
    FileText,
    Tags,
    Settings,
    RefreshCw,
    CheckCircle2,
    User2
} from 'lucide-react';
import BanglishEditor from './BanglishEditor';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import kalpurushFont from '/kalpurush.ttf';

const genAI = new GoogleGenerativeAI("AIzaSyBXwV9V-IBKqnBMEryEvbKA0OXp43VDr3I");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const DocumentEditor = () => {
    const { id } = useParams();
    const [socket, setSocket] = useState(null);
    const [document, setDocument] = useState(null);
    const [content, setContent] = useState({ banglish: '', bangla: '' });
    const [collaboratorEmail, setCollaboratorEmail] = useState('');
    const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);
    const [collaborators, setCollaborators] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState([]);
    const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_API_URL);
        setSocket(newSocket);

        if (newSocket) {
            newSocket.emit('join-document', id);

            newSocket.on('receive-changes', (data) => {
                if (data.userId !== currentUser._id) {
                    setContent(prevContent => ({
                        ...prevContent,
                        [data.field]: data.content
                    }));
                }
            });

            newSocket.on('document-saved', (updatedDocument) => {
                setDocument(updatedDocument);
            });
        }

        return () => newSocket.disconnect();
    }, [id]);

    // Load speech synthesis voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
        };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Fetch document data
    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents/${id}`);
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

    const handleAddCollaborator = async () => {
        if (!collaboratorEmail) return; // Ensure email is provided
        setIsAddingCollaborator(true);

        try {
            // Fetch users from the API
            const response = await axios.get('https://banglish-to-bangla-conversion-app.vercel.app/api/users');
            const users = response.data;

            // Find user by email
            const user = users.find((user) => user.email === collaboratorEmail);

            if (!user) {
                alert('User not found!');
                setIsAddingCollaborator(false);
                return;
            }

            // Ensure the user is not already a collaborator
            if (document.collaborators.includes(user._id)) {
                alert('This user is already a collaborator.');
                setIsAddingCollaborator(false);
                return;
            }

            // Add the user to the collaborators list
            const updatedDocument = {
                ...document,
                collaborators: [...document.collaborators, user._id],
            };

            // Update local state
            setDocument(updatedDocument);
            setCollaboratorEmail(''); // Clear the input
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('An error occurred while adding the collaborator.');
        } finally {
            setIsAddingCollaborator(false);
        }
    };

    const downloadAsPDF = () => {
        // Create a temporary div for rendering
        const contentDiv = window.document.createElement('div');
        contentDiv.style.fontFamily = 'Kalpurush';
        contentDiv.style.padding = '40px';
        contentDiv.style.width = '210mm'; // A4 width
        contentDiv.style.background = '#ffffff'; // Using hex instead of potential OKLCH

        // Populate the div with content using web-safe colors
        contentDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 24px; margin-bottom: 10px; color: #000000;">${document.title || ''}</h1>
        <p style="font-size: 16px; color: #666666;">${document.caption || ''}</p>
      </div>
      <div style="font-size: 14px; line-height: 1.6; color: #000000;">
        ${document.banglaContent || ''}
      </div>
      <div style="margin-top: 20px; font-size: 12px; color: #666666;">
        <p>লেখক: ${document.owner?.displayName || 'অজানা'}</p>
        <p>তারিখ: ${new Date().toLocaleDateString('bn-BD')}</p>
        ${document.tags?.length ? `<p>ট্যাগ: ${document.tags.join(', ')}</p>` : ''}
      </div>
    `;

        // Force all elements to use web-safe colors
        const elements = contentDiv.getElementsByTagName('*');
        for (let element of elements) {
            const computedStyle = window.getComputedStyle(element);
            if (computedStyle.color.includes('oklch')) {
                element.style.color = '#000000';
            }
            if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes('oklch')) {
                element.style.backgroundColor = '#ffffff';
            }
        }

        // Add to document temporarily
        window.document.body.appendChild(contentDiv);

        // Load Bangla font
        const font = new FontFace('Kalpurush', `url(${kalpurushFont})`);
        font.load().then(() => {
            window.document.fonts.add(font);
            window.document.fonts.ready.then(() => {
                // Generate PDF with explicit background color
                html2canvas(contentDiv, {
                    scale: 2,
                    useCORS: true,
                    windowWidth: 210 * 4.16667, // A4 width in pixels
                    windowHeight: 297 * 4.16667, // A4 height in pixels
                    letterRendering: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff', // Explicit background color
                    removeContainer: true, // Automatically remove the temporary element
                    onclone: (clonedDoc) => {
                        // Force all colors in the cloned document to be web-safe
                        const allElements = clonedDoc.getElementsByTagName('*');
                        for (let element of allElements) {
                            element.style.color = element.style.color || '#000000';
                            element.style.backgroundColor = element.style.backgroundColor || '#ffffff';
                        }
                    }
                }).then(canvas => {
                    // Convert to PDF
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                    // Add content to PDF
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

                    // Save the PDF
                    pdf.save(`${document.title || 'document'}.pdf`);

                    // Cleanup
                    if (window.document.body.contains(contentDiv)) {
                        window.document.body.removeChild(contentDiv);
                    }
                }).catch(error => {
                    console.error('Error generating PDF:', error);
                    if (window.document.body.contains(contentDiv)) {
                        window.document.body.removeChild(contentDiv);
                    }
                });
            });
        }).catch(error => {
            console.error('Error loading font:', error);
            if (window.document.body.contains(contentDiv)) {
                window.document.body.removeChild(contentDiv);
            }
        });
    };
    const cleanText = (text) => {
        // This regex removes HTML tags and keeps the plain text
        return text.replace(/<\/?[^>]+(>|$)/g, "").trim();
    };

    // Translation function
    const translateToBangla = async (banglishText) => {
        if (!banglishText.trim()) return null;

        const prompt = `You are an expert Translator From Banglish(written in English font) to Bangla(written in Bangla font).
    Given the user query, you should translate the query to Bangla.
    user query: ${banglishText}
    Strictly follow below format(don't need to write json, and don't need to bold text):
    {
      banglish: "${banglishText}",
      bangla: "response"
    }`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const validJsonString = text.replace(/(\w+):/g, '"$1":');
            const parsedResponse = JSON.parse(validJsonString);
            const cleanedText = cleanText(parsedResponse.bangla)
            return cleanedText;
        } catch (error) {
            throw new Error("Translation failed: " + error.message);
        }
    };

    // Handle content change
    const handleContentChange = (field, value) => {
        const newContent = { ...content, [field]: value };
        setContent(newContent);

        // Emit changes to other users
        socket.emit('document-change', {
            documentId: id,
            userId: currentUser._id,
            field,
            content: value
        });
    };

    // Save document with translation
    const handleSave = async () => {
        setIsSaving(true);
        setError(null);

        try {
            // First translate the banglish text
            const translatedText = await translateToBangla(content.banglish);

            if (translatedText) {
                // Update local state with translation
                const updatedContent = {
                    ...content,
                    bangla: translatedText
                };
                setContent(updatedContent);

                // Save to backend
                await axios.patch(`${import.meta.env.VITE_API_URL}/api/documents/${id}`, {
                    banglishContent: updatedContent.banglish,
                    banglaContent: translatedText
                });

                // Emit save event
                socket.emit('save-document', {
                    documentId: id,
                    content: updatedContent
                });
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Speech synthesis function
    const speakText = () => {
        if (!content.bangla) return;

        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(content.bangla);

        const bengaliVoice = voices.find(voice =>
            voice.lang.includes('bn') ||
            voice.lang.includes('ben') ||
            voice.lang.includes('hi-IN')
        );

        if (bengaliVoice) {
            utterance.voice = bengaliVoice;
        }

        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (event) => {
            setError("Speech synthesis failed: " + event.error);
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    const generateCaption = async () => {
        if (!content.bangla) return;

        setIsGeneratingCaption(true);
        setError(null);

        const prompt = `You are an expert in Bengali language and content analysis.
      Given the following Bengali text, generate a concise and meaningful caption that summarizes its main points.
      Keep the caption within 1 sentences.
      
      Text: ${content.bangla}
      
      Please provide the caption in Bengali script.`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const caption = response.text();

            // Update document with new caption
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/documents/${id}`, {
                caption: caption
            });

            setDocument(prev => ({ ...prev, caption }));
        } catch (error) {
            setError("Caption generation failed: " + error.message);
        } finally {
            setIsGeneratingCaption(false);
        }
    };
    const generateTitle = async () => {
        if (!content.bangla) return;

        setIsGeneratingTitle(true);
        setError(null);

        const prompt = `You are an expert in Bengali language and content analysis.
    Given the following Bengali text, generate a concise and meaningful title.
    The title should be catchy, relevant, and brief (maximum 4-5 words).
    It should capture the main theme or subject matter of the text.
    
    Text: ${content.bangla}
    
    Please provide the title in Bengali script.`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const title = response.text();

            // Update document with new title
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/documents/${id}`, {
                title: title
            });

            setDocument(prev => ({ ...prev, title }));
        } catch (error) {
            setError("Title generation failed: " + error.message);
        } finally {
            setIsGeneratingTitle(false);
        }
    };
    const handleUpdateDocument = async (updates) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/documents/${id}`, updates);
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
        <div className="flex h-screen w-full flex-col overflow-y-scroll bg-gradient-to-br from-[#FFF7F4] via-white to-[#FFF0E9]">
            {/* Header */}
            <div className="relative flex items-center justify-between border-b bg-white/80 px-8 py-4 backdrop-blur-lg">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                        <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {document?.title || 'Untitled Document'}
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-green-500" />
                            <p className="text-sm text-gray-600">
                                {document?.status || 'Draft'} • Last saved {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2 text-gray-700 transition-all hover:bg-gray-100"
                    >
                        <Edit2 className="h-4 w-4" />
                        Edit Details
                    </button>

                    <button
                        onClick={downloadAsPDF}
                        className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-blue-600 transition-all hover:bg-blue-100"
                    >
                        <Download className="h-4 w-4" />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Document Details Editor */}
            {isEditing && (
                <div className="mx-8 my-4 rounded-xl bg-white p-6 shadow-lg">
                    <div className="grid gap-4">
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                value={document.title}
                                onChange={(e) => setDocument({ ...document, title: e.target.value })}
                                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-lg focus:border-blue-500 focus:outline-none"
                                placeholder="Document Title"
                            />
                            <button
                                onClick={generateTitle}
                                disabled={isGeneratingTitle || !content.bangla}
                                className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-blue-600 transition-all hover:bg-blue-100 disabled:opacity-50"
                            >
                                {isGeneratingTitle ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                Generate Title
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                value={document.caption}
                                onChange={(e) => setDocument({ ...document, caption: e.target.value })}
                                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                placeholder="Document Caption"
                            />
                            <button
                                onClick={generateCaption}
                                disabled={isGeneratingCaption || !content.bangla}
                                className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-blue-600 transition-all hover:bg-blue-100 disabled:opacity-50"
                            >
                                {isGeneratingCaption ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                Generate Caption
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <input
                                type="email"
                                value={collaboratorEmail}
                                onChange={(e) => setCollaboratorEmail(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                placeholder="Collaborator Email"
                            />
                            <button
                                onClick={handleAddCollaborator}
                                disabled={!collaboratorEmail || isAddingCollaborator}
                                className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-blue-600 transition-all hover:bg-blue-100 disabled:opacity-50"
                            >
                                {isAddingCollaborator ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                Add Collaborator
                            </button>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <Tags className="h-4 w-4 text-gray-500" />
                                    <input
                                        type="text"
                                        value={document.tags.join(', ')}
                                        onChange={(e) => setDocument({ ...document, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                                        className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                        placeholder="Tags (comma-separated)"
                                    />
                                </div>
                            </div>
                            <select
                                value={document.status}
                                onChange={(e) => setDocument({ ...document, status: e.target.value })}
                                className="rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleUpdateDocument(document)}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                <Save className="h-4 w-4" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 overflow-hidden p-8">
                <div className="mx-auto grid h-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Banglish Editor Panel */}
                    <div className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                                    <Edit2 className="h-4 w-4 text-blue-600" />
                                </div>
                                <h3 className="font-medium text-gray-700">Banglish Text</h3>
                            </div>
                        </div>

                        <div className="flex-1 p-6 overflow-y-scroll">
                            <BanglishEditor
                                content={content}
                                onContentChange={handleContentChange}
                            />
                        </div>

                        <div className="border-t bg-gradient-to-b from-white/0 to-white px-6 py-4">
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !content.banglish.trim()}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Saving & Translating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5" />
                                        Save & Translate
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Bangla Output Panel */}
                    <div className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                </div>
                                <h3 className="font-medium text-gray-700">Bangla Content</h3>
                            </div>
                            {content.bangla && (
                                <button
                                    onClick={speakText}
                                    className={`rounded-lg p-2 transition-all hover:bg-gray-100 ${isSpeaking ? 'text-blue-500' : 'text-gray-600'}`}
                                >
                                    {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                </button>
                            )}
                        </div>

                        <div className="flex-1 p-6">
                            <textarea
                                value={content.bangla}
                                readOnly
                                className="h-full w-full resize-none rounded-xl border-0 bg-gradient-to-b from-blue-50/50 to-white/50 p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="Translation will appear here..."
                            />
                        </div>

                        <div className="border-t bg-gradient-to-b from-white/0 to-white px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <User2 className="h-4 w-4" />
                                {collaborators.length} collaborator{collaborators.length !== 1 ? 's' : ''} online
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-red-50 px-4 py-2 text-red-600 shadow-lg">
                    <p className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-red-500" />
                        {error}
                    </p>
                </div>
            )}
        </div>
    );
};

export default DocumentEditor;