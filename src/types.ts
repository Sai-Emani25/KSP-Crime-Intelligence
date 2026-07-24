export type CrimeCategory =
  | 'Cybercrime'
  | 'Narcotics'
  | 'Property Crime'
  | 'Violent Crime'
  | 'Financial Fraud'
  | 'Organized Crime'
  | 'Human Trafficking';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Incident {
  incident_id: string;
  fir_number: string;
  district: string;
  police_station: string;
  crime_category: CrimeCategory;
  modus_operandi: string;
  timestamp: string; // ISO String
  time_of_day_hour: number; // 0-23
  latitude: number;
  longitude: number;
  status: 'Under Investigation' | 'Charge Sheeted' | 'Closed' | 'Unsolved';
  severity: 'Minor' | 'Moderate' | 'Severe' | 'Critical';
  loss_amount_inr?: number;
  suspect_ids: string[];
  victim_details?: string;
  beat_name: string;
}

export interface Suspect {
  suspect_id: string;
  full_name: string;
  aliases: string[];
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  risk_score: number; // 0.0 to 10.0
  primary_mo: string;
  associated_network_id: string;
  firs_involved: string[]; // List of FIR numbers
  districts_active: string[];
  status: 'Absconding' | 'In Custody' | 'On Bail' | 'Under Surveillance' | 'Wanted';
  photo_avatar?: string;
  degree_centrality?: number;
}

export type NetworkNodeType =
  | 'Suspect'
  | 'Alias'
  | 'ModusOperandi'
  | 'Location'
  | 'Vehicle'
  | 'BankAccount'
  | 'Victim'
  | 'FIR';

export interface NetworkNode {
  id: string;
  name: string;
  type: NetworkNodeType;
  risk_score?: number;
  district?: string;
  details?: string;
  firs_count?: number;
}

export interface NetworkLink {
  source: string; // Node ID
  target: string; // Node ID
  relationship: string; // e.g. "OPERATES_IN", "SAME_MO", "USED_VEHICLE", "TRANSFERRED_FUNDS", "ACCOMPLICE"
  weight: number; // 1 to 5
}

export interface PoliceStation {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  jurisdiction_area_sqkm: number;
  station_head: string;
  contact_number: string;
  active_incidents_count: number;
  high_risk_beats_count: number;
}

export interface DistrictSummary {
  name: string;
  code: string;
  centerLat: number;
  centerLng: number;
  total_incidents: number;
  cybercrime_rate: number;
  violent_crime_rate: number;
  narcotics_rate: number;
  property_crime_rate: number;
  urbanization_index: number; // 0 - 100
  population_density: number; // per sq km
  literacy_rate: number; // %
  youth_unemployment_rate: number; // %
  poverty_rate: number; // %
  liquor_license_density: number; // per 10k
  risk_rating: RiskLevel;
  trending_direction: 'up' | 'down' | 'stable';
}

export interface AnomalyAlert {
  id: string;
  title: string;
  district: string;
  police_station: string;
  crime_category: CrimeCategory;
  detected_at: string;
  baseline_hourly_avg: number;
  current_spike_value: number;
  percentage_increase: number;
  description: string;
  recommended_action: string;
  severity: 'Warning' | 'High Alert' | 'Critical Spike';
}

export interface PredictiveBeat {
  beat_id: string;
  beat_name: string;
  police_station: string;
  district: string;
  predicted_crime_category: CrimeCategory;
  risk_score: number; // 0 - 100
  time_window: string; // e.g. "22:00 - 03:00"
  forecast_days: 'Next 7 Days' | 'Next 30 Days';
  contributing_factors: string[];
  recommended_patrol_units: number;
}

export interface AIAnalysisRequest {
  query?: string;
  district?: string;
  category?: CrimeCategory;
  timeframe?: string;
  suspect_id?: string;
}

export interface UserRole {
  title: string;
  name: string;
  badge_number: string;
  jurisdiction: string;
  level: 'State DGP Command' | 'District SP' | 'Inspector SHO' | 'SCRB Analyst';
}
