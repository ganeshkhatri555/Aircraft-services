import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HOTSPOT_ZONES_JET, HOTSPOT_ZONES_HELI, MOCK_PARTS, MOCK_SYSTEMS } from '../data/mockData';
import { HotspotZone } from '../types';
import { Plane, Layers, Wrench, Package, Info, CheckCircle2 } from 'lucide-react';

export const VisualAircraftExplorer: React.FC = () => {
  const { selectedAircraft, setActiveTab, setSelectedPartForDetail, tasks } = useApp();

  const isHelicopter = selectedAircraft.category === 'helicopter';
  const zones = isHelicopter ? HOTSPOT_ZONES_HELI : HOTSPOT_ZONES_JET;

  const [activeZone, setActiveZone] = useState<HotspotZone>(zones[1]); // Default NLG or Transmission

  const relatedSystems = MOCK_SYSTEMS.filter(sys =>
    activeZone.ataChapters.some(ata => sys.ataCode.startsWith(ata) || ata.startsWith(sys.ataCode))
  );

  const relatedParts = MOCK_PARTS.filter(p =>
    activeZone.ataChapters.some(ata => p.ataCode === ata)
  );

  const relatedDefects = tasks.filter(t =>
    activeZone.ataChapters.some(ata => t.ataCode === ata) && t.status !== 'Completed'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Plane className="w-4 h-4" /> Interactive Airframe Hotspot Diagram
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            {selectedAircraft.name} — Airframe & Component Zone Explorer
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Click any physical zone on the airframe below to inspect relevant ATA chapters, installed hydraulic/electrical components, and active line station defects.
          </p>
        </div>

        <span className="text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-1.5 rounded-xl">
          {isHelicopter ? 'Rotorcraft Airframe Map' : 'Commercial Jet Airframe Map'}
        </span>
      </div>

      {/* Main Diagram Stage & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Diagram Stage (Col Span 7) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
            <span className="font-bold text-slate-200">Airframe Diagram Coordinates</span>
            <span>Selected Zone: <strong className="text-cyan-300">{activeZone.name} ({activeZone.zoneCode})</strong></span>
          </div>

          {/* Diagram Canvas */}
          <div className="relative w-full h-80 sm:h-96 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-4 group">
            {/* Background Aircraft Graphic */}
            <img
              src={selectedAircraft.imageUrl}
              alt={selectedAircraft.name}
              className="w-full h-full object-cover opacity-35 mix-blend-luminosity filter blur-[1px] group-hover:blur-0 transition-all"
            />
            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px]" />

            {/* Hotspot Markers */}
            {zones.map(zone => {
              const isActive = activeZone.id === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => setActiveZone(zone)}
                  style={{ left: `${zone.xPercentage}%`, top: `${zone.yPercentage}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group/marker z-20 transition-all ${
                    isActive ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Ping Ring */}
                    <span
                      className={`absolute inline-flex h-8 w-8 rounded-full opacity-75 animate-ping ${
                        isActive ? 'bg-cyan-400' : 'bg-blue-500'
                      }`}
                    />
                    {/* Pin Circle */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 shadow-xl ${
                        isActive
                          ? 'bg-cyan-400 text-slate-950 border-white ring-4 ring-cyan-500/40'
                          : 'bg-slate-900 text-cyan-300 border-cyan-500 hover:bg-cyan-500 hover:text-slate-950'
                      }`}
                    >
                      {zone.zoneCode.slice(-3)}
                    </div>
                  </div>

                  {/* Tooltip Hover Label */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/marker:block bg-slate-900 text-slate-100 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 whitespace-nowrap shadow-xl z-40">
                    {zone.name}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Zone Selector Buttons Bar */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Select Airframe Zone:</div>
            <div className="flex flex-wrap gap-1.5">
              {zones.map(z => {
                const isActive = activeZone.id === z.id;
                return (
                  <button
                    key={z.id}
                    onClick={() => setActiveZone(z)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {z.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Zone Deep Intelligence Panel (Col Span 5) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
                {activeZone.zoneCode}
              </span>
              <span className="text-xs font-semibold text-slate-400">Airframe Zone</span>
            </div>
            <h3 className="text-lg font-black text-white mt-1">{activeZone.name}</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeZone.description}</p>
          </div>

          {/* Relevant ATA Chapters */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Primary ATA Chapters
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {activeZone.ataChapters.map(ata => (
                <span
                  key={ata}
                  className="text-xs font-mono font-bold bg-slate-950 text-cyan-300 border border-slate-700 px-2.5 py-1 rounded-lg"
                >
                  {ata}
                </span>
              ))}
            </div>
          </div>

          {/* Active Defects in this Zone */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-amber-400" /> Active Line Defect Reports ({relatedDefects.length})
            </h4>
            {relatedDefects.length > 0 ? (
              <div className="space-y-2">
                {relatedDefects.map(def => (
                  <div key={def.id} className="p-3 bg-amber-950/20 border border-amber-800/60 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-400 text-xs">{def.taskNumber}</span>
                      <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">{def.priority}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-100">{def.title}</div>
                    <p className="text-[11px] text-slate-400">{def.reportedDefect}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> Zero active open defects logged in this airframe zone.
              </div>
            )}
          </div>

          {/* Installed Components & Parts Catalog References */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-emerald-400" /> Zone Components ({relatedParts.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {relatedParts.map(part => (
                <div
                  key={part.partNumber}
                  onClick={() => {
                    setSelectedPartForDetail(part);
                    setActiveTab('parts');
                  }}
                  className="p-2.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer flex items-center justify-between text-xs group"
                >
                  <div>
                    <div className="font-mono font-bold text-emerald-400 group-hover:text-emerald-300">{part.partNumber}</div>
                    <div className="text-slate-200 font-medium line-clamp-1">{part.description}</div>
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-cyan-300">View Detail →</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
