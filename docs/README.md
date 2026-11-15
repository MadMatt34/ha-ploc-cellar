# Technical documentation

This directory contains implementation and maintenance documentation for the Ploc Cellar Home Assistant integration. The root README files are intended for installation, configuration and everyday use.

## Integration internals

| Document | Scope |
|---|---|
| [Architecture and lifecycle](ARCHITECTURE.md) | Config entries, authentication boundaries, coordinator lifecycle, synchronization flow and persistent state |
| [Inventory algorithms (English overview)](ALGORITHMS.md) | Stock reconstruction, diagnostics, synchronization and persistence invariants |
| [Spécification détaillée des algorithmes (français)](ALGORITHMES.md) | Règles complètes de fusion, récupération, stockage transactionnel et cache des images |
| [PLOUD field mapping](PLOUD_FIELD_MAPPING.md) | Source collections and fields mapped to the local model and inventory response |
| [Test strategy](TESTS.md) | Test layers, module coverage, local commands and validation limits |

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
- Keep English and French user-facing documentation aligned. Technical documents may retain their established language where a maintained translation does not yet exist.

## Documentation en français

Cette documentation décrit les choix internes et les règles de maintenance. Le [README français](../README.fr.md) reste le guide d'installation et d'utilisation.

| Document | Sujet |
|---|---|
| [Architecture et cycle de vie](ARCHITECTURE.md) | Entrées de configuration, authentification, coordinateur, synchronisation et persistance |
| [Algorithmes d'inventaire (aperçu anglais)](ALGORITHMS.md) | Formules et invariants de stock (aperçu en anglais) |
| [Règles détaillées des algorithmes](ALGORITHMES.md) | Fusion incrémentale, diagnostics, stockage transactionnel et cache images |
| [Correspondance des champs PLOUD](PLOUD_FIELD_MAPPING.md) | Mapping des collections et champs sources vers le modèle local |
| [Stratégie de tests](TESTS.md) | Couverture, commandes locales et limites de validation |

Le contrat partagé avec le frontend est maintenu dans [sa documentation dédiée](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/CONTRAT_BACKEND.fr.md).
