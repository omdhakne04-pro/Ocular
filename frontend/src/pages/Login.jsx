import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/scanner');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    setError('');
    setLoading(true);
    try {
      await quickDemoLogin();
      navigate('/scanner');
    } catch (err) {
      setError('Failed to initiate demo session. You may register a new account below.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Brand Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-cyan-400 text-black shadow-xl shadow-cyan-500/20 mb-4">
            <Eye className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sign In to Ocular
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Enterprise Visual Intelligence & Assistive Multimodal Inspection
          </p>
        </div>

        {/* Expired Session Notice */}
        {searchParams.get('expired') && (
          <div className="mb-4 p-3 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Your session has expired. Please sign in again to continue.</span>
          </div>
        )}

        {/* Main Login Box */}
        <div className="rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 shadow-2xl">
          {/* Quick Demo Access for Hackathon Judges */}
          <button
            type="button"
            onClick={handleDemoAccess}
            disabled={loading}
            className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>JUDGE / DEMO 1-CLICK ACCESS</span>
          </button>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Or Sign In With Email
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@ocular.vision"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Operator Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Don't have an operator account?{' '}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
