import React, { useState } from 'react';
import { inspectAPI } from '../services/api';
import CameraFeed from '../components/CameraFeed';
import ResultCard from '../components/ResultCard';
import {
  Pill,
  Banknote,
  Compass,
  FileCheck,
  Volume2,
  VolumeX,
  Sparkles,
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function Scanner() {
  const [selectedMode, setSelectedMode] = useState('medicine');
  const [currentInspection, setCurrentInspection] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const modes = [
    {
      id: 'medicine',
      title: 'Medicine & Packaging',
      desc: 'Inspect expiry dates, active dosage, and tamper seals',
      icon: Pill,
      accent: 'border-cyan-500 text-cyan-400',
    },
    {
      id: 'currency',
      title: 'Currency Verification',
      desc: 'Verify denomination, security strip & counterfeit risks',
      icon: Banknote,
      accent: 'border-emerald-500 text-emerald-400',
    },
    {
      id: 'environment',
      title: 'Scene & Surroundings',
      desc: 'Detect physical obstacles, wet floors, and safe paths',
      icon: Compass,
      accent: 'border-amber-500 text-amber-400',
    },
    {
      id: 'document',
      title: 'Document & Waybill',
      desc: 'Extract key OCR dates, invoices, and shipping numbers',
      icon: FileCheck,
      accent: 'border-violet-500 text-violet-400',
    },
  ];

  const handleImageCaptured = async (file, previewUrl) => {
    setIsAnalyzing(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('mode', selectedMode);

    try {
      const res = await inspectAPI.analyze(formData);
      if (res.success && res.data) {
        setCurrentInspection(res.data);
      } else {
        throw new Error(res.error || 'Failed to analyze image feed.');
      }
    } catch (err) {
      console.error('[Scanner Analyze Error]:', err);
      const detail =
        err.response?.data?.error ||
        err.message ||
        'Unable to process visual feed. Please check your connection.';
      setErrorMsg(detail);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Visual Inspection Studio
            </h1>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 text-xs font-mono font-medium border border-cyan-800">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              Live Multi-Modal
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated OCR, anomaly detection, and voice delivery powered by Google Gemini 2.5 Flash
          </p>
        </div>

        {/* Audio Autoplay Toggle */}
        <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setAutoPlayAudio(!autoPlayAudio)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            {autoPlayAudio ? (
              <>
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Auto Voice Feedback: <strong className="text-cyan-400">ON</strong></span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-500" />
                <span>Auto Voice Feedback: <strong className="text-slate-500">OFF</strong></span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10 -translate-y-0.5'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`p-2 rounded-xl ${
                    isSelected ? 'bg-cyan-950 text-cyan-400' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-white">{mode.title}</p>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{mode.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-rose-400 hover:text-white font-bold text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Dual Column Layout: Camera on Left, Result Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Camera Studio */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative">
            <CameraFeed
              onImageCaptured={handleImageCaptured}
              isAnalyzing={isAnalyzing}
              selectedMode={selectedMode}
            />

            {/* Scanning HUD Overlay when model inference is running */}
            {isAnalyzing && (
              <div className="absolute inset-0 rounded-2xl bg-black/75 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
                <div className="relative mb-4">
                  <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                  <Sparkles className="w-5 h-5 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <h4 className="text-base font-bold text-white font-mono">
                  GEMINI 2.5 FLASH RUNNING
                </h4>
                <p className="text-xs text-cyan-300 mt-1 font-mono">
                  Extracting OCR &bull; Verifying Safety &bull; Synthesizing Voice
                </p>
                <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div className="w-full h-full bg-cyan-400 animate-pulse" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Structured Result Card */}
        <div className="lg:col-span-5">
          <ResultCard inspection={currentInspection} autoPlayAudio={autoPlayAudio} />
        </div>
      </div>
    </div>
  );
}
