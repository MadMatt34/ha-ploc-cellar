# Ploc Cellar

Intégration Home Assistant personnalisée pour consulter une cave PLOC synchronisée par PLOUD.

## Principes

- PLOUD reste la source de vérité ; l'intégration est strictement en lecture seule.
- Synchronisation incrémentale via `POST /sync/exec`, avec `Objects={}`.
- Premier curseur `LastSyncTime=1` (PLOUD rejette `0`).
- Modèle complet (vins y compris ceux sans stock, casiers, emplacements et références) conservé dans le stockage persistant Home Assistant (`Store`).
- Un seul capteur agrégé ; l'inventaire détaillé est récupéré à la demande par une action.
- Aucun capteur par vin, casier ou emplacement.

## Installation

Copier `custom_components/ploc_cellar` dans `config/custom_components/`, redémarrer Home Assistant, puis ajouter **Ploc Cellar** depuis Appareils et services.

Le formulaire demande le serveur PLOUD, le jeton d'accès existant et l'identifiant de l'appareil à cinq caractères. Il ne réalise ni connexion PLOC, ni activation PLOUD.

## Entités

- `sensor.ploc_cellar_cellar` : nombre total de bouteilles. Attributs limités : vins en stock, casiers, positions occupées et date de synchronisation.

## Actions

### `ploc_cellar.get_inventory`

Action à réponse (utiliser `response_variable`) ; renvoie les vins en stock, leurs caractéristiques et emplacements. Filtres facultatifs `search` et `color`.

### `ploc_cellar.sync`

Déclenche une synchronisation immédiate.

Exemple :

```yaml
action: ploc_cellar.get_inventory
data:
  search: Condrieu
response_variable: cellar
```

## Données et confidentialité

Le jeton est conservé dans les données de configuration de l'intégration. Le cache local est stocké dans le répertoire de stockage Home Assistant et n'est jamais envoyé à PLOUD. Seuls les appels de synchronisation documentés sont effectués ; aucun objet de cave n'est envoyé au serveur.

## État du développement

Première base d'intégration ; validation complète avec Hassfest, Ruff et tests Home Assistant à effectuer avant utilisation en production.
