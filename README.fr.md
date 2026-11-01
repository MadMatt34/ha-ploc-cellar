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

## Installation

1. Copier `custom_components/ploc_cellar` dans `<config>/custom_components/`.
2. Redémarrer Home Assistant.
3. Aller dans **Paramètres → Appareils et services → Ajouter une intégration**, puis sélectionner **Ploc Cellar**.
4. Saisir l'URL du serveur PLOUD, le jeton d'accès PLOUD et la langue souhaitée. L'identifiant d'appareil est généré automatiquement.

## Préparer le jeton d'accès PLOUD

L'intégration a besoin du jeton technique PLOUD, pas du mot de passe PLOC, du jeton de session PLOC, ni du champ `ploud_token`.

Le client Python PLOC/PLOUD utilisé pour valider le protocole effectue cette préparation :

1. Il se connecte au compte PLOC avec l'adresse e-mail et le mot de passe PLOC.
2. Il appelle l'activation PLOUD pour ce client (`POST /ploud/activate`).
3. La réponse contient le modèle PLOUD, dont `accessToken`. Le client l'enregistre sous la clé `ploud_access_token` dans son fichier d'état local.
4. Le client Python de synchronisation réutilise ensuite cette valeur comme champ `Token` des requêtes `/sync/exec`.

Par défaut, le fichier d'état du client Python est :

```text
~/.ploc_ploud_state.json
```

Après avoir effectué l'activation avec le client Python, afficher localement la valeur à saisir dans Home Assistant avec :

```bash
jq -r '.ploud_access_token' ~/.ploc_ploud_state.json
```

Copier cette valeur dans le champ **Jeton d'accès PLOUD** de l'intégration. Ne pas utiliser `ploud_token` ni `accessToken` de premier niveau : ce sont des champs distincts. Ne pas publier ni transmettre le jeton. Le champ `device` de ce fichier appartient au client Python et n'est pas à recopier : Home Assistant génère sa propre identité d'appareil.

Si le fichier d'état existe déjà, le client Python réutilise normalement les informations enregistrées et ne relance pas l'activation. Le fichier `~/.ploc_ploud_cellar.json` est uniquement le cache de l'inventaire local : il ne contient pas les identifiants d'authentification.

> L'intégration Home Assistant ne réalise pas elle-même la connexion au compte PLOC ni l'activation PLOUD. Cette étape préalable est actuellement effectuée par le client Python de préparation.

## Configuration

### Paramètres de connexion

La configuration initiale demande l'URL du serveur PLOUD (par défaut `https://ploud.ploc.co/v1`), le jeton d'accès PLOUD et la langue des réponses (`fr` ou `en`). Un nouvel identifiant d'appareil est créé automatiquement à chaque nouvelle installation : il est construit à partir des cinq premiers caractères hexadécimaux d'un UUID aléatoire, conformément au format court de cinq caractères utilisé par PLOC et validé avec `sync/exec`. Il est enregistré dans l'entrée de configuration et reste stable lors des rechargements et réauthentifications. À noter : la première version du client Python de préparation générait pour sa part un UUID complet pour son propre appareil ; cet identifiant distinct n'est pas réutilisé par Home Assistant.

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

Le jeton d'accès PLOUD et l'identifiant de l'appareil sont conservés dans l'entrée de configuration Home Assistant. L'inventaire local et son curseur de synchronisation associé sont enregistrés avec le `Store` persistant de Home Assistant. Les changements reçus sont enregistrés avant de remplacer le modèle en mémoire : un échec d'écriture ne fait donc pas avancer le curseur actif.

L'intégration demande uniquement les données de synchronisation ; elle n'envoie pas d'objets de cave et n'effectue aucune modification de la cave.

## État du développement

Cette intégration est en cours de développement. La CI contrôle Ruff, Hassfest et le typage strict avec Pyright sur Home Assistant 2026.8.2 et la dernière version stable. Ces contrôles statiques ne remplacent pas les essais de bout en bout avec une instance Home Assistant réelle et la cave PLOUD.
