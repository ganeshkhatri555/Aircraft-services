import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plane, Search, Check, Layers, ShieldCheck, ArrowRight, Plus } from 'lucide-react';
import { MOCK_AIRCRAFT } from '../data/mockData';
import { AircraftModel } from '../types';

export const AircraftSelector: React.FC = () => {
  const { selectedAircraft, setSelectedAircraft, setActiveTab } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'commercial_jet' | 'helicopter'>('all');
  const [manufacturerFilter, setManufacturerFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const manufacturers = Array.from(new Set(MOCK_AIRCRAFT.map(a => a.manufacturer)));

  const filteredAircraft = MOCK_AIRCRAFT.filter(ac => {
    const matchesCat = categoryFilter === 'all' || ac.category === categoryFilter;
    const matchesMfr = manufacturerFilter === 'all' || ac.manufacturer === manufacturerFilter;
    const matchesSearch =
      ac.name.toLowerCase().includes(search.toLowerCase()) ||
      ac.family.toLowerCase().includes(search.toLowerCase()) ||
      ac.variants.some(v => v.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesMfr && matchesSearch;
  });

  const handleSelect = (ac: AircraftModel) => {
    setSelectedAircraft(ac);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Plane className="w-4 h-4" /> Aircraft & Rotorcraft Selection Engine
          </div>
          <h2 className="text-xl font-black text-white mt-1">Fleet Model & Variant Selection</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Select an active aircraft model to customize ATA chapter systems, troubleshooting workflows, and compatible component databases.
          </p>
        </div>

        {/* Selected Aircraft Active Pill */}
        <div className="bg-slate-950 border border-blue-500/40 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Currently Active</div>
            <div className="text-sm font-extrabold text-white">{selectedAircraft.name}</div>
            <div className="text-[10px] text-cyan-400">{selectedAircraft.family} • {selectedAircraft.variants.length} Variants</div>
          </div>
          <button
            onClick={() => setActiveTab('systems')}
            className="ml-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
          >
            Explore Systems <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
              categoryFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Fleet Types ({MOCK_AIRCRAFT.length})
          </button>
          <button
            onClick={() => setCategoryFilter('commercial_jet')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
              categoryFilter === 'commercial_jet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Commercial Jets
          </button>
          <button
            onClick={() => setCategoryFilter('helicopter')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
              categoryFilter === 'helicopter' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Helicopters / Rotorcraft
          </button>
        </div>

        {/* Search & Manufacturer Filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by model, family, or engine type..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <select
            value={manufacturerFilter}
            onChange={e => setManufacturerFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Manufacturers</option>
            {manufacturers.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Aircraft Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAircraft.map(ac => {
          const isSelected = selectedAircraft.id === ac.id;
          return (
            <div
              key={ac.id}
              onClick={() => handleSelect(ac)}
              className={`bg-slate-900/90 rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col group ${
                isSelected
                  ? 'border-cyan-400 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-400'
                  : 'border-slate-800 hover:border-slate-700 hover:shadow-lg'
              }`}
            >
              {/* Image Preview & Badge */}
              <div className="relative h-44 bg-slate-950 overflow-hidden">
                <img
                  src={ac.imageUrl}
                  alt={ac.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-cyan-300 border border-slate-700 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                    {ac.manufacturer}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-950/80 text-blue-300 border border-blue-800 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                    {ac.category === 'helicopter' ? 'Helicopter' : 'Jet Airliner'}
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute top-3 right-3 bg-cyan-500 text-slate-950 px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-lg">
                    <Check className="w-3.5 h-3.5" /> ACTIVE SELECTION
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">{ac.name}</h3>
                    <span className="text-xs font-mono font-bold text-slate-400">{ac.family}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{ac.description}</p>
                </div>

                {/* Specs List */}
                <div className="space-y-1.5 text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between">
                    <span>Engines:</span>
                    <strong className="text-slate-200">{ac.engines.join(', ')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Systems:</span>
                    <strong className="text-cyan-300">{ac.ataSystemsCount} ATA Modules</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Global Active Fleet:</span>
                    <strong className="text-emerald-400">{ac.activeFleetCount} Airframes</strong>
                  </div>
                </div>

                {/* Variants Tags */}
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Supported Variants:</div>
                  <div className="flex flex-wrap gap-1">
                    {ac.variants.map(v => (
                      <span key={v} className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Trigger */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>{isSelected ? 'Currently Selected' : 'Click to Select'}</span>
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400 group-hover:text-white'}`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Extensibility Notice / Add Fleet Card */}
      <div className="bg-slate-900/60 border border-dashed border-slate-700 rounded-2xl p-6 text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center mx-auto">
          <Plus className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-slate-200">System Architecture Ready for Custom Fleet Expansion</h4>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Need to add regional jets, turboprops (ATR, Bombardier), military freighters, or bespoke rotorcraft? The database framework supports custom ATA definitions and JSON manifest imports.
        </p>
      </div>
    </div>
  );
};
