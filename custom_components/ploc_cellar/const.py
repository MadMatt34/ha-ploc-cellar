"""Constants for the Ploc Cellar integration."""
from datetime import timedelta

DOMAIN = "ploc_cellar"

PLOUD_DEFAULT_SERVER = "https://ploud.ploc.co/v1"
PLOUD_VERSION = 611
PLOUD_SYNC_METHOD = "sync"
PLOUD_SYNC_PATH = "/sync/exec"
PLOUD_COLLECTION_WINES = "Wines"
PLOUD_COLLECTION_RACKS = "Racks"
PLOUD_COLLECTION_RACK_ITEMS = "RackItems"
PLOUD_COLLECTION_DELETED = "DeletedObjects"
PLOUD_REFERENCE_COLLECTIONS = (
    "appellations",
    "bottleFormats",
    "classifications",
    "colors",
    "countries",
    "regions",
)
PLOUD_HMAC_KEY = b"PLOC.co.20@16"

DEVICE_ID_LENGTH = 5
SUPPORTED_LANGUAGES = ("fr", "en")
DEFAULT_LANGUAGE = "fr"

DEFAULT_SCAN_INTERVAL = timedelta(minutes=15)
MIN_SCAN_INTERVAL_MINUTES = 5
MAX_SCAN_INTERVAL_MINUTES = 1440

STORAGE_VERSION = 1
STORAGE_KEY = f"{DOMAIN}.cellar"

CONF_SERVER = "server"
CONF_TOKEN = "token"
CONF_DEVICE = "device"
CONF_LANGUAGE = "language"
CONF_SCAN_INTERVAL = "scan_interval"

SERVICE_GET_INVENTORY = "get_inventory"
SERVICE_SYNC = "sync"
