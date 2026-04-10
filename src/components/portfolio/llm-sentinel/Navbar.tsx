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
      className="fixed top-0 left-0 right-0 z-50 flex flex-col"
    >
      {/* Top Branding Bar */}
      <div className="bg-charcoal/5 backdrop-blur-md border-b border-charcoal/5 px-8 py-1.5 flex justify-end items-center gap-2 group cursor-default">
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-600 transition-colors">
          Strategic infrastructure by
        </span>
        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-all">
          <span className="text-[9px] font-black tracking-tighter text-charcoal">MITR</span>
          <Image 
            src="/MITR Tech Logo Design.png" 
            alt="MITR Logo" 
            width={40} 
            height={16} 
            className="h-3 w-auto grayscale group-hover:grayscale-0 transition-all"
          />
        </div>
      </div>

      {/* Main Product Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white/95 backdrop-blur-xl border-b border-charcoal/5 shadow-sm">
        <div className="flex items-center">
          {/* Product Logo - Enlarged and Primed for Clarity */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <Image 
              src="/llmfinetune.png" 
              alt="LLM Fine-tune Logo" 
              width={220} 
              height={55} 
              className="h-11 w-auto object-contain"
              priority
              quality={100}
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          <a href="#problem" className="hover:text-charcoal transition-colors">Forensics</a>
          <a href="#solution" className="hover:text-charcoal transition-colors">Methodology</a>
          <a href="#architecture" className="hover:text-charcoal transition-colors">Infrastructure</a>
          <a href="#scoring" className="hover:text-charcoal transition-colors">Quantification</a>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/audit"
            className="hidden lg:block px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#2e3192] border border-[#2e3192]/20 hover:bg-[#2e3192]/5 transition-all text-center"
          >
            Fine tune score check your model
          </Link>
          <button className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white bg-orange-red hover:bg-orange-600 transition-all">
            Request Demo
          </button>
          <button className="p-2 md:hidden text-zinc-400">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
