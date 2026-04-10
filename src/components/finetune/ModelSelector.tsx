"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, Globe, Download, Star, Loader2, CheckCircle2, ChevronDown, Activity, TestTube, BarChart3, Settings2, X, Info, Gauge, Play, Terminal, HardDrive, Shield, AlertTriangle, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BACKEND_URL, SMALL_MODELS } from "@/src/lib/apiConfig";
import Link from "next/link";

interface HFModel {
  id: string;
  author: string | null;
  downloads: number;
  likes: number;
  lastModified: string;
  tags: string[];
  pipeline_tag: string | null;
  isPrivate: boolean;
}

interface TestMetrics {
  accuracy: number;
  avg_latency_ms: number;
  total_duration_s: number;
  throughput_qps: number;
  success_rate: number;
}

interface TestTrial {
  prompt_id: string;
  prompt_text: string;
  response: string;
  latency: number;
  score: number;
  correct: number;
  status: string;
}

interface TestResult {
  model_id: string;
  sample_count: number;
  metrics: TestMetrics;
  trials: TestTrial[];
}

export default function ModelSelector() {
  const [query, setQuery] = useState("");
  const [models, setModels] = useState<HFModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<HFModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  // Local Models & Progress State
  const [localModels, setLocalModels] = useState<string[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Scalability Test State (Streaming Enabled)
  const [showTest, setShowTest] = useState(false);
  const [testScale, setTestScale] = useState(1);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [liveInjectionId, setLiveInjectionId] = useState<string | null>(null);
  const trailEndRef = useRef<HTMLDivElement>(null);

  const fetchLocalModels = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/models/local`, {
        headers: { "ngrok-skip-browser-warning": "69420" }
      });
      if (response.ok) {
        const data = await response.json();
        setLocalModels(data.local_models || []);
      }
    } catch (err) {
      console.error("Failed to fetch local models list");
    }
  }, []);

  const fetchDownloadProgress = useCallback(async (modelId: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/models/progress/${encodeURIComponent(modelId)}`, {
        headers: { "ngrok-skip-browser-warning": "69420" }
      });
      if (response.ok) {
        const data = await response.json();
        setDownloadProgress(data.progress || 0);
        
        if (data.progress >= 100) {
          setIsDownloading(false);
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          fetchLocalModels();
        } else if (data.progress === -1) {
          setIsDownloading(false);
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setError("Auto-Download Failed: High latency or source server rejection.");
        }
      }
    } catch (err) {
      console.error("Progress polling failed");
    }
  }, [fetchLocalModels]);

  useEffect(() => {
    fetchLocalModels();
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [fetchLocalModels]);

  const searchModels = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setModels([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/hf/search?query=${encodeURIComponent(searchQuery)}&limit=9`, {
        headers: { "ngrok-skip-browser-warning": "69420" }
      });
      if (!response.ok) throw new Error("Failed to fetch models");
      const data = await response.json();
      setModels(data);
    } catch (err: any) {
      setError(`Forensic Error: ${err.name === 'TypeError' ? 'Network Failure' : err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDownload = async (modelId: string) => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setError(null);
    
    try {
      await fetch(`${BACKEND_URL}/api/models/download?model_id=${encodeURIComponent(modelId)}`, {
        method: "POST",
        headers: { "ngrok-skip-browser-warning": "69420" }
      });
      
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = setInterval(() => fetchDownloadProgress(modelId), 2000);
      
    } catch (err) {
      setError("Failed to trigger initialization sequence.");
      setIsDownloading(false);
    }
  };

  const selectModelById = async (modelId: string) => {
    setShowDropdown(false);
    setIsLoading(true);
    setError(null);
    setDownloadProgress(0);

    try {
      const response = await fetch(`${BACKEND_URL}/api/hf/model/${encodeURIComponent(modelId)}`, {
        headers: { "ngrok-skip-browser-warning": "69420" }
      });
      if (!response.ok) throw new Error("Failed to fetch model details");
      const data = await response.json();
      const modelDetail = {
        id: data.id || data.modelId,
        author: data.author,
        downloads: data.downloads || 0,
        likes: data.likes || 0,
        lastModified: data.lastModified,
        tags: data.tags || [],
        pipeline_tag: data.pipeline_tag,
        isPrivate: data.private || false
      };
      
      setSelectedModel(modelDetail);
      setModels([]);
      setQuery("");
      setShowAnalysis(false);
      setShowConfig(false);
      setShowTest(false);
      setTestResult(null);

      if (!localModels.includes(modelDetail.id)) {
          const isPredefined = SMALL_MODELS.some(m => m.id === modelDetail.id);
          if (isPredefined) {
             handleDownload(modelDetail.id);
          }
      }

    } catch (err: any) {
      setError(`Failed to initialize model core: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const runScalabilityTest = async () => {
    if (!selectedModel) return;
    setIsTesting(true);
    setError(null);
    
    // Initialize empty result structure for live updates
    setTestResult({
      model_id: selectedModel.id,
      sample_count: testScale,
      metrics: { accuracy: 0, avg_latency_ms: 0, total_duration_s: 0, throughput_qps: 0, success_rate: 0 },
      trials: []
    });

    try {
      const response = await fetch(`${BACKEND_URL}/api/testing/scalability?model_id=${encodeURIComponent(selectedModel.id)}&sample_count=${testScale}`, {
        method: "POST",
        headers: { "ngrok-skip-browser-warning": "69420" }
      });

      if (!response.body) throw new Error("No streaming body received");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const chunk = JSON.parse(line);
            if (chunk.type === "trial") {
              setLiveInjectionId(chunk.data.prompt_id);
              setTestResult(prev => {
                if (!prev) return prev;
                const newTrials = [...prev.trials, chunk.data];
                // Progressive metrics
                const successful = newTrials.filter(t => t.status === "success");
                const correct = successful.filter(t => t.correct === 1);
                const avgLat = successful.length > 0 ? successful.reduce((acc, t) => acc + t.latency, 0) / successful.length : 0;
                
                return {
                  ...prev,
                  metrics: {
                    ...prev.metrics,
                    accuracy: successful.length > 0 ? Math.round((correct.length / successful.length) * 100) : 0,
                    avg_latency_ms: Math.round(avgLat * 1000),
                    success_rate: Math.round((successful.length / newTrials.length) * 100)
                  },
                  trials: newTrials
                };
              });
            } else if (chunk.type === "final") {
              setTestResult(prev => prev ? { ...prev, metrics: chunk.metrics } : prev);
              setLiveInjectionId(null);
            }
          } catch (e) {
            console.error("Chunk parse error:", e);
          }
        }
      }
    } catch (err: any) {
      setError(`Live Stream Failure: ${err.message}`);
    } finally {
      setIsTesting(false);
      setLiveInjectionId(null);
    }
  };

  useEffect(() => {
    if (trailEndRef.current) {
        trailEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [testResult?.trials]);

  const isModelLocal = (id: string) => localModels.includes(id);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-12 font-sans">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-indigo-blue transition-colors" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Hugging Face models..."
            className="block w-full pl-12 pr-4 py-4 bg-white border border-charcoal/10 rounded-none text-charcoal focus:ring-0 focus:border-indigo-blue transition-all placeholder:text-zinc-400 text-sm font-medium uppercase tracking-wider"
          />
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="h-full px-6 py-4 bg-charcoal text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-indigo-blue transition-all"
          >
            Small Models
            <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-72 bg-white border border-charcoal/10 shadow-2xl z-50 p-2"
              >
                {SMALL_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => selectModelById(m.id)}
                    className="w-full text-left p-3 hover:bg-zinc-50 flex flex-col gap-1 group transition-colors"
                  >
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-charcoal group-hover:text-indigo-blue uppercase tracking-widest">{m.label}</span>
                       {isModelLocal(m.id) && <HardDrive className="w-3 h-3 text-indigo-blue opacity-50" />}
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Dashboard */}
      <AnimatePresence mode="wait">
        {selectedModel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-4"
          >
            <div className={`p-8 border flex flex-col lg:flex-row gap-8 items-start justify-between shadow-sm relative overflow-hidden transition-colors ${isModelLocal(selectedModel.id) ? 'bg-zinc-50 border-charcoal/5' : 'bg-orange-50/10 border-orange-red/10'}`}>
               {/* Badges & Indicators */}
               <div className="absolute top-0 right-0 px-4 py-2 flex items-center gap-4">
                  {isDownloading && (
                     <div className="flex items-center gap-2 px-3 py-1 bg-orange-red/10 border border-orange-red/20 rounded-full">
                        <Loader2 className="w-3 h-3 text-orange-red animate-spin" />
                        <span className="text-[8px] font-black text-orange-red uppercase tracking-widest">Initialization: {Math.round(downloadProgress)}%</span>
                     </div>
                  )}
                  {isModelLocal(selectedModel.id) ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-blue/10 border border-indigo-blue/20 rounded-full">
                       <HardDrive className="w-3 h-3 text-indigo-blue" />
                       <span className="text-[8px] font-black text-indigo-blue uppercase tracking-widest">Forensic Local Workspace</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full">
                       <Globe className="w-3 h-3 text-zinc-400" />
                       <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Public API Cloud</span>
                    </div>
                  )}
               </div>

              <div className="flex gap-6 items-start">
                <div className={`p-4 ${isModelLocal(selectedModel.id) ? 'bg-indigo-blue/10' : 'bg-orange-red/10'}`}>
                  {isModelLocal(selectedModel.id) ? <Cpu className="w-8 h-8 text-indigo-blue" /> : <Globe className="w-8 h-8 text-orange-red" />}
                </div>
                <div>
                  <p className={`text-[10px] uppercase font-black tracking-[0.3em] mb-1 ${isModelLocal(selectedModel.id) ? 'text-indigo-blue' : 'text-orange-red'}`}>
                    Active Forensic Node
                  </p>
                  <h2 className="text-2xl font-bold tracking-tighter text-charcoal mb-4">{selectedModel.id}</h2>
                  <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                    <span className="flex items-center gap-1.5"><Download className="w-3 h-3"/> {selectedModel.downloads.toLocaleString()}</span>
                    <span className="flex items-center gap-1.5"><Globe className="w-3 h-3"/> {selectedModel.author || 'Open Source'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                <Link 
                  href={`/audit?model=${encodeURIComponent(selectedModel.id)}`}
                  className="px-6 py-4 bg-indigo-blue text-white text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:translate-y-[-2px] transition-all"
                >
                  <TestTube className="w-4 h-4" />
                  Audit
                </Link>
                <button 
                  onClick={() => { setShowTest(!showTest); setShowAnalysis(false); setShowConfig(false); }}
                  disabled={isDownloading}
                  className={`px-6 py-4 border text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${showTest ? 'bg-orange-red border-orange-red text-white' : 'bg-white border-charcoal/10 text-charcoal hover:bg-zinc-50'}`}
                >
                  <Gauge className="w-4 h-4" />
                  Live Monitor
                </button>
                {!isModelLocal(selectedModel.id) && (
                   <button 
                     onClick={() => handleDownload(selectedModel.id)}
                     disabled={isDownloading}
                     className="px-6 py-4 border border-charcoal/10 bg-white text-charcoal text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all disabled:opacity-50"
                   >
                     <Download className="w-4 h-4" />
                     Download
                   </button>
                )}
                <button 
                  onClick={() => { setShowConfig(!showConfig); setShowAnalysis(false); setShowTest(false); }}
                  className={`px-6 py-4 border text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${showConfig ? 'bg-charcoal border-charcoal text-white' : 'bg-white border-charcoal/10 text-charcoal hover:bg-zinc-50'}`}
                >
                  <Settings2 className="w-4 h-4" />
                  Config
                </button>
              </div>
            </div>

            {/* Live Streaming Test Panel */}
            <AnimatePresence>
              {showTest && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border border-orange-red/20 bg-white shadow-2xl"
                >
                   <div className="p-8 space-y-8">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-orange-red">Live Forensic Injection Monitor</h3>
                           {isTesting && (
                             <span className="flex items-center gap-2 text-[9px] font-bold text-orange-red animate-pulse">
                                <Terminal className="w-3 h-3" /> 
                                {liveInjectionId ? `Injecting Node: ${liveInjectionId}...` : 'Starting Sequence...'}
                             </span>
                           )}
                        </div>
                        <button onClick={() => setShowTest(false)}><X className="w-4 h-4 text-zinc-300 hover:text-charcoal" /></button>
                     </div>

                     <div className="flex flex-wrap gap-4 items-center bg-zinc-50 p-6 border-l-4 border-charcoal">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mr-4">Sample Density:</span>
                       {[1, 2, 4, 8, 16, 32].map(scale => (
                         <button
                           key={scale}
                           onClick={() => setTestScale(scale)}
                           disabled={isTesting}
                           className={`px-4 py-2 text-[10px] font-black border transition-all ${testScale === scale ? 'bg-orange-red border-orange-red text-white' : 'border-zinc-200 text-zinc-400 hover:border-orange-red/40'}`}
                         >
                           {scale}x
                         </button>
                       ))}
                       <button 
                         onClick={runScalabilityTest}
                         disabled={isTesting}
                         className="ml-auto px-8 py-4 bg-charcoal text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 disabled:opacity-50"
                       >
                         {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                         Initialize Showcase
                       </button>
                     </div>

                     {/* Live Progressive Metrics */}
                     {testResult && (
                       <div className="flex flex-col gap-6">
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="p-6 bg-zinc-50 rounded-sm space-y-2 border-b-2 border-indigo-blue">
                               <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Real-time Accuracy</p>
                               <p className="text-3xl font-bold text-charcoal">{testResult.metrics.accuracy}%</p>
                            </div>
                            <div className="p-6 bg-zinc-50 rounded-sm space-y-2 border-b-2 border-orange-red">
                               <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Avg Latency (ms)</p>
                               <p className="text-3xl font-bold text-charcoal">{testResult.metrics.avg_latency_ms}</p>
                            </div>
                            <div className="p-6 bg-zinc-50 rounded-sm space-y-2 border-b-2 border-charcoal">
                               <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Processed</p>
                               <p className="text-3xl font-bold text-charcoal">{testResult.trials.length} / {testScale}</p>
                            </div>
                            <div className="p-6 bg-zinc-50 rounded-sm space-y-2 border-b-2 border-green-600">
                               <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Success Rate</p>
                               <p className="text-3xl font-bold text-charcoal">{testResult.metrics.success_rate}%</p>
                            </div>
                         </div>

                         {/* Active Source Analysis Panel */}
                         {isTesting && liveInjectionId && testResult.trials.length > 0 && (
                           <motion.div 
                             initial={{ opacity: 0, scale: 0.98 }}
                             animate={{ opacity: 1, scale: 1 }}
                             className="p-8 bg-charcoal text-white rounded-none border-l-8 border-orange-red relative overflow-hidden"
                           >
                              <div className="absolute top-[-20%] right-[-10%] opacity-5">
                                 <Terminal className="w-64 h-64" />
                              </div>
                              <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
                                 <div>
                                    <span className="px-3 py-1 bg-orange-red text-[9px] font-black uppercase tracking-widest mb-4 inline-block">Active Forensic Source: {liveInjectionId}</span>
                                    <h5 className="text-xl font-bold tracking-tight mb-2">Analyzing Injected Node...</h5>
                                    <div className="flex flex-wrap gap-4">
                                       <div className="flex items-center gap-2">
                                          <Shield className="w-3 h-3 text-orange-red" />
                                          <span className="text-[10px] uppercase font-bold text-zinc-400">Domain: {testResult.trials[testResult.trials.length-1].metadata?.domain || 'General'}</span>
                                       </div>
                                       <div className="flex items-center gap-2">
                                          <Activity className="w-3 h-3 text-orange-red" />
                                          <span className="text-[10px] uppercase font-bold text-zinc-400">Complexity: {testResult.trials[testResult.trials.length-1].metadata?.difficulty || 'Medium'}</span>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="bg-white/5 p-4 border border-white/10 flex flex-col gap-2 min-w-[240px]">
                                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Target Generation Meta</p>
                                    <div className="flex justify-between items-center">
                                       <span className="text-[10px] text-zinc-300">Scoring Method:</span>
                                       <span className="text-[10px] font-bold text-orange-red uppercase">{testResult.trials[testResult.trials.length-1].metadata?.scoring_method}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                       <span className="text-[10px] text-zinc-300">Category:</span>
                                       <span className="text-[10px] font-bold text-indigo-blue uppercase">{testResult.trials[testResult.trials.length-1].metadata?.category}</span>
                                    </div>
                                 </div>
                              </div>
                           </motion.div>
                         )}
                       </div>
                     )}

                     {/* Live Generation Trail */}
                     {testResult && testResult.trials.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300">1-by-1 Forensic Injection Trail</h4>
                          <div className="max-h-[600px] overflow-y-auto space-y-6 pr-4 custom-scrollbar">
                            {testResult.trials.map((trial, idx) => (
                              <motion.div 
                                key={idx} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-8 border flex flex-col gap-6 relative transition-all ${trial.correct ? 'bg-white border-zinc-100 shadow-sm' : 'bg-orange-50/20 border-orange-red/20 shadow-md ring-1 ring-orange-red/10'}`}
                              >
                                 <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 bg-charcoal text-white flex items-center justify-center font-black text-xs">
                                          {idx + 1}
                                       </div>
                                       <div>
                                          <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Injection Node</p>
                                          <h6 className="text-xs font-bold text-charcoal">{trial.prompt_id}</h6>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                       <div className="text-right">
                                          <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Forensic Match</p>
                                          <span className={`text-[10px] font-black uppercase ${trial.correct ? 'text-green-600' : 'text-orange-red'}`}>
                                             {trial.correct ? 'Verified' : 'Regression'}
                                          </span>
                                       </div>
                                       <div className="h-8 w-[1px] bg-zinc-100" />
                                       <div className="text-right">
                                          <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Latency</p>
                                          <span className="text-[10px] font-mono font-bold text-charcoal">{Math.round(trial.latency * 1000)}ms</span>
                                       </div>
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                       <div>
                                          <p className="text-[8px] font-black text-indigo-blue uppercase tracking-widest mb-2 flex items-center gap-2">
                                             <Shield className="w-3 h-3" /> JSON Source Metadata
                                          </p>
                                          <div className="flex flex-wrap gap-2">
                                             <span className="px-2 py-1 bg-zinc-100 text-[8px] font-bold text-zinc-500 uppercase">{trial.metadata?.domain}</span>
                                             <span className="px-2 py-1 bg-zinc-100 text-[8px] font-bold text-zinc-500 uppercase">{trial.metadata?.category}</span>
                                             <span className="px-2 py-1 bg-zinc-100 text-[8px] font-bold text-zinc-500 uppercase">Difficulty: {trial.metadata?.difficulty}</span>
                                          </div>
                                       </div>
                                       <div>
                                          <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-2">Injected Forensic Prompt</p>
                                          <div className="p-4 bg-zinc-50 text-[11px] font-mono text-zinc-600 italic border-l-4 border-charcoal/10 leading-relaxed">
                                             {trial.prompt_text}
                                          </div>
                                       </div>
                                    </div>

                                    <div className="space-y-4">
                                       <div>
                                          <p className="text-[8px] font-black text-orange-red uppercase tracking-widest mb-2 flex items-center gap-2">
                                             <Activity className="w-3 h-3" /> Showcased Generation
                                          </p>
                                          <div className="p-4 bg-orange-red/[0.03] text-[11px] font-mono text-charcoal font-bold border-l-4 border-orange-red leading-relaxed min-h-[80px]">
                                             {trial.response}
                                          </div>
                                       </div>
                                       {trial.metadata?.keywords && (
                                          <div>
                                             <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-2">Ground Truth Keywords</p>
                                             <div className="flex flex-wrap gap-2">
                                                {trial.metadata.keywords.map((kw: string, kidx: number) => (
                                                   <span key={kidx} className="text-[9px] text-green-700 bg-green-50 px-2 py-1 rounded-sm border border-green-100">
                                                      {kw}
                                                   </span>
                                                ))}
                                             </div>
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              </motion.div>
                            ))}
                            <div ref={trailEndRef} />
                          </div>
                        </div>
                     )}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Layout for Search Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {models.map((model) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              onClick={() => selectModelById(model.id)}
              className={`group cursor-pointer p-6 border transition-all duration-300 relative ${selectedModel?.id === model.id ? 'border-orange-red bg-white ring-1 ring-orange-red shadow-lg' : 'border-zinc-100 bg-white hover:border-indigo-blue/30 hover:shadow-md'}`}
            >
              <div className="flex justify-between items-start mb-4 text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
                <span>{model.author || 'Forensic Hub'}</span>
                {isModelLocal(model.id) && <span className="text-indigo-blue/60 flex items-center gap-1 font-black"><HardDrive className="w-3 h-3" /> LOCAL</span>}
              </div>
              <h3 className="text-sm font-bold text-charcoal mb-1 truncate group-hover:text-indigo-blue transition-colors">{model.id.split('/').pop()}</h3>
              <p className="text-[8px] text-zinc-400 uppercase font-black tracking-widest mb-4 truncate italic">{model.id}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {error && (
        <div className="flex items-center gap-4 p-5 bg-orange-50 border border-orange-red/10 text-orange-red font-bold uppercase text-[10px] tracking-widest">
          <AlertTriangle className="w-5 h-5 text-orange-red" />
          {error}
        </div>
      )}
    </div>
  );
}
