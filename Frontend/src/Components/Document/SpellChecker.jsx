import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Loader2 } from "lucide-react";

const genAI = new GoogleGenerativeAI("AIzaSyBXwV9V-IBKqnBMEryEvbKA0OXp43VDr3I");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const SpellChecker = ({ query }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [correctedText, setCorrectedText] = useState("");

  // Debounce timer for checking
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Spell-checking function
  const spellCheckWithGemini = async (text) => {
    const prompt = `You are a great Banglish (written using English alphabet) spell checker. Correct the spelling of the following text while maintaining the context and grammar. 

Text: "${text}"

Please provide the corrected text in banglish (using English Alphabet) without additional explanations.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const correctedText = response.text();
      return correctedText.trim();
    } catch (error) {
      console.error("Error during spell checking:", error);
      throw new Error("Spell checking failed.");
    }
  };

  // Function to clean the correctedText by removing HTML tags
  const cleanText = (text) => {
    // This regex removes HTML tags and keeps the plain text
    return text.replace(/<\/?[^>]+(>|$)/g, "").trim();
  };

  // Spell check with debounce
  const checkSpelling = async (text) => {
    if (!text.trim()) return; // Skip empty inputs

    setLoading(true);
    setError(null);

    try {
      const corrected = await spellCheckWithGemini(text);
      setCorrectedText(cleanText(corrected)); // Clean the corrected text
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle query changes with debounce
  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      checkSpelling(query);
    }, 1000); // 1-second delay after input changes

    setTypingTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [query]); // Run effect when `query` changes

  return (
    <div className="p-6 max-w-2xl mx-auto mt-12">
      {loading && (
        <div className="flex items-center gap-2 text-blue-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Checking...</span>
        </div>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {correctedText && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-semibold mb-2">Corrected Text:</h4>
          <p className="whitespace-pre-wrap">{correctedText}</p>
        </div>
      )}
    </div>
  );
};

export default SpellChecker;
