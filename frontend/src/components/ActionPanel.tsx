import { ShieldAlert, CheckCircle, XCircle, Info } from 'lucide-react';

interface ActionPanelProps {
  onApprove: () => void;
  onReject: () => void;
  recommendation: string;
}

export default function ActionPanel({ onApprove, onReject, recommendation }: ActionPanelProps) {
  return (
    <div className="bg-red-950/20 border border-red-500/50 rounded-xl p-6 shadow-2xl">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-red-500/20 rounded-full">
          <ShieldAlert className="w-6 h-6 text-red-500" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500">Security Protocol: Pending Approval</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Recommended Response</h3>
          <p className="text-gray-300 mb-4 text-lg">
            {recommendation}
          </p>

          {/* Safety Disclaimer */}
          <div className="flex items-center space-x-2 bg-black/30 p-3 rounded-lg border border-white/10 mb-6">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <p className="text-xs text-gray-400 italic">
              Safety Check: KAVACHIN has not taken any automatic action. This device will remain connected to your network until you authorize a quarantine.
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onApprove}
              className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Authorize Block</span>
            </button>
            <button
              onClick={onReject}
              className="flex-1 flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-all border border-gray-600"
            >
              <XCircle className="w-5 h-5" />
              <span>Dismiss Alert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}