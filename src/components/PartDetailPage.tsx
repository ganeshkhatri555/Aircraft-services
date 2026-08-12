import React, { useState } from 'react';
import { Part } from '../types';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Package,
  Building,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  Layers,
  Wrench,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

interface PartDetailPageProps {
  part: Part;
  onBack: () => void;
}

export const PartDetailPage: React.FC<PartDetailPageProps> = ({ part, onBack }) => {
  const {
    toggleComparePart,
    comparedPartNumbers,
    setActiveTab,
    addTask,
    selectedAircraft,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const isCompared = comparedPartNumbers.includes(part.partNumber);

  const handleCopyPartNumber = () => {
    navigator.clipboard.writeText(part.partNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToTask = () => {
    addTask({
      aircraftReg: 'N737AF',
      aircraftModelId: selectedAircraft.id,
      aircraftModelName: selectedAircraft.name,
      serialNumberMSN: 'MSN 38291',
      ataCode: part.ataCode,
      title: `Install Part ${part.partNumber} - ${part.description}`,
      reportedDefect: `Replacement required for ${part.description} per ${part.applicableTasks[0] || 'AMM Task'}.`,
      priority: 'High',
      technician: 'Marcus Vance (A&P)',
      inspector: 'Elena Rostova (IA)',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'In Progress',
      requiredParts: [{ partNumber: part.partNumber, description: part.description, qty: 1, status: 'Allocated' }],
      requiredTools: ['Torque Wrench', 'Hydraulic Bleed Kit'],
      findings: `Part ${part.partNumber} allocated from Bin ${part.locationBin}.`,
      correctiveAction: `Perform R&I per ${part.techDocsReferences[0] || 'AMM Manual'}.`,
      hoursLogged: 2.0,
      ammReference: part.techDocsReferences[0] || 'AMM Manual',
    });
    setActiveTab('maintenance');
  };

  return (
    <div className="space-y-6">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" /> Back to Parts Catalog
        </button>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => toggleComparePart(part.partNumber)}
            className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all ${
              isCompared
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isCompared ? '✓ Added to Comparison' : '+ Compare Part'}
          </button>

          <button
            onClick={() => setActiveTab('compatibility')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" /> Find Compatible Parts
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" /> View Tech Documentation
          </button>

          <button
            onClick={handleAddToTask}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5"
          >
            + Add to Maintenance Task
          </button>
        </div>
      </div>

      {/* Main Part Summary Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-mono font-black text-emerald-400 tracking-wider">
                {part.partNumber}
              </span>
              <button
                onClick={handleCopyPartNumber}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                title="Copy P/N"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {copied && <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>}

              <span className="text-xs font-mono font-bold bg-slate-950 text-cyan-300 border border-slate-800 px-2 py-0.5 rounded">
                CAGE {part.cageCode}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">{part.description}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Manufacturer: <strong className="text-slate-200">{part.manufacturer}</strong> ({part.manufacturerCode})
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1.5">
            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-xl border ${
                part.status === 'In Stock'
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : 'bg-amber-950 text-amber-400 border-amber-800'
              }`}
            >
              ● {part.status} ({part.stockQuantity} Units)
            </span>
            <div className="text-xs font-mono text-slate-300">
              Bin Location: <strong className="text-cyan-300">{part.locationBin}</strong>
            </div>
            <div className="text-lg font-black text-white">${part.priceUsd.toLocaleString()} USD</div>
          </div>
        </div>

        {/* Interchangeability Status Notice */}
        <div className="bg-slate-950 border border-cyan-800/60 rounded-xl p-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="font-bold text-slate-100">Interchangeability Protocol</div>
              <div className="text-slate-400">{part.notes || 'Direct IPC / AMM replacement approved.'}</div>
            </div>
          </div>
          <span className="font-mono font-bold text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800 uppercase">
            {part.interchangeabilityType.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Detail Specifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Technical Specifications (Col Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Technical Specs Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" /> Component Technical Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold">Alternate Part Numbers:</span>
                <div className="font-mono text-cyan-300 font-semibold mt-0.5">
                  {part.alternatePartNumbers.length > 0 ? part.alternatePartNumbers.join(', ') : 'None'}
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold">National Stock Number (NSN):</span>
                <div className="font-mono text-emerald-400 font-semibold mt-0.5">{part.nsn || 'N/A'}</div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold">ATA Chapter & System:</span>
                <div className="font-bold text-slate-200 mt-0.5">{part.ataCode} — {part.systemName}</div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold">Serial Number Tracking:</span>
                <div className="font-bold text-slate-200 mt-0.5">
                  {part.serialNumberRequired ? 'Mandatory S/N Logbook Entry' : 'Batch / Lot Controlled'}
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 sm:col-span-2">
                <span className="text-slate-400 font-bold">Installation Position / Location:</span>
                <div className="font-semibold text-slate-200 mt-0.5">{part.installationPosition}</div>
              </div>
            </div>
          </div>

          {/* Overhaul & Life Limits */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Overhaul & Life Limit Directives
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold">Overhaul Interval:</span>
                <div className="font-extrabold text-amber-400 text-sm mt-0.5">
                  {part.overhaulIntervalHours ? `${part.overhaulIntervalHours.toLocaleString()} Flight Hours` : 'On-Condition Maintenance'}
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold">Life Limit Cycles:</span>
                <div className="font-extrabold text-amber-400 text-sm mt-0.5">
                  {part.lifeLimitCycles ? `${part.lifeLimitCycles.toLocaleString()} Flight Cycles` : 'No Hard Life Limit'}
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-slate-200">Inspection Requirements:</div>
              <p className="text-slate-400 leading-relaxed">{part.inspectionRequirements}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Aircraft Compatibility & Tech Docs (Col Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Aircraft Compatibility */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-400" /> Approved Aircraft Fleet Applications
            </h3>

            <div className="space-y-2">
              {part.aircraftCompatibility.map(acId => (
                <div key={acId} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 uppercase font-mono">{acId}</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Approved
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Applicable Maintenance Tasks & Manuals */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" /> Applicable AMM Tasks & Manuals
            </h3>

            <div className="space-y-2">
              {part.applicableTasks.map(taskRef => (
                <div key={taskRef} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 font-bold">
                  {taskRef}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
