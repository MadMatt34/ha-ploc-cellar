"""Constants for the Ploc Cellar integration."""
from datetime import timedelta

DOMAIN = "ploc_cellar"

AUTH_API_BASE = "https://api.ploc.co/a/v3"
GATEWAY_API_BASE = "https://api.ploc.co/v1"
PLOC_APPLICATION_NAME = "Home Assistant"
PLOC_VERSION = 611
PLOC_RSA_PUBLIC_KEY = (
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiLZIvVnu+DRvrfDOMWvoGyZ5nu0bQVEQpB8on3ly0fc0lAXJpjehoiYXXPR8Cetu9Tu2lH6Dm4fqLnYP1DkCFFCbXjvUmr8zXDrs8VhP1nyMwPbps7+tvp69xlxH9cEWA/RcSsyiUZhsrm5qIfgfpE85kJ8OAZhtC8pzR0hWZXC3+GaLDq1yJ7robW1aaxEHS3Uwr1QZIIhHgm53zY+L4bBehYem9FAp7LKYnHLpudoOQajjsJBY7nKWEcaUFSnUilbqC2gfeYesd72d/KLfH+UGOEN/asVmOgSrpNiiifjRFmGrxei04XJGptPiPa0c44bvMhsRvEr1yQH6EkRX0QIDAQAB"
)
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
PLOUD_SUPPORTED_COLLECTIONS = (
    *PLOUD_REFERENCE_COLLECTIONS,
    PLOUD_COLLECTION_WINES,
    PLOUD_COLLECTION_RACKS,
    PLOUD_COLLECTION_RACK_ITEMS,
    PLOUD_COLLECTION_DELETED,
)
PLOUD_HMAC_KEY = b"PLOC.co.20@16"

SUPPORTED_LANGUAGES = ("fr", "en")
DEFAULT_LANGUAGE = "fr"

DEFAULT_SCAN_INTERVAL = timedelta(minutes=15)
MIN_SCAN_INTERVAL_MINUTES = 5
MAX_SCAN_INTERVAL_MINUTES = 1440

STORAGE_VERSION = 1
STORAGE_KEY = f"{DOMAIN}.cellar"

CONF_TOKEN = "token"
CONF_DEVICE = "device"
CONF_LANGUAGE = "language"
CONF_SCAN_INTERVAL = "scan_interval"
CONF_SEARCH = "search"
CONF_COLOR = "color"

SENSOR_UNIQUE_ID = f"{DOMAIN}_summary"

SERVICE_GET_INVENTORY = "get_inventory"
SERVICE_SYNC = "sync"
