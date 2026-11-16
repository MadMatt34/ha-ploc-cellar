# Stratégie de tests

La suite backend valide l'intégration à trois niveaux :

1. **Tests purs du modèle et du protocole** : parsing, normalisation, reconstruction du stock, sémantique des suppressions, migrations de stockage et contrats de transport PLOUD, sans accès réseau.
2. **Tests du coordinateur, des images, du service et du WebSocket** : synchronisations incrémentales et complètes, persistance transactionnelle, compatibilité des événements publics, notifications dispatcher limitées à l'entrée pour les utilisateurs non administrateurs, cycle de vie du cache d'images, vues authentifiées, diagnostics et réponse JSON de l'inventaire.
3. **Contrôles Home Assistant** : Ruff, Hassfest, Pyright strict, suite unitaire et validation HACS.

Tous les appels HTTP PLOC/PLOUD des tests unitaires utilisent des doubles déterministes de réponses et de sessions. Les tests ne contactent pas de compte PLOC réel et ne modifient aucune cave.

## Modules de tests

| Module | Couverture |
|---|---|
| `test_auth.py` | Charge utile de connexion chiffrée, jeton de compte PLOC, activation PLOUD, validation des réponses et erreurs de transport |
| `test_config_flow_validation.py` | Validation de l'adresse e-mail avant authentification |
| `test_config_flow.py` | Configuration initiale, ajout d'entrées, identité d'appareil par entrée, erreurs d'authentification et réauthentification |
| `test_language.py` | Sélection automatique de la langue et priorité de la surcharge manuelle |
| `test_ploud_transport.py` | Endpoints de synchronisation et de documents, signatures, délais d'attente, erreurs HTTP/réseau, JSON mal formé et validation des collections |
| `test_ploud.py` | Parsing des enregistrements PLOUD, identifiants, champs facultatifs, résolution Owner et enregistrements mal formés |
| `test_ploud_payload_edges.py` | Cas limites des charges utiles PLOUD partielles ou mal formées |
| `test_delta_regressions.py` | Fusion des enregistrements partiels, distinction entre champ omis et effacé, suppressions et sémantique des instantanés complets |
| `test_models.py` | Calculs de stock, diagnostics, sérialisation et intégrité du modèle |
| `test_models_storage_edges.py` | Champs de stockage invalides, intégrité des références croisées et cas limites de sérialisation |
| `test_storage_migrations.py` | Migration des anciens schémas et normalisation des identifiants |
| `test_coordinator.py` | Métadonnées d'événements, notifications dispatcher, persistance avant notification, persistance vérifiée, synchronisations, récupération, rollback et cache images |
| `test_coordinator_lifecycle.py` | Initialisation, actualisation, annulation, déchargement et nettoyage du cycle de vie |
| `test_services.py` | Filtres d'inventaire, diagnostics de stock et valeurs de réponse |
| `test_service_contract.py` | Contrat JSON exact et compatibilité frontend |
| `test_integration_services.py` | Enregistrement du service et dispatch de la construction de l'inventaire via l'exécuteur, cycle de vie des entrées, validation des entrées chargées, abonnements WebSocket par entrée, notifications vides, commande compatible non-admin et nettoyage des désabonnements |
| `test_sensor.py` | Valeurs et disponibilité des capteurs, attributs d'horodatage obsolète, migration du registre et création des entités |
| `test_button.py` | Comportement des boutons de synchronisation différentielle/complète et propagation des erreurs |
| `test_images.py` | Métadonnées, téléchargement/cache, remplacement et suppression des images, y compris la recherche d'image en cache via l'exécuteur |
| `test_images_edges.py` | Métadonnées invalides, documents non pris en charge, nettoyage du cache et erreurs système de fichiers |
| `test_image_boundaries.py` | Limites de taille et de type de contenu des images |
| `test_image_lifecycle.py` | Nettoyage du cache d'images lors du cycle de vie d'une entrée |
| `test_views.py` | Endpoint d'image authentifié, requêtes de documents invalides et recherche dans le cache via l'exécuteur |

## Exécution locale

Exécuter les mêmes contrôles que la CI depuis la racine du dépôt :

```sh
ruff check custom_components/ploc_cellar tests
PYTHONPATH=custom_components pytest -q --cov=ploc_cellar --cov-report=term-missing
pyright --project pyrightconfig.json
```

La CI teste la version minimale Home Assistant déclarée (2026.10.4) et la dernière version stable. Le seuil de couverture est de 95 % pour l'ensemble du package d'intégration, et non pour chaque module. Les tests doivent vérifier des comportements utiles plutôt que d'ajouter des assertions uniquement pour exécuter des lignes.

## Périmètre et limites

- La suite est déterministe et hors ligne ; elle ne vérifie ni la disponibilité actuelle des serveurs externes PLOC/PLOUD ni leur comportement privé non documenté.
- La CI multi-version et Hassfest apportent des contrôles de compatibilité, mais ne remplacent pas un test d'installation sur une véritable instance Home Assistant.
- Les tests d'authentification vérifient la construction des requêtes et le traitement des réponses ; ils n'utilisent pas de vrais identifiants et ne prouvent pas que PLOC accepte un compte donné.