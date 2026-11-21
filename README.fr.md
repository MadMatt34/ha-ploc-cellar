# Ploc Cellar

Intégration personnalisée Home Assistant permettant de consulter une cave PLOC en **lecture seule**, synchronisée par PLOUD.

[English version](README.md)

[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2026.10.4%2B-blue)](https://www.home-assistant.io/)
[![HACS](https://img.shields.io/badge/HACS-Dépôt%20personnalisé-blue)](https://www.hacs.xyz/docs/faq/custom_repositories/)
[![Validation](https://github.com/MadMatt34/ha-ploc-cellar/actions/workflows/validate.yaml/badge.svg)](https://github.com/MadMatt34/ha-ploc-cellar/actions/workflows/validate.yaml)
[![Licence : MIT](https://img.shields.io/badge/Licence-MIT-green.svg)](LICENSE)

![Ploc Cellar](https://raw.githubusercontent.com/MadMatt34/ha-ploc-cellar/main/custom_components/ploc_cellar/brand/logo.png)

## Documentation

- [Index de la documentation technique](docs/README.fr.md) / [English](docs/README.md)
- [Algorithmes d'inventaire](docs/ALGORITHMS.fr.md) / [English](docs/ALGORITHMS.md)
- [Correspondance des champs PLOUD](docs/PLOUD_FIELD_MAPPING.fr.md) / [English](docs/PLOUD_FIELD_MAPPING.md)
- [Stratégie de tests](docs/TESTS.fr.md) / [English](docs/TESTS.md)
- [Compatibilité backend/frontend et politique de publication](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/COMPATIBILITY_AND_RELEASES.fr.md)

## Prérequis

- Home Assistant 2026.10.4 ou version ultérieure.
- Python 3.14.2 ou version ultérieure, conformément aux prérequis de Home Assistant 2026.10.4.

## Fonctionnalités

- PLOUD reste la source de vérité ; l'intégration fonctionne en lecture seule et n'envoie aucune modification de cave.
- Synchronisation incrémentale via `POST https://ploud.ploc.co/v1/sync/exec`, avec `Objects={}`. Le premier chargement utilise la valeur validée `LastSyncTime=1` ; les suivants utilisent le curseur client en millisecondes Unix.
- Modèle local persistant : références de vins, casiers, emplacements physiques, mouvements et collections de référence indexées. Les caractéristiques, dont le domaine viticole, sont enregistrées dans chaque fiche vin. La valeur brute `Wine.bo` est conservée à titre informatif.
- Stock effectif reconstitué à partir des mouvements `Orders` et des bouteilles physiquement placées (`RackItems`) selon `max(0, solde des mouvements, bouteilles en cave)`. Les diagnostics distinguent stock non localisé, solde de mouvements négatif et excédent physique. Un stock non localisé ne prouve pas qu'une bouteille a été retirée sans mouvement de sortie déclaré.
- Quatorze capteurs d'inventaire, de casiers et de diagnostic ; aucune entité n'est créée pour chaque vin, casier ou emplacement.
- Inventaire détaillé accessible à la demande avec l'action `ploc_cellar.get_inventory`.
- Photos téléchargées depuis les `Documents` PLOUD référencés, mises en cache localement et servies via une route Home Assistant authentifiée. Les documents modifiés invalident le cache ; les documents supprimés ou non référencés sont nettoyés.
- Deux boutons sur l'appareil Ploc Cellar permettent la synchronisation différentielle ou complète.
- UUID normalisés sous leur forme canonique minuscule ; les identifiants opaques sont débarrassés des espaces périphériques sans changement de casse.
- Plusieurs entrées de configuration indépendantes, chacune avec son compte, appareil, coordinateur, inventaire persistant et cache d'images.
- Aucune opération d'écriture n'est envoyée à PLOUD.

## Installation

### Avec HACS (recommandé)

1. Dans HACS, ouvrir **Dépôts personnalisés**.
2. Ajouter `MadMatt34/ha-ploc-cellar` et sélectionner la catégorie **Intégration**.
3. Installer **Ploc Cellar**.
4. Redémarrer Home Assistant, puis ouvrir **Paramètres → Appareils et services → Ajouter une intégration** et sélectionner **Ploc Cellar**.

Le dépôt est une intégration HACS personnalisée et ne fait pas partie du catalogue HACS par défaut.

### Installation manuelle

1. Copier `custom_components/ploc_cellar` dans `<config>/custom_components/`.
2. Redémarrer Home Assistant.
3. Ajouter **Ploc Cellar** depuis **Paramètres → Appareils et services → Ajouter une intégration**.

### Première configuration et comptes

Saisir l'adresse e-mail et le mot de passe du compte PLOC. Aucun jeton technique, identifiant d'appareil ou URL de serveur n'est nécessaire. Home Assistant authentifie le compte PLOC, active PLOUD pour l'application Home Assistant, conserve le jeton d'accès et un UUID d'appareil propre à l'entrée, puis lance la synchronisation initiale en lecture seule. L'UUID complet reste local ; les requêtes utilisent ses cinq premiers caractères comme identifiant PLOUD `Device`.

L'adresse e-mail, le mot de passe et le jeton de session PLOC ne sont pas conservés dans l'entrée. Le mot de passe sert uniquement à la configuration ou à la réauthentification. Ajouter d'autres comptes comme entrées distinctes ; elles restent isolées. Lors d'une réauthentification, saisir à nouveau les identifiants ; l'identifiant d'appareil est conservé.

## Configuration

Ouvrir **Paramètres → Appareils et services → Ploc Cellar → Configurer**.

- **Intervalle de synchronisation :** de 5 à 1 440 minutes ; 240 minutes par défaut.
- **Langue des réponses PLOUD :** Automatique, Français ou English. Le mode automatique choisit le français dans les pays francophones et l'anglais ailleurs ; si aucun pays n'est configuré, la langue générale de Home Assistant sert de repli. Le choix manuel reste prioritaire jusqu'au retour au mode Automatique.

L'adresse du serveur PLOUD est fixe et ne peut pas être modifiée dans les options.

## Entités et commandes

Chaque entrée crée un appareil **Ploc Cellar** distinct avec 14 capteurs et deux boutons de synchronisation. Les capteurs couvrent les bouteilles physiquement en cave, le stock reconstitué, les références en stock et physiquement présentes, le nombre/la capacité/la disponibilité des casiers, les diagnostics de stock et la dernière synchronisation réussie. Les valeurs dépendant des mouvements restent `unknown` tant qu'un instantané complet de `Orders` n'a pas été validé ; les compteurs physiques restent disponibles.

Le capteur de dernière synchronisation conserve son horodatage après un échec ultérieur et passe son attribut `stale` à true ; une synchronisation réussie le remet à false. Home Assistant génère les identifiants d'entités selon le format de nom configuré. Les identifiants existants sont conservés ; **Recréer les identifiants d'entité** dans le menu de l'appareil permet de les régénérer selon le format actuel.

Le bouton différentiel applique les changements depuis le curseur enregistré. Le bouton de synchronisation complète demande un instantané complet et reconstruit l'inventaire local ; l'inventaire validé reste disponible tant que le nouvel instantané n'est pas validé et enregistré. Les deux boutons peuvent être utilisés avec l'action standard `button.press`.

## Action d'inventaire

L'action avec réponse `ploc_cellar.get_inventory` exige `config_entry_id` et accepte les filtres facultatifs `search` et `color`. La recherche couvre le nom du vin, le domaine, l'appellation, la région, le pays, les cépages, la cuvée et le commentaire. Utiliser `response_variable` dans un script ou une automatisation.

La réponse comprend les totaux et diagnostics globaux, les casiers et emplacements, les vins correspondants, `wine_diagnostics`, `stock_reconstruction_complete`, `stale` et `last_sync`. Le [contrat backend](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/BACKEND_CONTRACT.fr.md) du dépôt frontend décrit les champs et leur nullabilité. Les filtres ne modifient pas les totaux globaux.

## Synchronisation et notifications frontend

Après validation, enregistrement et activation du nouvel inventaire, l'intégration émet `ploc_cellar_sync_completed` pour les automatisations administrateur. L'événement contient l'identifiant de l'entrée, la date de dernière synchronisation, le déclencheur, le type réel de synchronisation, les identifiants des objets modifiés et les compteurs. Aucun événement n'est émis en cas d'échec.

Les cartes frontend s'actualisent via la notification WebSocket propre à l'entrée `ploc_cellar/subscribe_sync`, plutôt que via l'événement réservé aux administrateurs. La notification est vide et indique uniquement que l'inventaire est prêt ; la carte relit ensuite les données avec `ploc_cellar.get_inventory`. Le backend vérifie que l'entrée est chargée et nettoie les abonnements lors du désabonnement ou de la déconnexion WebSocket. Aucun polling ni identifiant d'entité n'est nécessaire.

## Stockage et confidentialité

L'inventaire et le curseur de synchronisation sont conservés transactionnellement via le `Store` Home Assistant. Les changements sont appliqués à un modèle candidat et enregistrés avant le remplacement du modèle actif : un échec de sauvegarde ne fait pas avancer le curseur en mémoire. Les collections de référence sont persistées pour résoudre les deltas ; les enregistrements Owner bruts sont temporaires et seuls les noms de domaine résolus sont stockés dans Wine. Les mouvements Orders sont conservés pour les diagnostics, y compris ceux liés à des vins inconnus ou supprimés.

Les images restent dans le cache privé de l'entrée et ne sont servies qu'aux utilisateurs Home Assistant authentifiés. Le jeton PLOUD et l'UUID d'appareil sont stockés par entrée ; les mots de passe et jetons de session PLOC ne sont pas conservés. Les journaux de débogage peuvent contenir des données brutes de cave : les anonymiser avant partage.

## Validation

La CI exécute Ruff, Hassfest, Pyright strict, les tests et la validation HACS. Les tests utilisent des doubles HTTP déterministes et ne contactent aucun compte réel PLOC/PLOUD. La CI teste la version minimale déclarée de Home Assistant (2026.10.4) et la dernière version stable. Une CI réussie ne remplace pas un test d'installation réel et ne valide pas la disponibilité actuelle des services PLOUD privés.

## Cartes Lovelace

Le dépôt séparé [Ploc Cellar frontend](https://github.com/MadMatt34/ha-ploc-cellar-frontend) fournit les cartes Vue d'ensemble, Inventaire et Casier. Le backend expose une route d'images authentifiée et l'action d'inventaire ; les cartes s'actualisent via le signal WebSocket propre à l'entrée. Consulter le README frontend et la [politique de compatibilité](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/COMPATIBILITY_AND_RELEASES.fr.md) pour les versions prises en charge.

## Dépannage

- **Échec de l'authentification :** vérifier les identifiants PLOC et la connectivité Home Assistant vers PLOC/PLOUD.
- **Capteurs de stock en `unknown` :** les valeurs liées aux mouvements restent indisponibles tant qu'un instantané complet de `Orders` n'a pas été validé ; les compteurs physiques peuvent rester disponibles.
- **Dernière synchronisation obsolète :** une synchronisation ultérieure a échoué ; le dernier inventaire validé est conservé. Consulter les journaux Home Assistant et relancer une synchronisation depuis l'appareil Ploc Cellar.
- **Les cartes frontend ne s'actualisent pas :** mettre le frontend à jour et vérifier que la carte utilise la même entrée de configuration Ploc Cellar.

Pour signaler un problème, indiquer les versions de Home Assistant et de l'intégration, les journaux pertinents et les étapes de reproduction. Ne jamais publier de mot de passe ni de jeton d'accès. Les journaux de débogage peuvent contenir des données brutes de cave : les anonymiser avant partage.

## Désinstallation

1. Supprimer l'entrée Ploc Cellar depuis **Paramètres → Appareils et services**.
2. Désinstaller l'intégration via HACS ou supprimer `custom_components/ploc_cellar` en cas d'installation manuelle.
3. Redémarrer Home Assistant.

La suppression de l'entrée efface également son instantané d'inventaire et son cache privé de photos de vins.

## Licence et avertissement

Projet distribué sous [licence MIT](LICENSE).

Ploc Cellar est un projet indépendant et non officiel, sans affiliation, approbation ni soutien de PLOC ou PLOUD. Il s'appuie sur des interfaces PLOUD privées et non documentées, découvertes par recherche technique indépendante ; elles ne constituent pas une spécification officielle d'API et peuvent évoluer sans préavis.
