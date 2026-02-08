import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DeviceOverview from './components/DeviceOverview';
import AlertPanel from './components/AlertPanel';
import NetworkActivity from './components/NetworkActivity';
import ValidationTimeline from './components/ValidationTimeline';
import ActionPanel from './components/ActionPanel';
import AIReasoning from './components/AIReasoning';
import IncidentHistory from './components/IncidentHistory';
import type { Device, Alert, SecurityState, ValidationStep } from './types';
import SimulationControl from './components/SimulateControl';

// Define the API Base URL
const API_BASE = "http://localhost:8000"; // Update this to your FastAPI port

function App() {
  // --- 1. UI NAVIGATION STATE ---
  const [activeSection, setActiveSection] = useState('overview');

  // --- 2. AGENTIC SYSTEM STATE (The "Brain" results) ---
  const [securityState, setSecurityState] = useState<SecurityState>('normal');
  const [confidence, setConfidence] = useState(0);
  const [affectedDeviceId, setAffectedDeviceId] = useState<number | null>(null);

  // --- 3. DATA & TELEMETRY STATE ---
  const [devices, setDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [allIncidents, setAllIncidents] = useState<Alert[]>([]);
  const [validationSteps, setValidationSteps] = useState<ValidationStep[]>([]);
  const [showActions, setShowActions] = useState(false);

  // --- 4. THE REACTIVE SYNC (Polling the Agent) ---
  useEffect(() => {
    const syncWithAgent = async () => {
      try {
        // 1. Fetch Global State (Status, Confidence, Affected ID)
        const stateRes = await fetch(`${API_BASE}/state`);
        const stateData = await stateRes.json();
  
        setSecurityState(stateData.status);
        setConfidence(stateData.confidence);
        setAffectedDeviceId(stateData.affected_device);
        setShowActions(stateData.status === 'validated');
  
        // 2. FETCH DEVICE DATA (This makes the numbers jump in the UI!)
        const devicesRes = await fetch(`${API_BASE}/devices`);
        const devicesData = await devicesRes.json();
        setDevices(devicesData);
  
        // 3. FETCH HISTORY (This shows new incident logs automatically)
        const historyRes = await fetch(`${API_BASE}/history`);
        const historyData = await historyRes.json();
        setAllIncidents(historyData);
  
        // 4. Update Progress Steps
        const steps: ValidationStep[] = [
          { id: '1', label: 'Monitoring Baseline', status: 'completed' },
          { id: '2', label: 'Anomaly Detection', status: stateData.status !== 'normal' ? 'completed' : 'active' },
          { id: '3', label: 'Threat Validation', status: stateData.status === 'validated' ? 'completed' : (stateData.status === 'anomaly' ? 'active' : 'pending') },
          { id: '4', label: 'Response Ready', status: stateData.status === 'validated' ? 'active' : 'pending' },
        ];
        setValidationSteps(steps);
  
      } catch (error) {
        console.error("Agent Sync Error:", error);
      }
    };
  
    // Run the first sync immediately
    syncWithAgent();
  
    const interval = setInterval(syncWithAgent, 2000);
    return () => clearInterval(interval);
  }, []); // Empty dependency array is correct

  // --- API CALLS ---

  const fetchData = useCallback(async () => {
    try {
      // 1. Fetch Devices
      const devRes = await fetch(`${API_BASE}/devices`);
      const devicesData = await devRes.json();
      setDevices(devicesData);

      // 2. Fetch System State
      const historyRes = await fetch(`${API_BASE}/history`);
      const historyData = await historyRes.json();
      setAllIncidents(historyData);

      const stateRes = await fetch(`${API_BASE}/state`);
      const sysState = await stateRes.json();

      // Map Backend Status to Frontend SecurityState
      // Backend: "normal", "anomaly", "validated"
      if (sysState.status === 'normal') {
        setSecurityState('normal');
        setAlerts([]);
        setValidationSteps([]);
        setShowActions(false);
      } else if (sysState.status === 'anomaly') {
        setSecurityState('warning');
        generateAlertFromState(sysState, devicesData);
      } else if (sysState.status === 'validated') {
        setSecurityState('threat');
        setShowActions(true);
        generateAlertFromState(sysState, devicesData);
      }
    } catch (error) {
      console.error("Failed to fetch data from backend:", error);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchData();
    
    // Poll the backend every 3 seconds to get real-time updates
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Helper to sync backend anomaly with frontend Alert UI
  const generateAlertFromState = (sysState: any, currentDevices: Device[]) => {
    const affectedDevice = currentDevices.find(d => String(d.id) === String(sysState.affected_device));
    if (!affectedDevice) return;

    const newAlert: Alert = {
      id: `alert-${sysState.affected_device}`,
      device_id: String(sysState.affected_device),
      alert_type: 'Unusual Network Activity',
      severity: sysState.status === 'validated' ? 'high' : 'medium',
      message: `Activity spike: ${affectedDevice.name} is operating at 10x baseline.`,
      status: sysState.status === 'validated' ? 'active' : 'investigating',
      confidence: sysState.confidence ? sysState.confidence * 100 : 75,
      detected_at: new Date().toISOString(),
      device: affectedDevice,
    };
    setAlerts([newAlert]);

    // Update Validation Timeline based on status
    const steps: ValidationStep[] = [
      { id: '1', label: 'Monitoring Baseline', status: 'completed' },
      { id: '2', label: 'Anomaly Detection', status: 'completed' },
      { id: '3', label: 'Threat Validation', status: sysState.status === 'validated' ? 'completed' : 'active' },
      { id: '4', label: 'Response Ready', status: sysState.status === 'validated' ? 'active' : 'pending' },
    ];
    setValidationSteps(steps);
  };

  const handleUnblock = async (id: number) => {
    // Matches @router.post("/devices/unblock/{device_id}")
    await fetch(`${API_BASE}/devices/unblock/${id}`, { method: 'POST' });
    fetchData();
  };
  
  const handleApprove = async () => {
    if (!affectedDeviceId) return;
  
    try {
      // 1. Tell the backend to block the specific device
      const response = await fetch(`${API_BASE}/devices/${affectedDeviceId}/block`, {
        method: 'POST',
      });
  
      if (response.ok) {
        // 2. Clear local UI states
        setShowActions(false);
        
        // The Agent Loop will now automatically see the device is offline,
        // stop seeing the spike, and move securityState back to 'normal'.
        console.log(`Device ${affectedDeviceId} successfully neutralized.`);
      }
    } catch (error) {
      console.error("Action Error:", error);
    }
  };

  const handleReject = async () => {
    try {
      // Tell the backend to reset the simulation state
      await fetch(`${API_BASE}/simulate/reset`, { method: 'POST' });
      setShowActions(false);
    } catch (error) {
      console.error("Reset Error:", error);
    }
  };

  const handleTriggerAnomaly = async (id: number) => {
    await fetch(`${API_BASE}/simulate/anomaly/${id}`, { method: 'POST' });
    fetchData();
  };
  
  const handleTriggerValidation = async (id: number) => {
    await fetch(`${API_BASE}/simulate/validate/${id}`, { method: 'POST' });
    fetchData();
  };
  
  const handleReset = async () => {
    await fetch(`${API_BASE}/simulate/normal`, { method: 'POST' });
    fetchData();
  };

  // --- UI MAPPING DATA ---
  // (Static logic for charts based on current alert)
  const networkData = alerts.length > 0 ? [
    { label: 'T-10', current: alerts[0].device?.baseline_activity || 40, baseline: alerts[0].device?.baseline_activity || 40 },
    { label: 'T-5', current: alerts[0].device?.baseline_activity || 40, baseline: alerts[0].device?.baseline_activity || 40 },
    { label: 'NOW', current: alerts[0].device?.current_activity || 0, baseline: alerts[0].device?.baseline_activity || 40 },
  ] : [
    { label: 'IDLE', current: 10, baseline: 40 },
    { label: 'SCAN', current: 12, baseline: 40 },
  ];

  return (
    <div className="flex h-screen bg-[#020408] text-white overflow-hidden relative font-sans">
      
      {/* --- 1. DESIGN LAYER: CYBER GRID --- */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none" 
        style={{ 
          backgroundImage: `
            linear-gradient(to right, #1e293b 1px, transparent 1px),
            linear-gradient(to bottom, #1e293b 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(circle at center, black, transparent 85%)'
        }}
      />
  
      {/* --- 2. DESIGN LAYER: DYNAMIC AMBIENT GLOW --- */}
      <div className={`fixed top-0 left-64 right-0 h-[2px] transition-all duration-1000 z-50 ${
        securityState === 'threat' ? 'bg-red-500 shadow-[0_0_60px_20px_rgba(239,68,68,0.4)]' : 
        securityState === 'warning' ? 'bg-yellow-500 shadow-[0_0_60px_20px_rgba(234,179,8,0.4)]' : 
        'bg-blue-500 shadow-[0_0_60px_20px_rgba(59,130,246,0.3)]'
      }`} />
  
      {/* --- 3. DESIGN LAYER: RADIAL ATMOSPHERE --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
  
      {/* --- SIDEBAR --- */}
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} securityState={securityState} affectedDeviceId={affectedDeviceId} />
      
      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header securityState={securityState} confidence={confidence} />
        
        <main className="flex-1 overflow-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* --- OVERVIEW TAB --- */}
{activeSection === 'overview' && (
  <div className="space-y-8 animate-in fade-in duration-500">
    {/* 1. ALWAYS show the inventory so we can see nodes turn red/glow */}
    <DeviceOverview 
      devices={devices} 
      onUnblock={handleUnblock} 
      highlightId={affectedDeviceId} 
    />

    {/* 2. Show History when normal, OR show the Agent Intelligence when there's a threat */}
    {securityState === 'normal' ? (
      <IncidentHistory incidents={allIncidents} />
    ) : (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-6">
          {alerts.length > 0 && <AlertPanel alerts={alerts} />}
          <NetworkActivity data={networkData} securityState={securityState} />
          <ValidationTimeline steps={validationSteps} />
          
          {showActions && (
            <ActionPanel
              onApprove={handleApprove}
              onReject={handleReject}
              recommendation="Anomaly validated by Honeypot. Block device?"
            />
          )}
        </div>

        <div className="space-y-6">
          <AIReasoning data={{
            confidence: confidence, // Use the real state from the Agent
            reasoning: [
              `Activity spike detected on NODE_${affectedDeviceId}.`,
              "Interaction with network honeypot confirmed.",
              "Pattern matches known data exfiltration behavior."
            ],
            baseline: { "Baseline Activity": devices.find(d => d.id === affectedDeviceId)?.baseline_activity || 0 },
            current: { "Current Activity": devices.find(d => d.id === affectedDeviceId)?.current_activity || 0 }
          }} />
                  <IncidentHistory incidents={allIncidents} />
                </div>
              </div>
            )}
          </div>
        )}
  
            {/* --- DEVICES TAB --- */}
            {activeSection === 'devices' && (
              <DeviceOverview devices={devices} onUnblock={handleUnblock} highlightId={affectedDeviceId} />
            )}
  
            {/* --- ALERTS TAB --- */}
            {activeSection === 'alerts' && (
              <AlertPanel alerts={alerts} />
            )}
  
            {/* --- ACTIVITY (SECURITY TESTING) TAB --- */}
            {activeSection === 'activity' && (
              <div className="space-y-6">
                <NetworkActivity data={networkData} securityState={securityState} />
                <SimulationControl 
                  devices={devices}
                  onTriggerAnomaly={handleTriggerAnomaly}
                  onTriggerValidation={handleTriggerValidation}
                  onReset={handleReset}
                />
              </div>
            )}
  
            {/* --- HISTORY TAB --- */}
            {activeSection === 'history' && (
              <IncidentHistory incidents={allIncidents} />
            )}
  
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;