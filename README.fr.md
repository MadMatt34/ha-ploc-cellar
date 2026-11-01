# Ploc Cellar

Intégration personnalisée Home Assistant permettant de consulter une cave PLOC en **lecture seule**, synchronisée par PLOUD.

[English version](README.md)

## Prérequis

- Home Assistant 2026.8.2 ou version ultérieure.
- Python 3.14.2 ou version ultérieure (requis par Home Assistant 2026.8.2).

## Fonctionnalités

- PLOUD reste la source de vérité.
- Synchronisation incrémentale via l'endpoint existant PLOUD `POST /sync/exec`, avec `Objects={}`.
- Le premier chargement utilise la valeur d'initialisation validée `LastSyncTime=1`. Les requêtes suivantes utilisent le curseur client en millisecondes Unix.
- Modèle local complet conservé dans le stockage persistant Home Assistant (`Store`) : vins, y compris ceux sans stock, casiers, emplacements et données de référence.
- Un seul capteur de synthèse ; aucune entité par vin, casier ou emplacement.
- Inventaire détaillé accessible à la demande avec `ploc_cellar.get_inventory`.
- Actualisation manuelle avec `ploc_cellar.sync`.
- Aucune opération d'écriture n'est envoyée à PLOUD.

## Installation et première configuration

1. Copier `custom_components/ploc_cellar` dans `<config>/custom_components/`.
2. Redémarrer Home Assistant.
3. Aller dans **Paramètres → Appareils et services → Ajouter une intégration**, puis sélectionner **Ploc Cellar**.
4. Saisir l'adresse e-mail et le mot de passe du compte PLOC, puis vérifier ou modifier l'URL du serveur PLOUD (préremplie avec `https://ploud.ploc.co/v1`).

Home Assistant effectue automatiquement les opérations suivantes :

1. Génération d'un identifiant d'appareil UUID complet propre à cette installation.
2. Authentification au compte PLOC via `POST https://api.ploc.co/v1/signin`. La requête reproduit le chiffrement et la signature employés par l'application PLOC.
3. Activation de PLOUD pour l'application **Home Assistant** via `POST /ploud/activate`, avec le jeton de session PLOC obtenu à l'étape précédente.
4. Extraction de l'URL du serveur PLOUD et du jeton d'accès PLOUD retournés par l'API.
5. Enregistrement du serveur, du jeton PLOUD et de l'identifiant d'appareil dans l'entrée de configuration Home Assistant.
6. Première synchronisation en lecture seule de la cave.

Le mot de passe et le jeton de session PLOC ne sont pas enregistrés dans l'entrée de configuration. Seuls les éléments nécessaires aux synchronisations PLOUD ultérieures y sont conservés. Le mot de passe est utilisé uniquement pendant le processus d'authentification initial ou lors d'une réauthentification.

Si l'authentification échoue, vérifier les identifiants PLOC et la disponibilité des services PLOC/PLOUD. L'intégration ne demande pas de jeton technique à l'utilisateur et ne nécessite pas le client Python de préparation.

## Identité de l'appareil

Le client Python utilisé pour valider le protocole générait l'identifiant d'appareil avec `str(uuid4())`, soit un UUID complet. L'intégration reprend ce mécanisme : chaque nouvelle installation Home Assistant obtient son propre UUID complet, stocké dans l'entrée de configuration. Pour les requêtes PLOUD, seul son préfixe de cinq caractères est envoyé dans le champ `Device` et utilisé pour calculer la signature HMAC, conformément au comportement de l'application Android (`shortIdentifier()`). L'UUID complet reste conservé localement. Il ne faut ni saisir ni recopier l'identifiant d'un téléphone ou du client Python.

## Options de synchronisation

La reconfiguration permet de modifier l'URL du serveur PLOUD ; l'URL actuellement utilisée est préremplie. Dans **Configurer**, la fréquence d'interrogation (de 5 à 1 440 minutes ; 15 minutes par défaut) et la langue des réponses PLOUD (français ou anglais) restent également réglables. L'enregistrement des options recharge l'entrée de configuration. La synchronisation manuelle reste disponible.

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

Le jeton d'accès PLOUD et l'identifiant de l'appareil sont conservés dans l'entrée de configuration Home Assistant. L'inventaire local et son curseur de synchronisation associé sont enregistrés avec le `Store` persistant de Home Assistant. Les changements reçus sont enregistrés avant de remplacer le modèle en mémoire : un échec d'écriture ne fait donc pas avancer le curseur actif.

L'intégration demande uniquement les données de synchronisation ; elle n'envoie pas d'objets de cave et n'effectue aucune modification de la cave.

## État du développement

Cette intégration est en cours de développement. La CI contrôle Ruff, Hassfest et le typage strict avec Pyright sur Home Assistant 2026.8.2 et la dernière version stable. Ces contrôles statiques ne remplacent pas les essais de bout en bout avec une instance Home Assistant réelle et la cave PLOUD.
