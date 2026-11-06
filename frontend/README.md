# Ploc Cellar Lovelace frontend

This directory contains the TypeScript/Lit source for the optional Lovelace
cards. The overview, inventory and rack-layout cards read inventory only through the
integration's `ploc_cellar.get_inventory` response action. They never
communicate with PLOUD directly.

## Development

Run:

```sh
npm install
npm run check
npm run build
```

Vite writes the distributable module to
`custom_components/ploc_cellar/www/ploc-cellar-card.js`. The frontend GitHub
Actions workflow performs the type-check and build on frontend changes, then
commits the lockfile and generated module. Node.js is not required by end users.

## Home Assistant resource

The integration serves the compiled module at
`/ploc_cellar_static/ploc-cellar-card.js`. Add this URL once under
**Settings → Dashboards → Resources** with type **JavaScript module**. The card
picker then offers `Ploc Cellar`, `Ploc Cellar Rack` and `Ploc Cellar Inventory`. The inventory card supports text search, filters for color, region, appellation and vintage, sorting, bottle quantities and expandable wine details. Each card editor
provides a native configuration-entry selector.
