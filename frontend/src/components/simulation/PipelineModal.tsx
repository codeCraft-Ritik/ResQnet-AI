import React, { useState } from 'react';
import { Play, X, Clock, Sparkles } from 'lucide-react';
import { executePipelineDemo } from '../../services/simulationService';
import { PipelineStep } from '../../types/risk';

interface PipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PipelineModal: React.FC<PipelineModalProps> = ({ isOpen, onClose }) => {
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<PipelineStep[]>([]);

  if (!isOpen) return null;

  const handleRunPipeline = async () => {
    setRunning(true);
    setSteps([]);

    try {
      const data = await executePipelineDemo();
      for (let i = 0; i < data.pipeline_timeline.length; i++) {
        setSteps(prev => [...prev, data.pipeline_timeline[i]]);
        await new Promise(r => setTimeout(r, 220));
      }
    } catch (err) {
      console.warn('Pipeline demo error:', err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
      style={{ isolation: 'isolate' }}
    >
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-ocean-400" />
              <h3 className="font-bold text-lg text-slate-100">8-Stage Disaster Response Pipeline</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live automated execution: Sense ──► Verify ──► Predict ──► Simulate ──► Decide ──► Act ──► Alert ──► Learn
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {steps.length === 0 && !running && (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-ocean-500/10 text-ocean-400 flex items-center justify-center mx-auto border border-ocean-500/30">
                <Play className="w-6 h-6 ml-0.5" />
              </div>
              <h4 className="font-bold text-slate-200">Ready to Trigger Autonomous Pipeline</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Watch RESQNET AI ingest heterogeneous data streams, compute Bayesian consensus, simulate inundation, and trigger evacuation actions in real time.
              </p>
              <button
                onClick={handleRunPipeline}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-ocean-600 to-ocean-700 hover:from-ocean-500 hover:to-ocean-600 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg"
              >
                Execute 8-Stage Operational Pipeline
              </button>
            </div>
          )}

          {running && steps.length === 0 && (
            <div className="text-center py-8 text-xs text-ocean-400 font-mono animate-pulse">
              Initializing neural models and sensor gateway sockets...
            </div>
          )}

          {/* Timeline Steps */}
          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.step}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-850/80 border border-slate-700/80 transition-all animate-in slide-in-from-bottom-2"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  {step.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                      <span className="text-ocean-400 font-mono">[{step.stage}]</span>
                      <span>{step.event}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded shrink-0">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {step.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {step.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            {steps.length > 0 ? `${steps.length}/8 Stages Completed` : 'Ready'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRunPipeline}
              disabled={running}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-ocean-600 hover:bg-ocean-500 text-white transition-colors disabled:opacity-50"
            >
              {running ? 'Running...' : 'Re-Run Pipeline'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
