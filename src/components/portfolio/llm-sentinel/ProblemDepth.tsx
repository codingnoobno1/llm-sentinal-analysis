"use client";

import React from "react";
import { motion } from "framer-motion";
import { XCircle, CheckCircle2, ArrowRight, ShieldAlert } from "lucide-react";

export default function ProblemDepth() {
  return (
    <section id="problem" className="py-24 bg-[#050505] px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">The Blind Spot in AI Development</h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            The real issue isn't catastrophic forgetting—it's the complete lack of detection mechanisms during the fine-tuning process.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Current Workflow */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 relative overflow-hidden group"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white">Current Blind Workflow</h3>
            </div>

            <div className="space-y-6">
              <WorkflowStep status="completed" label="Fine-tune model" />
              <WorkflowStep status="completed" label="Validate only target domain" />
              <WorkflowStep status="danger" label="Deploy blindly" note="Missing: Cross-domain regression testing" />
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
              <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-4">Impact Profile</h4>
              <ul className="space-y-3">
                <ImpactItem text="Failures appear in production" />
                <ImpactItem text="Unsafe or unreliable outputs" />
                <ImpactItem text="Loss of trust in AI systems" />
              </ul>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.div>

          {/* Sentinel Workflow */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-3xl bg-blue-600/5 border border-blue-500/20 relative overflow-hidden group"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white">Sentinel-Enabled Workflow</h3>
            </div>

            <div className="space-y-6">
              <WorkflowStep status="completed" label="Fine-tune model" />
              <WorkflowStep status="sentinel" label="Sentinel Regression Audit" note="Full cross-domain capability check" />
              <WorkflowStep status="success" label="Safe Deployment" note="Validated stability & performance" />
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4">The Solution Outcome</h4>
              <ul className="space-y-3">
                <OutcomeItem text="Zero production regressions" />
                <OutcomeItem text="Verified safety constraints" />
                <OutcomeItem text="Measurable confidence scores" />
              </ul>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function WorkflowStep({ label, status, note }: { label: string, status: "completed" | "danger" | "success" | "sentinel", note?: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          status === "completed" ? "bg-zinc-700" : 
          status === "danger" ? "bg-red-500/20 border border-red-500" :
          status === "sentinel" ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]" :
          "bg-emerald-500"
        }`}>
          {status === "completed" && <div className="w-2 h-2 rounded-full bg-zinc-400" />}
          {status === "danger" && <XCircle className="w-5 h-5 text-red-500" />}
          {status === "sentinel" && <ShieldAlert className="w-5 h-5 text-white" />}
          {status === "success" && <CheckCircle2 className="w-5 h-5 text-white" />}
        </div>
        <div className="w-[2px] h-full bg-zinc-800 m-1" />
      </div>
      <div>
        <p className={`font-semibold ${status === "danger" ? "text-red-400" : status === "sentinel" ? "text-blue-400" : "text-zinc-300"}`}>{label}</p>
        {note && <p className="text-xs text-zinc-500 mt-1">{note}</p>}
      </div>
    </div>
  );
}

function ImpactItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm text-zinc-400">
      <div className="w-1.5 h-1.5 rounded-full bg-red-900" />
      {text}
    </li>
  );
}

function OutcomeItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm text-blue-200/70">
      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
      {text}
    </li>
  );
}
