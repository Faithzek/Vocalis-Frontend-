
import React, { useState, useEffect, useRef } from 'react';
import { Status, SessionData } from '../types';
import { PAUSE_MESSAGES } from '../constants';
import { cleanSpeechArtifacts, checkConfidence } from '../services/cleaningService';
import { smoothTextWithAI } from '../services/aiService';

const SpeechInterface: React.FC<{ onSave: (s: SessionData) => void }> = ({ onSave }) => {
  const [status, setStatus] = useState<Status>('IDLE');
  const [silenceDuration, setSilenceDuration] = useState(0);
  const [rawText, setRawText] = useState('');
  const [refinedText, setRefinedText] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [showRepeatPrompt, setShowRepeatPrompt] = useState(false);
  
  const timerRef = useRef<number | null>(null);

  const startListening = () => {
    setStatus('LISTENING');
    setRawText('');
    setRefinedText('');
    setSupportMessage(PAUSE_MESSAGES.LISTENING);
    setShowRepeatPrompt(false);
    
    // In a real RPi app, we'd trigger the local Whisper stream here.
    // For this prototype, we simulate a transcript after a delay.
    let seconds = 0;
    timerRef.current = window.setInterval(() => {
      seconds += 1;
      setSilenceDuration(seconds);
      
      if (seconds >= 10) setSupportMessage(PAUSE_MESSAGES.STILL_HERE);
      else if (seconds >= 5) setSupportMessage(PAUSE_MESSAGES.TIME);
      else if (seconds >= 2) setSupportMessage(PAUSE_MESSAGES.LISTENING);
    }, 1000);
  };

  const stopListening = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('PROCESSING');
    
    // Simulate raw Whisper output with stuttering artifacts
    const mockRaw = "i..i..i really w-w-want some g-g-goooood sssssssoup um like today";
    setRawText(mockRaw);

    // Step 1: Rule-based cleaning
    const ruleCleaned = cleanSpeechArtifacts(mockRaw);
    
    // Step 2: LLaMA Smoothing (Simulated via Gemini)
    const aiRefined = await smoothTextWithAI(ruleCleaned);
    setRefinedText(aiRefined);

    // Step 3: Confidence Check
    const isConfident = checkConfidence(aiRefined, 0.85);
    
    if (!isConfident) {
      setShowRepeatPrompt(true);
    }

    const newSession: SessionData = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      rawText: mockRaw,
      cleanedText: ruleCleaned,
      refinedText: aiRefined,
      confidence: 0.85
    };

    onSave(newSession);
    setStatus('DONE');
  };

  const handleRepeat = () => {
    startListening();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Action Area */}
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-lg border border-gray-100">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${
          status === 'LISTENING' ? 'bg-red-100 animate-pulse scale-110' : 
          status === 'PROCESSING' ? 'bg-blue-100' : 'bg-emerald-100'
        }`}>
          {status === 'LISTENING' ? (
            <div className="w-12 h-12 bg-red-500 rounded-full"></div>
          ) : (
            <svg className={`w-16 h-16 ${status === 'PROCESSING' ? 'text-blue-500 animate-spin' : 'text-emerald-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </div>

        <button 
          onClick={status === 'LISTENING' ? stopListening : startListening}
          disabled={status === 'PROCESSING'}
          className={`px-12 py-5 rounded-2xl text-xl font-bold transition-all shadow-xl active:scale-95 ${
            status === 'LISTENING' ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {status === 'LISTENING' ? 'Finish Speaking' : 'Start Listening'}
        </button>

        <p className="mt-6 text-lg font-medium text-gray-500 min-h-[1.5rem]">
          {status === 'LISTENING' ? supportMessage : status === 'PROCESSING' ? 'Refining your words...' : 'Tap to start'}
        </p>
      </div>

      {/* Results Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Raw Speech</h3>
          <div className="bg-gray-50 p-4 rounded-xl min-h-[100px] text-gray-700 font-mono italic">
            {rawText || 'Waiting for input...'}
          </div>
        </div>

        <div className="bg-emerald-50 p-6 rounded-2xl shadow-inner border border-emerald-100">
          <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4">Refined Meaning</h3>
          <div className="bg-white p-4 rounded-xl min-h-[100px] text-emerald-900 text-xl font-medium leading-relaxed">
            {refinedText || 'Processing...'}
          </div>
        </div>
      </div>

      {/* Feedback Area */}
      {(showRepeatPrompt || status === 'DONE') && (
        <div className="flex flex-col items-center bg-blue-50 p-8 rounded-3xl border border-blue-100 text-center animate-bounce-in">
          {showRepeatPrompt ? (
            <>
              <p className="text-blue-800 text-lg mb-4">I may not have understood clearly. Would you like to repeat?</p>
              <button onClick={handleRepeat} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                Repeat
              </button>
            </>
          ) : (
            <p className="text-emerald-800 text-lg font-medium">Great job! Your words are ready.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SpeechInterface;
