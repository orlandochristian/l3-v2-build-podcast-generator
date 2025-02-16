import React, { useState, useRef } from 'react';
import axios from "axios";
//import { Speaker} from 'speaker';
import { ElevenLabsClient, stream } from 'elevenlabs';
import { Readable } from 'stream'; 

//import { useElevenlabs } from '@11labs/react';



const API_KEY = import.meta.env.VITE_APP_GEMINI_API_KEY;
const API_URL = import.meta.env.VITE_APP_API_URL;
const API_11LABS_KEY = import.meta.env.VITE_APP_11LABS_API_KEY;



const PodcastGenerator = () => {
  const [activeInput, setActiveInput] = useState('text');
  const [inputText, setInputText] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [audioOutput, setAudioOutput] = useState(null);
  //const { generateAudio } = useElevenlabs();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
   
    
    try {
      if (activeInput === 'text') {
        // console.log('Submitting text:', inputText);

        // await new Promise(resolve => setTimeout(resolve, 1500));
        const prompt = `Generate a structured podcast script where two people discuss: ${inputText}. made up the nme of the host 1 and host 2
        Format it like this:
      
        Host 1: [Opening remarks]  
        Host 2: [Response]  
        Host 1: [Follow-up question]  
        Host 2: [Answer]  
        ...
      
        Keep it engaging, friendly, and informative.`;

        const requestData = {
          contents: [{ parts: [{ text: prompt }] }],
        };
        try {
          const response = await axios.post(`${API_URL}?key=${API_KEY}`, requestData);
          setGeneratedText(response.data.candidates[0].content.parts[0].text);
          setIsGenerated(true);
         
        } 
        catch (error) {
          console.error("Error generating podcast script:", error);
          return "Error generating script.";
        }


        
       
      
      }
       else if (activeInput === 'audio') {
        console.log('Submitting audio file:', audioFile);
      }
   
     
    } catch (error) {
      console.error('Error processing submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPodcast = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      ///// esto es con ElevenLabs AI //////////
     
      const client = new ElevenLabsClient({
        apiKey: API_11LABS_KEY,
      });
    
    
    //   const audioStream = await client.textToSpeech.convertAsStream("9BWtsMINqrJLrRacOk9x", {
    //     output_format: "mp3_44100_128",
    //     text: "hello Jose Mejia, how are you?",
    //     model_id: "eleven_multilingual_v2"
    // });

   
    // const speaker = new Speaker({
    //   channels: 1, // Mono audio
    //   bitDepth: 16,
    //   sampleRate: 44100,
    // });

   
    // audioStream.pipe(speaker);
  

      //Play the audio using an HTML5 audio element
      // const audio = new Audio(elevenlabs_audio);
      // audio.play();

   

      ////////////////////////////////////////


      // First, generate the optimized speech text using Gemini
    //   const prompt2 = `Convert the following text into natural-sounding speech patterns, dont read the word "host 1" and "host 2"
    //   including appropriate pauses, using different voice for each person:
    //   "${generatedText}"
      
    //   Format the output with speech marks like [pause], [emphasis], [rising tone], etc.`;

    //   const requestData2 = {
    //     contents: [{ parts: [{ text: prompt2 }] }]
    //   };

    //    const response2 = await axios.post(`${API_URL}?key=${API_KEY}`, requestData2);;

    //    const speechText = response2.data.candidates[0].content.parts[0].text;
    

    //   // Then convert to audio using Web Speech API
    //   const utterance = new SpeechSynthesisUtterance(speechText);
      
    //   // Configure speech parameters
    //   utterance.rate = 1.0;  // Speed of speech
    //   utterance.pitch = 1.0; // Pitch of voice
    //   utterance.volume = 1.0; // Volume
      
    //   // Store the audio for playback
    //     setAudioOutput(utterance);

    //   // Play the audio
    //   window.speechSynthesis.speak(utterance);

    } catch (err) {
      setError('Error generating speech: ' + err.message);
      // console.error('Error:', err);
      console.log("error")
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopAudio = () => {
    window.speechSynthesis.cancel();
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

        <div className="space-y-4">
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
        
          <div className="flex justify-center gap-4 mb-6">
          <button 
            type="button"
            onClick={handlePlayPodcast}
            disabled={!isGenerated}
            className={`w-sm py-3 rounded-lg font-medium transition-colors duration-200
              ${!isGenerated
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
          >
            Play
          </button>
          <button
                onClick={handleStopAudio}
                disabled={!isGenerated}
                className={`w-sm py-3 rounded-lg font-medium transition-colors duration-200
                  ${!isGenerated
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-black-700 text-white'
                  }`}
              >
                Stop
            </button>
          </div>
          


          <div className={`transition-opacity duration-200 ${isGenerated ? 'opacity-100' : 'opacity-50'}`}>
            <label 
              htmlFor="generatedText" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Generated Transcript:
            </label>
            <textarea
              id="generatedText"
              value={generatedText}
              onChange={(e) => setGeneratedText(e.target.value)}
              disabled={!isGenerated}
              rows={4}
              
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg 
                ${isGenerated 
                  ? 'focus:ring-2 focus:ring-blue-500 focus:border-green-600' 
                  : 'bg-gray-50'
                }`}
              placeholder="Generated transcript will appear here..."
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PodcastGenerator; 