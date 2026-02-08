import json
import os

devices = [
    {
      "id": 1,
      "name": "Living Room Camera",
      "type": "camera",
      "ip_address": "192.168.1.101",
      "status": "online",
      "risk_level": "safe",
      "baseline_activity": 40,
      "current_activity": 40
    },
    {
      "id": 2,
      "name": "Smart Thermostat",
      "type": "thermostat",
      "ip_address": "192.168.1.102",
      "status": "online",
      "risk_level": "safe",
      "baseline_activity": 15,
      "current_activity": 15
    },
    {
      "id": 3,
      "name": "Front Door Lock",
      "type": "lock",
      "ip_address": "192.168.1.103",
      "status": "online",
      "risk_level": "safe",
      "baseline_activity": 8,
      "current_activity": 8
    },
    {
      "id": 4,
      "name": "Kitchen Light",
      "type": "light",
      "ip_address": "192.168.1.104",
      "status": "online",
      "risk_level": "safe",
      "baseline_activity": 5,
      "current_activity": 5
    },
    {
      "id": 5,
      "name": "Smart Speaker",
      "type": "speaker",
      "ip_address": "192.168.1.105",
      "status": "online",
      "risk_level": "safe",
      "baseline_activity": 12,
      "current_activity": 12
    },
    {
      "id": 6,
      "name": "Garage Camera",
      "type": "camera",
      "ip_address": "192.168.1.106",
      "status": "online",
      "risk_level": "safe",
      "baseline_activity": 35,
      "current_activity": 35
    }
]

system_state = {
    "status" : "normal",
    "affected_device" : None,
    "confidence" : None,
    "honeypot_triggered" : False
}

HISTORY_FILE = "history.json"

def load_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    return []

def save_history(history_list):
    with open(HISTORY_FILE, "w") as f:
        json.dump(history_list, f, indent=4)

# Initialize history from the file
incident_history = load_history()