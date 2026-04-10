"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Zap, BarChart3, ArrowRight } from "lucide-react";

export default function ValueProp() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#050505] to-[#000] px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="inline-flex p-3 rounded-2xl bg-blue-600/10 text-blue-500 mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            What gets measured, <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">gets fixed.</span>
          </h2>
          <p className="text-zinc-400 text-xl leading-relaxed">
            Stop deploying blind. Get the measurable comparison you need to improve the reliability of your fine-tuned models.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <ValueCard 
            icon={<Zap className="w-5 h-5" />}
            title="Pre-deploy Detection"
            desc="Identify hidden failures before they reach production."
          />
          <ValueCard 
            icon={<BarChart3 className="w-5 h-5" />}
            title="Measurable Proof"
            desc="Quantifiable data to justify fine-tuning decisions."
          />
          <ValueCard 
            icon={<CheckCircle2 className="w-5 h-5" />}
            title="Reliability First"
            desc="Ensure your specialization doesn't compromise core logic."
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <button className="px-12 py-5 bg-white text-black font-black text-lg rounded-2xl hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] group flex items-center gap-3 mx-auto">
            Audit Your Model Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-8 text-zinc-600 text-sm font-medium">
            Join 50+ AI teams ensuring model stability.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-3xl bg-zinc-900 border border-white/5 text-left">
      <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 mb-6">
        {icon}
      </div>
      <h4 className="text-white font-bold mb-3">{title}</h4>
      <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  );
}
