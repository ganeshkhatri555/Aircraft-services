import React, { useState } from 'react';
import { MOCK_DOCUMENTS } from '../data/mockData';
import { TechDocument } from '../types';
import { FileText, Search, ShieldCheck, Download, ExternalLink, Filter, BookOpen, X } from 'lucide-react';

export const DocLibrary: React.FC = () => {
  const [search, setSearch] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState<TechDocument | null>(null);

  const filteredDocs = MOCK_DOCUMENTS.filter(doc => {
    const q = search.toLowerCase();
    const matchSearch =
      doc.documentNumber.toLowerCase().includes(q) ||
      doc.title.toLowerCase().includes(q) ||
      doc.summary.toLowerCase().includes(q) ||
      doc.ataCode.toLowerCase().includes(q);

    const matchType = docTypeFilter === 'all' || doc.docType === docTypeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> Approved Engineering Documentation Vault
          </div>
          <h2 className="text-xl font-black text-white mt-1">Technical Manuals Library (AMM / IPC / FIM / AD)</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Access manufacturer-approved Aircraft Maintenance Manuals, Illustrated Parts Catalogs, Service Bulletins, and Airworthiness Directives.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> All Manuals Revision Current
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by document number (e.g. B737-AMM-32-51), title, or ATA..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={docTypeFilter}
            onChange={e => setDocTypeFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none font-bold"
          >
            <option value="all">All Document Types</option>
            <option value="AMM">AMM — Aircraft Maintenance Manual</option>
            <option value="IPC">IPC — Illustrated Parts Catalog</option>
            <option value="FIM">FIM — Fault Isolation Manual</option>
            <option value="SB">SB — Service Bulletin</option>
            <option value="AD">AD — Airworthiness Directive</option>
          </select>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 shadow-xl cursor-pointer transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                  [{doc.docType}] {doc.documentNumber}
                </span>
                <span className="text-xs font-mono text-cyan-400 font-bold">{doc.ataCode}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                Rev: {doc.revisionDate}
              </span>
            </div>

            <h3 className="text-base font-black text-white group-hover:text-purple-300 transition-colors">
              {doc.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{doc.summary}</p>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <div>Approved Authority: <strong className="text-slate-200">{doc.approvedBy}</strong></div>
              <span className="text-purple-400 font-bold group-hover:underline flex items-center gap-1">
                View Spec <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Document Specification Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-purple-400">
                  [{selectedDoc.docType}] {selectedDoc.documentNumber}
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">{selectedDoc.title}</h3>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-slate-200">Manual Scope & Technical Abstract:</div>
                <p className="text-slate-300 leading-relaxed">{selectedDoc.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div>ATA Chapter: <strong className="text-cyan-300 font-mono">{selectedDoc.ataCode}</strong></div>
                <div>Approved By: <strong className="text-emerald-400">{selectedDoc.approvedBy}</strong></div>
                <div>Revision Date: <strong className="text-slate-200">{selectedDoc.revisionDate}</strong></div>
                <div>Status: <strong className="text-emerald-400">ACTIVE & EFFECTIVE</strong></div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="font-bold text-slate-200">Applicable Airframe Models:</div>
                <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                  {selectedDoc.applicableModels.map(m => (
                    <span key={m} className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-mono">MD5: e9a28c40f1a942</span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg"
              >
                Close Spec Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
