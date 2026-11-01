"""Constants for the Ploc Cellar integration."""
from datetime import timedelta

DOMAIN = "ploc_cellar"
PLOUD_VERSION = 611
HMAC_KEY = b"PLOC.co.20@16"

DEFAULT_SCAN_INTERVAL = timedelta(minutes=15)
MIN_SCAN_INTERVAL_MINUTES = 5
MAX_SCAN_INTERVAL_MINUTES = 1440
DEFAULT_LANGUAGE = "fr"

STORAGE_VERSION = 1
STORAGE_KEY = f"{DOMAIN}.cellar"

CONF_SERVER = "server"
CONF_TOKEN = "token"
CONF_DEVICE = "device"
CONF_LANGUAGE = "language"
CONF_SCAN_INTERVAL = "scan_interval"
