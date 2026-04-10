"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, LayoutDashboard, Activity, Database, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3 bg-white border-b border-charcoal/5 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-indigo-blue rounded">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-charcoal uppercase tracking-wider">
          Sentinel <span className="text-orange-red font-light">Audit</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
        <a href="#problem" className="hover:text-charcoal transition-colors">Forensics</a>
        <a href="#solution" className="hover:text-charcoal transition-colors">Methodology</a>
        <a href="#architecture" className="hover:text-charcoal transition-colors">Infrastructure</a>
        <a href="#scoring" className="hover:text-charcoal transition-colors">Quantification</a>
      </div>

      <div className="flex items-center gap-4">
        <button className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white bg-orange-red hover:bg-orange-600 transition-all">
          Request Demo
        </button>
        <button className="p-2 md:hidden text-zinc-400">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </motion.nav>
  );
}
