import time

def trigger_anomaly(device_id):
    from state import devices, system_state  # Local import to prevent circular loop
    for device in devices:
        if device["id"] == device_id:
            device["current_activity"] = device["baseline_activity"] * 10
            device["risk_level"] = "warning"
            system_state["status"] = "anomaly"
            system_state["affected_device"] = device_id
            break

def trigger_validation(device_id):
    from state import system_state, devices, incident_history, save_history
    system_state["honeypot_triggered"] = True
    system_state["status"] = "validated"
    system_state["confidence"] = 0.9

    for device in devices:
        if device["id"] == device_id:
            device["risk_level"] = "high"
            # Record validation event
            new_incident = {
                "id": f"val-{int(time.time())}",
                "device_id": str(device_id),
                "alert_type": "Threat Validation Confirmed",
                "severity": "high",
                "message": f"Suspicious activity on {device['name']} confirmed via decoy interaction.",
                "status": "validated", # Lifecycle Status
                "detected_at": time.strftime('%Y-%m-%dT%H:%M:%SZ'),
                "device": device.copy()
            }
            incident_history.insert(0, new_incident)
            save_history(incident_history)
            break

def quarantine_device(device_id):
    from state import devices, system_state, incident_history, save_history
    for device in devices:
        if device["id"] == device_id:
            device["status"] = "offline"
            device["risk_level"] = "high"
            
            # Record quarantine event
            new_entry = {
                "id": f"block-{int(time.time())}",
                "device_id": str(device_id),
                "alert_type": "Threat Contained (Quarantine)",
                "severity": "high",
                "message": f"User authorized quarantine for {device['name']}. Network access severed.",
                "status": "contained", # Lifecycle Status
                "detected_at": time.strftime('%Y-%m-%dT%H:%M:%SZ'),
                "device": device.copy()
            }
            incident_history.insert(0, new_entry)
            save_history(incident_history)
            break
    
    system_state["status"] = "normal"
    system_state["affected_device"] = None
    system_state["honeypot_triggered"] = False

def restore_device(device_id):
    from state import devices, incident_history, save_history
    for device in devices:
        if device["id"] == device_id:
            device["status"] = "online"
            device["risk_level"] = "safe"
            device["current_activity"] = device["baseline_activity"]
            
            # --- Lifecycle Event: RESOLVED ---
            new_entry = {
                "id": f"res-{int(time.time())}",
                "device_id": str(device_id),
                "alert_type": "Incident Resolved (Restored)",
                "severity": "safe",
                "message": f"Device {device['name']} manually restored to network after audit.",
                "status": "resolved", # Lifecycle Status
                "detected_at": time.strftime('%Y-%m-%dT%H:%M:%SZ'),
                "device": device.copy()
            }
            incident_history.insert(0, new_entry)
            save_history(incident_history)
            break

def reset_to_normal():
    from state import devices, system_state, incident_history, save_history
    
    if system_state["affected_device"]:
        dev_id = system_state["affected_device"]
        device = next((d for d in devices if d["id"] == dev_id), None)
        if device:
            new_entry = {
                "id": f"dismiss-{int(time.time())}",
                "device_id": str(dev_id),
                "alert_type": "Alert Dismissed",
                "severity": "medium",
                "message": f"Anomaly on {device['name']} was dismissed by user.",
                "status": "resolved",
                "detected_at": time.strftime('%Y-%m-%dT%H:%M:%SZ'),
                "device": device.copy()
            }
            incident_history.insert(0, new_entry)
            save_history(incident_history)

    system_state["status"] = "normal"
    system_state["affected_device"] = None
    system_state["confidence"] = None
    system_state["honeypot_triggered"] = False
    for device in devices:
        device["current_activity"] = device["baseline_activity"]
        device["risk_level"] = "safe"