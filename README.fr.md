# Ploc Cellar

Intégration personnalisée Home Assistant permettant de consulter une cave PLOC en **lecture seule**, synchronisée par PLOUD.

[English version](README.md)

[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2026.10.4%2B-blue)](https://www.home-assistant.io/)
[![HACS](https://img.shields.io/badge/HACS-Dépôt%20personnalisé-blue)](https://www.hacs.xyz/docs/faq/custom_repositories/)
[![Validation](https://github.com/MadMatt34/ha-ploc-cellar/actions/workflows/validate.yaml/badge.svg)](https://github.com/MadMatt34/ha-ploc-cellar/actions/workflows/validate.yaml)
[![Licence : MIT](https://img.shields.io/badge/Licence-MIT-green.svg)](LICENSE)

![Ploc Cellar](https://raw.githubusercontent.com/MadMatt34/ha-ploc-cellar/main/custom_components/ploc_cellar/brand/logo.png)

## 📚 Navigation

- [Prérequis](#prérequis)
- [Fonctionnalités](#fonctionnalités)
- [Données des accords mets et vins](#données-des-accords-mets-et-vins)
- [Installation et première configuration](#installation-et-première-configuration)
- [Options de synchronisation](#options-de-synchronisation)
- [Entités](#entités)
- [Actions et réponse d'inventaire](#actions)
- [Événement de synchronisation](#événement-de-synchronisation)
- [Stockage et confidentialité](#stockage-et-confidentialité)
- [Validation](#validation)
- [Cartes Lovelace](#cartes-lovelace)
- [Dépannage](#dépannage)
- [Désinstallation](#désinstallation)
- [Licence et avertissement](#licence-et-avertissement)


## 📋 Prérequis

- Home Assistant 2026.10.4 ou version ultérieure.
- Python 3.14.2 ou version ultérieure, conformément aux prérequis de Home Assistant 2026.10.4.

## ⚡ Fonctionnalités

- PLOUD reste la source de vérité.
- Synchronisation incrémentale en lecture seule via `POST https://ploud.ploc.co/v1/sync/exec`, avec `Objects={}`.
- Le premier chargement utilise la valeur d'initialisation validée `LastSyncTime=1`. Les synchronisations suivantes utilisent le curseur client en millisecondes Unix.
- Modèle local persistant : les références `Wine` reçues de PLOUD, les casiers et leurs emplacements. La valeur brute `Wine.bo` est conservée à titre informatif. Le stock effectif est reconstitué avec les mouvements `Orders` et les bouteilles physiquement placées (`RackItems`) selon la formule `max(0, solde des mouvements, bouteilles en cave)`. Les diagnostics distinguent le stock non localisé (`unlocated_bottles`), les soldes de mouvements négatifs (`negative_movement_bottles`) et les excédents physiques (`physical_surplus_bottles`). Un stock non localisé signifie que le solde issu des mouvements dépasse les bouteilles affectées à des emplacements ; cela ne prouve pas qu'une bouteille a été retirée sans mouvement de sortie déclaré. Les données PLOUD ne sont jamais modifiées. Les caractéristiques, dont le domaine viticole, sont directement enregistrées dans chaque fiche vin. Les six collections de référence PLOUD sont indexées et conservées localement afin de résoudre les identifiants compacts lors des mises à jour incrémentales de vins, sans imposer une synchronisation complète. La collection `Owners` reste temporaire et sert uniquement à résoudre le nom du domaine viticole. Si un vin reçu dans un delta référence un propriétaire absent de ce delta, ou un Owner dont l'enregistrement ne contient pas de champ de nom, une synchronisation complète ponctuelle est déclenchée pour résoudre son nom.
- Quatorze capteurs répartis entre inventaire, casiers et diagnostics ; aucune entité individuelle n'est créée pour chaque vin, casier ou emplacement.
- Inventaire détaillé accessible à la demande avec l'action `ploc_cellar.get_inventory`.
- Les photos principales et de couverture des vins sont téléchargées depuis les `Documents` PLOUD lorsqu’elles sont référencées, mises en cache localement et servies par une route Home Assistant authentifiée. Une modification du document invalide le cache ; les documents supprimés ou non référencés sont nettoyés, et la suppression de l’entrée efface son cache d’images.
- Deux boutons sur l'appareil Cave Ploc déclenchent une synchronisation différentielle ou une synchronisation complète.
- Les UUID sont normalisés sous leur forme canonique minuscule pour les vins, casiers, positions, mouvements, propriétaires et suppressions ; les identifiants non UUID sont débarrassés des espaces périphériques sans changement de casse.
- Plusieurs entrées de configuration Ploc Cellar sont autorisées. Chaque entrée utilise un compte PLOC/PLOUD, un appareil Home Assistant, un coordinateur, un inventaire persistant et un cache d'images indépendants.
- Aucune opération d'écriture n'est envoyée à PLOUD.

## Données des accords mets et vins

PLOUD stocke les associations mets-vins dans le champ `Wine.ml`. L'intégration expose cette valeur sous la forme de l'entier brut facultatif `Wine.meals` ; elle ne traduit, ne normalise et ne supprime aucun indicateur. Il s'agit d'un masque de bits : plusieurs catégories peuvent être présentes dans une même valeur en combinant leurs indicateurs par OU binaire.

Indicateurs `Meals` identifiés dans les données PLOUD :

| Valeur du bit | Catégorie de mets |
|---:|---|
| `1` | Apéritif |
| `2` | Soupe |
| `4` | Entrée |
| `8` | Porc et charcuterie |
| `16` | Fruits de mer |
| `32` | Poisson |
| `64` | Viande blanche |
| `128` | Gibier |
| `256` | Volaille |
| `512` | Viande rouge |
| `1024` | Plats et légumes |
| `2048` | Fromage |
| `4096` | Dessert |
| `8192` | Épicés |

Le frontend associe ces indicateurs à des libellés localisés dans la fenêtre de détail du vin. Une valeur `meals` absente ou nulle signifie que les données d'association ne sont pas disponibles ; elle ne doit pas être interprétée comme une liste explicitement vide.

L'application Android PLOUD identifie `8192` comme `foodtype8192` (plats épicés). Le frontend affiche cet indicateur confirmé sous le libellé **Épicés**. Les autres bits inconnus doivent toujours être conservés par le backend et ignorés par le frontend.

Les règles détaillées de calcul du stock, de synchronisation et d'intégrité
du stockage sont décrites dans la [spécification des algorithmes](docs/ALGORITHMES.md).

## 🧩 Installation et première configuration

### 🧩 Installation avec HACS (recommandée)

1. Dans HACS, ouvrir **Dépôts personnalisés**.
2. Ajouter `MadMatt34/ha-ploc-cellar` et sélectionner la catégorie **Intégration**.
3. Installer **Ploc Cellar** depuis HACS.
4. Redémarrer Home Assistant, puis ouvrir **Paramètres → Appareils et services → Ajouter une intégration** et sélectionner **Ploc Cellar**.

Le dépôt est distribué comme intégration HACS personnalisée ; il n'est pas présenté comme faisant partie du catalogue HACS par défaut.

### 🧩 Installation manuelle


1. Copier le dossier `custom_components/ploc_cellar` dans `<config>/custom_components/`.
2. Redémarrer Home Assistant.
3. Aller dans **Paramètres → Appareils et services → Ajouter une intégration**, puis sélectionner **Ploc Cellar**.
4. Saisir l'adresse e-mail et le mot de passe du compte PLOC.

Aucun jeton technique, identifiant d'appareil ou serveur PLOUD n'est à saisir. Le serveur PLOUD utilisé par l'intégration est fixe. Pour ajouter un autre compte PLOC, répéter l'ajout de l'intégration et se connecter avec les identifiants de ce compte.

### Authentification et activation PLOUD

Home Assistant effectue automatiquement les opérations suivantes :

1. Authentification au compte PLOC via `POST https://api.ploc.co/a/v3/signin`. La requête utilise le chiffrement et la signature employés par l'application PLOC.
2. Activation de PLOUD pour l'application **Home Assistant** via `POST https://api.ploc.co/v1/ploud/activate`, avec le jeton de session PLOC obtenu à l'étape précédente.
3. Récupération du jeton d'accès PLOUD retourné par l'activation.
4. Génération d'un identifiant d'appareil UUID propre à cette entrée de configuration.
5. Enregistrement du jeton d'accès PLOUD et de l'identifiant d'appareil dans cette entrée de configuration Home Assistant. Chaque compte dispose ainsi de son propre identifiant PLOUD. La langue n'est pas figée dans l'entrée : elle est déterminée automatiquement à partir du pays configuré dans Home Assistant.
6. Première synchronisation en lecture seule avec le serveur PLOUD fixe.

L'identifiant UUID complet est conservé localement. Pour les requêtes PLOUD, seul son préfixe de cinq caractères est envoyé dans le champ `Device` et utilisé pour calculer la signature, conformément au comportement du client Android.

L'adresse e-mail, le mot de passe et le jeton de session PLOC ne sont pas enregistrés dans l'entrée de configuration. Le mot de passe est utilisé uniquement pendant l'authentification initiale ou lors d'une réauthentification.

### Réauthentification

Si Home Assistant demande une réauthentification, saisir à nouveau l'adresse e-mail et le mot de passe du compte PLOC. L'intégration renouvelle l'activation PLOUD et remplace le jeton d'accès enregistré. L'identifiant de l'appareil reste inchangé.

## ⚙️ Options de synchronisation

Dans **Paramètres → Appareils et services → Ploc Cellar → Configurer**, les options suivantes sont disponibles :

- **Intervalle de synchronisation** : de 5 à 1 440 minutes ; 240 minutes par défaut.
- **Langue des réponses PLOUD** : `Automatique`, `Français` ou `English`. En mode automatique (par défaut), les pays francophones utilisent `fr` et les autres pays `en`. Si aucun pays n'est défini dans Home Assistant, la langue générale de Home Assistant sert de repli (`fr` si elle est française, `en` sinon). Les choix manuels `Français` et `English` restent prioritaires jusqu'à ce que `Automatique` soit sélectionné.

L'enregistrement des options recharge l'entrée de configuration. L'adresse du serveur PLOUD n'est pas modifiable depuis l'intégration.

## 📊 Entités

Chaque entrée de configuration crée son propre appareil **Cave Ploc**, avec 14 capteurs, deux boutons de synchronisation et un coordinateur PLOUD dédiés. Les inventaires, les identifiants d'entités et les caches restent indépendants entre les comptes. L’intégration ne crée pas d’entité individuelle pour chaque vin, casier ou emplacement.

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
| Boutons | Synchronisation différentielle | Récupère les modifications depuis le curseur PLOUD enregistré. |
| Boutons | Synchronisation complète | Force un instantané PLOUD complet et reconstruit l’inventaire local. |

Les capteurs de stock et de diagnostic dépendant des mouvements affichent `unknown` tant qu’un instantané PLOUD complet de la collection `Orders` n’a pas été validé. Les compteurs physiques de bouteilles et d’emplacements restent disponibles. Après un échec de synchronisation, la date de dernière réussite est conservée et l’attribut `stale` du capteur de synchronisation passe à true ; une synchronisation réussie le remet à false.

L’intégration ne force aucun identifiant d’entité. Home Assistant les génère selon le format configuré dans l’instance (zone, appareil parent, appareil et nom de l’entité). Les identifiants déjà présents dans le registre sont conservés lors d’une mise à niveau. Pour les recréer selon le format actuel, utiliser **Recréer les identifiants d’entité** dans le menu de l’appareil.
## 🔘 Actions

### Boutons de synchronisation

Les deux boutons sont disponibles sur l’appareil **Cave Ploc** :

- **Synchronisation différentielle** : applique les modifications depuis la dernière synchronisation à partir du curseur enregistré.
- **Synchronisation complète** : demande un instantané PLOUD complet et reconstruit l’inventaire local. L’inventaire validé existant reste disponible tant que le nouvel instantané n’a pas été validé et enregistré.

Ils peuvent également être utilisés dans une automatisation avec l’action standard `button.press`.

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
- `rack_items`, la liste complète des emplacements physiques, y compris les emplacements libres et les références de casier ou de vin temporairement inconnues. Chaque élément contient `id`, `rack_id`, `wine_id` (`null` si l'emplacement est libre), `row` et `column` ;
- `stale`, indique si l'inventaire affiché est antérieur à la dernière synchronisation réussie parce qu'une synchronisation ultérieure a échoué ;
- `wines`, normalement uniquement les vins dont le stock effectif est positif. Si la reconstitution est incomplète, seuls les vins connus avec des bouteilles physiquement placées sont renvoyés ; leurs quantités et diagnostics dépendant du stock valent `null`, comme les totaux globaux qui dépendent des mouvements ;
- `wine_diagnostics`, la liste non filtrée des vins ayant au moins un diagnostic de stock non localisé, de solde de mouvements négatif ou d’excédent physique, y compris ceux dont le stock effectif est nul. Chaque entrée fournit les entrées, sorties, le solde des mouvements, la quantité physique, le stock effectif et les trois quantités de diagnostic. Cette liste vaut `null` tant que la reconstitution du stock est incomplète ;
- `stock_reconstruction_complete`, indique si un instantané complet des Orders est disponible ;
- `last_sync`, la date et l'heure de la dernière synchronisation réussie.

Pour chaque vin, `unlocated_bottles` correspond à la différence entre le stock effectif et les bouteilles physiquement placées ; `negative_movement_bottles` est la valeur absolue d'un solde entrées-sorties négatif ; `physical_surplus_bottles` compte les bouteilles physiquement présentes au-delà de `max(0, movement_balance)`. Ces diagnostics sont distincts et peuvent coexister pour une même référence. Un stock non localisé ne prouve pas qu'une bouteille a été retirée sans déclarer sa sortie : elle peut ne jamais avoir été rangée ou être conservée hors de la cave. Les valeurs brutes `Wine.bo` restent informatives et ne déterminent pas le stock effectif. Aucune correction n'est envoyée à PLOUD. Les filtres ne modifient pas les totaux globaux. Chaque emplacement associé à un vin contient le nom et l'identifiant du casier, ainsi que la rangée et la colonne lorsqu'elles sont disponibles.

## 📡 Événement de synchronisation

Après validation et enregistrement réussi d'une synchronisation, lorsque le nouvel inventaire devient l'inventaire actif, l'intégration déclenche l'événement Home Assistant `ploc_cellar_sync_completed`. Aucun événement n'est émis lorsqu'une synchronisation échoue.

Les données de l'événement sont les suivantes :

| Champ | Signification |
|---|---|
| `config_entry_id` | Identifiant de l'entrée de configuration Ploc Cellar dont l'inventaire a été mis à jour. |
| `last_sync` | Date et heure de la dernière synchronisation réussie. |

Les cartes frontend s'abonnent à cet événement et ne s'actualisent que si son `config_entry_id` correspond à l'entrée sélectionnée dans l'éditeur de la carte. Les mises à jour restent ainsi propres à chaque cave, sans dépendre d'un identifiant d'entité ni d'un polling.

## 🔐 Stockage et confidentialité

Les fichiers image restent dans le cache privé de l'entrée de configuration et ne sont accessibles qu'aux utilisateurs authentifiés de Home Assistant. Ce cache est indépendant de l'inventaire persistant et n'entraîne aucune écriture vers PLOUD.

Le jeton d'accès PLOUD et l'identifiant UUID de l'appareil sont conservés séparément dans chaque entrée de configuration Home Assistant. Le mot de passe et le jeton de session PLOC ne sont pas stockés.

L'inventaire local et son curseur de synchronisation associé sont enregistrés avec le `Store` persistant de Home Assistant. Les changements reçus sont appliqués à une copie du modèle puis enregistrés avant de remplacer le modèle en mémoire : un échec d'écriture ne fait donc pas avancer le curseur actif.

L'intégration envoie uniquement les paramètres nécessaires à la synchronisation et un objet `Objects` vide. Elle ne transmet aucun objet de cave et n'effectue aucune modification de la cave. La collection `Owners` est traitée uniquement en mémoire pour renseigner `Wine.domain`. Les mouvements `Orders` sont conservés localement afin de calculer les diagnostics d'inventaire. Les commandes dont la référence Wine n'existe plus sont conservées comme historique et comptées dans `orders_without_wine`, mais ne contribuent au stock d'aucun vin connu. Si un propriétaire référencé par un nouveau vin manque dans le delta, le coordinateur effectue une seule synchronisation complète pour résoudre son nom.

## 🧪 Validation

La CI vérifie le code avec Ruff et Hassfest, puis exécute Pyright en mode strict et la suite pytest avec la version minimale déclarée de Home Assistant (2026.10.4) ainsi que la dernière version stable. La validation HACS de l'intégration est exécutée séparément.

Ces contrôles statiques ne remplacent pas les essais de bout en bout avec une instance Home Assistant réelle et la cave PLOUD.


## 🖥️ Cartes Lovelace

Les cartes Lovelace facultatives sont désormais maintenues et publiées
indépendamment dans le dépôt
[Ploc Cellar Cards](https://github.com/MadMatt34/ha-ploc-cellar-frontend).
Ce dépôt contient la documentation des cartes, les instructions d'installation
du plugin Dashboard HACS et le workflow de développement frontend.


## 🛠️ Dépannage

- **Impossible d'ajouter l'intégration ou de se réauthentifier :** vérifier l'adresse e-mail et le mot de passe du compte PLOC, puis relancer le parcours d'authentification.
- **L'authentification réussit, mais aucune donnée de cave n'apparaît :** vérifier que PLOUD est activé pour l'application Home Assistant et que Home Assistant peut joindre les services PLOC/PLOUD.
- **Les capteurs liés au stock affichent `unknown` :** les valeurs calculées à partir des mouvements restent indisponibles tant qu'un instantané complet de `Orders` n'a pas été validé. Les compteurs physiques de casiers et de bouteilles peuvent rester disponibles.
- **La dernière synchronisation est signalée comme obsolète :** la synchronisation la plus récente a échoué ; le dernier inventaire validé est conservé. Consulter **Paramètres → Système → Journaux**, puis relancer une synchronisation depuis l'appareil Ploc Cellar.
- **Les cartes ne s'actualisent pas après une synchronisation :** vérifier que la version du frontend est à jour et que la carte utilise la bonne entrée de configuration Ploc Cellar.

Pour ouvrir un ticket, joindre la version de Home Assistant, la version de l'intégration, les messages de journal pertinents et les étapes permettant de reproduire le problème. Ne jamais publier de mot de passe, de jeton d'accès ou d'autres identifiants.

## 🗑️ Désinstallation

1. Ouvrir **Paramètres → Appareils et services → Ploc Cellar**.
2. Ouvrir le menu de l'intégration/de l'appareil et supprimer l'entrée de configuration Ploc Cellar.
3. Si l'intégration a été installée avec HACS, désinstaller **Ploc Cellar** depuis HACS.
4. En cas d'installation manuelle, supprimer le dossier `custom_components/ploc_cellar` du répertoire de configuration Home Assistant.
5. Redémarrer Home Assistant.

La suppression de l'entrée de configuration efface également les fichiers privés d'images mis en cache pour cette entrée.

## ⚖️ Licence et avertissement

Ce projet est distribué sous [licence MIT](LICENSE).

Ploc Cellar est un projet indépendant et non officiel. Il n'est ni affilié à PLOC ou PLOUD, ni approuvé ou pris en charge par ces services.
