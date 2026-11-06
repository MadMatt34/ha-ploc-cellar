import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type {
  HomeAssistant,
  InventoryResponse,
  PlocCellarCardConfig,
  RackItem,
  Wine,
} from "./types";
import { translate, type TranslationKey } from "./translations";

@customElement("ploc-cellar-rack-card")
export class PlocCellarRackCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private config?: PlocCellarCardConfig;
  @state() private inventory?: InventoryResponse;
  @state() private selectedRackId?: string;
  @state() private loading = false;
  @state() private error?: string;

  static styles = css`
    :host { display: block; }
    ha-card { padding: 16px; color: var(--primary-text-color); }
    header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    h2 { margin: 0; font-size: 1.2rem; font-weight: 500; }
    button { color: var(--primary-text-color); background: var(--secondary-background-color); border: 1px solid var(--divider-color); border-radius: 8px; padding: 8px 12px; cursor: pointer; }
    button[aria-pressed="true"] { border-color: var(--primary-color); background: var(--secondary-background-color); }
    button[disabled] { opacity: .5; cursor: default; }
    .rack-picker { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0; }
    .grid-wrap { overflow-x: auto; padding: 4px 0 12px; }
    .rack-grid { display: grid; gap: 6px; min-width: min-content; }
    .slot { min-width: 76px; min-height: 64px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 6px; border-radius: 8px; border: 1px solid var(--divider-color); background: var(--secondary-background-color); box-sizing: border-box; }
    .slot.occupied { border-color: var(--primary-color); background: var(--card-background-color); }
    .slot.missing { border-style: dashed; color: var(--secondary-text-color); background: transparent; }
    .slot strong { font-size: .9rem; }
    .slot small { color: var(--secondary-text-color); font-size: .75rem; }
    .legend, .muted { color: var(--secondary-text-color); font-size: .85rem; }
    .warning { color: var(--warning-color); padding: 8px 0; }
    .error { color: var(--error-color); padding: 8px 0; }
    .unplaced { border-top: 1px solid var(--divider-color); padding-top: 10px; margin-top: 10px; }
    .unplaced-item { padding: 5px 0; }
  `;

  static getConfigForm() {
    return {
      schema: [
        {
          name: "config_entry_id",
          required: true,
          selector: { config_entry: { integration: "ploc_cellar" } },
        },
        { name: "title", selector: { text: {} } },
      ],
    };
  }

  static getStubConfig(): Partial<PlocCellarCardConfig> {
    return {};
  }

  setConfig(config: PlocCellarCardConfig): void {
    this.config = config;
    this.inventory = undefined;
    this.error = undefined;
    if (this.config.config_entry_id) void this.refresh();
  }

  protected updated(): void {
    if (this.hass && this.config && !this.inventory && !this.loading && !this.error) {
      void this.refresh();
    }
  }

  private async refresh(): Promise<void> {
    if (!this.hass || !this.config?.config_entry_id || this.loading) return;
    this.loading = true;
    this.error = undefined;
    try {
      const result = await this.hass.callWS<{ response: InventoryResponse }>({
        type: "call_service",
        domain: "ploc_cellar",
        service: "get_inventory",
        service_data: { config_entry_id: this.config.config_entry_id },
        return_response: true,
      });
      this.inventory = result.response;
      if (!this.selectedRackId || !this.inventory.racks.some((rack) => rack.id === this.selectedRackId)) {
        this.selectedRackId = this.inventory.racks[0]?.id;
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.loading = false;
    }
  }

  private get selectedItems(): RackItem[] {
    return (this.inventory?.rack_items ?? []).filter((item) => item.rack_id === this.selectedRackId);
  }

  private get positionedItems(): RackItem[] {
    return this.selectedItems.filter(
      (item) => item.row !== null && item.column !== null,
    );
  }

  private get rowValues(): number[] {
    return this.positionedItems.map((item) => item.row as number);
  }

  private get columnValues(): number[] {
    return this.positionedItems.map((item) => item.column as number);
  }

  private get firstRow(): number {
    return Math.min(...this.rowValues);
  }

  private get firstColumn(): number {
    return Math.min(...this.columnValues);
  }

  private get rowCount(): number {
    return Math.max(...this.rowValues) - this.firstRow + 1;
  }

  private get columnCount(): number {
    return Math.max(...this.columnValues) - this.firstColumn + 1;
  }

  private get missingCoordinates(): Array<{ row: number; column: number }> {
    if (!this.positionedItems.length) return [];
    const known = new Set(
      this.positionedItems.map((item) => `${item.row}:${item.column}`),
    );
    const missing: Array<{ row: number; column: number }> = [];
    for (let row = this.firstRow; row <= Math.max(...this.rowValues); row += 1) {
      for (
        let column = this.firstColumn;
        column <= Math.max(...this.columnValues);
        column += 1
      ) {
        if (!known.has(`${row}:${column}`)) missing.push({ row, column });
      }
    }
    return missing;
  }

  private get wineById(): Map<string, Wine> {
    return new Map((this.inventory?.wines ?? []).map((wine) => [wine.id, wine]));
  }

  private wineLabel(item: RackItem): string {
    if (!item.wine_id) return "";
    const wine = this.wineById.get(item.wine_id);
    return wine ? wine.name : translate(this.hass?.language ?? "en", "unknown_wine");
  }

  protected render() {
    const t = (key: TranslationKey): string =>
      translate(this.hass?.language ?? "en", key);
    const data = this.inventory;
    const rack = data?.racks.find((item) => item.id === this.selectedRackId);
    const rows = this.rowValues;
    const columns = this.columnValues;
    const items = this.positionedItems;
    const unplaced = this.selectedItems.filter((item) => item.row === null || item.column === null);
    const rackItemsWithUnknownRack = (data?.rack_items ?? []).filter(
      (item) => !data?.racks.some((candidate) => candidate.id === item.rack_id),
    );

    return html`
      <ha-card>
        <header>
          <h2>${this.config?.title ?? (t("rack_title"))}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>${this.loading ? "…" : (t("refresh"))}</button>
        </header>
        ${this.error ? html`<div class="error">${this.error}</div>` : nothing}
        ${!this.config?.config_entry_id ? html`<div class="muted">${t("select_config")}</div>` : nothing}
        ${data?.stale ? html`<div class="warning">${t("stale")}</div>` : nothing}
        ${data?.racks.length ? html`
          <nav class="rack-picker" aria-label=${t("rack_selection")}>
            ${data.racks.map((item) => html`
              <button aria-pressed=${item.id === this.selectedRackId}
                @click=${() => { this.selectedRackId = item.id; }}>${item.name}</button>
            `)}
          </nav>
          <div class="legend">${rack?.name ?? ""} · ${this.selectedItems.filter((item) => item.wine_id).length} ${t("occupied")} · ${this.selectedItems.filter((item) => !item.wine_id).length} ${t("free")}</div>
          ${rows.length && columns.length ? html`
            <div class="grid-wrap">
              <div class="rack-grid" style=${`grid-template-columns: repeat(${this.columnCount}, minmax(88px, 1fr)); grid-template-rows: repeat(${this.rowCount}, minmax(72px, auto));`}>
                ${items.map((item) => {
                  const row = (item.row as number) - this.firstRow + 1;
                  const column = (item.column as number) - this.firstColumn + 1;
                  const occupied = Boolean(item.wine_id);
                  return html`
                    <div class=${occupied ? "slot occupied" : "slot"}
                      style=${`grid-row: ${row}; grid-column: ${column};`}
                      title=${this.wineLabel(item) || (t("empty_position"))}>
                      <strong>${occupied ? this.wineLabel(item) : "—"}</strong>
                      <small>${t("row")} ${item.row} · ${t("column")} ${item.column}</small>
                    </div>
                  `;
                })}
                ${this.missingCoordinates.map((position) => html`
                  <div class="slot missing"
                    style=${`grid-row: ${position.row - this.firstRow + 1}; grid-column: ${position.column - this.firstColumn + 1};`}>
                    <strong>—</strong>
                    <small>${t("not_mapped")}</small>
                  </div>
                `)}
              </div>
            </div>
          ` : html`<div class="warning">${t("no_coordinates")}</div>`}
          ${unplaced.length ? html`
            <div class="unplaced">
              <strong>${t("positions_without_coordinates")}</strong>
              ${unplaced.map((item) => html`<div class="unplaced-item">${this.wineLabel(item) || (t("empty_position"))}</div>`)}
            </div>
          ` : nothing}
        ` : html`<p class="muted">${t("no_racks")}</p>`}
        ${rackItemsWithUnknownRack.length ? html`
          <div class="warning">${rackItemsWithUnknownRack.length} ${t("missing_rack")}</div>
        ` : nothing}
      </ha-card>
    `;
  }

  getCardSize(): number {
    return 5;
  }

  getGridOptions() {
    return {
      columns: 12,
      min_columns: 6,
      rows: 5,
      min_rows: 4,
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ploc-cellar-rack-card": PlocCellarRackCard;
  }
}

(window as Window & { customCards?: Array<Record<string, string>> }).customCards ??= [];
(window as Window & { customCards: Array<Record<string, string>> }).customCards.push({
  type: "ploc-cellar-rack-card",
  name: "Ploc Cellar Rack",
  description: "Visualize physical rack positions and assigned wines.",
});
