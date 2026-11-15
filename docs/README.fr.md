# Documentation technique

Ce répertoire rassemble la documentation d'implémentation et de maintenance de l'intégration Home Assistant Ploc Cellar. Les README à la racine sont consacrés à l'installation, à la configuration et à l'utilisation.

## Architecture et cycle de vie

| Document | Contenu |
|---|---|
| [Architecture et cycle de vie](ARCHITECTURE.fr.md) | Entrées de configuration, authentification, coordinateur, synchronisation, notifications et stockage |
| [Architecture and lifecycle](ARCHITECTURE.md) | English version |
| [Algorithmes d'inventaire](ALGORITHMES.md) | Règles détaillées de reconstruction du stock, diagnostics, synchronisation et persistance |
| [Inventory algorithms](ALGORITHMS.md) | English version of the algorithm specification |
| [Correspondance des champs PLOUD](PLOUD_FIELD_MAPPING.fr.md) | Correspondance des collections et champs PLOUD avec le modèle local |
| [PLOUD field mapping](PLOUD_FIELD_MAPPING.md) | English version |
| [Stratégie de tests](TESTS.fr.md) | Organisation des tests, couverture et commandes locales |
| [Test strategy](TESTS.md) | English version |

## Contrat partagé avec le frontend

Le contrat public de l'action d'inventaire et des notifications de synchronisation est maintenu dans le dépôt frontend :

- [Contrat backend en français](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/CONTRAT_BACKEND.fr.md)
- [Backend contract in English](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/BACKEND_CONTRACT.md)
- [Compatibilité et publications](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/COMPATIBILITY_AND_RELEASES.fr.md)

Lorsqu'un champ de réponse ou le comportement d'une notification change, mettre à jour ensemble l'implémentation, les tests de contrat et les deux versions linguistiques du contrat.

## Règles éditoriales

- Les README racine contiennent les informations destinées aux utilisateurs.
- Les documents de ce répertoire décrivent les détails techniques et les règles de maintenance.
- Le contrat de réponse complet n'est pas recopié ici : le dépôt frontend en est la référence partagée.
- Chaque document d'information possède une version anglaise et une version française. Les deux versions doivent rester cohérentes.