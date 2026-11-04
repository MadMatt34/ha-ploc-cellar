# Règles des algorithmes de Ploc Cellar

Ce document décrit les règles métier et les invariants appliqués par
l'intégration. PLOUD reste la source de vérité : Ploc Cellar reconstruit un
inventaire local en lecture seule et ne corrige jamais la cave distante.

## 1. Sources et rôle des collections

| Collection PLOUD | Rôle dans le modèle local |
|---|---|
| `Wines` | Références de vins et caractéristiques descriptives |
| `Orders` | Mouvements d'entrée et de sortie de bouteilles |
| `RackItems` | Emplacements physiques, occupés ou vides |
| `Racks` | Métadonnées des casiers |
| `Owners` | Résolution temporaire du domaine viticole à partir de son UUID |
| `DeletedObjects` | Suppressions explicites à appliquer au modèle local |

Les références `Wine` à stock nul sont conservées dans le modèle : un delta
ultérieur peut leur affecter un mouvement ou un emplacement. Elles sont
simplement exclues de la liste normale d'inventaire tant que leur stock effectif
reste nul.

La valeur brute `Wine.bo` (ou `Wine.bottles`) est conservée à titre
informatif. Elle n'est jamais utilisée comme source directe du stock effectif.

## 2. Reconstruction du stock

Les trois quantités fondamentales sont calculées séparément pour chaque UUID
de vin.

### 2.1 Mouvements

- `purchased` = somme des `Order.in` du vin.
- `consumed` = somme des `Order.ot` du vin.
- `movement_balance` = `purchased - consumed`.
- `calculated_stock` = `max(0, movement_balance)`.

Un solde négatif n'est pas ramené à zéro dans le diagnostic : il reste visible
dans `movement_balance` et génère l'avertissement
`negative_movement_balance`.

### 2.2 Bouteilles physiquement placées

Chaque `RackItem` représente exactement une position physique. Une position
est occupée lorsque son `wine_id` n'est pas vide.

Pour un vin connu :

`bottles_in_cellar` = nombre de `RackItems` dont `wine_id` correspond à
l'UUID du vin.

Ce décompte ne dépend pas de la présence des métadonnées du casier. Un
`RackItem` dont le `rack_id` est temporairement inconnu reste un emplacement
occupé et compte toujours pour le vin associé.

### 2.3 Stock effectif

La règle de reconstruction est :

```text
effective_stock = max(0, movement_balance, bottles_in_cellar)
bottles_to_store = effective_stock - bottles_in_cellar
```

Conséquences :

- Le stock effectif n'est jamais négatif.
- Le stock effectif ne peut jamais être inférieur au nombre de bouteilles
  déjà placées.
- Les mouvements déterminent le stock disponible lorsqu'ils dépassent le
  nombre de bouteilles placées.
- Les bouteilles non placées sont la différence entre le stock effectif et
  les positions occupées par ce vin.
- `Wine.bo` n'intervient pas dans cette formule.

## 3. Invariants globaux de l'inventaire

Soit `R` l'ensemble de tous les `RackItems`.

| Attribut | Règle |
|---|---|
| `total_positions` | `len(R)` |
| `occupied_positions` | Nombre de `RackItems` dont `wine_id` est non vide |
| `empty_positions` | `total_positions - occupied_positions` |
| `total_bottles` | `occupied_positions` |
| `stocked_wines` | Nombre de références Wine connues ayant `bottles_in_cellar > 0` |
| `wine_references` | Nombre de références Wine connues dont le stock effectif est positif |
| `bottles_to_store` | Somme des bouteilles non placées de toutes les références Wine connues |
| `total_stock_bottles` | Somme des stocks effectifs connus + `orphaned_wine_positions` |
| `rack_count` | Nombre de références Rack connues |

Deux compteurs d'intégrité sont distincts :

- `orphaned_rack_positions` compte les positions dont le `rack_id` ne
  correspond à aucun casier local connu.
- `orphaned_wine_positions` compte les positions occupées dont le
  `wine_id` ne correspond à aucune référence Wine locale connue.
- `orphaned_order_count` compte les mouvements `Order` conservés dont le
  `wine_id` ne correspond plus à une référence Wine locale connue.

Une position orpheline de vin reste une bouteille physique : elle est incluse
dans `occupied_positions`, `total_bottles` et
`total_stock_bottles`. Elle n'est jamais convertie silencieusement en
emplacement vide.

Les filtres de recherche et de couleur de l'action `get_inventory` ne
modifient jamais les totaux globaux.

## 4. Diagnostics séparés

Les bouteilles non placées et les écarts de mouvements sont deux diagnostics
indépendants.

### 4.1 Bouteilles non placées

La référence reçoit le drapeau `unplaced_bottles` lorsque
`bottles_to_store > 0`.

- `inventory_error_wines` compte les références concernées.
- `inventory_error_count` compte les drapeaux d'erreur (une seule catégorie
  actuellement).
- `bottles_to_store` compte les bouteilles, et non les références.

### 4.2 Écarts de mouvements

Une référence présente un avertissement lorsque :

- `movement_balance < 0` : `negative_movement_balance` ;
- `movement_balance != effective_stock` :
  `movement_balance_mismatch`.

L'écart absolu est :

`movement_difference_bottles = abs(movement_balance - effective_stock)`.

Les agrégats sont :

- `movement_warning_wines` : nombre de références présentant au moins un
  avertissement ;
- `movement_warning_bottles` : somme des écarts absolus pour ces références.

Ce dernier chiffre est un indicateur d'écart, pas un nombre de bouteilles
physiquement excédentaires. Les références à stock effectif nul restent
présentes dans `movement_anomalies`, même si elles sont absentes de la liste
normale `wines`.

## 5. Règles de synchronisation PLOUD

### 5.1 Synchronisation complète et incrémentale

La première synchronisation et toute récupération utilisent
`LastSyncTime=1`. Les synchronisations suivantes utilisent le curseur
incrémental en millisecondes Unix.

Une réponse complète est un instantané : le modèle candidat repart d'une cave
vide. Les références absentes de l'instantané ne sont donc pas conservées par
erreur.

Un delta est appliqué à une copie du dernier modèle validé. Le modèle actif et
son curseur ne changent qu'après validation et sauvegarde vérifiée.

Une réponse complète doit contenir les collections `Wines`, `Racks`,
`RackItems`, `Orders` et `Owners`. Les références RackItem doivent être
résolues dans cet instantané. Un instantané complet contenant encore une
référence Rack ou Wine inconnue est rejeté.

### 5.2 Fusion des champs partiels

Un delta peut ne transmettre qu'une partie des champs d'un objet existant.
La règle générale est :

- **Champ absent** : conserver la valeur connue dans le modèle précédent.
- **Champ explicitement vide ou nul** : appliquer l'effacement lorsque le
  champ autorise une valeur vide.
- **Champ présent mais invalide** : rejeter la réponse plutôt que d'effacer
  silencieusement une valeur connue.
- **Nouvel objet incomplet** : ne pas inventer les champs manquants ; demander
  un instantané complet.

Cette règle s'applique aux caractéristiques Wine, aux métadonnées Rack, aux
mouvements Order et aux positions RackItem.

Pour un `Wine`, les caractéristiques, le nom, le millésime, le propriétaire
et la valeur informative de stock sont préservés quand ils sont absents du
delta. Les champs descriptifs explicitement vides peuvent être effacés. Un
nouveau Wine doit notamment fournir son identifiant et une valeur de stock
initiale ; si cette dernière manque, le delta est considéré incomplet.

Pour un `Rack` déjà connu, l'absence de `nm` ou `name` préserve le nom
précédent. Un nouveau Rack doit fournir son nom ; sinon, le delta est considéré
incomplet. Une valeur explicitement vide ou nulle efface le nom ; une valeur
d'un type incorrect rejette la réponse.

Pour un `RackItem` déjà connu, l'absence de `rk`, `wi`, `rw` ou `cl`
préserve la valeur précédente. Une chaîne vide ou une valeur nulle explicite
sur `wi` signifie que la position est vide. Pour un nouveau RackItem, les
champs `rk` et `wi` doivent être présents : leur omission ne signifie pas
que l'emplacement est libre. Les coordonnées explicitement vides deviennent
`None`; une coordonnée mal formée rejette la réponse.

Pour un `Order` déjà connu, les champs `wi`, `in` et `ot` absents sont
conservés depuis l'objet précédent. Un nouvel Order doit fournir ces trois
champs. Les quantités doivent être des entiers positifs ou nuls.

Pour un `Wine`, un millésime négatif ou une valeur numérique négative
(alcoométrie, températures ou volume) rejette la réponse. La valeur zéro reste
interprétée comme une absence de donnée pour ces champs optionnels. Un
`owner_id` doit être une chaîne ou un entier ; une valeur nulle ou vide efface
la référence, tandis qu'un autre type rejette la réponse.

Pour un `Owner`, l'identifiant doit être présent. Le champ de nom peut être
absent dans un delta, mais cet Owner n'est alors pas considéré comme résolu :
un Wine nouvellement associé à cet Owner provoque une récupération complète.
Un nom explicitement vide ou nul efface le domaine ; un nom d'un type incorrect
rejette la réponse.

### 5.3 Identifiants en doublon

Une même réponse ne peut pas contenir deux fois le même identifiant Wine,
Owner, Rack, RackItem ou Order. Deux noms de collections pris en charge qui ne
diffèrent que par la casse (par exemple `Wines` et `wines`) sont également
rejetés : aucune collection ne doit être ignorée silencieusement.

### 5.4 Références inconnues et suppressions explicites

Une référence RackItem vers un Wine inconnu est conservée comme position
occupée. Elle provoque une récupération par synchronisation complète lorsqu'elle
arrive dans un delta. Si l'instantané complet ne résout pas cette référence,
il est rejeté.

Un `Order` dont le `wine_id` n'existe plus dans la collection `Wines` est
conservé comme historique de mouvements, notamment lorsqu'un vin a été supprimé
sans suppression correspondante de ses commandes. Il ne contribue au stock
d'aucun vin connu, ne crée pas de référence Wine artificielle et ne déclenche
pas de synchronisation complète à lui seul. Le compteur
`orphaned_order_count` rend ces commandes visibles. Une suppression explicite
de l'Order dans `DeletedObjects` reste appliquée normalement.

Une référence vers un Owner absent du delta ou dont le champ de nom est
incomplet peut provoquer une synchronisation complète afin de résoudre le nom
du domaine viticole. Les doublons d'identifiant Owner, comparés sans tenir
compte de la casse, sont rejetés.

Les suppressions ont une sémantique explicite :

- Suppression d'un Wine : effacer uniquement son `wine_id` dans les positions
  concernées ; conserver l'identifiant de la position, le casier, la rangée
  et la colonne.
- Suppression d'un Rack : supprimer les positions physiques appartenant à ce
  casier.
- Une référence Wine simplement absente du delta n'est **pas** une suppression.
- Un Wine reçu avec `bo = 0` n'est **pas** supprimé et ses positions ne sont
  **pas** vidées.

## 6. Stockage persistant et transaction

La version du schéma de cave est stockée séparément de la version enveloppe
Home Assistant. Le schéma courant est la version 6.

Au chargement :

- Les schémas historiques pris en charge sont migrés et leur curseur est
  ramené à `1` pour forcer un instantané complet.
- Le schéma courant doit contenir les quatre collections persistées
  (`wines`, `racks`, `rack_items`, `orders`) sous forme de dictionnaires,
  ainsi que des enregistrements complets et typés.
- Un stockage courant incomplet ou mal formé n'est pas interprété comme une
  collection vide. L'inventaire cache est mis de côté en mémoire et une
  synchronisation complète est exigée. Le fichier existant n'est remplacé
  qu'après réception, validation et sauvegarde vérifiée d'un nouvel instantané.

Pour chaque synchronisation :

1. Récupérer la réponse PLOUD.
2. Construire un modèle candidat (copie du modèle actif pour un delta, modèle
   vide pour un instantané complet).
3. Appliquer les modifications et les suppressions.
4. Vérifier les références RackItem et les invariants du modèle.
5. Sérialiser le candidat et l'enregistrer via le `Store` Home Assistant avec
   écritures atomiques.
6. Relire le stockage et comparer le contenu avec le candidat.
7. Remplacer le modèle actif et son curseur uniquement si l'écriture a été
   vérifiée.

En cas d'échec réseau, de validation ou de persistance, le dernier modèle
validé et son curseur restent actifs ; l'intégration marque l'inventaire comme
périmé (`stale = true`).

### Arrêt de Home Assistant pendant une sauvegarde

Lorsque Home Assistant passe à l'état d'arrêt, `Store.async_save()` peut
mettre les données en attente d'une écriture finale puis retourner sans que le
fichier soit déjà écrit sur disque. Dans ce cas, `Store.async_load()` peut
renvoyer le contenu en attente depuis sa mémoire interne : une égalité entre
les données relues et le candidat ne prouve donc pas, à elle seule, la
persistance sur disque.

L'intégration vérifie l'état d'arrêt avant la sauvegarde, juste après
`async_save()` et après la relecture. Si l'arrêt a commencé pendant cette
séquence, la transaction n'est pas considérée comme validée et le modèle en
mémoire n'est pas avancé. L'écriture finale de Home Assistant peut néanmoins
terminer la sauvegarde en attente ; au redémarrage, le stockage est revalidé
avant réutilisation.

## 7. Garanties de lecture seule

Toutes les requêtes de synchronisation transmettent `Objects={}`. L'intégration
ne transmet aucun objet de cave modifié et n'envoie aucune écriture métier à
PLOUD. Les corrections de cohérence sont locales au modèle Home Assistant ;
les anomalies distantes restent des diagnostics et ne sont jamais corrigées
automatiquement.
