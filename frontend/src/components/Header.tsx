import { Shield, Bell, Settings, Activity, Terminal } from 'lucide-react';

interface HeaderProps {
  securityState: 'normal' | 'warning' | 'threat';
  confidence: number; // Add this line
}

export default function Header({ securityState, confidence }: HeaderProps) {
  return (
    <header className="h-20 bg-[#020408]/80 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-6">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-mono font-bold text-gray-400 tracking-tighter uppercase">Gateway Node: KVN-01</span>
          </div>
          <h1 className="text-sm font-bold text-white uppercase tracking-[0.2em]">SecureHome Protocol</h1>
        </div>

        <div className="flex items-center space-x-3 px-6 border-l border-white/10 h-10">
          <Activity className={`w-4 h-4 transition-colors duration-500 ${
            securityState === 'normal' ? 'text-blue-500/50' : 'text-red-500 animate-pulse'
          }`} />
          
          <div className="flex flex-col items-start">
            <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Logic Pulse</span>
            <div className="flex items-end space-x-1 h-3">
              <div className={`w-1 rounded-full transition-all duration-300 ${securityState === 'normal' ? 'bg-blue-500/40 animate-[bounce_1s_infinite_0.1s]' : 'bg-red-500 animate-pulse h-4'}`} />
              <div className={`w-1 rounded-full transition-all duration-300 ${securityState === 'normal' ? 'bg-blue-500 animate-[bounce_1s_infinite_0.2s] h-4' : 'bg-red-500 animate-pulse h-2'}`} />
              <div className={`w-1 rounded-full transition-all duration-300 ${securityState === 'normal' ? 'bg-blue-500/40 animate-[bounce_1s_infinite_0.3s]' : 'bg-red-500 animate-pulse h-3'}`} />
            </div>
          </div>
        </div>

        {/* --- ADDED SECTION: AI CONFIDENCE --- */}
        {securityState !== 'normal' && (
          <div className="flex items-center space-x-3 px-6 border-l border-white/10 h-10 animate-in fade-in duration-500">
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">AI Certainty</span>
              <span className="text-xs font-mono text-blue-400">{(confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-1000" 
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-6">
        <div className={`px-4 py-1.5 rounded-full border flex items-center space-x-2 transition-all duration-500 ${
          securityState === 'normal' 
            ? 'bg-green-500/5 border-green-500/20' 
            : 'bg-red-500/10 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            securityState === 'normal' ? 'bg-green-500' : 'bg-red-500 animate-ping'
          }`} />
          <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${
            securityState === 'normal' ? 'text-green-500' : 'text-red-500'
          }`}>
            {securityState === 'normal' ? 'System Integrity: Optimal' : 'Active Breach Countermeasures'}
          </span>
        </div>

        <div className="flex items-center space-x-4 border-l border-white/10 pl-6">
          <button className="text-gray-500 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            {securityState !== 'normal' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020408]" />
            )}
          </button>
          <button className="text-gray-500 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 ml-2">
            <div className="text-right">
              <p className="text-xs font-bold text-white leading-none">Kunal</p>
              <p className="text-[10px] text-gray-500 leading-none mt-1 uppercase tracking-tighter font-mono">Sec-Admin</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center border border-white/10 shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}