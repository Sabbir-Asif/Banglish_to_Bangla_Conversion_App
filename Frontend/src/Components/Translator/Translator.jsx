import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBXwV9V-IBKqnBMEryEvbKA0OXp43VDr3I");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Translator = () => {
  const [query, setQuery] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const[bangla, setbangla] = useState(null);

  const translateWithGemini = async (query) => {
    const prompt = `You are an expert Translator From Banglish(written in English font) to Bangla(written in Bangla font).
    
Given the user query, you should translate the query to Bangla.

user query: ${query} \n
Strictly follow below format(don't need to write json, and don't need to bold text):
{
  banglish: "${query}",
  bangla:  "response"  
}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const validJsonString = text.replace(/(\w+):/g, '"$1":');
      const parsedResponse = JSON.parse(validJsonString);
      console.log("Banglish:", parsedResponse.banglish); 
      console.log("Bangla:", parsedResponse.bangla);   
      setbangla(parsedResponse.bangla);
      return text;
    } catch (error) {
      console.error("Error during translation:", error);
      throw new Error("Translation failed.");
    }
  };

  const handleTranslate = async () => {
    if (!query.trim()) {
      alert("Please enter a query to translate.");
      return;
    }

    setLoading(true);
    setError(null);
    setTranslation("");

    try {
      const translatedText = await translateWithGemini(query);
      setTranslation(translatedText);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Gemini Banglish to Bangla Translator</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter Banglish text here..."
        rows="5"
        style={{ width: "100%", marginBottom: "10px" }}
      ></textarea>
      <button onClick={handleTranslate} style={{ padding: "10px 20px" }} disabled={loading}>
        {loading ? "Translating..." : "Translate"}
      </button>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {bangla && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <h4>Translated Bangla:</h4>
          <p>{bangla}</p>
        </div>
      )}
    </div>
  );
};

export default Translator;
