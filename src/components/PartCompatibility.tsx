import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_PARTS } from '../data/mockData';
import { Part } from '../types';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Search,
  ArrowRightLeft,
  FileText,
  Package,
  Layers,
  Wrench,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

export const PartCompatibility: React.FC = () => {
  const { comparedPartNumbers, removeComparePart, clearCompareParts } = useApp();

  const [partAQuery, setPartAQuery] = useState('65-46321-12'); // Default
  const [partBQuery, setPartBQuery] = useState('65-46321-15'); // Superseded variant

  const partA = MOCK_PARTS.find(p => p.partNumber.toLowerCase() === partAQuery.toLowerCase()) || MOCK_PARTS[0];
  const partB = MOCK_PARTS.find(p => p.partNumber.toLowerCase() === partBQuery.toLowerCase()) || MOCK_PARTS[1];

  // Determine Compatibility Matrix Status
  let compatibilityStatus: 'DIRECT_REPLACEMENT' | 'CONDITIONAL_REPLACEMENT' | 'NOT_INTERCHANGEABLE' = 'DIRECT_REPLACEMENT';
  let reasoning = '';
  let requiredModifications: string[] = [];

  if (partA.partNumber === partB.partNumber) {
    compatibilityStatus = 'DIRECT_REPLACEMENT';
    reasoning = 'Identical Part Number selected. 100% Form, Fit, and Function compatible.';
  } else if (partA.interchangeabilityType === 'direct_replacement' || partB.interchangeabilityType === 'direct_replacement') {
    compatibilityStatus = 'DIRECT_REPLACEMENT';
    reasoning = 'One-way/Two-way direct interchangeability approved by OEM Illustrated Parts Catalog (IPC). No airframe or wiring modification required.';
  } else if (partA.interchangeabilityType === 'conditional_sb' || partB.interchangeabilityType === 'conditional_sb') {
    compatibilityStatus = 'CONDITIONAL_REPLACEMENT';
    reasoning = 'Interchangeable only when Service Bulletin SB-B737-32-118 is applied or updated bracket P/N 3251-BRK-02 is installed.';
    requiredModifications = [
      'Install Mounting Adapter Bracket P/N 3251-BRK-02',
      'Verify wiring harness pinout per SB-B737-32-118',
      'Perform leak check & 3000 PSI pressure cycle test',
    ];
  } else {
    compatibilityStatus = 'NOT_INTERCHANGEABLE';
    reasoning = 'Incompatible mounting interface or hydraulic pressure rating mismatch. Do NOT mix on same airframe position.';
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ArrowRightLeft className="w-4 h-4" /> Form, Fit & Function Interchangeability Engine
          </div>
          <h2 className="text-xl font-black text-white mt-1">Part Interchangeability & Compatibility Checker</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Evaluate direct replacement eligibility, superseding part numbers, required Service Bulletins (SB), and electrical/mechanical modifications prior to installation.
          </p>
        </div>

        {comparedPartNumbers.length > 0 && (
          <button
            onClick={clearCompareParts}
            className="text-xs font-bold text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
          >
            Clear Selected Comparison Buffer ({comparedPartNumbers.length})
          </button>
        )}
      </div>

      {/* Part Selection Inputs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Part A Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
              Base Installed Part Number (Part A):
            </label>
            <div className="relative">
              <select
                value={partA.partNumber}
                onChange={e => setPartAQuery(e.target.value)}
                className="w-full bg-slate-950 border border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono font-bold focus:outline-none"
              >
                {MOCK_PARTS.map(p => (
                  <option key={p.partNumber} value={p.partNumber}>
                    {p.partNumber} — {p.description} ({p.manufacturer})
                  </option>
                ))}
              </select>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Status: <span className="text-emerald-400 font-bold">{partA.status}</span> | Bin: {partA.locationBin}
            </div>
          </div>

          {/* Part B Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              Candidate Alternate / Replacement Part Number (Part B):
            </label>
            <div className="relative">
              <select
                value={partB.partNumber}
                onChange={e => setPartBQuery(e.target.value)}
                className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono font-bold focus:outline-none"
              >
                {MOCK_PARTS.map(p => (
                  <option key={p.partNumber} value={p.partNumber}>
                    {p.partNumber} — {p.description} ({p.manufacturer})
                  </option>
                ))}
              </select>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Status: <span className="text-emerald-400 font-bold">{partB.status}</span> | Bin: {partB.locationBin}
            </div>
          </div>
        </div>
      </div>

      {/* Compatibility Verdict Banner */}
      <div
        className={`p-6 rounded-2xl border shadow-2xl space-y-3 ${
          compatibilityStatus === 'DIRECT_REPLACEMENT'
            ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200'
            : compatibilityStatus === 'CONDITIONAL_REPLACEMENT'
            ? 'bg-amber-950/40 border-amber-500/80 text-amber-200'
            : 'bg-red-950/40 border-red-500/80 text-red-200'
        }`}
      >
        <div className="flex items-center gap-3">
          {compatibilityStatus === 'DIRECT_REPLACEMENT' && <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0" />}
          {compatibilityStatus === 'CONDITIONAL_REPLACEMENT' && <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />}
          {compatibilityStatus === 'NOT_INTERCHANGEABLE' && <XCircle className="w-8 h-8 text-red-400 shrink-0" />}

          <div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-slate-400">Interchangeability Verdict</div>
            <h3 className="text-xl font-black text-white mt-0.5">
              {compatibilityStatus === 'DIRECT_REPLACEMENT' && 'DIRECT REPLACEMENT APPROVED (100% INTERCHANGEABLE)'}
              {compatibilityStatus === 'CONDITIONAL_REPLACEMENT' && 'CONDITIONAL INTERCHANGEABILITY (MODIFICATION REQUIRED)'}
              {compatibilityStatus === 'NOT_INTERCHANGEABLE' && 'NOT INTERCHANGEABLE — DO NOT INSTALL'}
            </h3>
          </div>
        </div>

        <p className="text-xs leading-relaxed font-medium pt-2 border-t border-slate-800/80">{reasoning}</p>

        {requiredModifications.length > 0 && (
          <div className="pt-2">
            <div className="text-xs font-bold uppercase text-amber-300 mb-1">Mandatory Engineering Action Items:</div>
            <ul className="space-y-1 text-xs text-amber-200/90 pl-4 list-disc">
              {requiredModifications.map((mod, idx) => (
                <li key={idx}>{mod}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison Matrix Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 font-bold text-slate-200 text-xs uppercase tracking-wider">
          Side-by-Side Parameter Matrix
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4 w-1/4">Parameter Spec</th>
                <th className="p-4 w-3/8 text-cyan-300">Part A: {partA.partNumber}</th>
                <th className="p-4 w-3/8 text-emerald-300">Part B: {partB.partNumber}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr>
                <td className="p-4 font-bold text-slate-400">Description</td>
                <td className="p-4 text-slate-100 font-medium">{partA.description}</td>
                <td className="p-4 text-slate-100 font-medium">{partB.description}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-400">Manufacturer & CAGE</td>
                <td className="p-4 text-slate-200">{partA.manufacturer} ({partA.cageCode})</td>
                <td className="p-4 text-slate-200">{partB.manufacturer} ({partB.cageCode})</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-400">ATA Chapter & System</td>
                <td className="p-4 font-mono text-cyan-300">{partA.ataCode} — {partA.systemName}</td>
                <td className="p-4 font-mono text-cyan-300">{partB.ataCode} — {partB.systemName}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-400">Aircraft Compatibility</td>
                <td className="p-4 font-mono">{partA.aircraftCompatibility.join(', ')}</td>
                <td className="p-4 font-mono">{partB.aircraftCompatibility.join(', ')}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-400">Overhaul Interval</td>
                <td className="p-4 font-bold text-amber-400">
                  {partA.overhaulIntervalHours ? `${partA.overhaulIntervalHours.toLocaleString()} Flight Hours` : 'On-Condition'}
                </td>
                <td className="p-4 font-bold text-amber-400">
                  {partB.overhaulIntervalHours ? `${partB.overhaulIntervalHours.toLocaleString()} Flight Hours` : 'On-Condition'}
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-400">Price (USD)</td>
                <td className="p-4 font-extrabold text-white">${partA.priceUsd.toLocaleString()}</td>
                <td className="p-4 font-extrabold text-white">${partB.priceUsd.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-400">Tech Docs References</td>
                <td className="p-4 font-mono text-cyan-300">{partA.techDocsReferences.join(', ')}</td>
                <td className="p-4 font-mono text-cyan-300">{partB.techDocsReferences.join(', ')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
