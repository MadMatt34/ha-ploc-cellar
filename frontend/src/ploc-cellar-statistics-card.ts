import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type {
  HomeAssistant,
  InventoryResponse,
  PlocCellarCardConfig,
  Wine,
} from "./types";
import { translate, translatePicker, type TranslationKey } from "./translations";

interface DistributionItem {
  name: string;
  bottles: number;
  wines: number;
}

type DistributionField =
  | "color"
  | "region"
  | "appellation"
  | "vintage"
  | "bottle_format";

@customElement("ploc-cellar-statistics-card")
export class PlocCellarStatisticsCard extends LitElement {
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
    h2 { margin: 0; font-size: 1.2rem; font-weight: 500; }
    button { color: var(--primary-text-color); background: var(--secondary-background-color); border: 0; border-radius: 8px; padding: 8px 12px; cursor: pointer; }
    button[disabled] { opacity: .5; cursor: default; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; margin: 14px 0; }
    .metric { background: var(--secondary-background-color); border-radius: 10px; padding: 12px; min-width: 0; }
    .value { display: block; font-size: 1.4rem; font-weight: 600; }
    .muted, .metric-label { color: var(--secondary-text-color); font-size: .85rem; }
    .groups { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 12px; margin-top: 14px; }
    .group { min-width: 0; border: 1px solid var(--divider-color); border-radius: 10px; padding: 12px; }
    h3 { margin: 0 0 12px; font-size: 1rem; font-weight: 500; }
    .item { display: grid; gap: 5px; margin: 10px 0; }
    .item-heading { display: flex; justify-content: space-between; gap: 8px; font-size: .88rem; }
    .item-name { min-width: 0; overflow-wrap: anywhere; }
    .item-value { flex: 0 0 auto; font-variant-numeric: tabular-nums; font-weight: 600; }
    .bar { height: 8px; border-radius: 999px; overflow: hidden; background: var(--divider-color); }
    .bar-fill { height: 100%; border-radius: inherit; background: var(--primary-color); }
    .item-meta { color: var(--secondary-text-color); font-size: .75rem; }
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
    const generation = ++this.requestGeneration;
    this.loading = true;
    this.error = undefined;
    try {
      const result = await hass.callWS<{ response: InventoryResponse }>({
        type: "call_service",
        domain: "ploc_cellar",
        service: "get_inventory",
        service_data: { config_entry_id: config.config_entry_id },
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

  private getBottleCount(wine: Wine): number {
    if (this.inventory?.stock_reconstruction_complete) {
      return wine.bottles ?? wine.bottles_in_cellar;
    }
    return wine.bottles_in_cellar;
  }

  private distribution(field: DistributionField): DistributionItem[] {
    const t = (key: TranslationKey): string =>
      translate(this.hass?.language ?? "en", key);
    const grouped = new Map<string, DistributionItem>();
    for (const wine of this.inventory?.wines ?? []) {
      const rawValue = wine[field];
      const name = rawValue === null || rawValue === ""
        ? t("statistics_unknown")
        : String(rawValue);
      const current = grouped.get(name) ?? { name, bottles: 0, wines: 0 };
      current.bottles += this.getBottleCount(wine);
      current.wines += 1;
      grouped.set(name, current);
    }

    const sorted = [...grouped.values()].sort(
      (a, b) => b.bottles - a.bottles || a.name.localeCompare(b.name, this.hass?.language),
    );
    if (sorted.length <= 8) return sorted;

    const visible = sorted.slice(0, 7);
    const other = sorted.slice(7).reduce<DistributionItem>(
      (total, item) => ({
        name: t("statistics_other"),
        bottles: total.bottles + item.bottles,
        wines: total.wines + item.wines,
      }),
      { name: t("statistics_other"), bottles: 0, wines: 0 },
    );
    return [...visible, other];
  }

  private renderDistribution(field: DistributionField, titleKey: TranslationKey) {
    const t = (key: TranslationKey): string =>
      translate(this.hass?.language ?? "en", key);
    const items = this.distribution(field);
    const max = Math.max(1, ...items.map((item) => item.bottles));

    return html`
      <section class="group">
        <h3>${t(titleKey)}</h3>
        ${items.length ? items.map((item) => {
          const percentage = Math.round((item.bottles / max) * 100);
          return html`
            <div class="item">
              <div class="item-heading">
                <span class="item-name">${item.name}</span>
                <span class="item-value">${item.bottles} ${t("bottles_short")}</span>
              </div>
              <div class="bar" role="progressbar"
                aria-label=${item.name}
                aria-valuemin="0"
                aria-valuemax=${max}
                aria-valuenow=${item.bottles}>
                <div class="bar-fill" style=${`width: ${percentage}%`}></div>
              </div>
              <div class="item-meta">${item.wines} ${t("statistics_references")}</div>
            </div>
          `;
        }) : html`<p class="muted">${t("statistics_empty")}</p>`}
      </section>
    `;
  }

  protected render() {
    const t = (key: TranslationKey): string =>
      translate(this.hass?.language ?? "en", key);
    const data = this.inventory;
    const wines = data?.wines ?? [];
    const totalBottles = wines.reduce((total, wine) => total + this.getBottleCount(wine), 0);

    return html`
      <ha-card>
        <header>
          <h2>${this.config?.title ?? t("statistics_title")}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>
            ${this.loading ? t("loading") : t("refresh")}
          </button>
        </header>
        ${this.error ? html`<div class="error">${this.error}</div>` : nothing}
        ${!this.config?.config_entry_id
          ? html`<div class="muted">${t("select_config")}</div>`
          : nothing}
        ${data?.stale ? html`<div class="warning">${t("stale")}</div>` : nothing}
        ${data ? html`
          ${!data.stock_reconstruction_complete
            ? html`<div class="warning">${t("reconstruction_incomplete")}</div>`
            : nothing}
          <div class="summary">
            <div class="metric">
              <span class="value">${totalBottles}</span>
              <span class="metric-label">${t("statistics_bottles")}</span>
            </div>
            <div class="metric">
              <span class="value">${wines.length}</span>
              <span class="metric-label">${t("statistics_references")}</span>
            </div>
          </div>
          <div class="groups">
            ${this.renderDistribution("color", "statistics_color")}
            ${this.renderDistribution("region", "statistics_region")}
            ${this.renderDistribution("appellation", "statistics_appellation")}
            ${this.renderDistribution("vintage", "statistics_vintage")}
            ${this.renderDistribution("bottle_format", "statistics_format")}
          </div>
        ` : nothing}
      </ha-card>
    `;
  }

  getCardSize(): number {
    return 7;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: 7, min_rows: 4 };
  }
}

declare global {
  interface Window {
    customCards?: Array<Record<string, string>>;
  }

  interface HTMLElementTagNameMap {
    "ploc-cellar-statistics-card": PlocCellarStatisticsCard;
  }
}

window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-statistics-card",
  name: translatePicker("picker_statistics_name"),
  description: translatePicker("picker_statistics_description"),
});
