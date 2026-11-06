export interface HomeAssistant {
  language: string;
  callWS<T>(message: Record<string, unknown>): Promise<T>;
}

export interface PlocCellarCardConfig {
  type: string;
  config_entry_id?: string;
  title?: string;
  show_occupancy?: boolean;
  show_diagnostics?: boolean;
  show_statistics?: boolean;
  show_statistics_legends?: boolean;
}

export interface Rack {
  id: string;
  name: string;
}

export interface RackItem {
  id: string;
  rack_id: string;
  wine_id: string | null;
  row: number | null;
  column: number | null;
}

export interface Wine {
  id: string;
  name: string;
  domain: string | null;
  /** Reconstructed stock; null until the Orders snapshot is complete. */
  bottles: number | null;
  effective_stock: number | null;
  /** Raw PLOUD stock value, retained for information only. */
  ploud_bottles: number;
  bottles_in_cellar: number;
  unlocated_bottles: number | null;
  purchased: number | null;
  consumed: number | null;
  movement_balance: number | null;
  calculated_stock: number | null;
  negative_movement_bottles: number | null;
  physical_surplus_bottles: number | null;
  vintage: number | null;
  appellation: string | null;
  color: string | null;
  color_rgb: [number, number, number] | null;
  classification: string | null;
  region: string | null;
  country: string | null;
  grapes: string | null;
  cuvee: string | null;
  comment: string | null;
  alcohol_percent: number | null;
  service_temperature_min: number | null;
  service_temperature_max: number | null;
  bottle_format: string | null;
  bottle_volume_l: number | null;
  ploud_pid: string | null;
  locations: Array<{
    rack: string;
    rack_id: string;
    row: number | null;
    column: number | null;
  }>;
}

export interface WineDiagnostic {
  id: string;
  name: string;
  domain: string | null;
  vintage: number | null;
  purchased: number | null;
  consumed: number | null;
  movement_balance: number | null;
  bottles_in_cellar: number;
  effective_stock: number;
  unlocated_bottles: number | null;
  negative_movement_bottles: number | null;
  physical_surplus_bottles: number | null;
}

export interface InventoryResponse {
  stale: boolean;
  last_sync: string | null;
  stock_reconstruction_complete: boolean;
  total_bottles: number;
  total_stock_bottles: number | null;
  stocked_wines: number;
  wine_references: number | null;
  total_positions: number;
  empty_positions: number;
  occupied_positions: number;
  unlocated_wines: number | null;
  unlocated_bottles: number | null;
  negative_movement_wines: number | null;
  negative_movement_bottles: number | null;
  physical_surplus_wines: number | null;
  physical_surplus_bottles: number | null;
  wine_diagnostics: WineDiagnostic[] | null;
  matching_wines: number;
  rack_count: number;
  positions_without_rack: number;
  positions_with_unknown_wine: number;
  orders_without_wine: number | null;
  racks: Rack[];
  rack_items: RackItem[];
  wines: Wine[];
}
