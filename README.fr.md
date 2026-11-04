# Ploc Cellar

Intégration personnalisée Home Assistant permettant de consulter une cave PLOC en **lecture seule**, synchronisée par PLOUD.

[English version](README.md)

## Prérequis

- Home Assistant 2026.10.4 ou version ultérieure.
- Python 3.14.2 ou version ultérieure, conformément aux prérequis de Home Assistant 2026.10.4.

## Fonctionnalités

- PLOUD reste la source de vérité.
- Synchronisation incrémentale en lecture seule via `POST https://ploud.ploc.co/v1/sync/exec`, avec `Objects={}`.
- Le premier chargement utilise la valeur d'initialisation validée `LastSyncTime=1`. Les synchronisations suivantes utilisent le curseur client en millisecondes Unix.
- Modèle local persistant : les références `Wine` reçues de PLOUD, les casiers et leurs emplacements. La valeur brute `Wine.bo` est conservée à titre informatif. Le stock effectif est reconstitué avec les mouvements `Orders` et les bouteilles physiquement placées (`RackItems`) selon la formule `max(0, solde des mouvements, bouteilles en cave)`. Les bouteilles non placées (`bottles_to_store`) correspondent à la différence entre le stock effectif et les bouteilles en cave. Les écarts entre le solde des mouvements et le stock effectif sont signalés séparément, sans jamais corriger les données PLOUD. Les caractéristiques, dont le domaine viticole, sont directement enregistrées dans chaque fiche vin. La collection `Owners` est utilisée temporairement pour résoudre les UUID des propriétaires ; aucune table de correspondance n'est conservée. Si un vin reçu dans un delta référence un propriétaire absent de ce delta, une synchronisation complète ponctuelle est déclenchée pour résoudre son nom.
- Un seul capteur de synthèse ; aucune entité n'est créée pour chaque vin, casier ou emplacement.
- Inventaire détaillé accessible à la demande avec l'action `ploc_cellar.get_inventory`.
- Synchronisation immédiate à la demande avec l'action `ploc_cellar.sync`.
- Une seule entrée de configuration Ploc Cellar par instance Home Assistant.
- Aucune opération d'écriture n'est envoyée à PLOUD.

Les règles détaillées de calcul du stock, de synchronisation et d'intégrité
du stockage sont décrites dans la [spécification des algorithmes](docs/ALGORITHMES.md).

## Installation et première configuration

1. Copier le dossier `custom_components/ploc_cellar` dans `<config>/custom_components/`.
2. Redémarrer Home Assistant.
3. Aller dans **Paramètres → Appareils et services → Ajouter une intégration**, puis sélectionner **Ploc Cellar**.
4. Saisir l'adresse e-mail et le mot de passe du compte PLOC.

Aucun jeton technique, identifiant d'appareil ou serveur PLOUD n'est à saisir. Le serveur PLOUD utilisé par l'intégration est fixe.

### Authentification et activation PLOUD

Home Assistant effectue automatiquement les opérations suivantes :

1. Authentification au compte PLOC via `POST https://api.ploc.co/a/v3/signin`. La requête utilise le chiffrement et la signature employés par l'application PLOC.
2. Activation de PLOUD pour l'application **Home Assistant** via `POST https://api.ploc.co/v1/ploud/activate`, avec le jeton de session PLOC obtenu à l'étape précédente.
3. Récupération du jeton d'accès PLOUD retourné par l'activation.
4. Génération d'un identifiant d'appareil UUID propre à cette installation.
5. Enregistrement du jeton d'accès PLOUD et de l'identifiant d'appareil dans l'entrée de configuration Home Assistant. La langue n'est pas figée dans cette entrée : elle est déterminée automatiquement à partir du pays configuré dans Home Assistant.
6. Première synchronisation en lecture seule avec le serveur PLOUD fixe.

L'identifiant UUID complet est conservé localement. Pour les requêtes PLOUD, seul son préfixe de cinq caractères est envoyé dans le champ `Device` et utilisé pour calculer la signature, conformément au comportement du client Android.

L'adresse e-mail, le mot de passe et le jeton de session PLOC ne sont pas enregistrés dans l'entrée de configuration. Le mot de passe est utilisé uniquement pendant l'authentification initiale ou lors d'une réauthentification.

### Réauthentification

Si Home Assistant demande une réauthentification, saisir à nouveau l'adresse e-mail et le mot de passe du compte PLOC. L'intégration renouvelle l'activation PLOUD et remplace le jeton d'accès enregistré. L'identifiant de l'appareil reste inchangé.

## Options de synchronisation

Dans **Paramètres → Appareils et services → Ploc Cellar → Configurer**, les options suivantes sont disponibles :

- **Intervalle de synchronisation** : de 5 à 1 440 minutes ; 240 minutes par défaut.
- **Langue des réponses PLOUD** : `Automatique`, `Français` ou `English`. En mode automatique (par défaut), les pays francophones utilisent `fr` et les autres pays `en`. Si aucun pays n'est défini dans Home Assistant, la langue générale de Home Assistant sert de repli (`fr` si elle est française, `en` sinon). Les choix manuels `Français` et `English` restent prioritaires jusqu'à ce que `Automatique` soit sélectionné.

L'enregistrement des options recharge l'entrée de configuration. L'adresse du serveur PLOUD n'est pas modifiable depuis l'intégration.

## Entité

L'intégration crée un capteur de synthèse :

- `sensor.ploc_cellar_inventory` : nombre de bouteilles affectées à des emplacements de cave (calculé depuis les `RackItems`).

Ses attributs sont :

| Identifiant | Description |
|---|---|
| `wine_references` | Nombre de références ayant un stock effectif positif |
| `stocked_wines` | Nombre de références ayant au moins une position en cave |
| `total_stock_bottles` | Nombre total de bouteilles reconstitué |
| `bottles_to_store` | Nombre de bouteilles non placées |
| `inventory_error_wines` | Nombre de références avec des bouteilles non placées |
| `inventory_error_count` | Nombre d'anomalies de bouteilles non placées |
| `movement_warning_wines` | Nombre de références avec une anomalie de mouvements |
| `movement_warning_bottles` | Somme des écarts absolus entre mouvements et stock effectif |
| `rack_count` | Nombre de casiers |
| `total_positions` | Nombre total d'emplacements physiques |
| `empty_positions` | Nombre d'emplacements vides |
| `occupied_positions` | Nombre d'emplacements ayant un `wine_id` non vide |
| `orphaned_rack_positions` | Nombre de positions référençant un casier inconnu |
| `orphaned_wine_positions` | Nombre de positions occupées référençant un vin inconnu |
| `orphaned_order_count` | Nombre de mouvements conservés référençant un vin inconnu |
| `stale` | Indique que la dernière synchronisation a échoué |
| `last_successful_sync` | Date et heure de la dernière synchronisation réussie (format ISO 8601) |

Les libellés des attributs sont traduits selon la langue de Home Assistant. En cas d'échec de synchronisation, le dernier inventaire local connu est conservé et l'attribut `stale` indique que les données peuvent être périmées. Une synchronisation réussie remet cet indicateur à `false`.

La liste complète des vins n'est volontairement pas placée dans les attributs du capteur. Elle reste dans le stockage persistant et n'est renvoyée que sur demande.

## Actions

### `ploc_cellar.get_inventory`

Action avec réponse. Utiliser `response_variable` dans un script ou une automatisation.

Le champ `config_entry_id` est obligatoire pour identifier la connexion Ploc Cellar. Home Assistant propose un sélecteur limité aux entrées de cette intégration. Les filtres facultatifs sont :

- `search` : recherche partielle dans le nom du vin, le domaine viticole, l'appellation, la région, le pays, le cépage, la cuvée ou le commentaire.
- `color` : filtre partiel sur la couleur du vin.

Exemple :

```yaml
action: ploc_cellar.get_inventory
data:
  config_entry_id: IDENTIFIANT_DE_CONFIGURATION
  search: Condrieu
response_variable: cave
```

La réponse contient :

- les totaux globaux : `total_bottles` compte toutes les positions physiques occupées ; `stocked_wines` compte les références Wine connues ayant au moins une position ; `total_stock_bottles` inclut aussi les positions occupées dont la référence Wine est temporairement inconnue ; `orphaned_order_count` compte les mouvements conservés pour des vins inconnus ou supprimés (ils sont exclus des calculs de stock des vins connus) ; `bottles_to_store`, `inventory_error_wines` et `inventory_error_count` décrivent les bouteilles connues non placées ;
- `rack_count`, `total_positions`, `occupied_positions` et `empty_positions`, le nombre de casiers et le détail des emplacements ; `orphaned_rack_positions` et `orphaned_wine_positions` signalent les références de casier ou de vin temporairement inconnues ;
- `matching_wines`, le nombre de vins correspondant aux filtres ;
- `racks`, la liste des casiers ;
- `wines`, uniquement les vins ayant un stock effectif positif, avec `bottles` (stock effectif reconstitué), `ploud_bottles` (valeur brute `Wine.bo`), `bottles_in_cellar` (en cave), `bottles_to_store` (non placées), `purchased`, `consumed`, `movement_balance`, `calculated_stock`, `inventory_errors` (bouteilles non placées) et `movement_warnings` (écarts entre le solde des mouvements et le stock effectif) ;
- `movement_anomalies`, la liste dédiée des 7 références dont les mouvements ne correspondent pas au stock effectif, y compris les références à stock nul ;
- `last_sync`, la date et l'heure de la dernière synchronisation réussie.

Dans `inventory_errors`, la valeur `unplaced_bottles` signale une référence avec des bouteilles non placées. Les références avec un écart de mouvements sont listées séparément dans `movement_anomalies`, y compris lorsqu’elles ont un stock effectif nul ; elles ne sont donc pas ajoutées à la liste normale `wines`. `movement_warning_wines` compte ces références et `movement_warning_bottles` additionne les écarts absolus en bouteilles entre le solde des mouvements et le stock effectif. Les valeurs brutes `Wine.bo` restent informatives et ne déterminent ni les anomalies de mouvements ni le stock effectif. Aucune correction n’est envoyée à PLOUD. Les filtres ne modifient pas les totaux globaux. Chaque emplacement associé à un vin contient le nom et l'identifiant du casier, ainsi que la rangée et la colonne lorsqu'elles sont disponibles.

### `ploc_cellar.sync`

Déclenche immédiatement une synchronisation en lecture seule :

```yaml
action: ploc_cellar.sync
data:
  config_entry_id: IDENTIFIANT_DE_CONFIGURATION
```

## Stockage et confidentialité

Le jeton d'accès PLOUD et l'identifiant UUID de l'appareil sont conservés dans l'entrée de configuration Home Assistant. Le mot de passe et le jeton de session PLOC ne sont pas stockés.

L'inventaire local et son curseur de synchronisation associé sont enregistrés avec le `Store` persistant de Home Assistant. Les changements reçus sont appliqués à une copie du modèle puis enregistrés avant de remplacer le modèle en mémoire : un échec d'écriture ne fait donc pas avancer le curseur actif.

L'intégration envoie uniquement les paramètres nécessaires à la synchronisation et un objet `Objects` vide. Elle ne transmet aucun objet de cave et n'effectue aucune modification de la cave. La collection `Owners` est traitée uniquement en mémoire pour renseigner `Wine.domain`. Les mouvements `Orders` sont conservés localement afin de calculer les diagnostics d'inventaire. Les commandes dont la référence Wine n'existe plus sont conservées comme historique et comptées dans `orphaned_order_count`, mais ne contribuent au stock d'aucun vin connu. Si un propriétaire référencé par un nouveau vin manque dans le delta, le coordinateur effectue une seule synchronisation complète pour résoudre son nom.

## Validation

La CI vérifie le code avec Ruff et Hassfest et exécute Pyright en mode strict contre la dernière version stable de Home Assistant disponible sur PyPI.

Ces contrôles statiques ne remplacent pas les essais de bout en bout avec une instance Home Assistant réelle et la cave PLOUD.
