import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Volume2,
  VolumeX,
  RotateCcw,
  FileText,
  CheckCircle,
  Copy,
  Check,
  Sparkles,
  Info,
} from 'lucide-react';

export default function ResultCard({ inspection, autoPlayAudio = true }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [copied, setCopied] = useState(false);
  const [showRawOCR, setShowRawOCR] = useState(false);

  const hasAnomaly =
    inspection?.anomaly_warning &&
    inspection.anomaly_warning.trim().toLowerCase() !== 'none' &&
    !inspection.anomaly_warning.trim().toLowerCase().startsWith('none');

  // Trigger automated speech playback whenever a new inspection arrives
  useEffect(() => {
    if (inspection?.spoken_script && autoPlayAudio) {
      speakScript(inspection.spoken_script);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [inspection]);

  const speakScript = (text) => {
    if (!('speechSynthesis' in window) || !text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const replaySpeaking = () => {
    if (inspection?.spoken_script) {
      speakScript(inspection.spoken_script);
    }
  };

  const handleCopyJson = () => {
    if (inspection) {
      navigator.clipboard.writeText(JSON.stringify(inspection, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!inspection) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center min-h-[420px]">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-500 mb-4 animate-pulse">
          <Sparkles className="w-8 h-8 text-cyan-500/50" />
        </div>
        <h3 className="text-base font-semibold text-slate-300">Awaiting Visual Feed</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
          Snap a camera frame or upload an image to generate structured computer vision intelligence & audio readout.
        </p>
      </div>
    );
  }

  const confidencePct = Math.round((inspection.confidence_score || 0.95) * 100);

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
      {/* Top Banner & Status Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              hasAnomaly
                ? 'bg-rose-950/80 text-rose-400 border border-rose-700/60 shadow-lg shadow-rose-900/30'
                : 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 shadow-lg shadow-emerald-900/30'
            }`}
          >
            {hasAnomaly ? (
              <AlertTriangle className="w-7 h-7 stroke-[2.2]" />
            ) : (
              <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  hasAnomaly
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}
              >
                {hasAnomaly ? 'Anomaly / Risk Flagged' : 'Verified Authentic & Safe'}
              </span>
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                {inspection.category || inspection.mode}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1 leading-snug">
              {inspection.title}
            </h2>
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="flex items-center gap-3 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Confidence</span>
            <span className="text-sm font-bold font-mono text-cyan-400">{confidencePct}%</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-cyan-500/40 flex items-center justify-center text-xs font-mono text-white">
            {confidencePct}
          </div>
        </div>
      </div>

      {/* Audio Playback & Voice Readout Console */}
      <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-900/40 shadow-inner flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400">
              <Volume2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Audio Assistive Synthesizer
            </span>
          </div>

          {/* Sound wave equalizer animation when speaking */}
          {isSpeaking && (
            <div className="flex items-center gap-1 h-5 px-2">
              <div className="w-1 bg-cyan-400 rounded-full animate-wave-bar" style={{ animationDelay: '0ms' }} />
              <div className="w-1 bg-cyan-400 rounded-full animate-wave-bar" style={{ animationDelay: '150ms' }} />
              <div className="w-1 bg-cyan-400 rounded-full animate-wave-bar" style={{ animationDelay: '300ms' }} />
              <div className="w-1 bg-cyan-400 rounded-full animate-wave-bar" style={{ animationDelay: '450ms' }} />
            </div>
          )}

          {/* Playback Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                const nextRate = speechRate === 1.0 ? 1.25 : 1.0;
                setSpeechRate(nextRate);
                if (isSpeaking) {
                  stopSpeaking();
                  speakScript(inspection.spoken_script);
                }
              }}
              title="Change speech rate"
              className="px-2 py-1 rounded text-[11px] font-mono font-medium bg-slate-800 text-slate-300 hover:text-white"
            >
              {speechRate}x
            </button>
            {isSpeaking ? (
              <button
                onClick={stopSpeaking}
                title="Stop Audio"
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800 hover:bg-rose-900 transition-colors"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                onClick={replaySpeaking}
                title="Replay Voice Readout"
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-300 italic bg-black/40 p-3 rounded-lg border border-slate-800 leading-relaxed font-sans">
          "{inspection.spoken_script}"
        </p>
      </div>

      {/* Anomaly or Warning Banner if flagged */}
      {hasAnomaly && (
        <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-200 flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-rose-300">Safety / Anomaly Warning:</p>
            <p className="mt-0.5 leading-relaxed">{inspection.anomaly_warning}</p>
          </div>
        </div>
      )}

      {/* Summary Section */}
      <div className="text-xs text-slate-300 leading-relaxed">
        <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block mb-1">
          Executive Summary
        </span>
        {inspection.summary}
      </div>

      {/* Extracted Key-Value OCR Attributes */}
      {inspection.key_attributes && inspection.key_attributes.length > 0 && (
        <div>
          <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block mb-2">
            Structured Data Attributes
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {inspection.key_attributes.map((attr, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs"
              >
                <span className="text-slate-400 font-medium">{attr.key}:</span>
                <span className="text-white font-mono font-semibold text-right ml-2">{attr.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw OCR Text Toggle */}
      {inspection.detected_text && (
        <div className="pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setShowRawOCR(!showRawOCR)}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{showRawOCR ? 'Hide Extracted OCR Text' : 'View Extracted OCR Text'}</span>
          </button>
          {showRawOCR && (
            <div className="mt-2 p-3 rounded-lg bg-black/60 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {inspection.detected_text}
            </div>
          )}
        </div>
      )}

      {/* Bottom Actions: Copy JSON */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
        <span className="font-mono text-[10px]">
          ID: {inspection.id || 'LIVE-STREAM-SCAN'}
        </span>
        <button
          onClick={handleCopyJson}
          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'JSON Copied!' : 'Copy Structured JSON'}</span>
        </button>
      </div>
    </div>
  );
}
