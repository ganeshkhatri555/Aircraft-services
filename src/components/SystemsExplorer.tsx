import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_ATA_CHAPTERS, MOCK_SYSTEMS, MOCK_PARTS } from '../data/mockData';
import { Layers, Search, Wrench, Package, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ATAChapter, AircraftSystem } from '../types';

export const SystemsExplorer: React.FC = () => {
  const { selectedAircraft, setSelectedPartForDetail, setActiveTab } = useApp();
  const [selectedATA, setSelectedATA] = useState<ATAChapter>(MOCK_ATA_CHAPTERS[6]); // ATA 32 Landing Gear
  const [selectedSystem, setSelectedSystem] = useState<AircraftSystem | null>(MOCK_SYSTEMS[0]);
  const [search, setSearch] = useState('');

  const filteredChapters = MOCK_ATA_CHAPTERS.filter(
    ata =>
      ata.code.toLowerCase().includes(search.toLowerCase()) ||
      ata.title.toLowerCase().includes(search.toLowerCase()) ||
      ata.description.toLowerCase().includes(search.toLowerCase())
  );

  const systemsInATA = MOCK_SYSTEMS.filter(s => s.ataCode === selectedATA.code);
  const partsInATA = MOCK_PARTS.filter(p => p.ataCode === selectedATA.code);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" /> Multi-Tier Systems Hierarchy
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            Aircraft Systems & ATA Chapter Matrix — {selectedAircraft.name}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Browse aircraft systems organized by standard Air Transport Association (ATA) chapter specification. Drill down: <strong className="text-cyan-300">Aircraft → ATA Chapter → System → Component → Part</strong>.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300">
          Selected ATA: <strong className="text-cyan-400">{selectedATA.code} ({selectedATA.title})</strong>
        </div>
      </div>

      {/* Breadcrumb Hierarchy Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
        <span className="text-blue-400 font-bold">{selectedAircraft.name}</span>
        <span className="text-slate-600">/</span>
        <span className="text-purple-400 font-bold">{selectedATA.code} - {selectedATA.title}</span>
        {selectedSystem && (
          <>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400 font-bold">{selectedSystem.name}</span>
          </>
        )}
      </div>

      {/* 2-Column Layout: Left ATA Chapters, Right System & Component Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: ATA Chapter Selector List (Col Span 4) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search ATA code or title..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredChapters.map(ata => {
              const isSelected = selectedATA.code === ata.code;
              return (
                <div
                  key={ata.code}
                  onClick={() => {
                    setSelectedATA(ata);
                    const matchedSys = MOCK_SYSTEMS.find(s => s.ataCode === ata.code);
                    setSelectedSystem(matchedSys || null);
                  }}
                  className={`p-3 rounded-xl cursor-pointer border transition-all text-xs flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-950/60 border-purple-500/80 text-purple-200 font-bold shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-400">{ata.code}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">{ata.category}</span>
                    </div>
                    <div className="font-bold text-slate-100 mt-0.5">{ata.title}</div>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-slate-600'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed System, Components & Associated Parts (Col Span 8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Chapter Overview Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {selectedATA.code} Specification
                </span>
                <h3 className="text-xl font-black text-white mt-1">{selectedATA.title}</h3>
              </div>
              <span className="text-xs font-bold text-slate-400">{selectedATA.category} Systems Group</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{selectedATA.description}</p>
          </div>

          {/* Sub-Systems Section */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <Wrench className="w-4 h-4 text-indigo-400" /> Sub-Systems Registered in {selectedATA.code}
            </h3>

            {systemsInATA.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {systemsInATA.map(sys => (
                  <div
                    key={sys.id}
                    onClick={() => setSelectedSystem(sys)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedSystem?.id === sys.id
                        ? 'bg-indigo-950/40 border-indigo-500/80 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-100 text-sm">{sys.name}</h4>
                      {sys.safetyCritical && (
                        <span className="text-[10px] font-bold bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded uppercase">
                          Safety Critical
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{sys.description}</p>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-2 text-[11px]">
                      <span className="text-slate-400 font-semibold">Primary Components:</span>
                      {sys.primaryComponents.map(comp => (
                        <span key={comp} className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-medium border border-slate-700">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 p-4 bg-slate-950 rounded-xl border border-slate-800">
                General ATA specification active. Select components below or execute a part number cross-reference query.
              </div>
            )}
          </div>

          {/* Catalog Parts in this ATA Chapter */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <Package className="w-4 h-4 text-emerald-400" /> Catalog Parts in {selectedATA.code} ({partsInATA.length})
              </h3>
              <button
                onClick={() => setActiveTab('parts')}
                className="text-xs font-bold text-emerald-400 hover:underline"
              >
                Open Full Catalog →
              </button>
            </div>

            {partsInATA.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {partsInATA.map(part => (
                  <div
                    key={part.partNumber}
                    onClick={() => {
                      setSelectedPartForDetail(part);
                      setActiveTab('parts');
                    }}
                    className="p-3.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-xl cursor-pointer transition-all space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-emerald-400 group-hover:text-emerald-300">{part.partNumber}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">{part.cageCode}</span>
                    </div>
                    <div className="font-bold text-xs text-slate-200 line-clamp-1">{part.description}</div>
                    <div className="text-[10px] text-slate-400">{part.manufacturer} • Position: {part.installationPosition}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 p-4 bg-slate-950 rounded-xl border border-slate-800">
                No active inventory parts matching this chapter currently loaded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
