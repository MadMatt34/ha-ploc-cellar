# Ploc Cellar Lovelace frontend

This directory contains the TypeScript/Lit source for the optional Lovelace card.
The card reads inventory only through the integration's `ploc_cellar.get_inventory`
response action. It never communicates with PLOUD directly.

## Development

Run:

```sh
npm ci
npm run check
npm run build
```

Vite writes the distributable module to
`custom_components/ploc_cellar/www/ploc-cellar-card.js`.

The Lovelace resource and the static HTTP path are intentionally not registered
until the distributable is present and its loading lifecycle has been verified
against the supported Home Assistant version. Do not point a dashboard resource
at the TypeScript source.
