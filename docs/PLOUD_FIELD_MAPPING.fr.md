# Correspondance des champs PLOUD

Ce document décrit la correspondance actuellement implémentée par le backend. PLOUD reste la source de vérité ; l'intégration synchronise les données en lecture seule et n'envoie jamais de modification de cave.

## Collections

| Collection PLOUD | Représentation locale | Conservation |
|---|---|---|
| `Wines` | Enregistrements immuables `Wine` dans `Cellar.wines` | Persistés, y compris les références à stock nul |
| `Racks` | Enregistrements `Rack` dans `Cellar.racks` | Persistés |
| `RackItems` | Enregistrements `RackItem` dans `Cellar.rack_items` | Persistés, y compris les emplacements vides et les références non résolues des instantanés restaurés |
| `Orders` | Enregistrements `Order` dans `Cellar.orders` | Persistés pour reconstituer le stock |
| `appellations`, `bottleFormats`, `classifications`, `colors`, `countries`, `regions` | Enregistrements JSON indexés dans `Cellar.references` | Persistés et fusionnés entre synchronisations incrémentales |
| `Owners` | Résolution temporaire UUID vers nom affiché | Les enregistrements bruts ne sont pas persistés |
| `Documents` | Métadonnées d'images utilisées par le cache privé | Hors du modèle de cave ; les octets des images référencées sont mis en cache séparément |
| `DeletedObjects` | Instructions explicites de suppression | Appliquées au modèle candidat ; la collection n'est pas conservée |

Les six collections de référence font partie de l'instantané sérialisé. Une fiche Wine reçue dans un delta ultérieur peut ainsi résoudre ses identifiants compacts même si l'enregistrement de référence correspondant n'est pas répété dans ce delta. Les enregistrements Owner sont volontairement temporaires : le nom résolu du domaine est stocké dans `Wine.domain`, tandis que l'UUID Owner est conservé dans `owner_id`.

## Champs Wine

| Champ PLOUD | Champ local | Signification et traitement |
|---|---|---|
| `id` | `Wine.id` | Identifiant obligatoire ; les UUID sont normalisés en forme canonique minuscule |
| `nm` / `name` | `Wine.name` | Nom du vin ; les deltas partiels préservent les valeurs omises |
| `bo` / `bottles` | `Wine.bottles` | Quantité brute PLOUD, conservée à titre indicatif ; elle ne calcule pas le stock effectif |
| `vi` / `vintage` | `Wine.vintage` | Millésime ; zéro et chaîne vide signifient inconnu |
| `ap` | `Wine.appellation` | Résolu via `appellations` |
| `co` | `Wine.color`, `Wine.color_rgb` | Résolu via `colors` ; les composantes RGB sont validées |
| `cl` | `Wine.classification` | Résolu via `classifications` |
| `rn` | `Wine.region` | Résolu via `regions` |
| `cn` | `Wine.country` | Résolu via `countries` |
| `gr` | `Wine.grapes` | Texte de composition en cépages |
| `cu` | `Wine.cuvee` | Cuvée |
| `cs` | `Wine.comment` | Commentaire |
| `de` | `Wine.alcohol_percent` | Pourcentage d'alcool ; valeur numérique finie et positive ou nulle uniquement |
| `ti`, `to` | `Wine.service_temperature_min`, `Wine.service_temperature_max` | Limites de température de service |
| `vf` | `Wine.bottle_format`, `Wine.bottle_volume_l` | Résolu via `bottleFormats` |
| `pid` | `Wine.ploud_pid` | Identifiant produit PLOC |
| `ml` | `Wine.meals` | Masque de bits brut facultatif, entier positif ou nul ; les bits inconnus sont conservés |
| `ow` | `Wine.owner_id`, `Wine.domain` | Identifiant Owner conservé ; nom affiché résolu depuis la réponse Owners et stocké sur Wine |
| `im`, `ci` | `Wine.ploud_reference_fields` | Identifiants du document principal et de couverture utilisés par le cache d'images |
| Autres champs compacts | `Wine.ploud_reference_fields` | Conservés pour permettre la fusion incrémentale et la résolution ultérieure des références |

Un delta qui omet un champ préserve la valeur précédente. Un champ explicitement vide efface la valeur facultative correspondante. Un nouvel enregistrement Wine doit contenir son identité, son nom et les données de quantité de bouteilles requises ; un enregistrement incomplet déclenche une récupération plutôt que la création silencieuse d'une fiche métier partielle.

## Identifiants et données de référence

| Collection | Champ Wine compact | Champs d'affichage |
|---|---|---|
| `appellations` | `ap` | `nm` |
| `bottleFormats` | `vf` | `nm`, `vo` (litres) |
| `classifications` | `cl` | `nm` |
| `colors` | `co` | `nm`, `r`, `g`, `b` |
| `countries` | `cn` | `nm` |
| `regions` | `rn` | `nm` |

Les index de référence utilisent des identifiants normalisés comme clés et sont mis à jour lorsqu'une synchronisation inclut une collection de référence. Les champs d'affichage Wine sont actualisés depuis l'index fusionné. Une référence absente ne génère pas de libellé inventé : la dernière valeur valide est conservée lorsque c'est approprié, sinon le champ reste inconnu.

## Masque binaire des accords mets-vins

PLOUD stocke les associations de mets dans `Wine.ml` ; le backend expose la valeur brute dans `Wine.meals`. Il s'agit d'un masque binaire : les indicateurs se combinent par OU binaire.

| Bit | Catégorie |
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
| `1024` | Plats avec légumes |
| `2048` | Fromage |
| `4096` | Dessert |
| `8192` | Plats épicés |

Par exemple, `10341` combine `1 + 4 + 32 + 64 + 2048 + 8192` : apéritif, entrée, poisson, viande blanche, fromage et plats épicés. Une valeur `meals` absente ou nulle signifie que PLOUD n'a pas fourni de données d'association. Les futurs bits inconnus restent conservés dans l'entier brut et ne reçoivent pas de libellé inventé.

## Champs des casiers et mouvements

| Collection / champ | Champ local | Signification |
|---|---|---|
| `Racks.id` | `Rack.id` | Identifiant du casier |
| `Racks.nm` / `name` | `Rack.name` | Nom affiché du casier |
| `RackItems.id` | `RackItem.id` | Identifiant de l'enregistrement d'emplacement physique |
| `RackItems.rk` | `RackItem.rack_id` | Référence du casier |
| `RackItems.wi` | `RackItem.wine_id` | Référence du vin ; vide signifie emplacement inoccupé |
| `RackItems.rw` | `RackItem.row` | Coordonnée de ligne à base zéro, nullable |
| `RackItems.cl` | `RackItem.column` | Coordonnée de colonne à base zéro, nullable |
| `Orders.id` | `Order.id` | Identifiant du mouvement |
| `Orders.wi` | `Order.wine_id` | Référence du vin |
| `Orders.in` | `Order.incoming` | Quantité de bouteilles entrantes |
| `Orders.ot` | `Order.outgoing` | Quantité de bouteilles sortantes |

Chaque RackItem représente une position physique. Une position occupée reste comptabilisée même si sa référence Wine ou Rack est temporairement non résolue. La réponse d'inventaire expose ces situations dans `positions_with_unknown_wine` et `positions_without_rack` ; un emplacement occupé non résolu n'est jamais requalifié en emplacement vide.

## Stock et diagnostics

Pour un vin dont l'historique Orders est complet :

```text
purchased = sum(Order.in)
consumed = sum(Order.ot)
movement_balance = purchased - consumed
calculated_stock = max(0, movement_balance)
effective_stock = max(calculated_stock, bottles_in_cellar)
unlocated_bottles = max(0, effective_stock - bottles_in_cellar)
negative_movement_bottles = max(0, -movement_balance)
physical_surplus_bottles = max(0, bottles_in_cellar - calculated_stock)
```

Les trois diagnostics sont indépendants et peuvent coexister. La valeur brute PLOUD `Wine.bo` est purement informative. Tant qu'un instantané Orders complet n'a pas été validé, les valeurs dérivées du stock sont nulles ; les positions physiques connues restent disponibles.

## Contrat de l'action d'inventaire

L'action Home Assistant de réponse est `ploc_cellar.get_inventory`. Elle exige `config_entry_id` et accepte les filtres textuels facultatifs `search` et `color`. La recherche porte sur le nom du vin, le domaine, l'appellation, la région, le pays, les cépages, la cuvée et le commentaire. Les filtres ne modifient pas les totaux globaux.

La réponse comprend les compteurs globaux et diagnostics, `matching_wines`, `racks`, `rack_items`, `wines`, `wine_diagnostics`, `stale`, `stock_reconstruction_complete` et `last_sync`. Une fiche vin contient ses caractéristiques d'affichage, les valeurs de stock, `meals` facultatif, l'URL d'image et les emplacements. Un emplacement contient le nom et l'identifiant du casier ainsi que des coordonnées de ligne et de colonne nullables.

Le contrat machine complet est vérifié par le test backend `test_service_contract.py` et reflété par les assertions de contrat TypeScript dans le dépôt frontend.
