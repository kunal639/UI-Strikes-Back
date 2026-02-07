import { Zap, Target, RotateCcw, AlertCircle } from 'lucide-react';
import type { Device } from '../types';

interface SimulationControlProps {
  devices: Device[];
  onTriggerAnomaly: (id: number) => void;
  onTriggerValidation: (id: number) => void;
  onReset: () => void;
}

export default function SimulationControl({ devices, onTriggerAnomaly, onTriggerValidation, onReset }: SimulationControlProps) {
  // Focus on the first camera or first device for the case study
  const featuredDevice = devices.find(d => d.type === 'camera') || devices[0];

  if (!featuredDevice) return null;

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Security Case Study</h3>
          <p className="text-sm text-gray-400 mt-1">Simulate a targeted attack on a vulnerable IoT device to verify the KAVACHIN gateway protocol.</p>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center space-x-2 text-xs bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors border border-gray-600 text-gray-300 font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Laboratory State</span>
        </button>
      </div>

      {/* Single Featured Device Card */}
      <div className="bg-gray-900 rounded-xl border border-blue-500/20 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Active Test Target</span>
            </div>
            <h4 className="text-2xl font-bold text-white">{featuredDevice.name}</h4>
            <div className="flex items-center space-x-4 text-sm text-gray-500 font-mono">
              <span>IP: {featuredDevice.ip_address}</span>
              <span>Baseline: {featuredDevice.baseline_activity} pps</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onTriggerAnomaly(featuredDevice.id)}
              className="flex-1 flex items-center justify-center space-x-3 px-6 py-4 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-xl transition-all group"
            >
              <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="text-sm font-bold uppercase tracking-tight">Step 1: Simulate Spike</p>
                <p className="text-[10px] opacity-70">Inject anomalous traffic</p>
              </div>
            </button>

            <button
              onClick={() => onTriggerValidation(featuredDevice.id)}
              className="flex-1 flex items-center justify-center space-x-3 px-6 py-4 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition-all group"
            >
              <Target className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="text-sm font-bold uppercase tracking-tight">Step 2: Test Decoy</p>
                <p className="text-[10px] opacity-70">Verify honeypot hit</p>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 leading-relaxed italic">
            This module is for demonstration purposes. In a live environment, KAVACHIN identifies these patterns autonomously across all connected ports. For this MVP, we are focusing on the **{featuredDevice.name}** as our primary vulnerability case.
          </p>
        </div>
      </div>
    </div>
  );
}