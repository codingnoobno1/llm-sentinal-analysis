"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Zap, Brain, Terminal } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-charcoal pt-20 px-4">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-red/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-blue/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-red/10 border border-orange-red/20 text-orange-red text-xs font-semibold mb-6">
            <Zap className="w-3 h-3" />
            <span>The Hidden Cost of Fine-Tuning</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
            Detect <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-red to-white">Catastrophic Forgetting</span> Before It’s Too Late
          </h1>
          
          <p className="text-xl text-zinc-400 mb-8 max-w-xl">
            Fine-tuning improves specialization—but introduces hidden degradation. Sentinel LLM helps you quantify what you've lost while you gain.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-orange-red text-white font-bold rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2 shadow-[0_4px_20px_rgba(255,69,0,0.3)]">
              Start Evaluation
            </button>
            <button className="px-8 py-4 bg-white/5 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-all">
              View Case Studies
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="relative bg-indigo-blue/10 backdrop-blur-2xl p-8 rounded-3xl border border-white/5 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-red/50" />
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
                <div className="w-3 h-3 rounded-full bg-zinc-800" />
              </div>
              <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono font-bold">Regression Report v1.02</span>
            </div>

            <div className="space-y-6">
              <RegressionBar label="Arithmetic Accuracy" value={-12} color="text-orange-red" />
              <RegressionBar label="Code Generation" value={-8} color="text-orange-red/70" />
              <RegressionBar label="Logical Reasoning" value={-15} color="text-orange-red" />
              <RegressionBar label="Domain Specialization" value={+24} color="text-white" trend="up" />
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-orange-red/5 border border-orange-red/10">
                <AlertTriangle className="w-6 h-6 text-orange-red shrink-0" />
                <p className="text-sm text-zinc-300 italic">
                  Critical regression detected in core reasoning capabilities. Base model parity lost.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function RegressionBar({ label, value, color, trend = "down" }: { label: string, value: number, color: string, trend?: "up" | "down" }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-zinc-300 text-sm font-medium">{label}</span>
        <span className={`${color} text-sm font-mono font-bold`}>{value > 0 ? "+" : ""}{value}%</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full ${trend === "up" ? "bg-emerald-500" : "bg-red-500"}`}
          style={{ width: `${Math.abs(value) * 3}%`, maxWidth: "100%" }}
        />
      </div>
    </div>
  );
}
