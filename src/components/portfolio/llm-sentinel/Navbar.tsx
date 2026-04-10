"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, LayoutDashboard, Activity, Database, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-indigo-blue/40 backdrop-blur-md border-b border-white/5"
    >
      <div className="flex items-center gap-2">
        <div className="p-2 bg-orange-red rounded-lg shadow-[0_0_15px_rgba(255,69,0,0.4)]">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          Sentinel <span className="text-orange-red font-normal">LLM</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
        <a href="#problem" className="hover:text-white transition-colors">The Problem</a>
        <a href="#solution" className="hover:text-white transition-colors">Our Solution</a>
        <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
        <a href="#scoring" className="hover:text-white transition-colors">Scoring</a>
      </div>

      <div className="flex items-center gap-4">
        <button className="px-5 py-2 text-sm font-semibold text-white bg-orange-red rounded-full hover:bg-orange-600 transition-all shadow-[0_0_20px_rgba(255,69,0,0.3)]">
          Get Started
        </button>
        <button className="p-2 md:hidden text-zinc-400">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </motion.nav>
  );
}
