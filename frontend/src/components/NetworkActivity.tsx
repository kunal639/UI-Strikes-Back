import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Zap } from 'lucide-react';

interface NetworkActivityProps {
  data: any[];
}

export default function NetworkActivity({ data }: NetworkActivityProps) {
  return (
    <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-white/5 p-8 shadow-2xl relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Activity className="w-32 h-32 text-blue-500" />
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10">
  <div className="flex items-center space-x-3">
    <div className="p-2 bg-blue-500/20 rounded-lg">
      <Zap className="w-5 h-5 text-blue-400" />
    </div>
    <div>
      <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">Traffic Analysis</h3>
      <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase">Real-time Port Monitoring</p>
    </div>
  </div>

  <div className="flex items-center space-x-6"> {/* Added container for stats + badge */}
    {/* --- THE NEW LIVE STREAM BADGE --- */}
    <div className="flex items-center space-x-2 bg-red-500/5 px-2 py-1 rounded border border-red-500/20">
      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
      <span className="text-[9px] font-mono text-red-500 font-bold uppercase tracking-widest">Live Stream</span>
    </div>

    <div className="flex space-x-4 border-l border-white/10 pl-6">
      <div className="text-right">
        <span className="block text-[9px] text-gray-500 uppercase font-bold">Inbound</span>
        <span className="text-xs font-mono text-blue-400 font-bold">12.4 Mbps</span>
      </div>
      <div className="text-right border-l border-white/10 pl-4">
        <span className="block text-[9px] text-gray-500 uppercase font-bold">Outbound</span>
        <span className="text-xs font-mono text-purple-400 font-bold">2.1 Mbps</span>
      </div>
    </div>
  </div>
</div>

<div className="h-[280px] w-full relative overflow-hidden group">
  
  {/* The Cyber Scan Line */}
  <div className="animate-scan" />

  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data && data.length > 0 ? data : [{ time: '0', current: 0 }]}>
      <defs>
        <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
        </linearGradient>
      </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#ffffff" 
              opacity={0.05} 
            />
            <XAxis 
              dataKey="time" 
              hide={true} 
            />
            <YAxis 
              hide={true}
              domain={[0, 'dataMax + 20']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#020408', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '10px',
                fontFamily: 'monospace'
              }}
              itemStyle={{ color: '#3b82f6' }}
            />
            <Area 
        type="monotone" 
        dataKey="current" 
        stroke="#3b82f6" 
        strokeWidth={3}
        fillOpacity={1} 
        fill="url(#colorTraffic)" 
        animationDuration={1000}
        dot={false}
        activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#020408' }}
      />
    </AreaChart>
  </ResponsiveContainer>
</div>

      {/* Footer System Meta */}
      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-[9px] font-mono text-gray-600 uppercase tracking-tighter">Frequency: 500Hz</span>
        <span className="text-[9px] font-mono text-blue-500/50 uppercase tracking-tighter italic">Encrypted Data Stream Live</span>
      </div>
    </div>
  );
}