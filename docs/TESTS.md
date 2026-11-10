# Test strategy

The backend suite validates the integration at three levels:

1. **Pure model and protocol tests** cover parsing, normalization, stock reconstruction, deletion semantics, storage migrations and PLOUD transport contracts without network access.
2. **Coordinator, image and service tests** cover incremental/full synchronization, transactional persistence, image cache lifecycle and boundaries, authenticated views, diagnostics and the JSON inventory response.
3. **Home Assistant contract checks** run Ruff, Hassfest, strict Pyright, the unit suite and HACS validation.

All PLOC/PLOUD HTTP calls in unit tests use deterministic response/session doubles. Tests do not contact a real PLOC account or mutate a cellar.

## Test modules

| Module | Coverage |
|---|---|
| `test_auth.py` | Encrypted sign-in payload, PLOC account token, PLOUD activation, response validation and transport failures |
| `test_config_flow_validation.py` | Email validation before authentication |
| `test_config_flow.py` | Initial setup, acceptance of additional config entries, per-entry device identity, authentication errors and reauthentication |
| `test_language.py` | Automatic language selection and manual override precedence |
| `test_ploud_transport.py` | Sync/document endpoints, request signatures, timeouts, HTTP/network errors, malformed JSON and collection validation |
| `test_ploud.py` | PLOUD record parsing, identifiers, optional fields, Owner resolution and malformed records |
| `test_ploud_payload_edges.py` | Malformed and partial PLOUD payload edge cases |
| `test_delta_regressions.py` | Partial-record merge, omitted versus cleared fields, deletions and full-snapshot semantics |
| `test_models.py` | Stock calculations, diagnostics, serialization and model integrity |
| `test_models_storage_edges.py` | Invalid storage fields, cross-reference integrity and serialization edge cases |
| `test_storage_migrations.py` | Legacy schema migration and identifier normalization |
| `test_coordinator.py` | Verified persistence, incremental/full sync, recovery, rollback and authentication failure |
| `test_coordinator_lifecycle.py` | Coordinator setup, refresh, cancellation, unload and lifecycle cleanup |
| `test_services.py` | Inventory filtering, stock diagnostics and response values |
| `test_service_contract.py` | Exact JSON response contract and frontend-facing compatibility |
| `test_integration_services.py` | Service registration/dispatch, config-entry setup, platform forwarding and unload |
| `test_sensor.py` | Sensor values, availability, stale timestamp attributes, registry migration and entity creation |
| `test_button.py` | Differential/full synchronization button behavior and failure propagation |
| `test_images.py` | Image metadata, download/cache, replacement and deletion lifecycle |
| `test_images_edges.py` | Invalid metadata, unsupported documents, cache cleanup and filesystem failures |
| `test_image_boundaries.py` | Image size and content-type boundaries |
| `test_image_lifecycle.py` | Image cache cleanup on config-entry lifecycle |
| `test_views.py` | Authenticated image endpoint and invalid document requests |

## Local execution

Run the same checks as CI from the repository root:

```sh
ruff check custom_components/ploc_cellar tests
PYTHONPATH=custom_components pytest -q --cov=ploc_cellar --cov-report=term-missing
pyright --project pyrightconfig.json
```

CI tests against the declared minimum Home Assistant version (2026.10.4) and
the latest stable release. The coverage threshold is 95% for the complete
integration package, not for each module. Tests should exercise meaningful
behavior rather than add assertions solely to execute lines.

## Scope and limitations

- The suite is deterministic and offline; it does not validate current external PLOC/PLOUD server availability or undocumented server behavior.
- Version-matrix CI and Hassfest provide compatibility checks, but do not replace installation testing on a real Home Assistant instance.
- Authentication tests verify request construction and response handling; they do not use real credentials or prove that PLOC accepts a particular account.
