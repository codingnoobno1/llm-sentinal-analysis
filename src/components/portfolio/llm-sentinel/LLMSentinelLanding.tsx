"use client";

import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import ProblemDepth from "./ProblemDepth";
import Solution from "./Solution";
import Architecture from "./Architecture";
import Scoring from "./Scoring";
import ValueProp from "./ValueProp";
import EvalDashboard from "./EvalDashboard";

export default function LLMSentinelLanding() {
  return (
    <div className="bg-black min-h-screen selection:bg-blue-500/30 selection:text-blue-200">
      <Navbar />
      <main>
        <Hero />
        <div id="problem-anchor">
          <ProblemDepth />
        </div>
        <Solution />
        <EvalDashboard />
        <Architecture />
        <Scoring />
        <ValueProp />
      </main>
      
      <footer className="py-12 border-t border-white/5 bg-black px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white">
              Sentinel <span className="text-blue-500 font-normal">LLM</span>
            </span>
          </div>
          <div className="text-zinc-500 text-sm">
            © 2026 Regression Sentinel Platform. Built for the era of specialized AI.
          </div>
          <div className="flex gap-6 text-zinc-400 text-sm">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">API Reference</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
