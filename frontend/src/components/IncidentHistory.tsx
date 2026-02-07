import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { Alert } from '../types';

interface IncidentHistoryProps {
  incidents: Alert[];
}

export default function IncidentHistory({ incidents }: IncidentHistoryProps) {
  const getStatusIcon = (status: string) => {
    const icons = {
      resolved: CheckCircle,
      investigating: AlertTriangle,
      active: XCircle,
    };
    return icons[status as keyof typeof icons] || Clock;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      resolved: 'text-green-500',
      investigating: 'text-yellow-500',
      active: 'text-red-500',
    };
    return colors[status as keyof typeof colors] || 'text-gray-500';
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Incidents</h3>

      <div className="space-y-3">
        {incidents.length === 0 ? (
          <p className="text-gray-400 text-sm">No incidents recorded</p>
        ) : (
          incidents.map((incident) => {
            const Icon = getStatusIcon(incident.status);
            const statusColor = getStatusColor(incident.status);

            return (
              <div
                key={incident.id}
                className="bg-gray-900 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start space-x-3 flex-1">
                    <Icon className={`w-5 h-5 mt-0.5 ${statusColor}`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white">{incident.alert_type}</h4>
                      <p className="text-sm text-gray-400 mt-1">{incident.message}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded bg-gray-800 capitalize ${statusColor}`}>
                    {incident.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                  <span>{new Date(incident.detected_at).toLocaleString()}</span>
                  <span className="capitalize">{incident.severity} severity</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
