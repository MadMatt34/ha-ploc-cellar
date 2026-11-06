import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type {
  HomeAssistant,
  InventoryResponse,
  PlocCellarCardConfig,
  Wine,
} from "./types";

@customElement("ploc-cellar-card")
export class PlocCellarCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private config?: PlocCellarCardConfig;
  @state() private inventory?: InventoryResponse;
  @state() private loading = false;
  @state() private error?: string;
  @state() private search = "";

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
    input { box-sizing: border-box; width: 100%; padding: 10px 12px; margin: 4px 0 12px; color: var(--primary-text-color); background: var(--card-background-color); border: 1px solid var(--divider-color); border-radius: 8px; }
    .wine { display: flex; justify-content: space-between; gap: 12px; padding: 12px 0; border-top: 1px solid var(--divider-color); }
    .wine-name { font-weight: 500; }
    .details { color: var(--secondary-text-color); font-size: .85rem; margin-top: 3px; }
    .count { white-space: nowrap; font-weight: 600; }
    .warning { color: var(--warning-color); padding: 8px 0; }
    .error { color: var(--error-color); padding: 8px 0; }
    @media (max-width: 420px) { ha-card { padding: 12px; } }
  `;

  setConfig(config: PlocCellarCardConfig): void {
    if (!config.config_entry_id) {
      throw new Error("Please set config_entry_id for the Ploc Cellar connection.");
    }
    this.config = config;
    this.inventory = undefined;
    this.error = undefined;
    void this.refresh();
  }

  protected updated(): void {
    if (this.hass && this.config && !this.inventory && !this.loading && !this.error) {
      void this.refresh();
    }
  }

  private async refresh(): Promise<void> {
    if (!this.hass || !this.config || this.loading) return;
    this.loading = true;
    this.error = undefined;
    try {
      this.inventory = await this.hass.callWS<InventoryResponse>({
        type: "call_service",
        domain: "ploc_cellar",
        service: "get_inventory",
        service_data: { config_entry_id: this.config.config_entry_id },
        return_response: true,
      });
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.loading = false;
    }
  }

  private get filteredWines(): Wine[] {
    const query = this.search.trim().toLocaleLowerCase();
    const wines = this.inventory?.wines ?? [];
    if (!query) return wines;
    return wines.filter((wine) =>
      [wine.name, wine.domain, wine.appellation, wine.region, wine.country, wine.grapes]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase()
        .includes(query),
    );
  }

  private formatSync(value: string | null): string {
    if (!value) return this.hass?.language === "fr" ? "Jamais" : "Never";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : new Intl.DateTimeFormat(this.hass?.language ?? undefined, {
          dateStyle: "short",
          timeStyle: "short",
        }).format(date);
  }

  protected render() {
    const fr = (this.hass?.language ?? "").startsWith("fr");
    const data = this.inventory;
    const title = this.config?.title ?? (fr ? "Cave Ploc" : "Ploc Cellar");
    return html`
      <ha-card>
        <header>
          <h2>${title}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>
            ${this.loading ? (fr ? "Chargement…" : "Loading…") : (fr ? "Actualiser" : "Refresh")}
          </button>
        </header>
        ${this.error ? html`<div class="error">${this.error}</div>` : nothing}
        ${data ? html`
          ${data.stale ? html`<div class="warning">${fr ? "Données potentiellement obsolètes : la dernière synchronisation a échoué." : "Data may be stale: the latest synchronization failed."}</div>` : nothing}
          <div class="summary">
            <div class="metric"><span class="value">${data.total_bottles}</span><span class="label">${fr ? "Bouteilles en cave" : "Bottles in cellar"}</span></div>
            <div class="metric"><span class="value">${data.total_stock_bottles ?? "—"}</span><span class="label">${fr ? "Stock reconstitué" : "Reconstructed stock"}</span></div>
            <div class="metric"><span class="value">${data.rack_count}</span><span class="label">${fr ? "Casiers" : "Racks"}</span></div>
            <div class="metric"><span class="value">${data.empty_positions}</span><span class="label">${fr ? "Places libres" : "Empty positions"}</span></div>
          </div>
          ${!data.stock_reconstruction_complete ? html`<div class="warning">${fr ? "Reconstitution du stock en cours : seules les quantités physiques sont disponibles." : "Stock reconstruction is incomplete: only physical quantities are available."}</div>` : nothing}
          <div class="muted">${fr ? "Dernière synchronisation réussie" : "Last successful synchronization"} : ${this.formatSync(data.last_sync)}</div>
          <input aria-label=${fr ? "Rechercher un vin" : "Search wines"} .value=${this.search} @input=${(event: Event) => { this.search = (event.target as HTMLInputElement).value; }} placeholder=${fr ? "Rechercher un vin…" : "Search wines…"} />
          ${this.filteredWines.map((wine) => html`
            <div class="wine">
              <div>
                <div class="wine-name">${wine.name}</div>
                <div class="details">${[wine.domain, wine.vintage, wine.appellation, wine.region].filter(Boolean).join(" · ")}</div>
              </div>
              <div class="count">${wine.bottles ?? wine.bottles_in_cellar}</div>
            </div>
          `)}
          ${this.filteredWines.length === 0 ? html`<div class="muted">${fr ? "Aucun vin correspondant." : "No matching wines."}</div>` : nothing}
        ` : nothing}
      </ha-card>
    `;
  }

  getCardSize(): number {
    return 5;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ploc-cellar-card": PlocCellarCard;
  }
}

(window as Window & { customCards?: Array<Record<string, string>> }).customCards ??= [];
(window as Window & { customCards: Array<Record<string, string>> }).customCards.push({
  type: "ploc-cellar-card",
  name: "Ploc Cellar",
  description: "Inventory overview for the Ploc Cellar integration.",
});
