"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calculator, AlertCircle, CheckCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function Scoring() {
  return (
    <section id="scoring" className="py-32 bg-charcoal border-t border-white/5 px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-24">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-blue mb-6">Quantification Logic</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-10 tracking-tight">Deterministic Forensics</h3>
          <p className="text-zinc-500 text-lg leading-relaxed">
            Eliminate subjectivity. Sentinel uses domain-specific, execution-based validation to ensure model outputs adhere to institutional benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          {/* Formula Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 border border-white/5 bg-white/[0.02] relative"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Calculator className="w-32 h-32 text-indigo-blue" />
            </div>
            
            <h3 className="text-sm font-bold text-white mb-10 uppercase tracking-widest flex items-center gap-3">
              The Delta Formula <span className="text-orange-red font-serif italic text-2xl">Δ</span>
            </h3>
            
            <div className="bg-charcoal p-8 border border-white/10 mb-12">
              <code className="text-3xl text-white font-mono tracking-tighter">Δ = F(m) – B(m)</code>
              <p className="mt-4 text-[10px] text-zinc-600 uppercase tracking-widest">Where F is fine-tuned and B is base model performance.</p>
            </div>

            <div className="space-y-px bg-white/5 border border-white/5">
              <Threshold 
                range="Δ < -10.0" 
                label="CRITICAL REGRESSION" 
                color="text-orange-red" 
                bg="bg-charcoal"
                icon={<TrendingDown className="w-3 h-3" />}
              />
              <Threshold 
                range="-10.0 ≤ Δ ≤ +5.0" 
                label="STABLE VARIANCE" 
                color="text-zinc-500" 
                bg="bg-charcoal"
                icon={<Minus className="w-3 h-3" />}
              />
              <Threshold 
                range="Δ > +5.0" 
                label="VERIFIED IMPROVEMENT" 
                color="text-white" 
                bg="bg-charcoal"
                icon={<TrendingUp className="w-3 h-3" />}
              />
            </div>
          </motion.div>

          {/* Metrics List */}
          <div className="space-y-6">
            <MetricItem 
              title="Arithmetic" 
              metric="Exact Match" 
              desc="Mathematical operations must yield identical results across base and variant."
            />
            <MetricItem 
              title="Code" 
              metric="Execution-based" 
              desc="Generated code is unit-tested in a sandbox to verify functional parity."
            />
            <MetricItem 
              title="Logic" 
              metric="Structured Validation" 
              desc="Deductive reasoning steps are analyzed for consistency and valid conclusions."
            />
            <MetricItem 
              title="Instruction" 
              metric="Constraint-based" 
              desc="Scoring the model's ability to respect negative constraints and formatting rules."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Threshold({ range, label, color, bg, icon }: { range: string, label: string, color: string, bg: string, icon: React.ReactNode }) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl ${bg} border border-white/5`}>
      <span className="text-white font-mono font-bold">{range}</span>
      <div className={`flex items-center gap-2 font-bold uppercase tracking-widest text-xs ${color}`}>
        {icon}
        {label}
      </div>
    </div>
  );
}

function MetricItem({ title, metric, desc }: { title: string, metric: string, desc: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-2xl bg-zinc-900 border border-white/5 hover:border-white/10 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-white font-bold">{title}</h4>
        <span className="px-2 py-1 rounded-md bg-zinc-800 text-[10px] text-zinc-400 uppercase font-black">{metric}</span>
      </div>
      <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
    </motion.div>
  );
}
