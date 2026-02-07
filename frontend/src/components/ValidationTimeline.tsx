import { Check, Loader2 } from 'lucide-react';
import type { ValidationStep } from '../types';

interface ValidationTimelineProps {
  steps: ValidationStep[];
}

export default function ValidationTimeline({ steps }: ValidationTimelineProps) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Validation Progress</h3>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-start space-x-4">
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step.status === 'completed'
                      ? 'bg-green-500 border-green-500'
                      : step.status === 'active'
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-gray-900 border-gray-700'
                  }`}
                >
                  {step.status === 'completed' && <Check className="w-4 h-4 text-white" />}
                  {step.status === 'active' && <Loader2 className="w-4 h-4 text-white animate-spin" />}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 h-12 mt-2 ${
                      step.status === 'completed' ? 'bg-green-500' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>

              <div className="flex-1 pt-1">
                <h4
                  className={`font-medium ${
                    step.status === 'pending' ? 'text-gray-500' : 'text-white'
                  }`}
                >
                  {step.label}
                </h4>
                {step.timestamp && (
                  <p className="text-xs text-gray-400 mt-1">{step.timestamp}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
