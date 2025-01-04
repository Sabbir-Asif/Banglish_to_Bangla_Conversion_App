import React, { useCallback, useEffect, useState, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Mic, Square, Upload, Edit2, Headphones } from 'lucide-react';
import Quill from 'quill';
import debounce from 'lodash/debounce';
import 'quill/dist/quill.snow.css';
import SpellChecker from './SpellChecker';

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ['clean']
];

const BanglishEditor = ({ content, onContentChange }) => {
  // Quill editor states
  const [quill, setQuill] = useState(null);
  const [text, setText] = useState(content?.banglish || '');

  // Audio states
  const [audioFile, setAudioFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [visualizerData, setVisualizerData] = useState(new Uint8Array(0));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Mode selection
  const [mode, setMode] = useState('text');

  // Refs
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  const debouncedChange = useCallback(
    debounce((content) => {
      onContentChange('banglish', content);
    }, 500),
    [onContentChange]
  );

  // Quill editor setup
  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) return;
    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);

    const quillInstance = new Quill(editor, {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions,
        history: {
          delay: 1000,
          maxStack: 500
        }
      },
      placeholder: 'Write in Banglish...',
    });

    setQuill(quillInstance);
  }, []);

  // Audio handling functions
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setAudioURL(URL.createObjectURL(file));
      setError('');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioFile(new File([blob], 'recorded-audio.wav', { type: 'audio/wav' }));
        setAudioURL(URL.createObjectURL(blob));
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      startVisualizer();
    } catch (err) {
      setError('Error accessing microphone: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      stopVisualizer();
    }
  };

  const startVisualizer = () => {
    const draw = () => {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      setVisualizerData(dataArray);
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#3B82F6';
      
      const barWidth = width / dataArray.length;
      dataArray.forEach((value, index) => {
        const barHeight = (value / 255) * height;
        ctx.fillRect(index * barWidth, height - barHeight, barWidth - 1, barHeight);
      });
      
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const stopVisualizer = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const transcribeAudio = async () => {
    if (!audioFile) {
      setError('Please select an audio file or record audio first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const genAI = new GoogleGenerativeAI('AIzaSyBXwV9V-IBKqnBMEryEvbKA0OXp43VDr3I');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const base64Audio = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        };
        reader.readAsDataURL(audioFile);
      });

      const fileObject = {
        inlineData: {
          data: base64Audio,
          mimeType: audioFile.type
        }
      };

      const prompt = `
        Listen to this audio carefully and follow these steps:
        1. Transcribe the Bangla speech to Roman letters (Banglish)
        2. Use standard Banglish conventions
        3. Only output the Banglish transcription
        4. Separate sentences with periods
      `;

      const result = await model.generateContent([prompt, fileObject]);
      const response = await result.response;
      const transcribedText = response.text().replace(/^["']|["']$/g, '').trim();
      
      if (quill) {
        const currentContent = quill.root.innerHTML;
        quill.root.innerHTML = currentContent + (currentContent ? '<br><br>' : '') + transcribedText;
        const newContent = quill.root.innerHTML;
        setText(newContent);
        debouncedChange(newContent);
      }
    } catch (err) {
      setError('Error transcribing audio: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quill) {
      const handleChange = () => {
        const content = quill.root.innerHTML;
        setText(content);
        debouncedChange(content);
      };

      quill.on('text-change', handleChange);
      return () => quill.off('text-change', handleChange);
    }
  }, [quill, debouncedChange]);

  useEffect(() => {
    if (quill && content?.banglish !== quill.root.innerHTML) {
      quill.root.innerHTML = content.banglish || '';
      setText(content.banglish || '');
    }
  }, [content?.banglish, quill]);

  useEffect(() => {
    return () => {
      stopVisualizer();
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaRecorder]);

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Banglish Editor</h2>

      <div className="mb-4 flex justify-center gap-4">
        <button
          onClick={() => setMode('text')}
          className={`flex items-center gap-2 py-2 px-4 rounded-lg ${
            mode === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          <Edit2 className="h-4 w-4" /> Text Editor
        </button>
        <button
          onClick={() => setMode('audio')}
          className={`flex items-center gap-2 py-2 px-4 rounded-lg ${
            mode === 'audio' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          <Headphones className="h-4 w-4" /> Audio Input
        </button>
      </div>

      <div className="space-y-6">
        {/* Quill Editor */}
        <div className="h-96 border rounded-lg" ref={wrapperRef} />
        
        {/* SpellChecker */}
        <SpellChecker query={text} />

        {mode === 'audio' && (
          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Audio File
              </label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              />
            </div>

            {/* Recording Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or Record Audio
              </label>
              <div className="flex justify-center gap-4">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg text-white ${
                    isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square className="h-4 w-4" /> Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" /> Start Recording
                    </>
                  )}
                </button>
              </div>
              
              <canvas
                ref={canvasRef}
                width="400"
                height="100"
                className="w-full mt-4 bg-gray-50 rounded-lg"
              />
            </div>

            {/* Audio Preview */}
            {audioURL && (
              <div>
                <audio src={audioURL} controls className="w-full" />
              </div>
            )}

            <button
              onClick={transcribeAudio}
              disabled={!audioFile || loading}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                'Converting to Banglish...'
              ) : (
                <>
                  <Upload className="h-4 w-4" /> Convert to Banglish
                </>
              )}
            </button>

            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BanglishEditor;