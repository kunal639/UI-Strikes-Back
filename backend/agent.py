from state import devices, system_state


def evaluate_state():
    affected_id = system_state["affected_device"]

    # If no device affected, system is normal
    if affected_id is None:
        system_state["status"] = "normal"
        return

    # Find the affected device
    for device in devices:
        if device["id"] == affected_id:

            baseline = device["baseline_activity"]
            current = device["current_activity"]

            # Calculate deviation
            deviation_ratio = current / baseline

            # Case 1: Normal behavior
            if deviation_ratio <= 2:
                system_state["status"] = "normal"
                device["risk_level"] = "safe"

            # Case 2: Anomaly detected (not yet validated)
            elif deviation_ratio > 2 and not system_state["honeypot_triggered"]:
                system_state["status"] = "anomaly"
                device["risk_level"] = "warning"

            # Case 3: Validated threat
            elif system_state["honeypot_triggered"]:
                system_state["status"] = "validated"
                device["risk_level"] = "high"

            break

            