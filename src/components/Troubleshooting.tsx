import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_TROUBLESHOOTING_FLOWS } from '../data/mockData';
import { DiagnosticStep } from '../types';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  FileText,
  PackageCheck,
  ShieldAlert,
} from 'lucide-react';

export const Troubleshooting: React.FC = () => {
  const {
    selectedTroubleshootingFlow,
    setSelectedTroubleshootingFlow,
    setSelectedPartForDetail,
    setActiveTab,
    addTask,
    selectedAircraft,
  } = useApp();

  const flow = selectedTroubleshootingFlow || MOCK_TROUBLESHOOTING_FLOWS[0];

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [stepStatuses, setStepStatuses] = useState<Record<string, 'PASSED' | 'FAILED' | 'SKIPPED'>>({});
  const [diagnosticOutcome, setDiagnosticOutcome] = useState<string | null>(null);

  const currentStep: DiagnosticStep | undefined = flow.steps[currentStepIndex];

  const handleTestResult = (status: 'PASSED' | 'FAILED' | 'SKIPPED') => {
    if (!currentStep) return;

    setStepStatuses(prev => ({ ...prev, [currentStep.id]: status }));

    if (status === 'PASSED') {
      if (currentStepIndex + 1 < flow.steps.length) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        setDiagnosticOutcome('SYSTEM TEST PASSED — Operational parameters nominal. Verify documentation & sign off logbook.');
      }
    } else if (status === 'FAILED') {
      setDiagnosticOutcome(
        `DEFECT CONFIRMED AT STEP ${currentStep.stepNumber}: ${currentStep.action}. Component replacement / repair recommended: P/N ${currentStep.relatedPartNumbers.join(', ')}.`
      );
    } else {
      if (currentStepIndex + 1 < flow.steps.length) {
        setCurrentStepIndex(prev => prev + 1);
      }
    }
  };

  const resetDiagnostic = () => {
    setCurrentStepIndex(0);
    setStepStatuses({});
    setDiagnosticOutcome(null);
  };

  const handleCreateTaskFromDiagnosis = () => {
    addTask({
      aircraftReg: 'N737AF',
      aircraftModelId: selectedAircraft.id,
      aircraftModelName: selectedAircraft.name,
      serialNumberMSN: 'MSN 38291',
      ataCode: flow.ataCode,
      title: `Corrective Action: ${flow.title}`,
      reportedDefect: flow.reportedDefect,
      priority: 'AOG',
      technician: 'Marcus Vance (A&P)',
      inspector: 'Elena Rostova (IA)',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'In Progress',
      requiredParts: (currentStep?.relatedPartNumbers || []).map(pn => ({
        partNumber: pn,
        description: 'Replacement Component identified via FIM Diagnosis',
        qty: 1,
        status: 'Allocated',
      })),
      requiredTools: currentStep?.requiredTools || [],
      findings: `Defect isolated during interactive troubleshooting flow step #${currentStepIndex + 1}: ${currentStep?.action}`,
      correctiveAction: `Perform R&I per ${currentStep?.ammReference || 'AMM Manual'}.`,
      hoursLogged: 1.5,
      ammReference: currentStep?.ammReference || 'AMM 32-51-11',
    });
    setActiveTab('maintenance');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Wrench className="w-4 h-4" /> Interactive Diagnostic & Fault Isolation Engine
          </div>
          <h2 className="text-xl font-black text-white mt-1">{flow.title}</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Aircraft: <strong className="text-slate-200">{flow.aircraftModelName}</strong> | System: <strong className="text-cyan-400">{flow.ataCode} {flow.systemName}</strong>
          </p>
        </div>

        {/* Select Flow Selector */}
        <select
          value={flow.id}
          onChange={e => {
            const next = MOCK_TROUBLESHOOTING_FLOWS.find(f => f.id === e.target.value);
            if (next) {
              setSelectedTroubleshootingFlow(next);
              resetDiagnostic();
            }
          }}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
        >
          {MOCK_TROUBLESHOOTING_FLOWS.map(f => (
            <option key={f.id} value={f.id}>{f.title}</option>
          ))}
        </select>
      </div>

      {/* Defect Context Banner */}
      <div className="bg-slate-900/90 border border-amber-900/50 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Reported Defect Log
          </span>
          <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
            FIM Ref: {flow.ataCode}
          </span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-medium">{flow.reportedDefect}</p>

        {/* Symptoms Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Symptoms:</span>
          {flow.symptoms.map(symptom => (
            <span key={symptom} className="text-[10px] font-medium bg-amber-950/80 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded-full">
              • {symptom}
            </span>
          ))}
        </div>
      </div>

      {/* Main Troubleshooting Stage: Left Causes Table, Right Interactive Test Step */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Probable Causes Ranked by Relevance (Col Span 5) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Diagnostic Probable Causes (Priority Ranked)
            </h3>
            <p className="text-[11px] text-slate-400">Order based on historical fleet reliability statistics</p>
          </div>

          <div className="space-y-3">
            {flow.possibleCauses.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-100">#{idx + 1} {item.cause}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      item.probability === 'High'
                        ? 'bg-red-950 text-red-400 border-red-800'
                        : item.probability === 'Medium'
                        ? 'bg-amber-950 text-amber-400 border-amber-800'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {item.probability} Probability
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">System: <strong className="text-cyan-300">{item.system}</strong></div>
                <p className="text-[10px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
                  Required Inspection: {item.inspection}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Interactive Step-by-Step Testing Workflow (Col Span 7) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <div>
            {/* Header & Step Counter */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Step {currentStepIndex + 1} of {flow.steps.length}
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  {currentStep ? currentStep.action : 'Diagnostic Sequence Complete'}
                </h3>
              </div>
              <button
                onClick={resetDiagnostic}
                className="text-xs text-slate-400 hover:text-slate-200 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restart
              </button>
            </div>

            {/* Step Progress Tracker Bar */}
            <div className="flex items-center gap-1 my-4">
              {flow.steps.map((st, i) => {
                const stStatus = stepStatuses[st.id];
                return (
                  <div
                    key={st.id}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      stStatus === 'PASSED'
                        ? 'bg-emerald-500'
                        : stStatus === 'FAILED'
                        ? 'bg-red-500'
                        : i === currentStepIndex
                        ? 'bg-cyan-400 ring-2 ring-cyan-500/50'
                        : 'bg-slate-800'
                    }`}
                  />
                );
              })}
            </div>

            {/* Diagnostic Outcome Box if complete/failed */}
            {diagnosticOutcome ? (
              <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-600/80 space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-white text-sm">Diagnostic Outcome Conclusion</h4>
                    <p className="text-xs text-amber-200 mt-1 leading-relaxed">{diagnosticOutcome}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-amber-900/60">
                  <button
                    onClick={handleCreateTaskFromDiagnosis}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg"
                  >
                    <PackageCheck className="w-4 h-4" /> Create Maintenance Work Order & Order Parts
                  </button>
                  <button
                    onClick={resetDiagnostic}
                    className="bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700"
                  >
                    Re-Run Diagnosis
                  </button>
                </div>
              </div>
            ) : currentStep ? (
              <div className="space-y-4">
                {/* Detailed Test Instructions */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Technical Inspection Procedure:</div>
                  <p className="text-slate-200 leading-relaxed font-medium">{currentStep.inspectionDetail}</p>
                </div>

                {/* Required Calibration Tools */}
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Required Tools & Equipment:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentStep.requiredTools.map(tl => (
                      <span key={tl} className="text-[11px] font-mono bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700">
                        • {tl}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expected Technical Result */}
                <div className="bg-emerald-950/30 border border-emerald-800/50 p-3 rounded-xl text-xs text-emerald-300">
                  <strong className="text-emerald-400">Expected Result (Pass Criteria):</strong> {currentStep.expectedResult}
                </div>

                {/* AMM Reference & Part Numbers */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800 gap-2">
                  <div>Approved AMM Reference: <span className="font-mono text-cyan-300 font-bold">{currentStep.ammReference}</span></div>
                  <div>Related Part Numbers: <span className="font-mono text-emerald-400 font-bold">{currentStep.relatedPartNumbers.join(', ')}</span></div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Action Trigger Buttons for Technician */}
          {!diagnosticOutcome && (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider text-center">
                Technician Action Entry — Mark Test Result:
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleTestResult('PASSED')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-transform"
                >
                  <CheckCircle2 className="w-4 h-4" /> TEST PASSED
                </button>

                <button
                  onClick={() => handleTestResult('FAILED')}
                  className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs py-3 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-transform"
                >
                  <XCircle className="w-4 h-4" /> TEST FAILED
                </button>

                <button
                  onClick={() => handleTestResult('SKIPPED')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3 px-3 rounded-xl flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" /> NOT APPLICABLE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
