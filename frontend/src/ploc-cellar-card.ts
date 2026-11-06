import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./ploc-cellar-rack-card";
import "./ploc-cellar-inventory-card";
import "./ploc-cellar-statistics-card";
import "./ploc-cellar-card-editor";

import type {
  HomeAssistant,
  InventoryResponse,
  PlocCellarCardConfig,
} from "./types";
import { translate, translatePicker, type TranslationKey } from "./translations";

@customElement("ploc-cellar-card")
export class PlocCellarCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private config?: PlocCellarCardConfig;
  @state() private inventory?: InventoryResponse;
  @state() private loading = false;
  @state() private error?: string;
  private requestGeneration = 0;

  static styles = css`
    :host { display: block; }
    ha-card { padding: 16px; color: var(--primary-text-color); }
    header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    h2 { margin: 0; font-size: 1.25rem; font-weight: 500; }
    button { color: var(--primary-text-color); background: var(--secondary-background-color); border: 0; border-radius: 8px; padding: 8px 12px; cursor: pointer; }
    button[disabled] { opacity: .5; cursor: default; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 8px; margin: 16px 0; }
    .metric { background: var(--secondary-background-color); border-radius: 10px; padding: 12px; min-width: 0; }
    .value { display: block; font-size: 1.4rem; font-weight: 600; font-variant-numeric: tabular-nums; }
    .label, .muted { color: var(--secondary-text-color); font-size: .85rem; }
    .section { margin-top: 16px; }
    .section-title { margin: 0 0 8px; font-size: .95rem; font-weight: 500; }
    .occupancy-heading { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 6px; font-size: .85rem; }
    .occupancy-bar { height: 9px; border-radius: 999px; overflow: hidden; background: var(--divider-color); }
    .occupancy-fill { height: 100%; border-radius: inherit; background: var(--primary-color); }
    .diagnostics { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; }
    .diagnostic { border: 1px solid var(--divider-color); border-radius: 8px; padding: 10px; min-width: 0; }
    .diagnostic-value { display: block; font-weight: 600; font-variant-numeric: tabular-nums; }
    .warning { color: var(--warning-color); padding: 8px 0; }
    .error { color: var(--error-color); padding: 8px 0; }
    @media (max-width: 420px) { ha-card { padding: 12px; } }
  `;

  static getConfigElement(): HTMLElement {
    return document.createElement("ploc-cellar-card-editor");
  }

  static getStubConfig(): Partial<PlocCellarCardConfig> {
    return {};
  }

  setConfig(config: PlocCellarCardConfig): void {
    this.requestGeneration += 1;
    this.loading = false;
    this.config = config;
    this.inventory = undefined;
    this.error = undefined;
    if (config.config_entry_id) void this.refresh();
  }

  protected updated(): void {
    if (this.hass && this.config && !this.inventory && !this.loading && !this.error) {
      void this.refresh();
    }
  }

  private async refresh(): Promise<void> {
    const hass = this.hass;
    const config = this.config;
    if (!hass || !config?.config_entry_id || this.loading) return;
    const configEntryId = config.config_entry_id;
    const generation = ++this.requestGeneration;
    this.loading = true;
    this.error = undefined;
    try {
      const result = await hass.callWS<{ response: InventoryResponse }>({
        type: "call_service",
        domain: "ploc_cellar",
        service: "get_inventory",
        service_data: { config_entry_id: configEntryId },
        return_response: true,
      });
      if (generation === this.requestGeneration) this.inventory = result.response;
    } catch (error) {
      if (generation === this.requestGeneration) {
        this.error = error instanceof Error ? error.message : String(error);
      }
    } finally {
      if (generation === this.requestGeneration) this.loading = false;
    }
  }

  private formatNumber(value: number): string {
    return new Intl.NumberFormat(this.hass?.language ?? undefined).format(value);
  }

  private formatSync(value: string | null): string {
    if (!value) return translate(this.hass?.language ?? "en", "never");
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : new Intl.DateTimeFormat(this.hass?.language ?? undefined, {
          dateStyle: "short",
          timeStyle: "short",
        }).format(date);
  }

  private metric(value: number | string, label: string) {
    return html`
      <div class="metric">
        <span class="value">${typeof value === "number" ? this.formatNumber(value) : value}</span>
        <span class="label">${label}</span>
      </div>
    `;
  }

  protected render() {
    const t = (key: TranslationKey): string =>
      translate(this.hass?.language ?? "en", key);
    const data = this.inventory;
    const title = this.config?.title ?? t("card_title");
    const occupancy = data && data.total_positions > 0
      ? Math.round((data.occupied_positions / data.total_positions) * 100)
      : 0;
    const diagnostics = data?.stock_reconstruction_complete
      ? [
          { key: "diagnostic_unlocated" as const, value: data.unlocated_bottles ?? 0 },
          { key: "diagnostic_negative" as const, value: data.negative_movement_bottles ?? 0 },
          { key: "diagnostic_surplus" as const, value: data.physical_surplus_bottles ?? 0 },
        ].filter((item) => item.value > 0)
      : [];

    return html`
      <ha-card>
        <header>
          <h2>${title}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>
            ${this.loading ? t("loading") : t("refresh")}
          </button>
        </header>
        ${this.error ? html`<div class="error">${this.error}</div>` : nothing}
        ${!this.config?.config_entry_id
          ? html`<div class="muted">${t("select_config")}</div>`
          : nothing}
        ${data ? html`
          ${data.stale ? html`<div class="warning">${t("stale")}</div>` : nothing}
          <div class="summary">
            ${this.metric(data.total_bottles, t("bottles_in_cellar"))}
            ${this.metric(
              data.total_stock_bottles ?? t("unknown_value"),
              t("reconstructed_stock"),
            )}
            ${this.metric(data.stocked_wines, t("stocked_references"))}
            ${this.metric(data.rack_count, t("racks"))}
          </div>
          <section class="section" aria-label=${t("rack_occupancy")}>
            <div class="occupancy-heading">
              <span>${t("rack_occupancy")}</span>
              <span>${this.formatNumber(data.occupied_positions)} / ${this.formatNumber(data.total_positions)}</span>
            </div>
            <div class="occupancy-bar" role="progressbar"
              aria-label=${t("rack_occupancy")}
              aria-valuemin="0" aria-valuemax=${data.total_positions}
              aria-valuenow=${data.occupied_positions}>
              <div class="occupancy-fill" style=${`width: ${occupancy}%`}></div>
            </div>
            <div class="muted">${t("empty_positions")}: ${this.formatNumber(Math.max(0, data.total_positions - data.occupied_positions))}</div>
          </section>
          ${!data.stock_reconstruction_complete
            ? html`<div class="warning">${t("reconstruction_incomplete")}</div>`
            : nothing}
          ${diagnostics.length ? html`
            <section class="section">
              <h3 class="section-title">${t("inventory_diagnostics")}</h3>
              <div class="diagnostics">
                ${diagnostics.map((item) => html`
                  <div class="diagnostic">
                    <span class="diagnostic-value">${this.formatNumber(item.value)}</span>
                    <span class="label">${t(item.key)}</span>
                  </div>
                `)}
              </div>
            </section>
          ` : nothing}
          <div class="muted section">${t("last_sync")}: ${this.formatSync(data.last_sync)}</div>
        ` : nothing}
      </ha-card>
    `;
  }

  getCardSize(): number {
    return 6;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: 6, min_rows: 4 };
  }
}

declare global {
  interface Window {
    customCards?: Array<Record<string, string>>;
  }

  interface HTMLElementTagNameMap {
    "ploc-cellar-card": PlocCellarCard;
  }
}

window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-card",
  name: translatePicker("picker_overview_name"),
  description: translatePicker("picker_overview_description"),
});
