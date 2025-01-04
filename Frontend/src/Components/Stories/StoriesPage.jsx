import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, User, Download, ArrowLeft, Clock } from "lucide-react";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import kalpurushFont from '/kalpurush.ttf';

const StoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/documents/${id}`);
        if (!response.ok) throw new Error("Failed to fetch story");
        const data = await response.json();
        setDocument(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-orange-50">
        <div className="w-12 h-12 border-3 border-[#FF8938] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-orange-50 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 font-exo">
            Story Not Found
          </h2>
          <p className="text-gray-600 mb-4 font-poppins">
            {error || "This story doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/home/stories")}
            className="inline-flex items-center px-4 py-2 text-[#FF8938] border border-[#FF8938] rounded-lg hover:bg-[#FF8938] hover:text-white transition duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stories
          </button>
        </div>
      </div>
    );
  }

  const downloadAsPDF = async () => {
    setDownloadingPdf(true);
    
    // Create a temporary div for rendering
    const contentDiv = window.document.createElement('div');
    contentDiv.style.fontFamily = 'Kalpurush';
    contentDiv.style.padding = '40px';
    contentDiv.style.width = '210mm'; // A4 width
    contentDiv.style.background = '#ffffff';
    
    // Populate the div with content
    contentDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 24px; margin-bottom: 10px; color: #000000;">${document.title || ''}</h1>
        <p style="font-size: 16px; color: #666666;">${document.caption || ''}</p>
      </div>
      <div style="font-size: 14px; line-height: 1.6; color: #000000;">
        ${document.banglaContent?.split('\n\n').map(para => `<p style="margin-bottom: 1em;">${para}</p>`).join('') || ''}
      </div>
      <div style="margin-top: 20px; font-size: 12px; color: #666666;">
        <p>লেখক: ${document.owner?.displayName || 'অজানা'}</p>
        <p>তারিখ: ${new Date().toLocaleDateString('bn-BD')}</p>
        ${document.tags?.length ? `<p>ট্যাগ: ${document.tags.join(', ')}</p>` : ''}
      </div>
    `;

    window.document.body.appendChild(contentDiv);

    try {
      // Load Bangla font
      const font = new FontFace('Kalpurush', `url(${kalpurushFont})`);
      await font.load();
      window.document.fonts.add(font);
      await window.document.fonts.ready;

      // Generate PDF
      const canvas = await html2canvas(contentDiv, {
        scale: 2,
        useCORS: true,
        windowWidth: 210 * 4.16667,
        windowHeight: 297 * 4.16667,
        letterRendering: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const allElements = clonedDoc.getElementsByTagName('*');
          for (let element of allElements) {
            element.style.color = element.style.color || '#000000';
            element.style.backgroundColor = element.style.backgroundColor || '#ffffff';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${document.title || 'story'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      if (window.document.body.contains(contentDiv)) {
        window.document.body.removeChild(contentDiv);
      }
      setDownloadingPdf(false);
    }
  };


  return (
    <article className="h-screen overflow-y-scroll w-full bg-white">
      {/* Hero Section with Background */}
      <div className="bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation */}
          <div className="py-6">
            <button
              onClick={() => navigate("/home/stories")}
              className="inline-flex items-center text-gray-600 hover:text-[#FF8938] font-poppins transition"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Stories
            </button>
          </div>

          {/* Article Header */}
          <div className="py-12 sm:py-16">
            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-exo leading-tight">
                {document.title}
              </h1>

              {document.caption && (
                <p className="text-xl sm:text-2xl text-gray-600 font-poppins mb-8 leading-relaxed">
                  {document.caption}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6 font-poppins">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  <span>{document.owner?.displayName || "Anonymous"}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{formatDate(document.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>5 min read</span>
                </div>
              </div>

              {document.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-1.5 text-sm text-[#FF8938] bg-orange-100 rounded-full font-poppins"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl py-12">
          <div className="prose prose-lg max-w-none font-poppins">
            <div className="text-gray-800 leading-relaxed space-y-8 text-lg sm:text-xl">
              {document.banglaContent && 
                document.banglaContent.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-8">{paragraph}</p>
                ))
              }
            </div>
          </div>

          {/* PDF Download */}
          <div className="mt-16 flex flex-wrap gap-4">
            <button
              onClick={downloadAsPDF}
              disabled={downloadingPdf}
              className="inline-flex items-center px-6 py-3 text-white bg-[#FF8938] rounded-lg hover:bg-[#E6A623] transition duration-200 font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5 mr-2" />
              {downloadingPdf ? 'Generating PDF...' : 'Download as PDF'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default StoryPage;