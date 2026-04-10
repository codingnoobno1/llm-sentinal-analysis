"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Globe, Server, Database, Share2, ArrowRight } from "lucide-react";

export default function Architecture() {
  return (
    <section id="architecture" className="py-24 bg-[#0a0a0a] px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">System Architecture</h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            A stateless, fast evaluation pipeline powered by real-time model orchestration.
          </p>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-20">
          <ArchCard icon={<Globe />} title="Frontend" subtitle="React + Visualization" color="text-blue-400" />
          <ArchCard icon={<Server />} title="Backend" subtitle="FastAPI Orchestration" color="text-purple-400" />
          <ArchCard icon={<Cpu />} title="Eval Engine" subtitle="Prompt + Scoring" color="text-emerald-400" />
          <ArchCard icon={<Database />} title="Model API" subtitle="Hugging Face / Custom" color="text-amber-400" />
          <ArchCard icon={<Share2 />} title="Reg. Detector" subtitle="Delta Computation" color="text-red-400" />
        </div>

        {/* Data Flow */}
        <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 relative overflow-hidden">
          <h3 className="text-2xl font-bold text-white mb-12 text-center">Stateless Evaluation Data Flow</h3>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
            {/* Custom SVG Connector Line could go here, but using cards for simplicity */}
            <FlowStep count="1" title="Model IDs" desc="Input identifiers" />
            <Arrow />
            <FlowStep count="2" title="Dispatch" desc="Identical prompts" />
            <Arrow />
            <FlowStep count="3" title="Collect" desc="Sync responses" />
            <Arrow />
            <FlowStep count="4" title="Score" desc="Domain metrics" />
            <Arrow />
            <FlowStep count="5" title="Compute" desc="Delta calculation" />
          </div>

          <div className="mt-16 flex justify-center">
            <div className="px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-mono font-bold">
              Final Output: Capability Heatmap + Comparison
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArchCard({ icon, title, subtitle, color }: { icon: React.ReactNode, title: string, subtitle: string, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-6 rounded-2xl bg-zinc-900 border border-white/5 text-center flex flex-col items-center gap-4 transition-all"
    >
      <div className={`p-3 rounded-full bg-zinc-800 ${color}`}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
      </div>
      <div>
        <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
        <p className="text-[10px] text-zinc-500 leading-tight uppercase tracking-wider">{subtitle}</p>
      </div>
    </motion.div>
  );
}

function FlowStep({ count, title, desc }: { count: string, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0)] group-hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]">
        {count}
      </div>
      <h5 className="text-white font-bold text-sm mb-1">{title}</h5>
      <p className="text-xs text-zinc-500">{desc}</p>
    </div>
  );
}

function Arrow() {
  return <ArrowRight className="hidden md:block w-5 h-5 text-zinc-700 mx-2" />;
}
