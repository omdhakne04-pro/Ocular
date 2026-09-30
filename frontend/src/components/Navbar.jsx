import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, Activity, ShieldCheck, LogOut, User, Volume2, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [audioFeedback, setAudioFeedback] = useState(true);

  const testAudioTone = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance('Ocular visual intelligence audio engine is active and ready.');
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#070b12]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 text-black shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Eye className="w-6 h-6 stroke-[2.5]" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  OCULAR
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                  v2.5 Flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Enterprise Visual Intelligence
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
              <Link
                to="/scanner"
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/scanner'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/25 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Live Scanner
              </Link>
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/dashboard'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/25 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Activity className="w-4 h-4" />
                Analytics & History
              </Link>
            </nav>
          )}

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            {/* Audio Engine Readiness Indicator */}
            <button
              onClick={testAudioTone}
              title="Test Voice Readout Audio Engine"
              aria-label="Test Speech Audio Engine"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-cyan-400 border border-cyan-900/50 hover:bg-cyan-950 hover:border-cyan-700 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">Audio Ready</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-200 truncate max-w-[120px]">{user?.name}</p>
                    <p className="text-[10px] text-slate-400">Verified Operator</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/40 text-rose-300 border border-rose-800/40 hover:bg-rose-900/60 hover:text-white transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black transition-colors shadow-md shadow-cyan-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
