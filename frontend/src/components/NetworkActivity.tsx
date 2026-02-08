import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Zap } from 'lucide-react';

interface NetworkActivityProps {
  data: any[];
  securityState: 'normal' | 'warning' | 'threat'; // ADD THIS LINE
}

export default function NetworkActivity({ data, securityState }: NetworkActivityProps) {
  // --- ADD THIS LOGIC TO SIMULATE THE SPIKE ---
  const processedData = data?.map((point, index) => {
    if (securityState !== 'normal' && index > data.length - 5) {
      return {
        ...point,
        current: point.current * 10, // Make it 10x higher
      };
    }
    return point;
  }) || [{ time: '0', current: 0 }];

  // Dynamic colors based on Agent's decision
  const chartColor = securityState === 'normal' ? '#3b82f6' : '#ef4444';

  return (
    <div className={`bg-gray-900/40 backdrop-blur-xl rounded-2xl border p-8 shadow-2xl relative overflow-hidden transition-colors duration-500 ${
      securityState === 'normal' ? 'border-white/5' : 'border-red-500/20'
    }`}>
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Activity className={`w-32 h-32 ${securityState === 'normal' ? 'text-blue-500' : 'text-red-500'}`} />
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${securityState === 'normal' ? 'bg-blue-500/20' : 'bg-red-500/20'}`}>
            <Zap className={`w-5 h-5 ${securityState === 'normal' ? 'text-blue-400' : 'text-red-400'}`} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">Traffic Analysis</h3>
            <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase">
              {securityState === 'normal' ? 'Real-time Port Monitoring' : 'ANOMALY DETECTED'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className={`flex items-center space-x-2 px-2 py-1 rounded border ${
            securityState === 'normal' ? 'bg-blue-500/5 border-blue-500/20' : 'bg-red-500/10 border-red-500/40'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full animate-ping ${securityState === 'normal' ? 'bg-blue-500' : 'bg-red-500'}`} />
            <span className={`text-[9px] font-mono font-bold uppercase tracking-widest ${
              securityState === 'normal' ? 'text-blue-500' : 'text-red-500'
            }`}>
              {securityState === 'normal' ? 'Live Stream' : 'Alert Stream'}
            </span>
          </div>

          <div className="flex space-x-4 border-l border-white/10 pl-6">
            <div className="text-right">
              <span className="block text-[9px] text-gray-500 uppercase font-bold">Inbound</span>
              <span className={`text-xs font-mono font-bold ${securityState === 'normal' ? 'text-blue-400' : 'text-red-400'}`}>
                {securityState === 'normal' ? '12.4 Mbps' : '148.9 Mbps'}
              </span>
            </div>
            {/* ... Outbound section ... */}
          </div>
        </div>
      </div>

      <div className="h-[280px] w-full relative overflow-hidden group">
        <div className={securityState === 'normal' ? 'animate-scan' : 'animate-scan-red'} />

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={processedData}>
            <defs>
              <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.05} />
            <XAxis dataKey="time" hide={true} />
            <YAxis hide={true} domain={[0, 'dataMax + 100']} /> {/* Expanded domain for spike */}
            <Tooltip 
              contentStyle={{ backgroundColor: '#020408', border: `1px solid ${chartColor}44`, borderRadius: '8px', fontSize: '10px', fontFamily: 'monospace' }}
              itemStyle={{ color: chartColor }}
            />
            <Area 
              type="monotone" 
              dataKey="current" 
              stroke={chartColor} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTraffic)" 
              animationDuration={1000}
              dot={false}
              activeDot={{ r: 6, stroke: chartColor, strokeWidth: 2, fill: '#020408' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* ... Footer ... */}
    </div>
  );
}