
import React from 'react';
import { UserProfile, SessionData } from '../types';

interface DashboardProps {
  user: UserProfile;
  sessions: SessionData[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, sessions }) => {
  const totalSessions = sessions.length;
  const progress = Math.min(totalSessions * 10, 100);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Hello, {user.fullName}!</h2>
        <p className="text-gray-500">Welcome back to your personalized speech assistant.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <span className="text-emerald-800 font-bold text-3xl">{totalSessions}</span>
            <p className="text-emerald-600 text-sm font-medium">Total Sessions</p>
          </div>
          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <span className="text-blue-800 font-bold text-lg leading-tight block mb-1">
              {user.supportType}
            </span>
            <p className="text-blue-600 text-sm font-medium">Support Focus</p>
          </div>
          <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
            <span className="text-purple-800 font-bold text-xl">
              {user.struggleSounds || 'General'}
            </span>
            <p className="text-purple-600 text-sm font-medium">Focused Sounds</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Communication Confidence</h3>
          <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Level {Math.floor(totalSessions / 10) + 1}
          </span>
        </div>
        <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full transition-all duration-1000 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-4 text-sm text-gray-500">Progress is measured by your frequent use and consistency.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">How Vocalis Helps</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-sm">1</div>
            <div>
              <p className="font-semibold text-gray-700">Listening with patience</p>
              <p className="text-sm text-gray-500">Our system detects pauses automatically, giving you space to finish at your own pace.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-sm">2</div>
            <div>
              <p className="font-semibold text-gray-700">Clarifying flow</p>
              <p className="text-sm text-gray-500">We gently remove repetitive sounds or syllables to let the core message shine.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-sm">3</div>
            <div>
              <p className="font-semibold text-gray-700">Polishing meaning</p>
              <p className="text-sm text-gray-500">Local AI refinement ensures your words are organized clearly while keeping your intent.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
