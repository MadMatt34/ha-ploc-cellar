# Ploc Cellar

Intégration personnalisée Home Assistant permettant de consulter une cave PLOC en **lecture seule**, synchronisée par PLOUD.

[English version](README.md)

## Prérequis

- Home Assistant 2026.8 ou version ultérieure.
- Python 3.13 ou version ultérieure (fourni par les versions Home Assistant prises en charge).

## Fonctionnalités

- PLOUD reste la source de vérité.
- Synchronisation incrémentale via l'endpoint existant PLOUD `POST /sync/exec`, avec `Objects={}`.
- Le premier chargement utilise la valeur d'initialisation validée `LastSyncTime=1`. Les requêtes suivantes utilisent le curseur client en millisecondes Unix.
- Modèle local complet conservé dans le stockage persistant Home Assistant (`Store`) : vins, y compris ceux sans stock, casiers, emplacements et données de référence.
- Un seul capteur de synthèse ; aucune entité par vin, casier ou emplacement.
- Inventaire détaillé accessible à la demande avec `ploc_cellar.get_inventory`.
- Actualisation manuelle avec `ploc_cellar.sync`.
- Aucune opération d'écriture n'est envoyée à PLOUD.

## Installation

1. Copier `custom_components/ploc_cellar` dans `<config>/custom_components/`.
2. Redémarrer Home Assistant.
3. Aller dans **Paramètres → Appareils et services → Ajouter une intégration**, puis sélectionner **Ploc Cellar**.
4. Saisir l'URL du serveur PLOUD existant, le jeton d'accès et l'identifiant d'appareil de cinq caractères.

L'intégration ne crée pas de compte PLOC, n'active pas PLOUD et ne modifie pas le contenu de la cave.

## Configuration

### Paramètres de connexion

La configuration initiale demande l'URL du serveur PLOUD (par défaut `https://ploud.ploc.co/v1`), le jeton d'accès existant, l'identifiant d'appareil de cinq caractères et la langue des réponses PLOUD (`fr` ou `en`).

Utiliser **Reconfigurer** pour modifier l'URL du serveur. Si PLOUD refuse le jeton, Home Assistant démarre la réauthentification afin de le remplacer sans supprimer l'intégration.

### Options de synchronisation

Ouvrir **Configurer** pour modifier la fréquence d'interrogation (de 5 à 1 440 minutes ; 15 minutes par défaut) et la langue des réponses PLOUD (français ou anglais). L'enregistrement des options recharge l'entrée de configuration. La synchronisation manuelle reste disponible.

## Entité

- `sensor.ploc_cellar_inventory` : nombre total de bouteilles.
- Attributs : nombre de vins en stock, nombre de casiers, positions occupées et indicateur `stale` signalant un échec de la dernière synchronisation.

La liste complète des vins n'est volontairement pas placée dans les attributs du capteur. Elle reste dans le stockage persistant et n'est renvoyée que sur demande. La date de dernière synchronisation réussie est incluse dans la réponse de l'action d'inventaire.

## Actions

### `ploc_cellar.get_inventory`

Action avec réponse. Utiliser `response_variable` dans un script ou une automatisation.

Le champ `config_entry_id` est obligatoire pour identifier la connexion PLOUD. Home Assistant propose un sélecteur de configuration limité à Ploc Cellar. Filtres facultatifs : `search` (nom du vin, appellation, région, pays, cépages ou cuvée) et `color`.

```yaml
action: ploc_cellar.get_inventory
data:
  config_entry_id: IDENTIFIANT_DE_CONFIGURATION
  search: Condrieu
response_variable: cave
```

La réponse contient les totaux globaux de bouteilles et de vins en stock, le nombre de vins correspondant aux filtres, les casiers, les positions occupées, les caractéristiques des vins et la date de la dernière synchronisation réussie. Les filtres ne modifient pas les totaux globaux.

### `ploc_cellar.sync`

Déclenche immédiatement une synchronisation :

```yaml
action: ploc_cellar.sync
data:
  config_entry_id: IDENTIFIANT_DE_CONFIGURATION
```

## Stockage et confidentialité

Le jeton d'accès est conservé dans l'entrée de configuration Home Assistant. L'inventaire local et son curseur de synchronisation associé sont enregistrés avec le `Store` persistant de Home Assistant. Les changements reçus sont enregistrés avant de remplacer le modèle en mémoire : un échec d'écriture ne fait donc pas avancer le curseur actif.

L'intégration demande uniquement les données de synchronisation ; elle n'envoie pas d'objets de cave et n'effectue aucune modification de la cave.

## État du développement

Cette intégration est en cours de développement. La CI contrôle Ruff, Hassfest et le typage strict avec Pyright. Ces contrôles statiques ne remplacent pas les essais avec une instance Home Assistant réelle et la cave PLOUD.
