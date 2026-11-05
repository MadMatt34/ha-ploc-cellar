# Test strategy

The test suite is designed to validate the integration at three levels:

1. **Pure model and protocol tests** validate parsing, normalization, stock reconstruction, deletion semantics and PLOUD transport contracts without network access.
2. **Coordinator and service tests** validate synchronization behavior, persistence boundaries, failure propagation and the JSON inventory response.
3. **Home Assistant contract checks** run Ruff, Hassfest, strict Pyright against the latest stable Home Assistant, and HACS validation.

All PLOC/PLOUD HTTP calls in unit tests are replaced by deterministic response/session doubles. The tests never contact a real PLOC account or mutate a cellar.

## Test modules

| Module | Coverage |
|---|---|
| `test_auth.py` | Encrypted sign-in payload shape, PLOC account token, PLOUD activation, HTTP status classification, malformed responses and transport failures |
| `test_config_flow_validation.py` | Email validation before authentication |
| `test_language.py` | Automatic language selection from HA country/language and explicit override precedence |
| `test_ploud_transport.py` | Sync endpoint, timeout, HTTP/network failures, JSON shape, collection validation and cursor behavior |
| `test_ploud.py` | PLOUD record parsing, identifiers, optional values, Owner resolution and malformed records |
| `test_delta_regressions.py` | Partial-record merge, missing fields, deletions and full-snapshot semantics |
| `test_models.py` | Stock calculations, diagnostics, storage serialization and integrity counters |
| `test_storage_migrations.py` | Legacy schema migration, identifier normalization and invalid current storage |
| `test_coordinator.py` | Verified persistence, recovery from incomplete deltas, full-snapshot validation, manual sync and transactional rollback |
| `test_services.py` | Inventory filtering/response, diagnostics and service response contracts |
| `test_integration_services.py` | Actual Home Assistant service registration, dispatch to the selected entry and invalid/unloaded-entry rejection |
| `test_sensor.py` | Sensor descriptions, aggregate values, unknown values before Orders reconstruction and timestamp parsing |
| `test_button.py` | Partial/full button mapping and propagation of synchronization failures |

## Local execution

Run the same checks as CI from the repository root:

```bash
ruff check custom_components/ploc_cellar tests
PYTHONPATH=custom_components pytest -q --cov=ploc_cellar --cov-report=term-missing
pyright --project pyrightconfig.json
```

The CI workflow installs the latest stable Home Assistant, runs the strict type checker and reports line coverage for the integration package. Coverage is reported rather than hidden behind a percentage gate: a threshold should only be introduced after the report has been reviewed and uncovered branches have been assessed, so that the suite is not incentivized to add low-value tests.

## Scope and limitations

- The suite is deterministic and offline; it does not validate the availability or current behavior of the external PLOC/PLOUD servers.
- It validates Home Assistant compatibility with the latest stable package installed by CI, plus Hassfest. It does not replace a manual installation test on a real Home Assistant instance.
- Authentication tests verify request construction and response handling; they do not use real credentials or assert that PLOC accepts a particular account.
