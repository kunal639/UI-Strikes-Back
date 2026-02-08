from fastapi import FastAPI
from routes import router
from fastapi.middleware.cors import CORSMiddleware
import threading
import time

# --- 1. THE AGENT EVALUATOR (THE BRAIN) ---
def evaluate_security_state():
    from state import devices, system_state, incident_history, save_history
    import time

    found_anomaly = False
    affected_device = None

    # 1. Look for the spike (Scanning all devices)
    for device in devices:
        if device["current_activity"] > device["baseline_activity"] * 2:
            found_anomaly = True
            affected_device = device
            break

    # 2. Reasoning Loop
    if found_anomaly:
        # --- ADD THIS LINE HERE ---
        # This tells the Frontend which ID to highlight
        system_state["affected_device"] = affected_device["id"] 

        # If Honeypot was triggered, Upgrade to Validated
        if system_state.get("honeypot_triggered"):
            if system_state["status"] != "validated":
                system_state["status"] = "validated"
                system_state["confidence"] = 0.98
                affected_device["risk_level"] = "high"
                
                # THE AGENT WRITES THE HISTORY:
                new_incident = {
                    "id": f"val-{int(time.time())}",
                    "device_id": str(affected_device["id"]),
                    "alert_type": "Threat Validation Confirmed",
                    "severity": "high",
                    "message": f"Suspicious activity on {affected_device['name']} confirmed via decoy interaction.",
                    "status": "validated",
                    "detected_at": time.strftime('%Y-%m-%dT%H:%M:%SZ'),
                    "device": affected_device.copy()
                }
                incident_history.insert(0, new_incident)
                save_history(incident_history)
        else:
            system_state["status"] = "anomaly"
            system_state["confidence"] = 0.75
            affected_device["risk_level"] = "warning"
    else:
        # Self-healing: Reset if the environment is calm
        system_state["status"] = "normal"
        system_state["honeypot_triggered"] = False
        system_state["confidence"] = 0
        # --- ADD THIS LINE HERE ---
        system_state["affected_device"] = None

# --- 2. THE AGENT LOOP (THE NERVOUS SYSTEM) ---
def start_agent_loop():
    def loop():
        print("--- KAVACHIN Agent Loop Started ---")
        while True:
            evaluate_security_state()
            time.sleep(2)  # The agent "thinks" every 2 seconds
            
    # daemon=True ensures the thread dies when the main process stops
    thread = threading.Thread(target=loop, daemon=True)
    thread.start()

# --- 3. FASTAPI SETUP ---
app = FastAPI(title="KAVACHIN Backend")

# Start the agent before the app begins accepting requests
start_agent_loop()

app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "KAVACHIN backend running with Agent Loop"}