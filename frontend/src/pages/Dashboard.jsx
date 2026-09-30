import React, { useState, useEffect } from 'react';
import { inspectAPI } from '../services/api';
import StatWidget from '../components/StatWidget';
import ResultCard from '../components/ResultCard';
import {
  Scan,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Volume2,
  X,
  FileText,
  Calendar,
  Layers,
} from 'lucide-react';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterMode, setSelectedFilterMode] = useState('all');
  const [selectedInspectionModal, setSelectedInspectionModal] = useState(null);

  const fetchData = async () => {
    try {
      const [metricsRes, historyRes] = await Promise.all([
        inspectAPI.getMetrics(),
        inspectAPI.getHistory({ limit: 50 }),
      ]);

      if (metricsRes.success) {
        setMetrics(metricsRes.data);
      }
      if (historyRes.success) {
        setHistory(historyRes.data);
      }
    } catch (err) {
      console.error('[Dashboard Error]:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const playVoice = (text, e) => {
    e.stopPropagation();
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      const isHindi = /[\u0900-\u097F]/.test(text);
      const voices = window.speechSynthesis.getVoices() || [];
      if (isHindi) {
        utterance.lang = 'hi-IN';
        const hiVoice = voices.find(
          (v) =>
            v.lang === 'hi-IN' ||
            v.lang === 'hi_IN' ||
            v.lang.toLowerCase().startsWith('hi') ||
            v.name.toLowerCase().includes('hindi') ||
            v.name.toLowerCase().includes('हिन्दी') ||
            v.name.toLowerCase().includes('kalpana') ||
            v.name.toLowerCase().includes('hemant') ||
            v.name.toLowerCase().includes('swara') ||
            v.name.toLowerCase().includes('madhur') ||
            v.name.toLowerCase().includes('lekha')
        );
        if (hiVoice) utterance.voice = hiVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  // Filter history based on search query and mode filter
  const filteredHistory = history.filter((item) => {
    const matchesMode = selectedFilterMode === 'all' || item.mode === selectedFilterMode;
    const matchesSearch =
      !searchQuery ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.detected_text?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMode && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Inspection Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time compliance monitoring, visual anomaly tracking & historical audit logs
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 hover:border-cyan-700 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Metrics'}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget
          title="Total Inspections"
          value={metrics?.total_scans ?? 0}
          subtext="Processed by Multimodal AI"
          icon={Scan}
          color="cyan"
        />
        <StatWidget
          title="Anomalies Flagged"
          value={metrics?.flagged_anomalies ?? 0}
          subtext="Risk / Counterfeit / Expired"
          icon={AlertTriangle}
          color="crimson"
        />
        <StatWidget
          title="Verified Safe Rate"
          value={metrics?.accuracy_rate ?? '98.5%'}
          subtext="High-Confidence Authenticated"
          icon={ShieldCheck}
          color="emerald"
        />
        <StatWidget
          title="Estimated Time Saved"
          value={`${metrics?.time_saved_minutes ?? 0}m`}
          subtext="vs Manual Human Inspection"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Inspection Mode Breakdown */}
      {metrics?.scans_by_mode && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Scans by Inspection Category
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400">Medicine & Packaging</span>
              <p className="text-lg font-bold font-mono text-cyan-400 mt-1">
                {metrics.scans_by_mode.medicine || 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400">Currency Notes</span>
              <p className="text-lg font-bold font-mono text-emerald-400 mt-1">
                {metrics.scans_by_mode.currency || 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400">Scene / Obstacles</span>
              <p className="text-lg font-bold font-mono text-amber-400 mt-1">
                {metrics.scans_by_mode.environment || 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400">Documents & Bills</span>
              <p className="text-lg font-bold font-mono text-violet-400 mt-1">
                {metrics.scans_by_mode.document || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* History & Inspection Logs Section */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Historical Inspection Logs</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Auditable records with OCR extractions and voice playback logs
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search OCR or title..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedFilterMode}
                onChange={(e) => setSelectedFilterMode(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:border-cyan-500 transition-colors"
              >
                <option value="all">All Modes</option>
                <option value="medicine">Medicine</option>
                <option value="currency">Currency</option>
                <option value="environment">Environment</option>
                <option value="document">Document</option>
              </select>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Status</th>
                <th className="py-3.5 px-4">Inspection Title & Summary</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Date / Time</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="font-semibold text-slate-400">No inspection records found</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Start an inspection in the Live Scanner to see visual intelligence logs.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => {
                  const hasWarning =
                    item.anomaly_warning &&
                    item.anomaly_warning.trim().toLowerCase() !== 'none' &&
                    !item.anomaly_warning.trim().toLowerCase().startsWith('none');

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedInspectionModal(item)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-4 px-4 sm:px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            hasWarning
                              ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                              : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              hasWarning ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                          />
                          {hasWarning ? 'Anomaly' : 'Verified'}
                        </span>
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <p className="font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.summary}
                        </p>
                      </td>

                      <td className="py-4 px-4 font-mono uppercase text-slate-300">
                        {item.mode}
                      </td>

                      <td className="py-4 px-4 font-mono font-semibold text-cyan-400">
                        {Math.round((item.confidence_score || 0.95) * 100)}%
                      </td>

                      <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Just now'}
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => playVoice(item.spoken_script, e)}
                            title="Play Voice Readout"
                            aria-label="Play Voice Readout"
                            className="p-1.5 rounded-lg bg-cyan-950/60 text-cyan-400 hover:bg-cyan-900 border border-cyan-800/60 transition-colors"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedInspectionModal(item)}
                            title="View Full Inspection Report"
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Inspecting Past Scan */}
      {selectedInspectionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedInspectionModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <ResultCard inspection={selectedInspectionModal} autoPlayAudio={false} />
          </div>
        </div>
      )}
    </div>
  );
}
