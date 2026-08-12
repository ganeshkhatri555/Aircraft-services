import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MaintenanceTask } from '../types';
import {
  ClipboardList,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  UserCheck,
  FileText,
  PackageCheck,
  X,
  Wrench,
} from 'lucide-react';

export const TaskManagement: React.FC = () => {
  const { tasks, addTask, updateTaskStatus, userRole, selectedAircraft } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAta, setNewTaskAta] = useState('ATA 32');
  const [newTaskDefect, setNewTaskDefect] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'AOG' | 'High' | 'Routine'>('AOG');
  const [newTaskTechnician, setNewTaskTechnician] = useState('Marcus Vance (A&P)');
  const [newTaskAmm, setNewTaskAmm] = useState('AMM 32-51-11');

  const filteredTasks = tasks.filter(t => {
    const matchPrio = filterPriority === 'all' || t.priority === filterPriority;
    const matchStat = filterStatus === 'all' || t.status === filterStatus;
    return matchPrio && matchStat;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      aircraftReg: 'N737AF',
      aircraftModelId: selectedAircraft.id,
      aircraftModelName: selectedAircraft.name,
      serialNumberMSN: 'MSN 38291',
      ataCode: newTaskAta,
      title: newTaskTitle,
      reportedDefect: newTaskDefect,
      priority: newTaskPriority,
      technician: newTaskTechnician,
      inspector: 'Elena Rostova (IA)',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'In Progress',
      requiredParts: [{ partNumber: '65-46321-12', description: 'Assigned Component', qty: 1, status: 'Allocated' }],
      requiredTools: ['Calibrated Torque Wrench'],
      findings: 'Created via Line Station Maintenance Order Form.',
      correctiveAction: 'Pending execution.',
      hoursLogged: 0,
      ammReference: newTaskAmm,
    });

    setShowCreateModal(false);
    setNewTaskTitle('');
    setNewTaskDefect('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <ClipboardList className="w-4 h-4" /> Work Order & Defect Sign-off System
          </div>
          <h2 className="text-xl font-black text-white mt-1">Fleet Maintenance Task Orders</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Active role: <strong className="text-emerald-400 capitalize">{userRole}</strong>. Manage line station defect logs, part allocations, technician hours, and Inspector (IA) logbook sign-offs.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create Work Order
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-400 uppercase text-[11px]">Filter Priority:</span>
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="AOG">AOG Aircraft On Ground</option>
            <option value="High">High</option>
            <option value="Routine">Routine</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-400 uppercase text-[11px]">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Waiting for Parts">Waiting for Parts</option>
            <option value="Completed">Completed / Signed Off</option>
          </select>
        </div>
      </div>

      {/* Tasks List Grid */}
      <div className="space-y-4">
        {filteredTasks.map(task => {
          const isCompleted = task.status === 'Completed';

          return (
            <div
              key={task.id}
              className={`p-6 rounded-2xl border shadow-xl transition-all space-y-4 ${
                task.priority === 'AOG' && !isCompleted
                  ? 'bg-red-950/20 border-red-800/80'
                  : isCompleted
                  ? 'bg-slate-900/60 border-slate-800/80 opacity-80'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              {/* Task Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-cyan-400 text-sm">{task.taskNumber}</span>
                  <span className="text-xs font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                    {task.aircraftReg} ({task.aircraftModelName})
                  </span>
                  <span className="text-xs font-mono text-slate-400">{task.ataCode}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border uppercase ${
                      task.priority === 'AOG'
                        ? 'bg-red-950 text-red-400 border-red-800 animate-pulse'
                        : task.priority === 'High'
                        ? 'bg-amber-950 text-amber-400 border-amber-800'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {task.priority}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                      isCompleted
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : task.status === 'In Progress'
                        ? 'bg-blue-950 text-blue-400 border-blue-800'
                        : task.status === 'Waiting for Parts'
                        ? 'bg-amber-950 text-amber-400 border-amber-800'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>

              {/* Task Title & Defect */}
              <div className="space-y-1">
                <h3 className="text-base font-black text-white">{task.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-slate-400">Defect Summary:</strong> {task.reportedDefect}</p>
              </div>

              {/* Allocated Parts & Tools */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Required Parts Allocation:</span>
                  {task.requiredParts.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-emerald-400 font-bold">{p.partNumber} ({p.qty}x)</span>
                      <span className="text-slate-300">{p.description}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Calibration Tools Needed:</span>
                  <div className="text-[11px] text-slate-300 font-mono">{task.requiredTools.join(', ')}</div>
                </div>
              </div>

              {/* Inspector Sign-off / Role Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-4 text-slate-400">
                  <span>Assigned Tech: <strong className="text-slate-200">{task.technician}</strong></span>
                  <span>AMM Manual: <strong className="font-mono text-cyan-300">{task.ammReference}</strong></span>
                  {isCompleted && task.signedOffBy && (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Logbook Signed Off By: {task.signedOffBy}
                    </span>
                  )}
                </div>

                {/* Status Update Dropdown Trigger */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Update Task Status:</span>
                  <select
                    value={task.status}
                    onChange={e => updateTaskStatus(task.id, e.target.value as any)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-bold focus:outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Waiting for Parts">Waiting for Parts</option>
                    <option value="Completed">Completed & Signed Off</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" /> Issue New Maintenance Work Order
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Work Order Title / Component Task:</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. R&I Hydraulic Pump Assembly"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">ATA Chapter Code:</label>
                  <input
                    type="text"
                    value={newTaskAta}
                    onChange={e => setNewTaskAta(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Priority Level:</label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="AOG">AOG Aircraft On Ground</option>
                    <option value="High">High</option>
                    <option value="Routine">Routine</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Reported Defect Description:</label>
                <textarea
                  rows={3}
                  value={newTaskDefect}
                  onChange={e => setNewTaskDefect(e.target.value)}
                  placeholder="Describe pilot defect log or line maintenance finding..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Assigned Lead Technician:</label>
                  <input
                    type="text"
                    value={newTaskTechnician}
                    onChange={e => setNewTaskTechnician(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">AMM Reference Manual:</label>
                  <input
                    type="text"
                    value={newTaskAmm}
                    onChange={e => setNewTaskAmm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-slate-800 text-slate-300 hover:bg-slate-700 px-4 py-2 rounded-xl border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-5 py-2 rounded-xl shadow-lg"
                >
                  Dispatch Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
