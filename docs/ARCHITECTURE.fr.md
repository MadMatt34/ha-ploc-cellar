# Architecture backend et cycle de vie

Ce document décrit les frontières internes et le cycle de vie de l'intégration. Les instructions destinées aux utilisateurs figurent dans le [README](../README.md) et le [README français](../README.fr.md).

## Responsabilités des composants

L'intégration est un client Home Assistant en lecture seule de PLOC/PLOUD. PLOUD reste la source de vérité.

- `auth.py` gère la connexion PLOC et l'activation PLOUD.
- `ploud.py` implémente le transport PLOUD, la signature des requêtes, la validation des réponses et la conversion des enregistrements sources.
- `models.py` définit le modèle d'inventaire local ainsi que ses règles de sérialisation et d'intégrité.
- `coordinator.py` gère la synchronisation, la construction d'un état candidat, la persistance et la publication des mises à jour réussies.
- `sensor.py` et `button.py` exposent les capteurs de synthèse et les commandes de synchronisation manuelle.
- `views.py` sert les images de vins mises en cache par un endpoint Home Assistant authentifié.
- `services.yaml` et l'enregistrement du service exposent l'action de réponse `ploc_cellar.get_inventory`.
- `types.py` centralise les structures typées partagées ; `const.py` contient les constantes de l'intégration.

Le frontend est maintenu dans un dépôt distinct. Il communique avec cette intégration par l'intermédiaire de Home Assistant et n'appelle pas directement PLOC ou PLOUD. Le contrat public du service et des notifications est décrit dans le [contrat backend/frontend](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/BACKEND_CONTRACT.fr.md).

## Isolation des entrées de configuration

Chaque entrée possède ses données d'activation, son coordinateur, son inventaire persistant, son curseur de synchronisation et son cache privé d'images. Plusieurs entrées sont prises en charge ; aucun état ne doit fuiter d'un compte à l'autre.

Le jeton d'accès PLOUD et l'UUID d'appareil généré sont conservés dans l'entrée de configuration Home Assistant. Le mot de passe PLOC et le jeton de session PLOC de courte durée ne sont pas persistés. Une réauthentification renouvelle le jeton d'activation PLOUD tout en conservant l'identité de l'appareil de l'entrée.

## Frontière d'authentification

Lors de l'initialisation, l'intégration effectue les opérations suivantes :

1. Se connecter au compte PLOC par le endpoint d'authentification PLOC.
2. Utiliser le jeton de session obtenu pour activer PLOUD pour l'application Home Assistant.
3. Valider la réponse d'activation et extraire le jeton d'accès PLOUD.
4. Générer un UUID d'appareil pour cette entrée et persister les données d'activation.
5. Démarrer la première synchronisation en lecture seule.

Les endpoints concrets ainsi que les détails privés de requête et de signature restent des détails d'implémentation : les interfaces amont ne sont pas documentées et peuvent évoluer. Ne pas les présenter comme une API publique prise en charge. Les sources de référence sont `auth.py`, `ploud.py` et `const.py`.

## Cycle de synchronisation

Une actualisation du coordinateur peut être déclenchée par l'intervalle configuré, le bouton de synchronisation différentielle ou le bouton de synchronisation complète.

- La synchronisation différentielle demande les changements depuis le curseur PLOUD persisté.
- La synchronisation complète demande un instantané intégral et reconstruit l'inventaire candidat.
- Un instantané complet de récupération peut être demandé lorsqu'un delta ne peut pas être résolu de manière sûre avec les références locales.
- Les changements sont appliqués à un modèle candidat. Sa validation et sa persistance doivent réussir avant le remplacement de l'inventaire actif en mémoire et de son curseur.
- Une requête échouée, une charge utile invalide ou un échec de persistance ne doit ni publier un inventaire partiel ni avancer le curseur actif.
- Après un échec de synchronisation ultérieur, le dernier inventaire validé reste disponible et est signalé comme obsolète.

Les règles détaillées de fusion, de suppression, de curseur, de reconstruction du stock et de cycle de vie du cache figurent dans [ALGORITHMS.fr.md](ALGORITHMS.fr.md).

## Notifications après mise à jour réussie

Après validation, persistance et activation du modèle candidat, l'intégration :

- met à jour les données actives du coordinateur ;
- émet l'événement public `ploc_cellar_sync_completed` pour les automatisations administrateur ;
- notifie les abonnés frontend de l'entrée concernée via la commande WebSocket `ploc_cellar/subscribe_sync`.

L'événement public contient les métadonnées de synchronisation et les changements effectifs d'identifiants d'objets. La notification d'abonnement frontend est volontairement vide : elle sert uniquement de signal d'invalidation, après lequel la carte appelle `ploc_cellar.get_inventory`.

Home Assistant réserve les abonnements aux événements personnalisés aux administrateurs. Le frontend utilise donc la commande WebSocket authentifiée dédiée plutôt que l'événement public. La charge utile, les champs et les garanties de cycle de vie sont définis dans le [contrat backend/frontend](https://github.com/MadMatt34/ha-ploc-cellar-frontend/blob/main/docs/BACKEND_CONTRACT.fr.md).

## Stockage de l'inventaire et des images

L'instantané d'inventaire et le curseur de synchronisation correspondant sont stockés avec le Store persistant de Home Assistant. Le cache d'images est séparé, privé à l'entrée de configuration et servi uniquement par un endpoint authentifié.

Les téléchargements d'images sont facultatifs et ne doivent pas faire échouer une synchronisation d'inventaire valide. Une mise à jour de document modifie l'URL locale de l'image afin que les clients puissent invalider une URL objet déjà mise en cache. La suppression d'une entrée supprime son inventaire et son cache d'images.

La recherche d'une image en cache effectue des vérifications synchrones du système de fichiers et parcourt les répertoires. Les appelants asynchrones doivent déporter ces opérations vers l'exécuteur Home Assistant. La synchronisation des images y déporte chaque recherche en cache, la vue d'image authentifiée y déporte la résolution du chemin sécurisé et le service `ploc_cellar.get_inventory` y exécute en une seule fois la construction complète de la réponse. Les accès au système de fichiers et la construction de la réponse restent ainsi hors de la boucle d'événements, tout en conservant les helpers synchrones et sans déclencher un appel à l'exécuteur pour chaque image de vin.

Voir [PLOUD_FIELD_MAPPING.fr.md](PLOUD_FIELD_MAPPING.fr.md) pour la correspondance des champs sources et [ALGORITHMS.fr.md](ALGORITHMS.fr.md) pour les règles de persistance et de cache.

## Invariants de maintenance

- Ne jamais envoyer de mutation de cave à PLOUD.
- Isoler les données, inventaires, curseurs et caches de chaque entrée.
- Ne jamais avancer le curseur validé avant la persistance de l'instantané correspondant.
- Ne notifier aucun consommateur avant un commit réussi.
- Conserver dans les totaux physiques les positions non résolues ; ne jamais les convertir silencieusement en positions vides.
- Traiter un historique de mouvements incomplet comme une donnée incomplète, jamais comme un stock nul.
- Maintenir le contrat de réponse backend en cohérence avec les types frontend, les assertions de compilation et les tests de contrat.