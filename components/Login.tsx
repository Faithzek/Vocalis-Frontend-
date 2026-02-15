
import React, { useState } from 'react';
import { SpeechSupportType, UserProfile } from '../types';
import { STORAGE_KEYS } from '../constants';

interface LoginProps {
  onComplete: (profile: UserProfile) => void;
}

const Login: React.FC<LoginProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState<UserProfile>({
    fullName: '',
    supportType: SpeechSupportType.STUTTERING,
    struggleSounds: '',
    isInitialized: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProfile = {
      ...formData,
      fullName: formData.fullName.trim() || 'Guest'
    };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(finalProfile));
    onComplete(finalProfile);
  };

  const handleSkip = () => {
    const defaultProfile = { 
      fullName: 'Guest', 
      supportType: SpeechSupportType.STUTTERING,
      struggleSounds: '',
      isInitialized: true 
    };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(defaultProfile));
    onComplete(defaultProfile);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100">
        <div className="bg-emerald-600 px-8 py-10 text-white text-center">
          <h1 className="text-3xl font-bold mb-2 font-display">Vocalis</h1>
          <p className="text-emerald-100 opacity-90 text-sm">A calm space to support your unique voice.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
              placeholder="Your name (optional)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Speech Support Type</label>
            <div className="relative">
              <select 
                value={formData.supportType}
                onChange={e => setFormData({...formData, supportType: e.target.value as SpeechSupportType})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all appearance-none"
              >
                {Object.values(SpeechSupportType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400 font-medium ml-1">You can update this anytime.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Specific sounds to focus on?</label>
            <input 
              type="text" 
              value={formData.struggleSounds}
              onChange={e => setFormData({...formData, struggleSounds: e.target.value})}
              placeholder="e.g. S, B, K (Optional)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-3 pt-4">
            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98]"
            >
              Start using Vocalis
            </button>
            <button 
              type="button"
              onClick={handleSkip}
              className="w-full text-gray-400 font-medium py-2 hover:text-emerald-600 transition-colors text-sm"
            >
              Skip for now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
