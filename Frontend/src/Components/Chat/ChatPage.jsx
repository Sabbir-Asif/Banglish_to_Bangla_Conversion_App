import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SAFETY_SETTINGS = [
  {
    category: "HARM_CATEGORY_SEXUAL",
    threshold: "BLOCK_ONLY_HIGH",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS",
    threshold: "BLOCK_ONLY_HIGH",
  },
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_ONLY_HIGH",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_ONLY_HIGH",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_ONLY_HIGH",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_ONLY_HIGH",
  },
];

const BANGLA_SYSTEM_PROMPT = `You are a helpful Bangla-speaking assistant. Always respond in Bangla (Bengali) language using Bengali script. Keep your responses natural and conversational, as if speaking to a Bengali speaker. If you need to include technical terms or English words, write them in Bengali script phonetically when possible. Never switch to English or any other language unless specifically asked. Even if the user writes in English, always respond in Bangla.`;

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const API_KEY = "AIzaSyBXwV9V-IBKqnBMEryEvbKA0OXp43VDr3I";

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-002' });
  const chatRef = useRef(null);
  
  useEffect(() => {
    const initChat = async () => {
      const chat = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });
      
      // Send the system prompt to set up Bangla responses
      await chat.sendMessage(BANGLA_SYSTEM_PROMPT);
      chatRef.current = chat;
    };
    
    initChat();
  }, []);

  useEffect(() => {
    const scrollToBottom = () => {
      const chatContainer = document.getElementById('chat-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    };
    scrollToBottom();
  }, [messages, currentResponse]);

  const clearChat = async () => {
    setMessages([]);
    setCurrentResponse('');
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
    await chat.sendMessage(BANGLA_SYSTEM_PROMPT);
    chatRef.current = chat;
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setCurrentResponse('ভাবছি...');

    try {
      const result = await chatRef.current.sendMessage(userMessage, {
        safetySettings: SAFETY_SETTINGS
      });

      setCurrentResponse('');
      let fullResponse = '';
      
      // Process the response chunks
      const response = await result.response;
      const text = response.text();
      const words = text.split('');
      
      for (let i = 0; i < words.length; i++) {
        fullResponse += words[i];
        setCurrentResponse(fullResponse + '▋');
        
        // Random delay between words
        if (i % Math.floor(Math.random() * (10 - 5 + 1) + 5) === 0) {
          await sleep(50);
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
      setCurrentResponse('');

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'দুঃখিত, একটি ত্রুটি হয়েছে। আবার চেষ্টা করুন।'
      }]);
      setCurrentResponse('');
    } finally {
      setIsLoading(false);
    }
  };
return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>বাংলা চ্যাটবট</h1>
      <p style={{ textAlign: 'center' }}>Google Gemini দ্বারা পরিচালিত একটি চ্যাটবট</p>

      <button 
        onClick={clearChat}
        style={{
          position: 'fixed',
          right: '20px',
          top: '20px',
          padding: '8px 16px',
          background: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        চ্যাট মুছুন
      </button>

      <div
        id="chat-container"
        style={{
          height: '500px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px'
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: '12px',
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                padding: '10px 16px',
                borderRadius: '12px',
                backgroundColor: message.role === 'user' ? '#007bff' : '#f0f0f0',
                color: message.role === 'user' ? 'white' : 'black'
              }}
            >
              {message.content}
            </div>
          </div>
        ))}
        {currentResponse && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                maxWidth: '70%',
                padding: '10px 16px',
                borderRadius: '12px',
                backgroundColor: '#f0f0f0'
              }}
            >
              {currentResponse}
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="আপনার বার্তা লিখুন..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          পাঠান
        </button>
      </form>
    </div>
  );
};

export default ChatPage;