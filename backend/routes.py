from fastapi import APIRouter
from state import devices, system_state, incident_history
from simulator import reset_to_normal, trigger_anomaly, trigger_validation, quarantine_device, restore_device
from agent import evaluate_state

router = APIRouter()


@router.get("/devices")
def get_devices():
    return devices

@router.get("/history")
def get_history():
    return incident_history

@router.get("/state")
def get_state():
    return system_state


@router.post("/simulate/normal")
def simulate_normal():
    reset_to_normal()
    # Explicitly clear the focus
    system_state["affected_device"] = None 
    evaluate_state()
    return system_state


@router.post("/simulate/anomaly/{device_id}")
def simulate_anomaly(device_id: int):
    if device_id is None:
        return {"error" : "device_id is required"}
    trigger_anomaly(device_id)
    evaluate_state()
    return system_state


@router.post("/simulate/validate/{device_id}")
def simulate_validate(device_id: int):
    if device_id is None:
        return {"error" : "device_id is required"}
    trigger_validation(device_id)
    evaluate_state()
    return system_state

@router.post("/devices/{device_id}/block")
def block_device(device_id: int):
    quarantine_device(device_id)
    # Once blocked, the Agent should stop targeting it
    system_state["affected_device"] = None 
    evaluate_state()
    return {"status": "success"}

@router.post("/devices/{device_id}/unblock")
def unblock_device(device_id: int):
    restore_device(device_id)
    evaluate_state()
    return {"status": "success"}