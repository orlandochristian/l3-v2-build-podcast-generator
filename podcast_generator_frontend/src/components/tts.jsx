import React, { useState } from 'react';
import axios from 'axios';

const API_KEY = "AIzaSyBmzA-ovDM5-h4elnJSvisnbVgw9BiKkxs";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

const TTS = () => {
  const [inputText, setInputText] = useState('');
  const [audioOutput, setAudioOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateSpeech = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First, generate the optimized speech text using Gemini
      const prompt = `Convert the following text into natural-sounding speech patterns, 
      including appropriate pauses, emphasis, and intonation markers:
      "${inputText}"
      
      Format the output with speech marks like [pause], [emphasis], [rising tone], etc.`;

      const requestData = {
        contents: [{ parts: [{ text: prompt }] }]
      };

      const response = await axios.post(
        `${API_URL}?key=${API_KEY}`,
        requestData
      );

      const speechText = response.data.candidates[0].content.parts[0].text;

      // Then convert to audio using Web Speech API
      const utterance = new SpeechSynthesisUtterance(speechText);
      
      // Configure speech parameters
      utterance.rate = 1.0;  // Speed of speech
      utterance.pitch = 1.0; // Pitch of voice
      utterance.volume = 1.0; // Volume
      
      // Store the audio for playback
      setAudioOutput(utterance);

      // Play the audio
      window.speechSynthesis.speak(utterance);

    } catch (err) {
      setError('Error generating speech: ' + err.message);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = () => {
    if (audioOutput) {
      window.speechSynthesis.speak(audioOutput);
    }
  };

  const handleStopAudio = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Text to Speech Generator!!!!</h2>
      
      <div className="space-y-4">
        <div>
          <label 
            htmlFor="speechText" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter Text to Convert
          </label>
          <textarea
            id="speechText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Enter the text you want to convert to speech..."
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={generateSpeech}
            disabled={isLoading || !inputText.trim()}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200
              ${isLoading || !inputText.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          >
            {isLoading ? 'Generating...' : 'Generate Speech'}
          </button>

          {audioOutput && (
            <>
              <button
                onClick={handlePlayAudio}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Play again
              </button>
              <button
                onClick={handleStopAudio}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Stop
              </button>
            </>
          )}
        </div>

        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TTS; 