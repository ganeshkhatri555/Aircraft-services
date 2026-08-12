import React from 'react';
import { ShieldCheck, AlertTriangle, FileText, Wrench } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-[#0f172a] border-t border-slate-800 text-slate-400 text-xs py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Mandate */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white">
              <Wrench className="w-3.5 h-3.5" />
            </div>
            AeroFix<span className="text-blue-400">MRO</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Integrated Aviation Maintenance, Diagnostics, & Parts Interchangeability Platform designed for MROs, Airlines, Engineers, and A&P Technicians.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full w-fit">
            <ShieldCheck className="w-3.5 h-3.5" /> ISO 9001 / AS9110 Certified Protocol
          </div>
        </div>

        {/* Quick Functional Modules */}
        <div>
          <h4 className="text-slate-200 font-bold text-xs uppercase tracking-wider mb-3">MRO Modules</h4>
          <ul className="space-y-2 text-[11px]">
            <li>
              <button onClick={() => setActiveTab('troubleshooting')} className="hover:text-blue-400 transition-colors">
                • Fault Isolation & Troubleshooting
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('parts')} className="hover:text-blue-400 transition-colors">
                • Parts Catalog & NSN/CAGE Lookup
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('compatibility')} className="hover:text-blue-400 transition-colors">
                • Interchangeability Engine
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('systems')} className="hover:text-blue-400 transition-colors">
                • ATA Chapter Systems Explorer
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('ai-assistant')} className="hover:text-blue-400 transition-colors">
                • Gemini 3.6 AI Aviation Specialist
              </button>
            </li>
          </ul>
        </div>

        {/* Fleet Support */}
        <div>
          <h4 className="text-slate-200 font-bold text-xs uppercase tracking-wider mb-3">Supported Fleet Types</h4>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li><strong className="text-slate-300">Boeing:</strong> 737 Classic/NG/MAX, 747, 757, 767, 777, 787</li>
            <li><strong className="text-slate-300">Airbus:</strong> A220, A300, A310, A320 family, A330, A340, A350, A380</li>
            <li><strong className="text-slate-300">Helicopters:</strong> Sikorsky S-92, Bell 412, Airbus H145, Leonardo AW139, Boeing CH-47</li>
          </ul>
        </div>

        {/* Regulatory Safety Warning */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-[11px] text-amber-200/90">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wider text-[10px]">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" /> Safety & Legal Disclaimer
          </div>
          <p className="leading-relaxed text-slate-300">
            AeroFix is an informational and decision-support software tool. It does NOT replace approved manufacturer Aircraft Maintenance Manuals (AMM), Illustrated Parts Catalogs (IPC), Fault Isolation Manuals (FIM), Airworthiness Directives (AD), or qualified licensed maintenance personnel.
          </p>
          <p className="text-[10px] text-slate-400 italic">
            Always verify parts, torque values, wiring diagrams, and procedures against current approved operator manuals prior to performing maintenance actions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <div>© 2026 AeroFix MRO Aviation Technologies. All Rights Reserved. Demo Data Prototype.</div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-400">
            <FileText className="w-3 h-3 text-blue-400" /> FAA FAR Part 145 / EASA Part 145 Support
          </span>
        </div>
      </div>
    </footer>
  );
};
