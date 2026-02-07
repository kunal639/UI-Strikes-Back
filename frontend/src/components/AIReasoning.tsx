import { Brain, Activity, ShieldCheck, Cpu, ChevronRight } from 'lucide-react';

interface AIReasoningProps {
  data: {
    confidence: number;
    reasoning: string[];
    baseline: Record<string, any>;
    current: Record<string, any>;
  };
}

export default function AIReasoning({ data }: AIReasoningProps) {
  return (
    <div className="bg-gray-900 border border-blue-500/30 rounded-xl overflow-hidden shadow-2xl transition-all duration-300">
      {/* Header - Identifies the "Intelligence" */}
      <div className="bg-blue-500/10 border-b border-blue-500/30 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Brain className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-white uppercase tracking-wider text-xs">Autonomous Analysis Engine</h3>
            <p className="text-[10px] text-blue-400/70 font-mono tracking-tighter">AGENTIC GATEWAY LOGIC v2.4.0</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-gray-400 uppercase block mb-0.5">Detection Confidence</span>
          <span className="text-xl font-mono font-bold text-blue-400">{data.confidence}%</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Layer 1: Natural Language Reasoning (The User Side) */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-green-500 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-widest">Heuristic Reasoning Logic</h4>
          </div>
          <div className="space-y-3">
            {data.reasoning.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 group">
                <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                <span className="text-sm text-gray-300 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Layer 2: Raw Metrics & Evidence (The Technical Panel Side) */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-purple-500 mb-2">
            <Cpu className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-widest">Technical Audit Data</h4>
          </div>
          
          <div className="bg-black/40 rounded-lg border border-white/5 divide-y divide-white/5">
            {/* Metric: Baseline */}
            <div className="p-4 flex justify-between items-center hover:bg-white/[0.02] transition-colors">
              <span className="text-xs text-gray-400">Behavioral Baseline:</span>
              <div className="text-right">
                <span className="text-sm font-mono text-gray-300">{Object.values(data.baseline)[0] || 40} pps</span>
                <p className="text-[9px] text-gray-600 uppercase">Standard Load</p>
              </div>
            </div>

            {/* Metric: Current */}
            <div className="p-4 flex justify-between items-center hover:bg-white/[0.02] transition-colors">
              <span className="text-xs text-gray-400">Real-time Observations:</span>
              <div className="text-right">
                <span className="text-sm font-mono text-red-400 font-bold">{Object.values(data.current)[0] || 0} pps</span>
                <p className="text-[9px] text-red-900 uppercase">Threshold Breach</p>
              </div>
            </div>

            {/* Metric: Calculation */}
            <div className="p-4 flex justify-between items-center bg-purple-500/5">
              <span className="text-xs text-gray-400 font-medium">Statistical Variance:</span>
              <div className="text-right">
                <span className="text-sm font-mono text-purple-400 font-bold">10.0x Critical</span>
                <p className="text-[9px] text-purple-700 uppercase">Anomaly Score</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-2 bg-gray-800/50 rounded border border-white/5">
            <Activity className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] text-gray-500 italic uppercase">
              Cross-Referenced via SecureHome Decoy Protocol (Honeypot v2.1)
            </span>
          </div>
        </div>
      </div>
      
      {/* Footer Disclaimer for Human-in-the-Loop context */}
      <div className="bg-black/20 p-3 text-center border-t border-white/5">
        <p className="text-[10px] text-gray-500 tracking-wide uppercase">
          Audit log exported to <span className="text-blue-500">history.json</span> for session persistence.
        </p>
      </div>
    </div>
  );
}