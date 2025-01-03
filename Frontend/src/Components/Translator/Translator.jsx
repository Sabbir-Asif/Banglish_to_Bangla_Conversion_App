import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  Languages, 
  Send, 
  Loader2, 
  RotateCcw, 
  Share2, 
  Download, 
  Settings, 
  Sparkles,
  Copy,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const genAI = new GoogleGenerativeAI("AIzaSyBXwV9V-IBKqnBMEryEvbKA0OXp43VDr3I");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function EnhancedTranslator() {
  const [query, setQuery] = useState("");
  const [bangla, setBangla] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      return parsedResponse.bangla;
    } catch (error) {
      console.error("Error during translation:", error);
      throw new Error("Translation failed.");
    }
  };

  const handleTranslate = async () => {
    if (!query.trim()) {
      setError("Please enter text to translate");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const translatedText = await translateWithGemini(query);
      setBangla(translatedText);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gradient-to-br from-[#FFF7F4] via-white to-[#FFF0E9]">
      {/* Header */}
      <div className="relative flex items-center justify-between border-b bg-white/80 px-8 py-4 backdrop-blur-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
            <Languages className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Banglish to Bangla</h1>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500" />
              <p className="text-sm text-gray-600">Powered by Google Gemini</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleCopy(bangla)}
            className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2 text-gray-700 transition-all hover:bg-gray-100"
          >
            {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2 text-gray-700 transition-all hover:bg-gray-100"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>

          <button
            onClick={() => {
              setQuery("");
              setBangla("");
              setError(null);
            }}
            className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-red-600 transition-all hover:bg-red-100"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        {showSettings && (
          <div className="absolute right-8 top-16 z-10 w-64 rounded-xl bg-white p-4 shadow-xl">
            <h3 className="mb-2 font-semibold">Settings</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-orange-500" />
                Auto Copy Translation
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-orange-500" />
                Auto Detect Language
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-8">
        <div className="mx-auto grid h-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Input Panel */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                  <Languages className="h-4 w-4 text-orange-600" />
                </div>
                <h3 className="font-medium text-gray-700">Banglish Text</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{query.length} characters</span>
              </div>
            </div>
            
            <div className="flex-1 p-6">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your Banglish text here..."
                className="h-full w-full resize-none rounded-xl border-0 bg-gray-50/50 p-4 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div className="border-t bg-gradient-to-b from-white/0 to-white px-6 py-4">
              <button
                onClick={handleTranslate}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Translate to Bangla
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                  <ArrowRight className="h-4 w-4 text-orange-600" />
                </div>
                <h3 className="font-medium text-gray-700">Bangla Translation</h3>
              </div>
              <div className="flex items-center gap-2">
                {loading && (
                  <div className="flex items-center gap-2 text-sm text-orange-500">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Translating...
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 p-6">
              <div className="h-full rounded-xl bg-gradient-to-b from-orange-50/50 to-white/50 p-4">
                {bangla ? (
                  <p className="text-lg text-gray-800">{bangla}</p>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <p className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Translation will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t bg-gradient-to-b from-white/0 to-white px-6 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleCopy(bangla)}
                  disabled={!bangla}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-600 transition-all hover:bg-gray-100 disabled:opacity-50"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy Translation"}
                </button>

                <div className="flex items-center gap-2">
                  <button className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
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
}