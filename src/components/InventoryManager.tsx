import React from 'react';
import { MOCK_TOOLS, MOCK_PARTS } from '../data/mockData';
import { Box, Wrench, ShieldCheck, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

export const InventoryManager: React.FC = () => {
  const lowStockParts = MOCK_PARTS.filter(p => p.stockQuantity <= 2 || p.status === 'Reorder Required');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <Box className="w-4 h-4" /> Calibrated Tool Crib & Inventory Management
          </div>
          <h2 className="text-xl font-black text-white mt-1">Specialized Tooling & Stock Room Control</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Monitor NIST/FAA calibrated test equipment, digital torque wrenches, hydraulic bleed rigs, and automatic reorder triggers for high-turnover parts.
          </p>
        </div>

        <span className="text-xs font-bold bg-teal-950 text-teal-300 border border-teal-800 px-3 py-1.5 rounded-xl">
          Station: SEA-TAC Line Hangar 4
        </span>
      </div>

      {/* Grid: Left Tool Crib, Right Low-Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tool Crib Inventory (Col Span 7) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Wrench className="w-4 h-4 text-teal-400" /> Calibrated Equipment & Tool Crib
            </h3>
            <span className="text-xs font-bold text-slate-400">{MOCK_TOOLS.length} Active Calibration Assets</span>
          </div>

          <div className="space-y-3">
            {MOCK_TOOLS.map(tool => (
              <div key={tool.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-100 text-sm">{tool.name}</div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      tool.calibrationStatus === 'Calibrated'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border-amber-800'
                    }`}
                  >
                    ● {tool.calibrationStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-400 pt-1">
                  <div>Serial #: <strong className="text-slate-200 font-mono">{tool.serialNumber}</strong></div>
                  <div>Bin: <strong className="text-cyan-300 font-mono">{tool.locationBin}</strong></div>
                  <div>Status: <strong className="text-slate-200">{tool.status}</strong></div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div>Calibration Due: <strong className="text-amber-300 font-mono">{tool.nextCalibrationDue}</strong></div>
                  <div>Cal Cert #: <span className="font-mono text-cyan-400">{tool.certNumber}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Low-Stock & Reorder Alerts (Col Span 5) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Low Stock & Reorder Triggers ({lowStockParts.length})
            </h3>
            <p className="text-[11px] text-slate-400">Parts below minimum safety threshold</p>
          </div>

          <div className="space-y-3">
            {lowStockParts.map(part => (
              <div key={part.partNumber} className="p-3.5 bg-amber-950/20 border border-amber-800/60 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-400">{part.partNumber}</span>
                  <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded font-bold uppercase">
                    Stock: {part.stockQuantity} Left
                  </span>
                </div>
                <div className="font-bold text-slate-200">{part.description}</div>
                <div className="text-[11px] text-slate-400">Bin: <span className="font-mono text-cyan-300">{part.locationBin}</span> | Mfr: {part.manufacturer}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
