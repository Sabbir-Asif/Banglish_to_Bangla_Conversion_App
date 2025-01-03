import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Volume2, VolumeX, Loader2, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import BanglishEditor from './BanglishEditor';

const genAI = new GoogleGenerativeAI("AIzaSyBXwV9V-IBKqnBMEryEvbKA0OXp43VDr3I");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const DocumentEditor = () => {
  const { id } = useParams();
  const [socket, setSocket] = useState(null);
  const [document, setDocument] = useState(null);
  const [content, setContent] = useState({ banglish: '', bangla: '' });
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
    const newSocket = io('http://localhost:3000');
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

   const downloadAsPDF = () => {
      const doc = new jsPDF();
      
      // Configure Bengali font
      
      doc.setFont('times', 'normal');
      doc.setFontSize(12);
      
      // Add title
      if (document.title) {
        doc.setFontSize(16);
        doc.text(document.title, 20, 20);
        doc.setFontSize(12);
      }
      
      // Add caption
      if (document.caption) {
        doc.text(document.caption, 20, 30);
      }
      
      // Add content with line breaks
      const splitText = doc.splitTextToSize(content.bangla, 170);
      doc.text(splitText, 20, 40);
      
      // Add metadata
      const today = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Generated on: ${today}`, 20, doc.internal.pageSize.height - 20);
      
      // Download the PDF
      doc.save(`${document.title || 'document'}.pdf`);
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
      return parsedResponse.bangla;
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
        await axios.patch(`http://localhost:3000/api/documents/${id}`, {
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
        await axios.patch(`http://localhost:3000/api/documents/${id}`, {
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
      await axios.patch(`http://localhost:3000/api/documents/${id}`, {
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
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-8 bg-white rounded-lg shadow-sm">
        {isEditing ? (
          <div className="space-y-4 p-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={document.title}
                  onChange={(e) => setDocument({ ...document, title: e.target.value })}
                  className="input input-bordered w-full text-2xl font-bold"
                />
                <button
                  onClick={generateTitle}
                  disabled={isGeneratingTitle || !content.bangla}
                  className="btn btn-sm btn-outline whitespace-nowrap"
                >Generate Title</button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={document.caption}
                  onChange={(e) => setDocument({ ...document, caption: e.target.value })}
                  className="input input-bordered w-full"
                />
                <button
                  onClick={generateCaption}
                  disabled={isGeneratingCaption || !content.bangla}
                  className="btn btn-sm btn-outline whitespace-nowrap"
                >Generate Caption</button>
              </div>
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
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsEditing(false)} className="btn">Cancel</button>
                <button onClick={() => handleUpdateDocument(document)} className="btn btn-primary">Save</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start p-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{document.title}</h1>
              <p className="text-gray-600 mb-3">{document.caption}</p>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag, index) => (
                  <span key={index} className="badge badge-primary">{tag}</span>
                ))}
              </div>
            </div>
            <button onClick={() => setIsEditing(true)} className="btn btn-primary">Edit Details</button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleSave}
          disabled={isSaving || !content.banglish.trim()}
          className={`btn btn-primary ${isSaving ? 'loading' : ''}`}
        >
          {isSaving ? 'Saving & Translating...' : 'Save & Translate'}
        </button>
        <button
          onClick={downloadAsPDF}
          disabled={!content.bangla.trim()}
          className="btn btn-secondary gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        {error && <span className="text-red-500">{error}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm">
          <BanglishEditor 
            content={content} 
            onContentChange={handleContentChange}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Bangla Content</span>
            {content.bangla && (
              <button
                onClick={speakText}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${isSpeaking ? 'text-blue-500' : ''}`}
              >
                {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
          </div>
          <textarea
            value={content.bangla}
            readOnly
            className="textarea textarea-bordered w-full h-96 bg-gray-50"
            placeholder="Click Save to see translation..."
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;