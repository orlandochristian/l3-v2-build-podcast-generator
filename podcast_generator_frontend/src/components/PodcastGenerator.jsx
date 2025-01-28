import React, { useState, useRef } from 'react';

const PodcastGenerator = () => {
  const [activeInput, setActiveInput] = useState('text');
  const [inputText, setInputText] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (activeInput === 'text') {
        console.log('Submitting text:', inputText);
      } else if (activeInput === 'audio') {
        console.log('Submitting audio file:', audioFile);
      }
    } catch (error) {
      console.error('Error processing submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
    } else {
      alert('Please drop an audio file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Podcast Generator</h2>
      
      <div className="flex justify-center gap-4 mb-6">
        <button 
          type="button"
          className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200
            ${activeInput === 'text' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
            }`}
          onClick={() => setActiveInput('text')}
        >
          Insert Text
        </button>
        <button 
          type="button"
          className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200
            ${activeInput === 'audio' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
            }`}
          onClick={() => setActiveInput('audio')}
        >
          Insert Audio
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeInput === 'text' && (
          <div>
            <label htmlFor="podcastText" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your podcast text:
            </label>
            <textarea
              id="podcastText"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter the text you want to convert to a podcast..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        )}

        {activeInput === 'audio' && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-blue-400 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors duration-200"
          >
            {audioFile ? (
              <div className="flex items-center justify-center gap-4">
                <span className="text-gray-700">{audioFile.name}</span>
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setAudioFile(null);
                  }}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="text-gray-600">
                <p>Drag and drop your audio file here</p>
                <p className="text-sm">or click to select</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setAudioFile(e.target.files?.[0])}
              accept="audio/*"
              className="hidden"
            />
          </div>
        )}

        {activeInput && (
          <button 
            type="submit" 
            disabled={isLoading || (activeInput === 'text' ? !inputText.trim() : !audioFile)}
            className={`w-full py-3 rounded-lg font-medium transition-colors duration-200
              ${isLoading || (activeInput === 'text' ? !inputText.trim() : !audioFile)
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          >
            {isLoading ? 'Processing...' : 'Generate Podcast'}
          </button>
        )}
      </form>
    </div>
  );
};

export default PodcastGenerator; 