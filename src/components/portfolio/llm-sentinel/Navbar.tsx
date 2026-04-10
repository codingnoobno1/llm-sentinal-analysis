"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex flex-col shadow-xl"
    >
      {/* Tier 1: Professional Utility Bar (MITR) */}
      <div className="bg-charcoal px-8 py-2 flex justify-between items-center text-white/50">
        <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.3em]">
          <span>Institutional Grade</span>
          <div className="w-1 h-1 bg-orange-red rounded-full" />
          <span>Verified Infrastructure</span>
        </div>
        <div className="flex items-center gap-2 group cursor-pointer">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] group-hover:text-white transition-colors">
            Powered by Modular Intelligent Tech Resources
          </span>
          <Image 
            src="/MITR Tech Logo Design.png" 
            alt="MITR Logo" 
            width={30} 
            height={12} 
            className="h-3 w-auto opacity-50 group-hover:opacity-100 transition-all brightness-0 invert"
          />
        </div>
      </div>

      {/* Tier 2: The Main Event - Massive Product Banner */}
      <div className="bg-white px-8 py-8 flex items-center justify-center border-b border-charcoal/5">
        <Link href="/" className="flex items-center hover:scale-[1.02] transition-transform duration-300">
          <Image 
            src="/llmfinetune.png" 
            alt="LLM Fine-tune Logo" 
            width={400} 
            height={100} 
            className="h-20 md:h-24 w-auto object-contain"
            priority
            quality={100}
          />
        </Link>
      </div>

      {/* Tier 3: Action & Navigation Bar */}
      <nav className="flex items-center justify-between px-8 py-3 bg-white/95 backdrop-blur-xl">
        <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
          <a href="#problem" className="hover:text-orange-red transition-colors relative group">
            Forensics
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-red group-hover:w-full transition-all" />
          </a>
          <a href="#solution" className="hover:text-orange-red transition-colors relative group">
            Methodology
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-red group-hover:w-full transition-all" />
          </a>
          <a href="#architecture" className="hover:text-orange-red transition-colors relative group">
            Infrastructure
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-red group-hover:w-full transition-all" />
          </a>
          <a href="#scoring" className="hover:text-orange-red transition-colors relative group">
            Quantification
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-red group-hover:w-full transition-all" />
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/audit"
            className="hidden lg:block px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#2e3192] border-2 border-[#2e3192]/20 hover:border-[#2e3192] hover:bg-[#2e3192]/5 transition-all"
          >
            Launch Sentinel Audit
          </Link>
          <button className="px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-orange-red hover:bg-orange-600 shadow-lg shadow-orange-red/20 transition-all">
            Contact Sales
          </button>
          <button className="p-2 md:hidden text-zinc-400">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
