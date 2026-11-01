"""Constants for the Ploc Cellar integration."""
from datetime import timedelta

DOMAIN = "ploc_cellar"
PLATFORM = "sensor"
PLOUD_VERSION = 611
HMAC_KEY = b"PLOC.co.20@16"
DEFAULT_SCAN_INTERVAL = timedelta(minutes=15)
STORAGE_VERSION = 1
STORAGE_KEY = f"{DOMAIN}.cellar"
CONF_SERVER = "server"
CONF_TOKEN = "token"
CONF_DEVICE = "device"
CONF_LANGUAGE = "language"
DEFAULT_LANGUAGE = "fr"
