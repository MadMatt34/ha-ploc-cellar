import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./ploc-cellar-rack-card";
import "./ploc-cellar-inventory-card";
import "./ploc-cellar-card-editor";

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
  color?: string;
}

type DistributionField =
  | "color"
  | "region"
  | "appellation"
  | "vintage"
  | "bottle_format";

const CHART_COLORS = [
  "#D55E00",
  "#0072B2",
  "#009E73",
  "#E69F00",
  "#CC79A7",
  "#56B4E9",
  "#F0E442",
  "#6A3D9A",
];

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
    .groups { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 12px; margin-top: 14px; }
    .group { min-width: 0; border: 1px solid var(--divider-color); border-radius: 10px; padding: 12px; }
    .group-title { margin: 0 0 12px; font-size: 1rem; font-weight: 500; }
    .chart-content { display: grid; grid-template-columns: minmax(112px, .85fr) minmax(0, 1.15fr); gap: 12px; align-items: center; }
    .donut { position: relative; display: grid; place-items: center; width: 100%; max-width: 150px; aspect-ratio: 1; justify-self: center; }
    .donut-chart { display: block; width: 100%; height: 100%; overflow: visible; }
    .donut-segment { fill: none; stroke-width: 16; pointer-events: stroke; cursor: help; }
    .donut-segment:focus { outline: none; }
    .donut-center { position: absolute; inset: 17%; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 50%; background: var(--card-background-color, var(--ha-card-background, #fff)); pointer-events: none; }
    .donut-total { color: var(--primary-text-color); font-size: 1rem; font-weight: 600; font-variant-numeric: tabular-nums; }
    .donut-caption { color: var(--secondary-text-color); font-size: .48rem; }
    .legend { display: grid; gap: 4px; min-width: 0; }
    .legend-item { display: grid; grid-template-columns: 10px minmax(0, 1fr) auto; align-items: center; column-gap: 7px; row-gap: 2px; font-size: .82rem; }
    .legend-swatch { width: 9px; height: 9px; border-radius: 50%; }
    .legend-name { min-width: 0; overflow-wrap: anywhere; }
    .legend-value { white-space: nowrap; font-variant-numeric: tabular-nums; font-weight: 600; }
    .legend-meta { grid-column: 2 / 4; margin-top: -2px; color: var(--secondary-text-color); font-size: .72rem; }
    .warning { color: var(--warning-color); padding: 8px 0; }
    .error { color: var(--error-color); padding: 8px 0; }
    @media (max-width: 420px) {
      ha-card { padding: 12px; }
      .chart-content { grid-template-columns: minmax(96px, .7fr) minmax(0, 1.3fr); gap: 8px; }
      .legend { gap: 6px; }
      .legend-item { font-size: .78rem; }
    }
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
      if (field === "color" && wine.color_rgb && !current.color) {
        const rgb = wine.color_rgb.map((component) =>
          Math.min(255, Math.max(0, Math.round(component))),
        );
        current.color = `rgb(${rgb.join(", ")})`;
      }
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
    const total = items.reduce((sum, item) => sum + item.bottles, 0);
    let offset = 0;
    const segments = items
      .filter((item) => item.bottles > 0)
      .map((item, index) => {
        const start = offset;
        offset += (item.bottles / total) * 100;
        return {
          ...item,
          start,
          end: offset,
          color: item.color ?? CHART_COLORS[index % CHART_COLORS.length],
        };
      });
    const chartLabel = items
      .map((item) => `${item.name}: ${this.formatNumber(item.bottles)}`)
      .join(", ");

    return html`
      <section class="group">
        <h3 class="group-title">${t(titleKey)}</h3>
        ${total > 0 ? html`
          <div class="chart-content">
            <div class="donut">
              <svg class="donut-chart" viewBox="0 0 100 100"
                role="img" aria-label=${t(titleKey) + ": " + chartLabel}>
                ${segments.map((item) => {
                  const circumference = 2 * Math.PI * 42;
                  const segmentLength = ((item.end - item.start) / 100) * circumference;
                  const dashArray = `${segmentLength} ${circumference - segmentLength}`;
                  const dashOffset = -(item.start / 100) * circumference;
                  const tooltip = `${item.name}: ${this.formatNumber(item.bottles)} ${t("statistics_bottles")} (${new Intl.NumberFormat(this.hass?.language ?? undefined, { style: "percent", maximumFractionDigits: 1 }).format(item.bottles / total)}), ${this.formatNumber(item.wines)} ${t("statistics_references")}`;
                  return html`
                    <circle class="donut-segment" cx="50" cy="50" r="42"
                      style=${`stroke: ${item.color}`}
                      stroke-dasharray=${dashArray}
                      stroke-dashoffset=${dashOffset}>
                      <title>${tooltip}</title>
                    </circle>
                  `;
                })}
              </svg>
              <div class="donut-center">
                <span class="donut-total">${this.formatNumber(total)}</span>
                <span class="donut-caption">${t("statistics_bottles")}</span>
              </div>
            </div>
            <div class="legend">
              ${segments.map((item) => html`
                <div class="legend-item">
                  <span class="legend-swatch" style=${`background: ${item.color}`}></span>
                  <span class="legend-name">${item.name}</span>
                  <span class="legend-value">${this.formatNumber(item.bottles)}</span>
                  <span class="legend-meta">
                    ${new Intl.NumberFormat(this.hass?.language ?? undefined, {
                      style: "percent",
                      maximumFractionDigits: 1,
                    }).format(item.bottles / total)}
                    · ${this.formatNumber(item.wines)} ${t("statistics_references")}
                  </span>
                </div>
              `)}
            </div>
          </div>
        ` : html`<p class="muted">${t("statistics_empty")}</p>`}
      </section>
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
    const wines = data?.wines ?? [];
    const referenceCount = data?.wine_references ?? wines.length;

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
            ${this.metric(referenceCount, t("stocked_references"))}
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
          ${data.positions_with_unknown_wine > 0
            ? html`<div class="warning">${t("statistics_unknown_wine_positions").replace("{count}", this.formatNumber(data.positions_with_unknown_wine))}</div>`
            : nothing}
          <section class="section">
            <h3 class="section-title">${t("statistics_title")}</h3>
            <p class="muted">${t("statistics_distribution_scope")}</p>
            <div class="groups">
              ${this.renderDistribution("color", "statistics_color")}
              ${this.renderDistribution("region", "statistics_region")}
              ${this.renderDistribution("appellation", "statistics_appellation")}
              ${this.renderDistribution("vintage", "statistics_vintage")}
              ${this.renderDistribution("bottle_format", "statistics_format")}
            </div>
          </section>
          <div class="muted section">${t("last_sync")}: ${this.formatSync(data.last_sync)}</div>
        ` : nothing}
      </ha-card>
    `;
  }

  getCardSize(): number {
    return 12;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }
}

/**
 * Keep existing dashboards using the former statistics card type working.
 * Both card types now render the unified overview and statistics experience.
 */
@customElement("ploc-cellar-statistics-card")
export class PlocCellarStatisticsCard extends PlocCellarCard {}

declare global {
  interface Window {
    customCards?: Array<Record<string, string>>;
  }

  interface HTMLElementTagNameMap {
    "ploc-cellar-card": PlocCellarCard;
    "ploc-cellar-statistics-card": PlocCellarStatisticsCard;
  }
}

window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-card",
  name: translatePicker("picker_overview_name"),
  description: translatePicker("picker_overview_description"),
});
