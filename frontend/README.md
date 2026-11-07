# Legacy Ploc Cellar frontend snapshot

The maintained frontend source has moved to the standalone
[MadMatt34/ha-ploc-cellar-frontend](https://github.com/MadMatt34/ha-ploc-cellar-frontend)
repository. New card development, frontend documentation, releases and
frontend CI belong there.

This directory and the integration-served JavaScript bundle are retained
temporarily as a migration fallback for existing dashboards. Do not develop
new frontend features here. The legacy resource remains available at
`/ploc_cellar_static/ploc-cellar-card.js` until the HACS Dashboard migration
has been validated.

When migrating a dashboard, install the standalone HACS Dashboard package,
replace the old resource with
`/hacsfiles/ha-ploc-cellar-frontend/ploc-cellar-card.js`, and remove the old
resource. Do not load both modules simultaneously because they register the
same custom card types. Existing card configurations remain compatible.

The previous source and build setup below this directory are not the source of
truth for future frontend changes.
