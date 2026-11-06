import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./ploc-cellar-rack-card";
import "./ploc-cellar-inventory-card";
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
    .value { display: block; font-size: 1.45rem; font-weight: 600; }
    .label, .muted { color: var(--secondary-text-color); font-size: .85rem; }
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
    if (this.config.config_entry_id) void this.refresh();
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
      if (generation === this.requestGeneration) {
        this.inventory = result.response;
      }
    } catch (error) {
      if (generation === this.requestGeneration) {
        this.error = error instanceof Error ? error.message : String(error);
      }
    } finally {
      if (generation === this.requestGeneration) this.loading = false;
    }
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

  protected render() {
    const t = (key: TranslationKey): string =>
      translate(this.hass?.language ?? "en", key);
    const data = this.inventory;
    const title = this.config?.title ?? t("card_title");
    return html`
      <ha-card>
        <header>
          <h2>${title}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>
            ${this.loading ? t("loading") : t("refresh")}
          </button>
        </header>
        ${this.error ? html`<div class="error">${this.error}</div>` : nothing}
        ${!this.config?.config_entry_id ? html`<div class="muted">${t("select_config")}</div>` : nothing}
        ${data ? html`
          ${data.stale ? html`<div class="warning">${t("stale")}</div>` : nothing}
          <div class="summary">
            <div class="metric"><span class="value">${data.total_bottles}</span><span class="label">${t("bottles_in_cellar")}</span></div>
            <div class="metric"><span class="value">${data.total_stock_bottles ?? "—"}</span><span class="label">${t("reconstructed_stock")}</span></div>
            <div class="metric"><span class="value">${data.rack_count}</span><span class="label">${t("racks")}</span></div>
            <div class="metric"><span class="value">${data.empty_positions}</span><span class="label">${t("empty_positions")}</span></div>
          </div>
          ${!data.stock_reconstruction_complete ? html`<div class="warning">${t("reconstruction_incomplete")}</div>` : nothing}
          <div class="muted">${t("last_sync")} : ${this.formatSync(data.last_sync)}</div>
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
