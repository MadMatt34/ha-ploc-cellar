import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { HomeAssistant, PlocCellarCardConfig } from "./types";
import { translate, type TranslationKey } from "./translations";

@customElement("ploc-cellar-card-editor")
export class PlocCellarCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private config?: PlocCellarCardConfig;

  private readonly schema = [
    {
      name: "config_entry_id",
      required: true,
      selector: { config_entry: { integration: "ploc_cellar" } },
    },
    { name: "title", selector: { text: {} } },
  ];

  setConfig(config: PlocCellarCardConfig): void {
    this.config = config;
  }

  private computeLabel = (schema: { name: string }): string => {
    const key: TranslationKey =
      schema.name === "config_entry_id" ? "editor_configuration" : "editor_title";
    return translate(this.hass?.language ?? "en", key);
  };

  private computeHelper = (schema: { name: string }): string | undefined => {
    if (schema.name === "config_entry_id") {
      return translate(this.hass?.language ?? "en", "editor_configuration_helper");
    }
    if (schema.name === "title") {
      return translate(this.hass?.language ?? "en", "editor_title_helper");
    }
    return undefined;
  };

  private valueChanged(event: CustomEvent<{ value: Record<string, unknown> }>): void {
    event.stopPropagation();
    const config = { ...this.config, ...event.detail.value } as PlocCellarCardConfig;
    this.config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected render() {
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this.config ?? {}}
        .schema=${this.schema}
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
        @value-changed=${this.valueChanged}
      ></ha-form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ploc-cellar-card-editor": PlocCellarCardEditor;
  }
}
