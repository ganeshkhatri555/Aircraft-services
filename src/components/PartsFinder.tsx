import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_PARTS } from '../data/mockData';
import { Part } from '../types';
import {
  PackageSearch,
  Search,
  Filter,
  Package,
  Layers,
  Building,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { PartDetailPage } from './PartDetailPage';

export const PartsFinder: React.FC = () => {
  const {
    selectedPartForDetail,
    setSelectedPartForDetail,
    toggleComparePart,
    comparedPartNumbers,
    setActiveTab,
  } = useApp();

  const [search, setSearch] = useState('');
  const [ataFilter, setAtaFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // If a part is selected for detail view, render PartDetailPage
  if (selectedPartForDetail) {
    return <PartDetailPage part={selectedPartForDetail} onBack={() => setSelectedPartForDetail(null)} />;
  }

  const filteredParts = MOCK_PARTS.filter(p => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.partNumber.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.manufacturer.toLowerCase().includes(q) ||
      p.cageCode.toLowerCase().includes(q) ||
      (p.nsn && p.nsn.toLowerCase().includes(q)) ||
      p.alternatePartNumbers.some(a => a.toLowerCase().includes(q));

    const matchesAta = ataFilter === 'all' || p.ataCode === ataFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesAta && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <PackageSearch className="w-4 h-4" /> Aviation Master Parts Catalog & Interchangeability
          </div>
          <h2 className="text-xl font-black text-white mt-1">Master Parts Search Engine</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Search by Part Number, Alternate P/N, Serial Number, CAGE Code, NSN (National Stock Number), or ATA chapter.
          </p>
        </div>

        {comparedPartNumbers.length > 0 && (
          <button
            onClick={() => setActiveTab('compatibility')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg"
          >
            Compare ({comparedPartNumbers.length}) Parts →
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          {/* Main Search */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search P/N (e.g. 65-46321-12), CAGE 73389, NSN, description..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* ATA Filter */}
          <div className="md:col-span-3">
            <select
              value={ataFilter}
              onChange={e => setAtaFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none"
            >
              <option value="all">All ATA Chapters</option>
              <option value="ATA 24">ATA 24 Electrical</option>
              <option value="ATA 29">ATA 29 Hydraulic</option>
              <option value="ATA 32">ATA 32 Landing Gear</option>
              <option value="ATA 63">ATA 63 Transmission</option>
              <option value="ATA 73">ATA 73 Engine Fuel</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none"
            >
              <option value="all">All Stock Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Reorder Required">Reorder Required</option>
              <option value="AOG Critical">AOG Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Part Number / Alternate</th>
                <th className="p-4">Description</th>
                <th className="p-4">Manufacturer / CAGE</th>
                <th className="p-4">Aircraft Application</th>
                <th className="p-4">System / ATA</th>
                <th className="p-4">Status / Location</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredParts.map(part => {
                const isCompared = comparedPartNumbers.includes(part.partNumber);
                return (
                  <tr
                    key={part.partNumber}
                    className="hover:bg-slate-800/60 transition-colors group cursor-pointer"
                    onClick={() => setSelectedPartForDetail(part)}
                  >
                    {/* Part Number */}
                    <td className="p-4">
                      <div className="font-mono font-bold text-emerald-400 text-sm group-hover:text-emerald-300">
                        {part.partNumber}
                      </div>
                      {part.alternatePartNumbers.length > 0 && (
                        <div className="text-[10px] text-slate-500 font-mono">
                          Alt: {part.alternatePartNumbers.join(', ')}
                        </div>
                      )}
                      {part.nsn && (
                        <div className="text-[9px] text-cyan-400 font-mono">NSN: {part.nsn}</div>
                      )}
                    </td>

                    {/* Description */}
                    <td className="p-4">
                      <div className="font-bold text-slate-100">{part.description}</div>
                      <div className="text-[10px] text-slate-400">{part.componentType}</div>
                    </td>

                    {/* Mfr & CAGE */}
                    <td className="p-4">
                      <div className="text-slate-200 font-semibold">{part.manufacturer}</div>
                      <div className="text-[10px] font-mono text-cyan-400">{part.cageCode}</div>
                    </td>

                    {/* Aircraft */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {part.aircraftCompatibility.map(ac => (
                          <span
                            key={ac}
                            className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700"
                          >
                            {ac}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* System / ATA */}
                    <td className="p-4">
                      <div className="font-bold font-mono text-cyan-300">{part.ataCode}</div>
                      <div className="text-[10px] text-slate-400">{part.systemName}</div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          part.status === 'In Stock'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : part.status === 'Reorder Required'
                            ? 'bg-amber-950 text-amber-400 border-amber-800'
                            : 'bg-red-950 text-red-400 border-red-800'
                        }`}
                      >
                        {part.status} ({part.stockQuantity} qty)
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{part.locationBin}</div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleComparePart(part.partNumber)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded border transition-colors ${
                            isCompared
                              ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {isCompared ? 'Compared' : '+ Compare'}
                        </button>

                        <button
                          onClick={() => setSelectedPartForDetail(part)}
                          className="bg-blue-600/30 text-blue-300 hover:bg-blue-600 hover:text-white px-2.5 py-1 rounded border border-blue-500/50 font-bold text-[11px] transition-colors"
                        >
                          Detail →
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
