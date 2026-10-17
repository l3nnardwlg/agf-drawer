export type UnitStatus = 'stored' | 'in_use' | 'loaned' | 'missing' | 'retired';

export interface CableUnit {
  id: string;
  itemId: string;
  unitIdentifier?: string | null;
  serialNumber?: string | null;
  status: UnitStatus;
  storageLocationId?: string | null;
  location_name?: string | null;
  usageLocation?: string | null;
  usage_place?: string | null;
  notes?: string | null;
  version?: number;
  updatedAt?: string;
}

export interface CableItem {
  id: string;
  name: string;
  category?: string;
  connector_a: string;
  connector_b: string;
  connector_a_gender?: string;
  connector_b_gender?: string;
  color?: string;
  length_cm?: number | null;
  cable_standard?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  notes?: string;
  tags?: string[];
  reference_code?: string;
  total: number;
  stored: number;
  in_use: number;
  loaned: number;
  missing: number;
  retired?: number;
  units?: CableUnit[];
  storageLocationName?: string;
  createdAt?: string;
}

export interface StorageLocation {
  id: string;
  name: string;
  type: 'ROOM' | 'CABINET' | 'DRAWER' | 'SHELF' | 'BOX' | 'RACK' | 'COMPARTMENT' | 'OTHER';
  parentId?: string | null;
  description?: string | null;
  sortOrder?: number;
  unitCount?: number;
  childCount?: number;
  children?: StorageLocation[];
}

export interface MovementItem {
  id: string;
  action: string;
  title: string;
  item_name?: string;
  unit_name?: string;
  from?: string;
  to?: string;
  user_initials: string;
  timestamp: string;
  date_group: string;
}

export interface ConnectorInfo {
  name: string;
  family: string;
  description?: string;
  isCustom?: boolean;
}

export type AppRoute =
  | 'landing'
  | 'features'
  | 'pricing'
  | 'login'
  | 'register'
  | 'dashboard';

export type ActiveView =
  | 'overview'
  | 'cable-finder'
  | 'cable-detail'
  | 'inventory'
  | 'storage'
  | 'in-use'
  | 'movements'
  | 'settings'
  | 'design-system';

export interface UserSession {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role?: string;
  workspaceName?: string;
}
