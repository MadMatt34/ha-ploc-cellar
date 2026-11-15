# Technical documentation

[Version française](README.fr.md)

This directory contains implementation and maintenance documentation for the Ploc Cellar Home Assistant integration. The root README files are intended for installation, configuration and everyday use.

## Integration internals

| Document | Scope |
|---|---|
| [Architecture and lifecycle](ARCHITECTURE.md) / [français](ARCHITECTURE.fr.md) | Config entries, authentication boundaries, coordinator lifecycle, synchronization flow and persistent state |
| [Inventory algorithms](ALGORITHMS.md) / [français](ALGORITHMES.md) | Stock reconstruction, diagnostics, synchronization and persistence invariants |
| [Spécification détaillée des algorithmes (français)](ALGORITHMES.md) | Règles complètes de fusion, récupération, stockage transactionnel et cache des images |
| [PLOUD field mapping](PLOUD_FIELD_MAPPING.md) / [français](PLOUD_FIELD_MAPPING.fr.md) | Source collections and fields mapped to the local model and inventory response |
| [Test strategy](TESTS.md) / [français](TESTS.fr.md) | Test layers, module coverage, local commands and validation limits |

## Cross-repository contract

The public inventory response and synchronization notification contract is maintained with the frontend repository:

- [Backend contract (English)](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/BACKEND_CONTRACT.md)
- [Contrat backend (français)](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/CONTRAT_BACKEND.fr.md)
- [Compatibility matrix and release policy](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/COMPATIBILITY_AND_RELEASES.md)

When a public response field or notification behavior changes, update the implementation, contract tests and both contract documents together. See the contract's change procedure before modifying the service.

## Documentation ownership

- Keep user-facing setup and troubleshooting in the root README files.
- Keep protocol details, data semantics, algorithms, lifecycle and test procedures here.
- Do not duplicate the full service response schema in this repository: the frontend contract documents are the shared reference.
- Every information document has English and French versions; keep both versions aligned.
