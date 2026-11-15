# Ploc Cellar

Intégration personnalisée Home Assistant permettant de consulter une cave PLOC en **lecture seule**, synchronisée par PLOUD.

[English version](README.md)

[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2026.10.4%2B-blue)](https://www.home-assistant.io/)
[![HACS](https://img.shields.io/badge/HACS-Dépôt%20personnalisé-blue)](https://www.hacs.xyz/docs/faq/custom_repositories/)
[![Validation](https://github.com/MadMatt34/ha-ploc-cellar/actions/workflows/validate.yaml/badge.svg)](https://github.com/MadMatt34/ha-ploc-cellar/actions/workflows/validate.yaml)
[![Licence : MIT](https://img.shields.io/badge/Licence-MIT-green.svg)](LICENSE)

![Ploc Cellar](https://raw.githubusercontent.com/MadMatt34/ha-ploc-cellar/main/custom_components/ploc_cellar/brand/logo.png)

## Documentation

- [Index de la documentation technique](docs/README.md)
- [Compatibilité backend/frontend et politique de publication](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/COMPATIBILITY_AND_RELEASES.md)

## Prérequis

- Home Assistant 2026.10.4 ou version ultérieure.

## Fonctionnalités

- Consultation en lecture seule : PLOUD reste la source de vérité et l'intégration ne modifie jamais les données de la cave.
- Synchronisation incrémentale automatique, avec possibilité de lancer une synchronisation différentielle ou complète depuis l'appareil de l'intégration.
- Inventaire, occupation des casiers et diagnostics de cohérence du stock.
- Caractéristiques des vins, accords mets-vins et photos mises en cache localement lorsqu'elles sont disponibles.
- Accès à l'inventaire détaillé à la demande avec l'action ploc_cellar.get_inventory.
- Plusieurs entrées de configuration indépendantes, chacune avec son compte, son inventaire et son cache.

Le stock est reconstitué à partir des mouvements et des emplacements physiques. Les diagnostics distinguent le stock non affecté à un casier, les soldes de mouvements négatifs et les excédents physiques. Les définitions précises figurent dans la [documentation des algorithmes d'inventaire](docs/ALGORITHMES.md).

## Installation

### Avec HACS (recommandé)

1. Dans HACS, ouvrir **Dépôts personnalisés**.
2. Ajouter **MadMatt34/ha-ploc-cellar** et sélectionner la catégorie **Intégration**.
3. Installer **Ploc Cellar**.
4. Redémarrer Home Assistant.
5. Ouvrir **Paramètres → Appareils et services → Ajouter une intégration** et sélectionner **Ploc Cellar**.

### Installation manuelle

1. Copier le dossier custom_components/ploc_cellar dans `<config>/custom_components/`.
2. Redémarrer Home Assistant.
3. Ajouter **Ploc Cellar** depuis **Paramètres → Appareils et services → Ajouter une intégration**.

### Première configuration et comptes

Saisir l'adresse e-mail et le mot de passe du compte PLOC lorsque l'assistant le demande. Aucun jeton technique, identifiant d'appareil ou URL de serveur n'est nécessaire. L'intégration active automatiquement PLOUD et lance la synchronisation initiale.

Il est possible d'ajouter d'autres comptes en configurant une nouvelle entrée Ploc Cellar. Chaque entrée reste indépendante. Si Home Assistant demande une réauthentification, saisir à nouveau l'adresse e-mail et le mot de passe du compte.

## Configuration

Ouvrir **Paramètres → Appareils et services → Ploc Cellar → Configurer**.

- **Intervalle de synchronisation :** de 5 à 1 440 minutes ; 240 minutes par défaut.
- **Langue des réponses PLOUD :** Automatique, Français ou Anglais. Le mode automatique sélectionne le français dans les pays francophones et l'anglais ailleurs. Si aucun pays n'est configuré, la langue générale de Home Assistant sert de solution de repli.

L'adresse du serveur PLOUD est fixe et ne peut pas être modifiée dans les options.

## Entités et commandes

Chaque compte configuré crée un appareil **Ploc Cellar** regroupant des capteurs d'inventaire, de casiers et de diagnostic, ainsi que deux boutons de synchronisation. Aucune entité distincte n'est créée pour chaque vin, casier ou emplacement.

Les capteurs indiquent l'occupation physique, le stock reconstitué, le nombre de références de vins, la capacité des casiers, les quantités de diagnostic et la date de la dernière synchronisation réussie. Les valeurs calculées à partir des mouvements restent indisponibles tant qu'un historique complet n'a pas été validé. En cas d'échec d'une synchronisation ultérieure, le dernier inventaire valide est conservé et le capteur de dernière synchronisation indique qu'il est obsolète.

Les boutons de l'appareil permettent de lancer une synchronisation différentielle ou une actualisation complète. Ils peuvent également être utilisés avec l'action Home Assistant standard button.press.

## Action d'inventaire

L'action de réponse ploc_cellar.get_inventory renvoie les données détaillées d'une cave pour une entrée de configuration sélectionnée. Elle exige config_entry_id et accepte les filtres facultatifs search et color. Dans un script ou une automatisation, récupérer la réponse avec response_variable.

La réponse comprend les totaux de la cave, les casiers, les emplacements physiques, les vins correspondants, les diagnostics de stock et la date de dernière synchronisation réussie. Le [contrat du service d'inventaire](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/CONTRAT_BACKEND.fr.md) décrit précisément sa structure et les champs facultatifs.

## Dépannage

- **Échec de l'authentification :** vérifier les identifiants du compte PLOC et l'accès réseau de Home Assistant aux services PLOC/PLOUD.
- **Valeurs de stock inconnues :** elles restent indisponibles tant qu'un instantané complet des mouvements PLOUD n'a pas été validé. Les comptes physiques des casiers et des bouteilles peuvent rester disponibles.
- **Dernière synchronisation obsolète :** une synchronisation ultérieure a échoué ; le dernier inventaire validé est conservé. Consulter **Paramètres → Système → Journaux**, puis relancer une synchronisation depuis l'appareil Ploc Cellar.
- **Les cartes frontend ne s'actualisent pas :** vérifier que le frontend est installé, compatible et configuré pour la même entrée d'intégration.

Pour signaler un problème, indiquer la version de Home Assistant, celle de l'intégration, les messages de journal pertinents et les étapes de reproduction. Ne jamais publier de mot de passe ou jeton d'accès. Les journaux de débogage peuvent contenir des enregistrements bruts de la cave : les anonymiser avant tout partage.

## Désinstallation

1. Ouvrir **Paramètres → Appareils et services → Ploc Cellar** et supprimer l'entrée de configuration.
2. Désinstaller **Ploc Cellar** depuis HACS ou supprimer le dossier custom_components/ploc_cellar en cas d'installation manuelle.
3. Redémarrer Home Assistant.

La suppression d'une entrée efface également son instantané d'inventaire local et son cache privé d'images de vins.

## Licence et avertissement

Ce projet est distribué sous [licence MIT](LICENSE).

Ploc Cellar est un projet indépendant et non officiel. Il n'est ni affilié à PLOC ou PLOUD, ni approuvé ou pris en charge par ces services. Le backend s'appuie sur des interfaces PLOUD privées et non documentées, reconstituées par un travail de recherche technique indépendant ; elles ne constituent pas une spécification officielle d'API et peuvent évoluer sans préavis.
