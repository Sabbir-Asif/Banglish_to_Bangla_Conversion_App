import React, { useState, useContext } from 'react';
import { AuthContext } from '../Authentication/AuthProvider';

const DatasetPage = () => {
  const { user } = useContext(AuthContext);
  const [uploadType, setUploadType] = useState('manual');
  const [datasetSize, setDatasetSize] = useState('');
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    banglish: '',
    english: '',
    bangla: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('upload');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const csvData = event.target.result;
      const lines = csvData.split('\n');
      const headers = lines[0].split(',').map(header => header.trim());

      if (!headers.includes('banglish') || !headers.includes('english') || !headers.includes('bangla')) {
        setError('CSV must contain banglish, english, and bangla columns');
        return;
      }

      const parsedEntries = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',').map(value => value.trim());
        const entry = {
          banglish: values[headers.indexOf('banglish')],
          english: values[headers.indexOf('english')],
          bangla: values[headers.indexOf('bangla')]
        };
        
        if (entry.banglish && entry.english && entry.bangla) {
          parsedEntries.push(entry);
        }
      }

      setEntries(parsedEntries);
      setSuccess(`Successfully loaded ${parsedEntries.length} entries`);
    };

    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    try {
      const dataToSubmit = uploadType === 'manual' ? [currentEntry] : entries;
      
      if (dataToSubmit.length === 0) {
        setError('No data to submit');
        return;
      }

      const response = await fetch('http://localhost:3000/api/tempData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: user._id,
          data: dataToSubmit
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit data');
      }

      setSuccess('Data submitted successfully');
      setCurrentEntry({ banglish: '', english: '', bangla: '' });
      setEntries([]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-cream-primary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-exo text-center text-orange-primary mb-8">Dataset Management</h1>
        
        <div className="tabs tabs-boxed justify-center mb-6">
          <button 
            className={`tab ${activeTab === 'upload' ? 'tab-active' : ''} text-cream-primary`}
            onClick={() => setActiveTab('upload')}
          >
            Upload Dataset
          </button>
          <button 
            className={`tab ${activeTab === 'download' ? 'tab-active' : ''} text-cream-primary`}
            onClick={() => setActiveTab('download')}
          >
            Download Dataset
          </button>
        </div>

        {activeTab === 'upload' && (
          <div className="card bg-white shadow-lg p-6">
            <div className="card-body">
              <div className="flex gap-4 justify-center mb-6">
                <button 
                  className={`btn ${uploadType === 'manual' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setUploadType('manual')}
                >
                  Upload Data
                </button>
                <button 
                  className={`btn ${uploadType === 'file' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setUploadType('file')}
                >
                  Upload File
                </button>
              </div>

              {uploadType === 'manual' && (
                <div className="space-y-4">
                  <div className="form-control">
                    <input
                      type="number"
                      placeholder="Dataset Size"
                      className="input input-bordered w-full"
                      value={datasetSize}
                      onChange={(e) => setDatasetSize(e.target.value)}
                    />
                  </div>

                  {Array.from({ length: parseInt(datasetSize) || 1 }, (_, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="form-control">
                        <input
                          placeholder="Banglish"
                          className="input input-bordered"
                          value={currentEntry.banglish}
                          onChange={(e) => setCurrentEntry({...currentEntry, banglish: e.target.value})}
                        />
                      </div>
                      <div className="form-control">
                        <input
                          placeholder="English"
                          className="input input-bordered"
                          value={currentEntry.english}
                          onChange={(e) => setCurrentEntry({...currentEntry, english: e.target.value})}
                        />
                      </div>
                      <div className="form-control">
                        <input
                          placeholder="Bangla"
                          className="input input-bordered"
                          value={currentEntry.bangla}
                          onChange={(e) => setCurrentEntry({...currentEntry, bangla: e.target.value})}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {uploadType === 'file' && (
                <div className="space-y-4">
                  <input
                    type="file"
                    accept=".csv"
                    className="file-input file-input-bordered w-full"
                    onChange={handleFileUpload}
                  />
                  {entries.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Preview:</h3>
                      <div className="max-h-60 overflow-y-auto">
                        {entries.slice(0, 5).map((entry, index) => (
                          <div key={index} className="card bg-base-200 mb-4 p-4">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <span className="font-semibold">Banglish:</span> {entry.banglish}
                              </div>
                              <div>
                                <span className="font-semibold">English:</span> {entry.english}
                              </div>
                              <div>
                                <span className="font-semibold">Bangla:</span> {entry.bangla}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={handleSubmit} 
                className="btn btn-primary w-full mt-6"
              >
                Submit
              </button>

              {error && (
                <div className="alert alert-error mt-4">
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="alert alert-success mt-4">
                  <span>{success}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'download' && (
          <div className="card bg-white shadow-lg p-6">
            <div className="card-body">
              <p className="text-center text-gray-500">Download functionality to be implemented</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetPage;
