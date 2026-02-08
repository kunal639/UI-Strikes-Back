import { Shield, LayoutDashboard, Tablet, AlertTriangle, History, Activity as ActivityIcon } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  securityState: 'normal' | 'warning' | 'threat';
  affectedDeviceId: number | null; // ADD THIS LINE
}

export default function Sidebar({ activeSection, onSectionChange, securityState, affectedDeviceId }: SidebarProps) {
  const sections = [
    { id: 'overview', label: 'Command Overview', icon: LayoutDashboard },
    { id: 'devices', label: 'IoT Inventory', icon: Tablet },
    { id: 'alerts', label: 'Incident Desk', icon: AlertTriangle },
    { id: 'activity', label: 'Security Testing', icon: ActivityIcon },
    { id: 'history', label: 'Audit Archives', icon: History },
  ];

  return (
    <div className="w-64 bg-[#020408] border-r border-white/5 flex flex-col relative z-50">
      {/* Brand Section */}
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className={`p-2 rounded-xl transition-all duration-500 ${
            securityState === 'normal' 
              ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
              : 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.6)] animate-pulse'
          }`}>
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase">Kavachin</span>
        </div>
        <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase ml-1">Agentic Gateway v2</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                isActive 
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-blue-500 shadow-[0_0_10px_#3b82f6] rounded-full" />
              )}
              
              <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className={`text-sm font-bold tracking-tight ${isActive ? 'text-white' : ''}`}>
                {section.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* --- REPLACED FOOTER: DYNAMIC AGENT STATUS --- */}
      <div className="p-6 border-t border-white/5 bg-black/20">
        {affectedDeviceId && securityState !== 'normal' ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] text-red-500 font-black uppercase tracking-widest animate-pulse">Breach Source</span>
              <span className="text-[10px] font-mono text-red-400">NODE_{affectedDeviceId}</span>
            </div>
            <div className="h-1 w-full bg-red-500/20 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 rounded-full w-full shadow-[0_0_10px_#dc2626]" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Network Load</span>
              <span className="text-[10px] font-mono text-blue-500">2.4 GB/s</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-1/3 shadow-[0_0_10px_#2563eb]" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}