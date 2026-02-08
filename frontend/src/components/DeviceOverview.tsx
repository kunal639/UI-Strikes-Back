import { Wifi, WifiOff, Camera, Thermometer, Lock, Lightbulb, Speaker } from 'lucide-react';
import type { Device, RiskLevel } from '../types';

interface DeviceOverviewProps {
  devices: Device[];
  onUnblock: (id: number) => void;
  highlightId: number | null; 
}

export default function DeviceOverview({ devices, onUnblock, highlightId }: DeviceOverviewProps) {
  const getDeviceIcon = (type: string) => {
    const icons: Record<string, any> = {
      camera: Camera,
      thermostat: Thermometer,
      lock: Lock,
      light: Lightbulb,
      speaker: Speaker,
    };
    return icons[type] || Wifi;
  };

  const getRiskColor = (level: RiskLevel) => {
    const colors = {
      safe: 'text-green-400 bg-green-500/10 border-green-500/20',
      warning: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
      high: 'text-red-400 bg-red-500/10 border-red-500/20',
    };
    return colors[level];
  };

  return (
    // Changed to a transparent glass container
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight uppercase tracking-widest text-sm opacity-80">Connected Nodes</h3>
        <div className="flex items-center space-x-2">
           <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
           <span className="text-[10px] text-gray-500 font-mono uppercase font-bold">Scanning Live Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => {
          const Icon = getDeviceIcon(device.type);
          const isOnline = device.status === 'online';
          
          const isTargeted = device.id === highlightId;

          return (
            <div
              key={device.id}
              // Changed to Premium Glass card with hover glow
              className={`group relative bg-gray-900/40 backdrop-blur-md rounded-xl border p-5 transition-all duration-500 overflow-hidden ${
                isTargeted 
                  ? 'border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.2)] scale-[1.02]' 
                  : 'border-white/5 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]'
              }`}
            >
              {/* Subtle hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {isTargeted && (
                <div className="absolute top-0 right-0 p-2">
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                </div>
              )}
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-lg transition-colors ${!isOnline ? 'bg-red-500/10 text-red-500' : 'bg-gray-800 text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-blue-100 transition-colors">{device.name}</h4>
                      <p className="text-[10px] text-gray-500 uppercase font-mono tracking-widest leading-none mt-1">{device.type}</p>
                    </div>
                  </div>
                  {isOnline ? (
                    <Wifi className="w-4 h-4 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-500 animate-pulse" />
                  )}
                </div>

                <div className="flex items-center justify-between mt-6">
                <span className="text-sm font-mono font-medium text-blue-400/80 tracking-normal">{device.ip_address}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getRiskColor(device.risk_level)}`}>
                    {device.risk_level}
                  </span>
                </div>

                {!isOnline && (
                  <button 
                    onClick={() => onUnblock(device.id)}
                    className="mt-4 w-full py-2 text-[10px] font-black uppercase tracking-widest bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all shadow-lg active:scale-95"
                  >
                    Authorize Restoration
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}