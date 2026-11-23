# Ploc Cellar - Intégration pour Home Assistant

![HA Monitoring for Home Assistant](docs/banner.png)

[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-Custom%20Integration-blue.svg)](https://www.home-assistant.io/)
[![Marketplace](https://img.shields.io/badge/Marketplace-Default-blue)](https://github.com/hacs/default)
[![Licence : MIT](https://img.shields.io/badge/Licence-MIT-green.svg)](LICENSE)\
[![Latest Release](https://img.shields.io/github/v/release/MadMatt34/ha-ploc-cellar?color=green)](https://github.com/MadMatt34/ha-ploc-cellar/releases)
[![Validation](https://github.com/MadMatt34/ha-ploc-cellar/actions/workflows/validate.yaml/badge.svg)](https://github.com/MadMatt34/ha-ploc-cellar/actions/workflows/validate.yaml)
![Installs](https://img.shields.io/badge/dynamic/json?label=Installations&color=41BDF5&cacheSeconds=15600&url=https%3A%2F%2Fanalytics.home-assistant.io%2Fcustom_integrations.json&query=%24.ha_ploc_cellar.total)

[❗ README in ENGLISH 🇬🇧 ❗](README.md)

Intégration personnalisée Home Assistant permettant de consulter une cave [PLOC](https://www.ploc.co/) en **lecture seule**, synchronisée par [PLOUD](https://www.ploc.co/sauvegarder-et-synchroniser).\
🍷❤️

> [!IMPORTANT]
> L'affichage dans le tableau de bord Home Assistant (Frontend Lovelace) est disponible dans un dépôt séparé [Ploc Cellar frontend](https://github.com/MadMatt34/ha-ploc-cellar-frontend).

---

## ⚡ Fonctionnalités principales

- [PLOUD](https://www.ploc.co/sauvegarder-et-synchroniser) reste le référentiel ; l'**intégration fonctionne en lecture seule** et n'envoie aucune modification de cave. Toute opération de création et de gestion de cave est à réaliser depuis l'application [PLOC](https://www.ploc.co/).

- **Plusieurs comptes** [PLOC](https://www.ploc.co/)/[PLOUD](https://www.ploc.co/sauvegarder-et-synchroniser) sont acceptés et sont indépendants les uns des autres.

- A la suite du premier import complet, les **synchronisations sont incrémentales**.

- **Quatorze capteurs** d'inventaire, de casiers et de diagnostic.

- **Deux boutons** sur l'appareil Ploc Cellar permettent la synchronisation différentielle ou complète à la demande.

- **Inventaire détaillé** accessible à la demande avec l'action `ploc_cellar.get_inventory`.

- Le stock effectif est reconstitué à partir des mouvements et des bouteilles physiquement placées. Les **diagnostics** distinguent stock non localisé, solde de mouvements négatif et excédent physique. Un stock non localisé ne prouve pas qu'une bouteille a été retirée sans mouvement de sortie déclaré ; à contrôler dans l'application [PLOC](https://www.ploc.co/).

- Les données sont stockées dans un **modèle local persistant**.

- **Photos** téléchargées depuis les fiches [PLOUD](https://www.ploc.co/sauvegarder-et-synchroniser) référencées, mises en cache localement et servies via une route Home Assistant authentifiée. Les fiches modifiées invalident le cache ; les fiches supprimées ou non référencées entrainent un nettoyage des images associées.

---

## 📋 Prérequis

- [x] Home Assistant 2026.10.4 ou version ultérieure.
- [x] Python 3.14.2 ou version ultérieure, conformément aux prérequis de Home Assistant 2026.10.4.
- [x] Compte créé dans [PLOC](https://www.ploc.co/)
- [x] Cave créée et gérée depuis l'application [PLOC](https://www.ploc.co/)
- [x] Cave synchronisée avec [PLOUD](https://www.ploc.co/sauvegarder-et-synchroniser)

---

## 🧩 Installation

### Option 1 : Installation via Marketplace (📌 recommandée)

1. Ouvrir l'intégration **Ploc Cellar** dans **Marketplace** dans Home Assistant\
    [![Open your Home Assistant instance and open a repository in the Marketplace.](https://my.home-assistant.io/badges/marketplace_repository.svg)](https://my.home-assistant.io/redirect/marketplace_repository/?owner=MadMatt34&repository=ha-ploc-cellar)
2. Cliquer sur **Installer**, puis suivre les étapes de la première configuration de l'intégration.

### Option 2 : Installation manuelle

1. Télécharger la dernière **Release** de ce dépôt.
2. Copier le dossier `ploc_cellar` dans `/config/custom_components/`.
3. Redémarrer Home Assistant pour faire détecter la nouvelle intégration.
4. Après le redémarrage, aller dans **Paramètres** → **Appareils et services**.\
   [![Open your Home Assistant instance and show your integrations.](https://my.home-assistant.io/badges/integrations.svg)](https://my.home-assistant.io/redirect/integrations/)
5. Cliquer sur **Ajouter une intégration** (en bas à droite).
6. Rechercher **Ploc Cellar** et le sélectionner, puis suivre les étapes de la première configuration de l'intégration.

---

## 🚀 Première configuration et comptes

L'installation se fait 100 % via l'interface graphique de Home Assistant.

1. Saisir l'adresse e-mail et le mot de passe du compte [PLOC](https://www.ploc.co/).\
Home Assistant authentifie le compte [PLOC](https://www.ploc.co/), identifie Home Assistant dans [PLOUD](https://www.ploc.co/sauvegarder-et-synchroniser), puis lance la synchronisation initiale en lecture seule.

> [!NOTE]
> L'adresse e-mail, le mot de passe et le jeton de session ne sont pas conservés dans l'entrée. Le mot de passe sert uniquement à la configuration ou à la réauthentification.\
> Lors d'une réauthentification, saisir à nouveau les identifiants ; l'identifiant d'appareil est conservé.

> [!NOTE]
> D'autres comptes peuvent être ajoutés comme entrées distinctes ; elles restent isolées les unes des autres.

---

## 🛡️ Stockage et confidentialité

Les images restent dans le cache privé de l'entrée et ne sont servies qu'aux utilisateurs Home Assistant authentifiés. Le jeton [PLOUD](https://www.ploc.co/sauvegarder-et-synchroniser) et l'UUID d'appareil sont stockés par entrée ; les mots de passe et jetons de session [PLOC](https://www.ploc.co/) ne sont pas conservés. Les journaux de débogage peuvent contenir des données brutes de cave : les anonymiser avant partage.

---

## ⚙️ Modification des paramètres

Vous pouvez modifier les paramètres à tout moment :

1. Aller dans **Paramètres** → **Appareils et services** → **Ploc Cellar**.\
   [![Open your Home Assistant instance and show an integration.](https://my.home-assistant.io/badges/integration.svg)](https://my.home-assistant.io/redirect/integration/?domain=ploc_cellar)
2. Cliquer sur le bouton **CONFIGURER** *(roue crantée)*.
3. Régler les paramètres souhaités :
    - **Intervalle de synchronisation :** de 5 à 1 440 minutes ; 240 minutes par défaut.
    - **Langue des réponses PLOUD :** Automatique, Français ou English. Le mode automatique choisit le français dans les pays francophones et l'anglais ailleurs ; si aucun pays n'est configuré, la langue générale de Home Assistant sert de repli. Le choix manuel reste prioritaire jusqu'au retour au mode Automatique.

---





## 📦 Événements et Entités fournis

Chaque entrée crée un appareil **Ploc Cellar** distinct avec 14 capteurs et deux boutons de synchronisation. Les capteurs couvrent les bouteilles physiquement en cave, le stock reconstitué, les références en stock et physiquement présentes, le nombre/la capacité/la disponibilité des casiers, les diagnostics de stock et la dernière synchronisation réussie.

Le capteur de dernière synchronisation conserve son horodatage après un échec ultérieur et passe son attribut `stale` à true ; une synchronisation réussie le remet à false.

Le bouton différentiel applique les changements depuis le curseur enregistré. Le bouton de synchronisation complète demande un instantané complet et reconstruit l'inventaire local ; l'inventaire validé reste disponible tant que le nouvel instantané n'est pas validé et enregistré. Les deux boutons peuvent être utilisés dans un script ou une automatisation avec l'action standard `button.press`.

## Action d'inventaire

L'action avec réponse `ploc_cellar.get_inventory` exige `config_entry_id` et accepte les filtres facultatifs `search` et `color`. La recherche couvre le nom du vin, le domaine, l'appellation, la région, le pays, les cépages, la cuvée et le commentaire. Utiliser `response_variable` dans un script ou une automatisation.

La réponse comprend les totaux et diagnostics globaux, les casiers et emplacements, les vins correspondants, `wine_diagnostics`, `stock_reconstruction_complete`, `stale` et `last_sync`. Le [contrat backend](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/BACKEND_CONTRACT.fr.md) du dépôt frontend décrit les champs et leur nullabilité. Les filtres ne modifient pas les totaux globaux.

## Synchronisation et notifications frontend

Après validation, enregistrement et activation du nouvel inventaire, l'intégration émet `ploc_cellar_sync_completed` pour les automatisations administrateur. L'événement contient l'identifiant de l'entrée, la date de dernière synchronisation, le déclencheur, le type réel de synchronisation, les identifiants des objets modifiés et les compteurs. Aucun événement n'est émis en cas d'échec.



---

## 🖥️ Cartes du tableau de bord

L'affichage dans le tableau de bord Home Assistant (Frontend Lovelace) est disponible dans un dépôt séparé [Ploc Cellar frontend](https://github.com/MadMatt34/ha-ploc-cellar-frontend).\
Il fournit les cartes Vue d'ensemble, Inventaire et Casier.

---

## 🏆 Qualité de l'intégration

La CI vérifie systématiquement, à chaque modification, le typage strict, la qualité du code et l'ensemble des tests techniques et fonctionnels. La version minimale déclarée de Home Assistant (2026.10.4) et la dernière version stable sont testées.\
Une CI réussie ne remplace pas un test d'installation réel et ne valide pas la disponibilité actuelle des services [PLOUD](https://www.ploc.co/sauvegarder-et-synchroniser).

---

## ⚠️ Limitations et problèmes connus

//TODO
- pas d'API officielle
- grosses caves = charge mémoire plus élevée

---

## 🛠️ Dépannage

- **Échec de l'authentification :** vérifier les identifiants [PLOC](https://www.ploc.co/) et la connectivité Home Assistant vers [PLOC](https://www.ploc.co/)/[PLOUD](https://www.ploc.co/sauvegarder-et-synchroniser).

- **Capteurs de stock en `unknown` :** les valeurs liées aux mouvements restent indisponibles tant qu'une synchronisation complète n'a pas été validée ; les compteurs physiques peuvent rester disponibles.

- **Dernière synchronisation obsolète :** une synchronisation ultérieure a échoué ; le dernier inventaire validé est conservé. Consulter les journaux Home Assistant et relancer une synchronisation depuis l'appareil Ploc Cellar.\
[![Open your Home Assistant instance and show your Home Assistant logs.](https://my.home-assistant.io/badges/logs.svg)](https://my.home-assistant.io/redirect/logs/)

- **Les cartes frontend ne s'actualisent pas :** mettre le frontend à jour et vérifier que la carte utilise la même entrée de configuration Ploc Cellar.

[Ouvrir un suivi sur GitHub](https://github.com/MadMatt34/ha-ploc-cellar-frontend/issues/new) :\
Pour demander des fonctionnalités, indiquez le maximum de précisions.\
Pour signaler un problème, indiquer la version de Home Assistant et de l'intégration, les journaux pertinents et les étapes de reproduction. Ne jamais publier de mot de passe ni de jeton d'accès. Les journaux de débogage peuvent contenir des données brutes de cave : les anonymiser avant partage.

---

## 🗑️ Supprimer l'intégration

Pour supprimer l'intégration de Home Assistant

1. Aller dans **Paramètres → Appareils et services** et choisir la carte de l'intégration **Ploc Cellar**.\
   [![Open your Home Assistant instance and show an integration.](https://my.home-assistant.io/badges/integration.svg)](https://my.home-assistant.io/redirect/integration/?domain=ploc_cellar)
2. Dans la liste des appareils, pointer l'instance à supprimer.
3. A côté de cette entrée, sélectionner le menu ⋮ avec trois points. Puis, choisir **Supprimer**.

---

## 🌐 Langues prises en charge

🇬🇧 English • 🇫🇷 Français

---

## ❤️ Soutenir ce projet

Vous trouvez cette intégration utile ? Ajoutez une ⭐ au projet sur GitHub !

---

## 🚀 Evolutions et versions futures

- Prendre en compte les différents formats de casiers possibles, autre que grille.
- Etablir des statistiques par casier.
- Consommation de bouteille depuis Home Assistant (sortie de stock).
- Données de diagnostics anonymisées.
- Autres ? A vous de proposer...

---

## 📚 Documentation complémentaire

- [Index de la documentation technique](docs/README.fr.md)
- [Algorithmes d'inventaire](docs/ALGORITHMS.fr.md)
- [Correspondance des champs PLOUD](docs/PLOUD_FIELD_MAPPING.fr.md)
- [Stratégie de tests](docs/TESTS.fr.md)
- [Compatibilité backend/frontend et politique de publication](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/COMPATIBILITY_AND_RELEASES.fr.md)

---

## ⚖️ Licence

Ce projet est sous **Licence MIT** ; voir le fichier [LICENSE](LICENSE) pour les details.

---

## ⚠️ Avertissement

*Ploc Cellar Cards est un frontend indépendant pour Home Assistant. Il n'est ni affilié à [PLOC](https://www.ploc.co) ou [PLOUD](https://www.ploc.co/sauvegarder-et-synchroniser), ni approuvé ou pris en charge par ces services.*

*L'intégration backend repose sur des interfaces PLOUD non documentées, dont le fonctionnement a été reconstitué par un travail de recherche technique indépendant. Il ne s'agit pas d'une API publique ou officiellement prise en charge, et ces interfaces peuvent évoluer ou devenir incompatibles à tout moment, sans préavis. PLOC a été contacté au sujet de ce travail et de l'existence éventuelle d'une interface officielle, mais aucune réponse n'avait été reçue au moment de la rédaction.*

*Les cartes frontend communiquent uniquement avec l'intégration backend Home Assistant et ne contactent jamais directement PLOUD.*
