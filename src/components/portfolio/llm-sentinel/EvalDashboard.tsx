"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ClipboardList, CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from "lucide-react";

const mockSuites = [
  { id: "arithmetic_v1", domain: "Arithmetic", count: 2 },
  { id: "code_v1", domain: "Code Generation", count: 5 },
  { id: "logic_v1", domain: "Logical Reasoning", count: 3 },
  { id: "instruction_v1", domain: "Instruction Following", count: 4 }
];

export default function EvalDashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<any>(null);

  const runEval = () => {
    setIsRunning(true);
    // Simulate API call to FastAPI backend
    setTimeout(() => {
      setReport({
        summary: { total: 14, regressions: 2, improvements: 3, status: "Warning" },
        cases: [
          { id: "math_01", domain: "Arithmetic", delta: 0, status: "stable" },
          { id: "logic_02", domain: "Logic", delta: -2, status: "regression" },
          { id: "code_05", domain: "Code", delta: 1, status: "improved" }
        ]
      });
      setIsRunning(false);
    }, 2000);
  };

  return (
    <section className="py-24 bg-charcoal px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Testing Phase</h2>
            <p className="text-zinc-500 text-lg">
              Manage your evaluation suites. Deploy the **Prometheus Orchestrator** to run fine-grained comparisons between model versions.
            </p>
          </div>
          <button 
            onClick={runEval}
            disabled={isRunning}
            className="flex items-center gap-2 px-8 py-4 bg-orange-red text-white font-bold rounded-2xl hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,69,0,0.3)]"
          >
            {isRunning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
            {isRunning ? "Evaluating..." : "Run Active Suites"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings / Suites */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-4">Active Test Suites</h3>
            {mockSuites.map((suite) => (
              <div key={suite.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center group hover:border-orange-red/30 transition-all">
                <div>
                  <h4 className="text-white font-bold text-sm">{suite.domain}</h4>
                  <p className="text-xs text-zinc-500">{suite.count} test cases loaded</p>
                </div>
                <ClipboardList className="w-5 h-5 text-zinc-700 group-hover:text-orange-red transition-colors" />
              </div>
            ))}
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2 min-h-[400px] rounded-3xl bg-indigo-blue/10 border border-white/5 p-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!report && !isRunning && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                >
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-6">
                    <ClipboardList className="w-8 h-8 text-zinc-500" />
                  </div>
                  <h4 className="text-white font-bold mb-2">Ready for Evaluation</h4>
                  <p className="text-zinc-500 text-sm max-w-xs">Select your suites and trigger the Prometheus testing phase to see results.</p>
                </motion.div>
              )}

              {isRunning && (
                <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="absolute inset-0 flex flex-col items-center justify-center text-center"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-orange-red/20 border-t-orange-red animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-orange-red font-bold font-serif">Π</span>
                    </div>
                  </div>
                  <p className="mt-8 text-orange-red font-mono text-sm animate-pulse">PROMETHEUS IS SCORING RESPONSES...</p>
                </motion.div>
              )}

              {report && !isRunning && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SummaryStat icon={<CheckCircle2 className="text-white" />} label="Improvements" value={report.summary.improvements} />
                    <SummaryStat icon={<AlertCircle className="text-orange-red" />} label="Regressions" value={report.summary.regressions} />
                    <SummaryStat icon={<RefreshCw className="text-orange-red/70" />} label="Comparison Status" value={report.summary.status} />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-zinc-400 text-xs font-black uppercase">Live Delta Feed</h4>
                    {report.cases.map((cs: any) => (
                      <div key={cs.id} className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/5">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-zinc-600">{cs.id}</span>
                          <span className="text-sm text-zinc-300">{cs.domain}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-xs font-bold font-mono px-2 py-1 rounded ${
                            cs.status === 'regression' ? 'bg-orange-red/10 text-orange-red' : 
                            cs.status === 'improved' ? 'bg-white/10 text-white' : 
                            'bg-zinc-800 text-zinc-400'
                          }`}>
                            Δ {cs.delta > 0 ? "+" : ""}{cs.delta}
                          </span>
                          <ArrowRight className="w-4 h-4 text-zinc-800" />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryStat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">{label}</span>
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  );
}
