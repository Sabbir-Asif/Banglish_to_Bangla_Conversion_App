import React, { useState, useContext } from "react";
import { AuthContext } from "../Authentication/AuthProvider";
import {
  Upload,
  Download,
  FileUp,
  Keyboard,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Database,
  ArrowRight
} from "lucide-react";
import { saveAs } from "file-saver";

const DatasetPage = () => {
  const { user } = useContext(AuthContext);
  const [uploadType, setUploadType] = useState("manual");
  const [datasetSize, setDatasetSize] = useState("");
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    banglish: "",
    english: "",
    bangla: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("upload");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvData = event.target.result;
        const lines = csvData.split("\n");
        const headers = lines[0].split(",").map((header) => header.trim());

        if (
          !headers.includes("banglish") ||
          !headers.includes("english") ||
          !headers.includes("bangla")
        ) {
          setError("CSV must contain banglish, english, and bangla columns");
          return;
        }

        const parsedEntries = [];
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === "") continue;

          const values = lines[i].split(",").map((value) => value.trim());
          const entry = {
            banglish: values[headers.indexOf("banglish")],
            english: values[headers.indexOf("english")],
            bangla: values[headers.indexOf("bangla")]
          };

          if (entry.banglish && entry.english && entry.bangla) {
            parsedEntries.push(entry);
          }
        }

        setEntries(parsedEntries);
        setSuccess(`Successfully loaded ${parsedEntries.length} entries`);
      } catch (err) {
        setError("Error processing file");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const dataToSubmit = uploadType === "manual" ? [currentEntry] : entries;

      if (dataToSubmit.length === 0) {
        setError("No data to submit");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tempData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: user._id,
          data: dataToSubmit
        })
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      setSuccess("Data submitted successfully");
      setCurrentEntry({ banglish: "", english: "", bangla: "" });
      setEntries([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trainData`);
      if (!response.ok) {
        throw new Error("Failed to fetch data for download");
      }
      const data = await response.json();
      const csvHeader = "banglish,english,bangla\n";
      const csvRows = data
        .map(
          (entry) =>
            `${entry.banglish},${entry.english},${entry.bangla}`
        )
        .join("\n");
      const csvContent = `${csvHeader}${csvRows}`;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "BanglaBridgeDataset.csv");
      setSuccess("File downloaded successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-y-scroll bg-gradient-to-br from-[#FFF7F4] via-white to-[#FFF0E9]">
      {/* Header */}
      <div className="relative flex items-center justify-between border-b bg-white/80 px-8 py-4 backdrop-blur-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
            <Database className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dataset Management</h1>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500" />
              <p className="text-sm text-gray-600">Manage Translation Dataset</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
              activeTab === "upload"
                ? "bg-orange-50 text-orange-600"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>
          <button
            onClick={() => setActiveTab("download")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
              activeTab === "download"
                ? "bg-orange-50 text-orange-600"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-scroll p-8">
        <div className="mx-auto max-w-4xl">
          {activeTab === "upload" && (
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              {/* Upload Type Selector */}
              <div className="mb-8 flex justify-center gap-4">
                <button
                  onClick={() => setUploadType("manual")}
                  className={`flex items-center gap-2 rounded-xl px-6 py-3 transition-all ${
                    uploadType === "manual"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Keyboard className="h-5 w-5" />
                  Manual Entry
                </button>
                <button
                  onClick={() => setUploadType("file")}
                  className={`flex items-center gap-2 rounded-xl px-6 py-3 transition-all ${
                    uploadType === "file"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FileUp className="h-5 w-5" />
                  File Upload
                </button>
              </div>

              {uploadType === "manual" && (
                <div className="space-y-4">
                  <div className="mb-6">
                    <input
                      type="number"
                      placeholder="Number of entries"
                      className="w-full rounded-xl border-0 bg-gray-50/50 p-4 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      value={datasetSize}
                      onChange={(e) => setDatasetSize(e.target.value)}
                    />
                  </div>

                  {Array.from({ length: parseInt(datasetSize) || 1 }, (_, i) => (
                    <div key={i} className="grid grid-cols-3 gap-4">
                      <input
                        placeholder="Banglish Text"
                        className="rounded-xl border-0 bg-gray-50/50 p-4 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        value={currentEntry.banglish}
                        onChange={(e) =>
                          setCurrentEntry({ ...currentEntry, banglish: e.target.value })
                        }
                      />
                      <input
                        placeholder="English Text"
                        className="rounded-xl border-0 bg-gray-50/50 p-4 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        value={currentEntry.english}
                        onChange={(e) =>
                          setCurrentEntry({ ...currentEntry, english: e.target.value })
                        }
                      />
                      <input
                        placeholder="Bangla Text"
                        className="rounded-xl border-0 bg-gray-50/50 p-4 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        value={currentEntry.bangla}
                        onChange={(e) =>
                          setCurrentEntry({ ...currentEntry, bangla: e.target.value })
                        }
                      />
                    </div>
                  ))}
                </div>
              )}

              {uploadType === "file" && (
                <div className="space-y-6">
                  <div className="rounded-xl border-2 border-dashed border-gray-200 p-8">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex cursor-pointer flex-col items-center gap-4"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-orange-50">
                        <Upload className="h-8 w-8 text-orange-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium text-gray-700">
                          Drop your CSV file here
                        </p>
                        <p className="text-sm text-gray-500">
                          or click to browse from your computer
                        </p>
                      </div>
                    </label>
                  </div>

                  {entries.length > 0 && (
                    <div className="rounded-xl bg-gray-50/50 p-6 overflow-scroll">
                      <h3 className="mb-4 font-medium text-gray-700">Preview</h3>
                      <div className="max-h-64 space-y-3 overflow-y-auto">
                        {entries.slice(0, 5).map((entry, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-3 gap-4 rounded-lg bg-white p-4 shadow-sm"
                          >
                            <div>
                              <p className="text-sm text-gray-500">Banglish</p>
                              <p className="text-gray-700">{entry.banglish}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">English</p>
                              <p className="text-gray-700">{entry.english}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Bangla</p>
                              <p className="text-gray-700">{entry.bangla}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-5 w-5" />
                      Submit Dataset
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "download" && (
            <div className="flex gap-2 h-64 items-center justify-center rounded-2xl bg-white p-6 shadow-lg">
              <p className="text-gray-700">File: BanglaBridgeDataset.csv</p>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-50"
              >
                <Download className="h-5 w-5" />
                Download
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-red-600 shadow-lg">
          <AlertCircle className="h-4 w-4" />
          {error}
          <button
            onClick={() => setError("")}
            className="ml-2 rounded-full p-1 hover:bg-red-100"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {success && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-green-600 shadow-lg">
          <CheckCircle2 className="h-4 w-4" />
          {success}
          <button
            onClick={() => setSuccess("")}
            className="ml-2 rounded-full p-1 hover:bg-green-100"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DatasetPage;