import { AlertTriangle, XCircle, AlertCircle, Info } from 'lucide-react';
import type { Alert } from '../types';

interface AlertPanelProps {
  alerts: Alert[];
}

export default function AlertPanel({ alerts }: AlertPanelProps) {
  const getSeverityIcon = (severity: string) => {
    const icons = {
      low: Info,
      medium: AlertCircle,
      high: AlertTriangle,
      critical: XCircle,
    };
    return icons[severity as keyof typeof icons] || AlertTriangle;
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
      medium: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
      high: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
      critical: 'text-red-500 bg-red-500/10 border-red-500/30',
    };
    return colors[severity as keyof typeof colors] || colors.medium;
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Active Alerts</h3>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = getSeverityIcon(alert.severity);
          const colorClass = getSeverityColor(alert.severity);

          return (
            <div
              key={alert.id}
              className={`rounded-lg border p-4 ${colorClass}`}
            >
              <div className="flex items-start space-x-3">
                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-white">{alert.alert_type}</h4>
                    <span className="text-xs px-2 py-1 bg-gray-900/50 rounded capitalize">
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
                  {alert.device && (
                    <p className="text-xs text-gray-400">
                      Device: {alert.device.name} ({alert.device.type})
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
