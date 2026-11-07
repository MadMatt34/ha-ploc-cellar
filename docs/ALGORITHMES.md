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
unlocated_bottles = max(0, effective_stock - bottles_in_cellar)
```

Conséquences :

- Le stock effectif n'est jamais négatif.
- Le stock effectif ne peut jamais être inférieur au nombre de bouteilles
  déjà placées.
- Les mouvements déterminent le stock disponible lorsqu'ils dépassent le
  nombre de bouteilles placées.
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
| `unlocated_bottles` | Somme des bouteilles du stock effectif qui ne sont pas affectées à un emplacement |
| `total_stock_bottles` | Somme des stocks effectifs connus + `positions_with_unknown_wine` |
| `rack_count` | Nombre de références Rack connues |

Trois compteurs d'intégrité sont distincts :

- `positions_without_rack` compte les positions dont le `rack_id` ne
  correspond à aucun casier local connu.
- `positions_with_unknown_wine` compte les positions occupées dont le
  `wine_id` ne correspond à aucune référence Wine locale connue.
- `orders_without_wine` compte les mouvements `Order` conservés dont le
  `wine_id` ne correspond plus à une référence Wine locale connue.

Une position orpheline de vin reste une bouteille physique : elle est incluse
dans `occupied_positions` et `total_bottles`. Elle est également ajoutée à
`total_stock_bottles` lorsque la reconstitution du stock est complète. Si
l'historique Orders n'est pas disponible, `total_stock_bottles` vaut `null`
plutôt que de présenter un total partiel comme un total exact. Elle n'est
jamais convertie silencieusement en emplacement vide.

Les filtres de recherche et de couleur de l'action `get_inventory` ne
modifient jamais les totaux globaux.

## 4. Diagnostics de stock et de cohérence

Les diagnostics dérivés des mouvements ne sont calculés que lorsque
l'historique Orders est complet. Avant cela, leurs quantités et compteurs
valent `null` ; les quantités physiquement placées et les références de
positions restent connues.

### 4.1 Stock non localisé

Pour chaque vin :

`unlocated_bottles = max(0, effective_stock - bottles_in_cellar)`.

- `unlocated_wines` compte les références ayant au moins une bouteille non
  localisée.
- `unlocated_bottles` compte le total de ces bouteilles.

Ce diagnostic signifie que le stock reconstitué à partir des mouvements est
supérieur au nombre de bouteilles affectées à des positions. Il ne prouve pas
qu'une bouteille a été retirée sans mouvement de sortie : elle peut aussi
n'avoir jamais été rangée ou être conservée hors de la cave.

### 4.2 Solde de mouvements négatif

Pour chaque vin :

`negative_movement_bottles = max(0, -movement_balance)`.

- `negative_movement_wines` compte les références dont le solde de mouvements
  est négatif.
- `negative_movement_bottles` additionne la valeur absolue de ces soldes
  négatifs.

Ce diagnostic signale un registre dans lequel les sorties dépassent les
entrées. Il ne représente pas un nombre de bouteilles physiquement manquantes.

### 4.3 Excédent physique

Pour chaque vin :

`physical_surplus_bottles = max(0, bottles_in_cellar - calculated_stock)`.

`calculated_stock` vaut `max(0, movement_balance)`. Les agrégats sont :

- `physical_surplus_wines` compte les références dont le nombre de bouteilles
  physiquement placées dépasse le stock non négatif calculé par les mouvements.
- `physical_surplus_bottles` additionne ces bouteilles physiques excédentaires.

Un excédent physique peut signaler une entrée non enregistrée ou un historique
incomplet. Il peut coexister avec un solde de mouvements négatif pour une même
référence ; les familles de diagnostics ne sont donc pas nécessairement
mutuellement exclusives.

### 4.4 Références non résolues

- `positions_without_rack` compte les positions qui référencent un casier
  inconnu.
- `positions_with_unknown_wine` compte les positions occupées qui
  référencent un vin inconnu.
- `orders_without_wine` compte les commandes conservées dont le vin n'existe
  plus dans les références locales. Une telle commande peut être un historique
  normal après suppression d'un vin dans PLOUD.

### 4.5 Détail des diagnostics

L'action `get_inventory` expose `wine_diagnostics`, une liste non filtrée
des vins qui présentent au moins un des trois diagnostics de stock :
`unlocated_bottles`, `negative_movement_bottles` ou
`physical_surplus_bottles`. Elle inclut également les vins à stock effectif
nul. Chaque entrée fournit les quantités achetées et sorties, le solde des
mouvements, la quantité physique, le stock effectif et les trois quantités de
diagnostic. Cette liste vaut `null` tant que la reconstitution Orders est
incomplète.

Les agrégats sont exposés par des capteurs Home Assistant distincts, regroupés
entre inventaire, casiers et diagnostics. Le capteur
`sensor.ploc_cellar_bottles_in_stock` conserve l'identifiant unique historique
et mesure les positions physiquement occupées ; le capteur
`sensor.ploc_cellar_bottles_stock_total` mesure le stock effectif reconstitué.
Les six capteurs de diagnostic reprennent les trois familles décrites ci-dessus,
avec un compteur de bouteilles et un compteur de références pour chacune. Le
capteur `sensor.ploc_cellar_diagnostic_last_successful_sync` fournit l'horodatage
de la dernière synchronisation validée et porte l'attribut `stale`. La liste
`wine_diagnostics` et les caractéristiques individuelles restent accessibles
uniquement par l'action `get_inventory` ; aucun capteur n'est créé par vin.

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

### 5.4 Normalisation des identifiants

Les identifiants UUID sont convertis en forme canonique minuscule et avec
tirets, qu'ils proviennent d'un objet, d'une référence croisée ou de
`DeletedObjects`. Cette règle s'applique aux Wine, Rack, RackItem, Order et
Owner. Les espaces périphériques sont supprimés avant la normalisation.
Les identifiants qui ne sont pas des UUID restent opaques : ils sont seulement
rognés et leur casse est conservée. Les identifiants et références restaurés
depuis un ancien stockage sont normalisés de la même façon avant de reconstruire
les dictionnaires du modèle.

Les nouvelles écritures du stockage exigent cette représentation canonique.
Une migration qui détecte deux clés devenant identiques après normalisation est
rejetée et le cache est récupéré par un instantané complet, plutôt que de
fusionner arbitrairement les enregistrements.

### 5.5 Références inconnues et suppressions explicites

Une référence RackItem vers un Wine inconnu est conservée comme position
occupée. Elle provoque une récupération par synchronisation complète lorsqu'elle
arrive dans un delta. Si l'instantané complet ne résout pas cette référence,
il est rejeté.

Un `Order` dont le `wine_id` n'existe plus dans la collection `Wines` est
conservé comme historique de mouvements, notamment lorsqu'un vin a été supprimé
sans suppression correspondante de ses commandes. Il ne contribue au stock
d'aucun vin connu, ne crée pas de référence Wine artificielle et ne déclenche
pas de synchronisation complète à lui seul. Le compteur
`orders_without_wine` rend ces commandes visibles. Une suppression explicite
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
Home Assistant. Le schéma courant est la version 7. La version 6 est la
première à persister les mouvements Orders.

Au chargement :

- Les schémas historiques pris en charge sont migrés et leur curseur est
  ramené à `1` pour forcer un instantané complet.
- Pour les versions 1 à 5, l'historique Orders complet n'est pas disponible :
  le cache physique est conservé, mais `stock_reconstruction_complete` vaut
  `false`.
- Pour la version 6, l'historique Orders est considéré complet si le curseur
  stocké est supérieur à `1`. Un curseur égal à `1` signifie que le premier
  instantané n'avait pas encore été validé.
- Le stockage est converti en version 7 ; les identifiants UUID et toutes
  leurs références sont normalisés. Le drapeau de disponibilité Orders est
  conservé séparément du curseur remis à `1`.
- Le schéma courant doit contenir les quatre collections persistées
  (`wines`, `racks`, `rack_items`, `orders`) sous forme de dictionnaires,
  ainsi que des enregistrements complets et typés. Il contient également le
  drapeau `stock_reconstruction_complete`; lorsqu'il vaut `false`, le curseur
  doit rester à `1`.
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

### Cache hors ligne sans historique Orders

Les versions 1 à 5 ne conservaient pas les mouvements permettant de
reconstituer le stock effectif. La valeur brute `Wine.bo` ne peut pas servir
de remplacement : elle peut surestimer le stock réel. Pour éviter à la fois
une estimation artificielle et une sous-déclaration présentée comme exacte,
les données connues restent accessibles mais les résultats dépendant des
mouvements sont temporairement indisponibles :

- `total_bottles`, les positions occupées et les quantités physiquement
  placées restent exacts ;
- `stock_reconstruction_complete` vaut `false` ;
- `wine_references`, `total_stock_bottles`, les compteurs de stock non localisé,
  de mouvements négatifs et d'excédent physique, ainsi que `orders_without_wine`,
  valent `null` ;
- l'action `get_inventory` retourne les vins connus physiquement placés,
  mais laisse leurs champs calculés et diagnostics à `null` ;
- un instantané PLOUD complet réussi marque le stock comme reconstitué et
  réactive tous les calculs.

Un cache version 6 qui contient déjà un instantané Orders complet garde ses
calculs pendant une panne, même si la migration vers la version 7 force un
nouvel instantané pour actualiser les identifiants.

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

## Données des accords mets et vins

PLOUD stocke les associations mets-vins dans le champ `Wine.ml`. L'intégration expose cette valeur sous la forme de l'entier brut facultatif `Wine.meals` ; elle ne traduit, ne normalise et ne supprime aucun indicateur. Il s'agit d'un masque de bits : plusieurs catégories peuvent être présentes dans une même valeur en combinant leurs indicateurs par OU binaire.

Indicateurs connus de l'énumération publique `Meals` :

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

Le frontend associe ces indicateurs à des libellés localisés dans la fenêtre de détail du vin. Une valeur `meals` absente ou nulle signifie que les données d'association ne sont pas disponibles ; elle ne doit pas être interprétée comme une liste explicitement vide.

L'APK contient également une ressource `foodtype8192`, mais `8192` n'est pas défini dans l'énumération publique du serveur. Sa signification n'est pas confirmée et cet indicateur est volontairement absent de la correspondance. Le backend doit conserver les bits inconnus et le frontend doit les ignorer.

## 8. Images des vins et documents PLOUD

Les images ne font pas partie du calcul du stock et ne modifient jamais les données de cave. Elles sont synchronisées séparément à partir de la collection PLOUD `Documents` et des références portées par les fiches `Wines`.

### 8.1 Références et récupération

- Les champs compacts `im` et `ci` d'un Wine référencent respectivement l'image principale et l'image de couverture.
- Les métadonnées des documents sont conservées depuis la collection `Documents`. Elles permettent d'identifier le type de document et de calculer une empreinte de version à partir des métadonnées disponibles (`tm`, `tp`, `lt`, `ct`, `wd`, `ht`, `or`, `ty`).
- Le contenu binaire est récupéré à la demande par la méthode PLOUD `getdocument`, via la route document dédiée. La requête est signée selon le protocole du client PLOC ; la réponse est un flux binaire, pas un objet JSON.
- Seuls les documents référencés par au moins un Wine sont téléchargés. Les documents sans référence image ne sont pas aspirés.
- Les formats image reconnus sont JPEG, PNG, GIF et WebP. La validation s'appuie sur la signature binaire ; un type MIME générique n'empêche pas un fichier image valide d'être accepté. Les documents identifiés comme PDF, texte, audio ou vidéo sont rejetés. La taille maximale acceptée est de 20 Mio par image.

### 8.2 Cache et actualisation

Les images sont stockées dans un cache privé propre à l'entrée de configuration, sous `.storage/ploc_cellar/<entry_id>/images`. Le cache image est distinct du stockage transactionnel de l'inventaire.

Le nom de fichier inclut une empreinte du document. Si les métadonnées changent pour un même identifiant de document, une nouvelle version est téléchargée et le chemin servi change également. Le frontend peut ainsi détecter une URL différente et recharger l'image même lorsque l'identifiant PLOUD reste identique.

Une erreur de téléchargement d'image ne fait pas échouer la synchronisation de l'inventaire. L'image existante reste disponible lorsqu'elle est valide ; un nouvel essai sera effectué lors d'une synchronisation ultérieure.

### 8.3 Suppressions et nettoyage

Après une synchronisation d'images réussie, le cache est élagué : les fichiers qui ne correspondent plus à une référence `im` ou `ci`, les documents explicitement supprimés (type PLOUD `Document = 115`) et les anciennes versions remplacées sont supprimés. Les suppressions ne sont pas déduites d'une simple absence dans un delta d'inventaire ; elles reposent sur les références et suppressions documentaires effectivement connues.

La suppression de l'entrée de configuration Home Assistant supprime son répertoire de cache image. Un simple déchargement ou rechargement de l'entrée ne supprime pas les images. Le cache reste local et n'est jamais envoyé à PLOUD.

### 8.4 Exposition à Home Assistant et au frontend

Le service `get_inventory` ajoute `image_url` à chaque fiche vin lorsque l'image principale ou, à défaut, l'image de couverture est disponible dans le cache. La valeur est `null` lorsqu'aucune image locale exploitable n'existe. Le chemin est servi par une vue Home Assistant authentifiée ; les réponses utilisent un cache HTTP privé sans conservation partagée.

L'URL est un endpoint local Home Assistant, pas une URL PLOUD publique. Le frontend doit utiliser le mécanisme authentifié de Home Assistant pour récupérer son contenu. Les images ne doivent pas être chargées avec un élément distant non authentifié ni être mises en cache dans un stockage public.
