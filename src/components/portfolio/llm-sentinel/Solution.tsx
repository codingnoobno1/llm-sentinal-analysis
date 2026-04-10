"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, Code, Calculator, Boxes, ArrowRightLeft, Search } from "lucide-react";

const capabilities = [
  {
    icon: <Calculator className="w-6 h-6" />,
    title: "Arithmetic",
    desc: "Exact match validation for mathematical precision across complex operations."
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Code Generation",
    desc: "Execution-based testing to ensure syntactical and logical integrity of code."
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Logical Reasoning",
    desc: "Structured validation of non-linear thinking and consistent deduction."
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "Instruction Follow",
    desc: "Constraint-based scoring for strict adherence to complex system prompts."
  }
];

export default function Solution() {
  return (
    <section id="solution" className="py-24 bg-gradient-to-b from-[#050505] to-[#0a0a0a] px-4 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              LLM <span className="text-blue-500">Regression Sentinel</span>
            </h2>
            <p className="text-zinc-400 text-lg mb-12">
              A specialized platform designed to compare base vs. fine-tuned models, evaluating performance across vital logical and technical domains to ensure zero capability loss.
            </p>

            <div className="space-y-6">
              <FeatureItem title="Capability Comparison" desc="Direct side-by-side analysis of model outputs." />
              <FeatureItem title="Regression Detection" desc="Automated identification of performance deltas." />
              <FeatureItem title="Heatmap Visualization" desc="Clear, visual reports of capability changes." />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-zinc-900 border border-white/5 hover:border-blue-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {cap.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{cap.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
      </div>
      <div>
        <h4 className="text-white font-semibold">{title}</h4>
        <p className="text-sm text-zinc-500">{desc}</p>
      </div>
    </div>
  );
}
