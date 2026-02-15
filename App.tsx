
import React, { useState, useEffect } from 'react';
import { UserProfile, SessionData } from './types';
import { STORAGE_KEYS } from './constants';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SpeechInterface from './components/SpeechInterface';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'interface'>('dashboard');

  useEffect(() => {
    const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    const savedSessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  const handleProfileComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  const handleSaveSession = (session: SessionData) => {
    const updated = [...sessions, session];
    setSessions(updated);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
  };

  if (!profile) {
    return <Login onComplete={handleProfileComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
      {/* Sidebar Navigation (Sticky) */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">V</div>
          <h1 className="font-bold text-xl text-emerald-800">Vocalis</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'dashboard' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('interface')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'interface' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Speak
          </button>
        </div>
        <div className="hidden md:flex items-center gap-3 text-sm font-medium text-gray-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Edge AI Offline
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-6 pt-12">
        {activeTab === 'dashboard' ? (
          <Dashboard user={profile} sessions={sessions} />
        ) : (
          <SpeechInterface onSave={handleSaveSession} />
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-6 mt-12 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm">
        Vocalis &copy; 2024. Privacy Focused. Local Storage Only.
      </footer>

      {/* Tailwind Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.9); opacity: 0; }
          70% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-bounce-in { animation: bounceIn 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
