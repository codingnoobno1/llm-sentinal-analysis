"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calculator, AlertCircle, CheckCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function Scoring() {
  return (
    <section id="scoring" className="py-24 bg-charcoal px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Deterministic Scoring</h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            Eliminating subjectivity with domain-specific, execution-based validation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Formula Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-orange-red/5 border border-orange-red/20 relative"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Calculator className="w-32 h-32 text-orange-red" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="text-orange-red italic text-4xl font-serif">Δ</span> The Delta Formula
            </h3>
            
            <div className="bg-charcoal p-6 rounded-2xl border border-white/5 mb-8">
              <code className="text-2xl text-white font-mono">Δ = Fine-tuned – Base</code>
            </div>

            <div className="space-y-4">
              <Threshold 
                range="Δ < -10" 
                label="Regression" 
                color="text-orange-red" 
                bg="bg-orange-red/10"
                icon={<TrendingDown className="w-4 h-4" />}
              />
              <Threshold 
                range="-10 ≤ Δ ≤ +5" 
                label="Stable" 
                color="text-zinc-400" 
                bg="bg-white/5"
                icon={<Minus className="w-4 h-4" />}
              />
              <Threshold 
                range="Δ > +5" 
                label="Improved" 
                color="text-white" 
                bg="bg-white/10"
                icon={<TrendingUp className="w-4 h-4" />}
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
