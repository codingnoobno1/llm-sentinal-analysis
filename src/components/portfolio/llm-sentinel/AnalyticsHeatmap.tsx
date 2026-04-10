"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calculator, 
  Code, 
  Brain, 
  Globe, 
  ListChecks, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown,
  Info,
  Sigma
} from "lucide-react";

interface Metrics {
  arithmetic: number;
  code: number;
  logic: number;
  general: number;
  instruction: number;
  safety: number;
}

interface ModelData {
  name: string;
  type: "Base" | "Fine-tuned";
  scores: Metrics;
}

const comparisonData: ModelData[] = [
  {
    name: "Sentinel-7B-v1",
    type: "Base",
    scores: { arithmetic: 88, code: 74, logic: 82, general: 91, instruction: 78, safety: 85 }
  },
  {
    name: "Sentinel-7B-v1",
    type: "Fine-tuned",
    scores: { arithmetic: 76, code: 89, logic: 74, general: 88, instruction: 94, safety: 82 }
  },
  {
    name: "Audit-Instruct-13B",
    type: "Base",
    scores: { arithmetic: 92, code: 82, logic: 88, general: 94, instruction: 81, safety: 89 }
  },
  {
    name: "Audit-Instruct-13B",
    type: "Fine-tuned",
    scores: { arithmetic: 81, code: 95, logic: 79, general: 90, instruction: 97, safety: 86 }
  }
];

const categories = [
  { id: 'arithmetic', label: 'Arithmetic', icon: <Calculator className="w-3 h-3" /> },
  { id: 'code', label: 'Code Gen', icon: <Code className="w-3 h-3" /> },
  { id: 'logic', label: 'Logic', icon: <Brain className="w-3 h-3" /> },
  { id: 'general', label: 'General', icon: <Globe className="w-3 h-3" /> },
  { id: 'instruction', label: 'Instruction', icon: <ListChecks className="w-3 h-3" /> },
  { id: 'safety', label: 'Safety', icon: <ShieldCheck className="w-3 h-3" /> }
];

export default function AnalyticsHeatmap() {
  const [hoveredCell, setHoveredCell] = useState<{ row: number, col: string } | null>(null);

  const getColor = (score: number) => {
    if (score >= 90) return "bg-indigo-blue";
    if (score >= 80) return "bg-indigo-blue/80";
    if (score >= 75) return "bg-indigo-blue/40";
    if (score >= 70) return "bg-orange-red/40";
    return "bg-orange-red";
  };

  return (
    <section className="py-32 bg-white px-8 border-t border-charcoal/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-red mb-6">Cross-Model Comparison</h2>
            <h3 className="text-3xl font-black text-charcoal mb-8 tracking-tight">Regression Heatmap</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-10">
              Visualizing the <span className="text-charcoal font-bold italic">Safety-Performance Tradeoff</span> across 6 dimensions. 
              Observe how domain specialization (Fine-tuning) impacts generalized reasoning.
            </p>

            <div className="p-6 bg-zinc-50 border border-charcoal/5 rounded-sm">
              <div className="flex items-center gap-3 mb-6">
                <Sigma className="w-4 h-4 text-indigo-blue" />
                <h4 className="text-[10px] font-black text-charcoal uppercase tracking-widest">Audit Formula</h4>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white border border-charcoal/5 font-mono text-xs">
                  <span className="text-zinc-400">Score(</span>
                  <span className="text-orange-red">FT</span>
                  <span className="text-zinc-400">) = Σ(</span>
                  <span className="text-indigo-blue">α</span>
                  <span className="text-zinc-400"> • </span>
                  <span className="text-charcoal">E<sub>k</sub></span>
                  <span className="text-zinc-400">) - </span>
                  <span className="text-orange-red">R<sub>forget</sub></span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed font-bold uppercase">
                  Regression is quantified as the negative delta between base cross-entropy and specialization bias.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Header */}
                <div className="grid grid-cols-[180px_repeat(6,1fr)] gap-2 mb-4">
                  <div />
                  {categories.map(cat => (
                    <div key={cat.id} className="text-center">
                      <div className="flex justify-center text-charcoal mb-2">{cat.icon}</div>
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{cat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Rows */}
                <div className="space-y-2">
                  {comparisonData.map((model, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-[180px_repeat(6,1fr)] gap-2 items-center">
                      <div className="pr-4 text-right">
                        <div className="text-[11px] font-black text-charcoal leading-tight uppercase tabular-nums">{model.name}</div>
                        <div className={`text-[9px] font-bold uppercase ${model.type === 'Base' ? 'text-zinc-400' : 'text-orange-red'}`}>{model.type}</div>
                      </div>
                      
                      {categories.map(cat => {
                        const score = (model.scores as any)[cat.id];
                        return (
                          <motion.div
                            key={cat.id}
                            onHoverStart={() => setHoveredCell({ row: rowIndex, col: cat.id })}
                            onHoverEnd={() => setHoveredCell(null)}
                            className={`h-14 flex items-center justify-center relative group cursor-crosshair border border-charcoal/5 ${getColor(score)} transition-all`}
                          >
                            <span className="text-[11px] font-black text-white mix-blend-difference tabular-nums">
                              {score}
                            </span>
                            
                            {/* Hover Proof Overlay */}
                            {hoveredCell?.row === rowIndex && hoveredCell?.col === cat.id && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute -top-12 left-0 right-0 z-20 bg-charcoal p-2 text-[8px] text-white font-mono pointer-events-none border border-white/20 whitespace-nowrap"
                              >
                                {cat.label} Proof: EM={score}%
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="mt-12 flex items-center justify-between border-t border-charcoal/5 pt-6">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-blue" />
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Optimized (90+)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-blue/40" />
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Baseline (75-90)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-red" />
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Degradation (&lt;75)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Info className="w-3 h-3" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Interactive Audit Log</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
