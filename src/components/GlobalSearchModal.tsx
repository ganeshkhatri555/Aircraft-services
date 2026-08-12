import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  X,
  Plane,
  Layers,
  Package,
  Wrench,
  FileText,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import {
  MOCK_AIRCRAFT,
  MOCK_ATA_CHAPTERS,
  MOCK_PARTS,
  MOCK_TROUBLESHOOTING_FLOWS,
  MOCK_DOCUMENTS,
} from '../data/mockData';

export const GlobalSearchModal: React.FC = () => {
  const {
    globalSearchOpen,
    setGlobalSearchOpen,
    setSelectedAircraft,
    setSelectedPartForDetail,
    setSelectedTroubleshootingFlow,
    setActiveTab,
    tasks,
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(true);
      }
      if (e.key === 'Escape' && globalSearchOpen) {
        setGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [globalSearchOpen, setGlobalSearchOpen]);

  if (!globalSearchOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingAircraft = q
    ? MOCK_AIRCRAFT.filter(
        a =>
          a.name.toLowerCase().includes(q) ||
          a.family.toLowerCase().includes(q) ||
          a.manufacturer.toLowerCase().includes(q) ||
          a.variants.some(v => v.toLowerCase().includes(q))
      )
    : MOCK_AIRCRAFT.slice(0, 3);

  const matchingATA = q
    ? MOCK_ATA_CHAPTERS.filter(
        a =>
          a.code.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      )
    : [];

  const matchingParts = q
    ? MOCK_PARTS.filter(
        p =>
          p.partNumber.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.manufacturer.toLowerCase().includes(q) ||
          p.cageCode.toLowerCase().includes(q) ||
          p.nsn?.toLowerCase().includes(q) ||
          p.alternatePartNumbers.some(alt => alt.toLowerCase().includes(q))
      )
    : MOCK_PARTS.slice(0, 3);

  const matchingTrouble = q
    ? MOCK_TROUBLESHOOTING_FLOWS.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.reportedDefect.toLowerCase().includes(q) ||
          t.symptoms.some(s => s.toLowerCase().includes(q)) ||
          t.ataCode.toLowerCase().includes(q)
      )
    : MOCK_TROUBLESHOOTING_FLOWS;

  const matchingTasks = q
    ? tasks.filter(
        t =>
          t.taskNumber.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.reportedDefect.toLowerCase().includes(q) ||
          t.aircraftReg.toLowerCase().includes(q)
      )
    : tasks.slice(0, 2);

  const matchingDocs = q
    ? MOCK_DOCUMENTS.filter(
        d =>
          d.documentNumber.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q) ||
          d.docType.toLowerCase().includes(q) ||
          d.summary.toLowerCase().includes(q)
      )
    : [];

  const handleSelectAircraft = (ac: typeof MOCK_AIRCRAFT[0]) => {
    setSelectedAircraft(ac);
    setActiveTab('systems');
    setGlobalSearchOpen(false);
  };

  const handleSelectPart = (part: typeof MOCK_PARTS[0]) => {
    setSelectedPartForDetail(part);
    setActiveTab('parts');
    setGlobalSearchOpen(false);
  };

  const handleSelectTroubleshooting = (flow: typeof MOCK_TROUBLESHOOTING_FLOWS[0]) => {
    setSelectedTroubleshootingFlow(flow);
    setActiveTab('troubleshooting');
    setGlobalSearchOpen(false);
  };

  const handleSelectTask = () => {
    setActiveTab('maintenance');
    setGlobalSearchOpen(false);
  };

  const handleSelectDoc = () => {
    setActiveTab('documents');
    setGlobalSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-slate-800">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/80">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search aircraft, system, fault, symptom, P/N, ATA chapter, or maintenance task..."
            className="bg-transparent text-slate-900 placeholder-slate-400 text-sm w-full focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setGlobalSearchOpen(false)}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded border border-slate-200 font-medium"
          >
            ESC
          </button>
        </div>

        {/* Quick Search Shortcut Prompts */}
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex flex-wrap gap-2 text-[10px] text-slate-500">
          <span className="font-bold text-slate-700">Quick Examples:</span>
          <button onClick={() => setQuery('737 hydraulic pump')} className="hover:text-blue-600 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs font-medium">
            "737 hydraulic pump"
          </button>
          <button onClick={() => setQuery('steering fault')} className="hover:text-blue-600 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs font-medium">
            "steering fault"
          </button>
          <button onClick={() => setQuery('ATA 29')} className="hover:text-blue-600 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs font-medium">
            "ATA 29"
          </button>
          <button onClick={() => setQuery('65-46321-12')} className="hover:text-blue-600 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs font-medium">
            "Part 65-46321-12"
          </button>
        </div>

        {/* Categorized Results Area */}
        <div className="p-4 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Aircraft Section */}
          {matchingAircraft.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-2">
                <Plane className="w-3.5 h-3.5" /> Aircraft Models ({matchingAircraft.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingAircraft.map(ac => (
                  <div
                    key={ac.id}
                    onClick={() => handleSelectAircraft(ac)}
                    className="p-2.5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-xl cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-blue-600">{ac.name}</div>
                      <div className="text-[10px] text-slate-500">{ac.family} • {ac.manufacturer}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ATA Chapters */}
          {matchingATA.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-purple-600 mb-2">
                <Layers className="w-3.5 h-3.5" /> ATA Chapters ({matchingATA.length})
              </div>
              <div className="space-y-1.5">
                {matchingATA.map(ata => (
                  <div
                    key={ata.code}
                    onClick={() => {
                      setActiveTab('systems');
                      setGlobalSearchOpen(false);
                    }}
                    className="p-2 bg-slate-50 hover:bg-purple-50/50 border border-slate-200 rounded-lg cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-purple-700 mr-2">{ata.code}</span>
                      <span className="font-semibold text-slate-900">{ata.title}</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{ata.description}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parts Section */}
          {matchingParts.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-2">
                <Package className="w-3.5 h-3.5" /> Aviation Parts ({matchingParts.length})
              </div>
              <div className="space-y-2">
                {matchingParts.map(part => (
                  <div
                    key={part.partNumber}
                    onClick={() => handleSelectPart(part)}
                    className="p-2.5 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 rounded-xl cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-700">{part.partNumber}</span>
                        <span className="text-[10px] bg-white text-slate-700 px-1.5 py-0.2 rounded font-mono border border-slate-200">{part.cageCode}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold">{part.status}</span>
                      </div>
                      <div className="font-semibold text-slate-900 mt-0.5">{part.description}</div>
                      <div className="text-[10px] text-slate-500">{part.manufacturer} • {part.ataCode}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Troubleshooting Section */}
          {matchingTrouble.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-600 mb-2">
                <Wrench className="w-3.5 h-3.5" /> Troubleshooting & Fault Diagnosis ({matchingTrouble.length})
              </div>
              <div className="space-y-2">
                {matchingTrouble.map(tb => (
                  <div
                    key={tb.id}
                    onClick={() => handleSelectTroubleshooting(tb)}
                    className="p-2.5 bg-slate-50 hover:bg-amber-50/50 border border-slate-200 rounded-xl cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-amber-700">{tb.title}</div>
                      <div className="text-[10px] text-amber-700 font-medium">{tb.aircraftModelName} • {tb.ataCode}</div>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{tb.reportedDefect}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Section */}
          {matchingTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-2">
                <ShieldAlert className="w-3.5 h-3.5" /> Maintenance Tasks ({matchingTasks.length})
              </div>
              <div className="space-y-2">
                {matchingTasks.map(tk => (
                  <div
                    key={tk.id}
                    onClick={handleSelectTask}
                    className="p-2 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-lg cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-blue-600 font-mono mr-2">{tk.taskNumber}</span>
                      <span className="text-slate-900 font-semibold">{tk.title}</span>
                      <div className="text-[10px] text-slate-500">{tk.aircraftReg} ({tk.aircraftModelName}) • Status: {tk.status}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Docs Section */}
          {matchingDocs.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-600 mb-2">
                <FileText className="w-3.5 h-3.5" /> Approved Technical Documents ({matchingDocs.length})
              </div>
              <div className="space-y-2">
                {matchingDocs.map(doc => (
                  <div
                    key={doc.id}
                    onClick={handleSelectDoc}
                    className="p-2 bg-slate-50 hover:bg-rose-50/50 border border-slate-200 rounded-lg cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-rose-600 font-mono mr-2">[{doc.docType}] {doc.documentNumber}</span>
                      <span className="text-slate-900 font-semibold">{doc.title}</span>
                      <div className="text-[10px] text-slate-500">{doc.approvedBy} • {doc.revisionDate}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
