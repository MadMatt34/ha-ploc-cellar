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
- Modèle local persistant : les références `Wine` reçues de PLOUD, les casiers et leurs emplacements. La valeur brute `Wine.bo` est conservée à titre informatif. Le stock effectif est reconstitué avec les mouvements `Orders` et les bouteilles physiquement placées (`RackItems`) selon la formule `max(0, solde des mouvements, bouteilles en cave)`. Les diagnostics distinguent le stock non localisé (`unlocated_bottles`), les soldes de mouvements négatifs (`negative_movement_bottles`) et les excédents physiques (`physical_surplus_bottles`). Un stock non localisé signifie que le solde issu des mouvements dépasse les bouteilles affectées à des emplacements ; cela ne prouve pas qu'une bouteille a été retirée sans mouvement de sortie déclaré. Les données PLOUD ne sont jamais modifiées. Les caractéristiques, dont le domaine viticole, sont directement enregistrées dans chaque fiche vin. La collection `Owners` est utilisée temporairement pour résoudre les UUID des propriétaires ; aucune table de correspondance n'est conservée. Si un vin reçu dans un delta référence un propriétaire absent de ce delta, ou un Owner dont l'enregistrement ne contient pas de champ de nom, une synchronisation complète ponctuelle est déclenchée pour résoudre son nom.
- Quatorze capteurs répartis entre inventaire, casiers et diagnostics ; aucune entité individuelle n'est créée pour chaque vin, casier ou emplacement.
- Inventaire détaillé accessible à la demande avec l'action `ploc_cellar.get_inventory`.
- Deux boutons sur l'appareil Cave Ploc déclenchent une synchronisation différentielle ou une synchronisation complète.
- Les UUID sont normalisés sous leur forme canonique minuscule pour les vins, casiers, positions, mouvements, propriétaires et suppressions ; les identifiants non UUID sont débarrassés des espaces périphériques sans changement de casse.
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

## Entités

Les 14 capteurs et les deux boutons de synchronisation sont rattachés au même appareil **Cave Ploc** et utilisent le même coordinateur PLOUD. L’intégration ne crée pas d’entité individuelle pour chaque vin, casier ou emplacement.

| Famille | Nom de l’entité | Signification |
|---|---|---|
| Inventaire | Bouteilles en cave | Bouteilles physiquement affectées à des emplacements (positions `RackItems` occupées). |
| Inventaire | Bouteilles en stock total | Stock total reconstitué : stock issu des mouvements ou stock physique, selon le plus élevé, avec les positions occupées dont le vin est inconnu. |
| Inventaire | Références de vins en stock | Références de vins connues dont le stock effectif est positif. |
| Inventaire | Références physiquement présentes en cave | Références de vins connues ayant au moins une position physique en cave. |
| Casiers | Nombre de casiers | Nombre de casiers connus. |
| Casiers | Nombre total d’emplacements | Nombre total d’emplacements physiques. |
| Casiers | Emplacements disponibles | Nombre d’emplacements vides. |
| Diagnostics | Bouteilles non localisées | Bouteilles reconstituées qui ne sont affectées à aucun emplacement. |
| Diagnostics | Vins avec stock non localisé | Références de vins avec du stock non localisé. |
| Diagnostics | Bouteilles liées à des mouvements négatifs | Somme des soldes entrées-sorties négatifs, en valeur absolue. |
| Diagnostics | Vins avec solde de mouvements négatif | Références de vins avec un solde de mouvements négatif. |
| Diagnostics | Bouteilles en excédent physique | Bouteilles physiques au-delà du stock non négatif issu des mouvements. |
| Diagnostics | Vins avec excédent physique | Références de vins présentant un excédent physique. |
| Diagnostics | Dernière synchronisation réussie | Date et heure de la dernière synchronisation réussie ; son attribut `stale` passe à true lorsqu’une synchronisation ultérieure échoue. |
| Actions | Synchronisation différentielle | Récupère les modifications depuis le curseur PLOUD enregistré. |
| Actions | Synchronisation complète | Force un instantané PLOUD complet et reconstruit l’inventaire local. |

Les capteurs de stock et de diagnostic dépendant des mouvements affichent `unknown` tant qu’un instantané PLOUD complet de la collection `Orders` n’a pas été validé. Les compteurs physiques de bouteilles et d’emplacements restent disponibles. Après un échec de synchronisation, la date de dernière réussite est conservée et l’attribut `stale` du capteur de synchronisation passe à true ; une synchronisation réussie le remet à false.

L’intégration ne force aucun identifiant d’entité. Home Assistant les génère selon le format configuré dans l’instance (zone, appareil parent, appareil et nom de l’entité). Les identifiants déjà présents dans le registre sont conservés lors d’une mise à niveau. Pour les recréer selon le format actuel, utiliser **Recréer les identifiants d’entité** dans le menu de l’appareil.
## Actions

### Boutons de synchronisation

Les deux boutons sont disponibles sur l’appareil **Cave Ploc** :

- `button.ploc_cellar_sync` : applique les modifications depuis la dernière synchronisation à partir du curseur enregistré.
- `button.ploc_cellar_sync_full` : demande un instantané PLOUD complet et reconstruit l’inventaire local. L’inventaire validé existant reste disponible tant que le nouvel instantané n’a pas été validé et enregistré.

Ils appellent les mêmes méthodes du coordinateur que les actions `ploc_cellar.sync` et `ploc_cellar.sync_full`. Ils peuvent également être utilisés dans une automatisation avec l’action standard `button.press`.

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

- les totaux globaux : `total_bottles` compte toutes les positions physiques occupées ; `stocked_wines` compte les références Wine connues ayant au moins une position ; `total_stock_bottles` inclut aussi les positions occupées dont la référence Wine est temporairement inconnue ; `orders_without_wine` compte les mouvements conservés pour des vins inconnus ou supprimés (ils sont exclus des calculs de stock des vins connus) ; `unlocated_wines` et `unlocated_bottles` décrivent le stock reconstitué non affecté à un emplacement ; `negative_movement_wines` et `negative_movement_bottles` décrivent les soldes de mouvements négatifs ; `physical_surplus_wines` et `physical_surplus_bottles` décrivent les bouteilles physiquement présentes au-delà du stock non négatif issu des mouvements. Ces valeurs dérivées des Orders valent `null` lorsque `stock_reconstruction_complete` est faux ;
- `rack_count`, `total_positions`, `occupied_positions` et `empty_positions`, le nombre de casiers et le détail des emplacements ; `positions_without_rack` et `positions_with_unknown_wine` signalent les références de casier ou de vin temporairement inconnues ;
- `matching_wines`, le nombre de vins correspondant aux filtres ;
- `racks`, la liste des casiers ;
- `wines`, normalement uniquement les vins dont le stock effectif est positif. Si la reconstitution est incomplète, seuls les vins connus avec des bouteilles physiquement placées sont renvoyés ; leurs quantités et diagnostics dépendant du stock valent `null`, comme les totaux globaux qui dépendent des mouvements ;
- `wine_diagnostics`, la liste non filtrée des vins ayant au moins un diagnostic de stock non localisé, de solde de mouvements négatif ou d’excédent physique, y compris ceux dont le stock effectif est nul. Chaque entrée fournit les entrées, sorties, le solde des mouvements, la quantité physique, le stock effectif et les trois quantités de diagnostic. Cette liste vaut `null` tant que la reconstitution du stock est incomplète ;
- `stock_reconstruction_complete`, indique si un instantané complet des Orders est disponible ;
- `last_sync`, la date et l'heure de la dernière synchronisation réussie.

Pour chaque vin, `unlocated_bottles` correspond à la différence entre le stock effectif et les bouteilles physiquement placées ; `negative_movement_bottles` est la valeur absolue d'un solde entrées-sorties négatif ; `physical_surplus_bottles` compte les bouteilles physiquement présentes au-delà de `max(0, movement_balance)`. Ces diagnostics sont distincts et peuvent coexister pour une même référence. Un stock non localisé ne prouve pas qu'une bouteille a été retirée sans déclarer sa sortie : elle peut ne jamais avoir été rangée ou être conservée hors de la cave. Les valeurs brutes `Wine.bo` restent informatives et ne déterminent pas le stock effectif. Aucune correction n'est envoyée à PLOUD. Les filtres ne modifient pas les totaux globaux. Chaque emplacement associé à un vin contient le nom et l'identifiant du casier, ainsi que la rangée et la colonne lorsqu'elles sont disponibles.

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

L'intégration envoie uniquement les paramètres nécessaires à la synchronisation et un objet `Objects` vide. Elle ne transmet aucun objet de cave et n'effectue aucune modification de la cave. La collection `Owners` est traitée uniquement en mémoire pour renseigner `Wine.domain`. Les mouvements `Orders` sont conservés localement afin de calculer les diagnostics d'inventaire. Les commandes dont la référence Wine n'existe plus sont conservées comme historique et comptées dans `orders_without_wine`, mais ne contribuent au stock d'aucun vin connu. Si un propriétaire référencé par un nouveau vin manque dans le delta, le coordinateur effectue une seule synchronisation complète pour résoudre son nom.

## Validation

La CI vérifie le code avec Ruff et Hassfest, exécute Pyright en mode strict contre la dernière version stable de Home Assistant disponible sur PyPI ainsi que la suite unitaire pytest, et valide la structure HACS de l'intégration.

Ces contrôles statiques ne remplacent pas les essais de bout en bout avec une instance Home Assistant réelle et la cave PLOUD.
