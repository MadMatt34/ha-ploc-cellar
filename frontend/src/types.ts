export interface HomeAssistant {
  language: string;
  callWS<T>(message: Record<string, unknown>): Promise<T>;
}

export interface PlocCellarCardConfig {
  type: string;
  config_entry_id: string;
  title?: string;
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
  bottles: number | null;
  bottles_in_cellar: number;
  vintage: number | null;
  appellation: string | null;
  color: string | null;
  color_rgb: [number, number, number] | null;
  region: string | null;
  country: string | null;
  grapes: string | null;
  cuvee: string | null;
  bottle_format: string | null;
  bottle_volume_l: number | null;
  locations: Array<{
    rack: string;
    rack_id: string;
    row: number | null;
    column: number | null;
  }>;
}

export interface InventoryResponse {
  stale: boolean;
  last_sync: string | null;
  stock_reconstruction_complete: boolean;
  total_bottles: number;
  total_stock_bottles: number | null;
  stocked_wines: number;
  wine_references: number | null;
  rack_count: number;
  total_positions: number;
  occupied_positions: number;
  empty_positions: number;
  racks: Rack[];
  rack_items: RackItem[];
  wines: Wine[];
}
