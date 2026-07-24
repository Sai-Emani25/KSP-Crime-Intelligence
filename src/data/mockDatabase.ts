import {
  Incident,
  Suspect,
  NetworkNode,
  NetworkLink,
  AnomalyAlert,
  PredictiveBeat,
  CrimeCategory,
} from '../types';

export const MOCK_SUSPECTS: Suspect[] = [
  {
    suspect_id: 'SUS-8091',
    full_name: 'Imran "Shadow" Pasha',
    aliases: ['Imran Khan', 'Shadow_BLR', 'Pasha Bhai', 'CyberKing_99'],
    gender: 'Male',
    age: 34,
    risk_score: 9.4,
    primary_mo: 'SIM-Swapping & WhatsApp Digital Arrest Scam',
    associated_network_id: 'NET-CYBER-01',
    firs_involved: ['FIR-2026-BLR-0091', 'FIR-2026-BLR-0142', 'FIR-2026-MYS-0033'],
    districts_active: ['Bengaluru Urban', 'Mysuru', 'Dakshina Kannada (Mangaluru)'],
    status: 'Absconding',
    degree_centrality: 0.88,
  },
  {
    suspect_id: 'SUS-8092',
    full_name: 'Venkatesh "Spanner" Gowda',
    aliases: ['Venky', 'Auto Gowda', 'Old Airport Venkat'],
    gender: 'Male',
    age: 41,
    risk_score: 8.7,
    primary_mo: 'Inter-district Commercial Burglary & Safe Cracking',
    associated_network_id: 'NET-PROP-03',
    firs_involved: ['FIR-2026-BLR-0312', 'FIR-2026-BEL-0110', 'FIR-2026-HUB-0089'],
    districts_active: ['Bengaluru Urban', 'Belagavi', 'Hubballi-Dharwad'],
    status: 'Wanted',
    degree_centrality: 0.74,
  },
  {
    suspect_id: 'SUS-8093',
    full_name: 'Dr. Sameer Ahmed (BAMS)',
    aliases: ['Doctor', 'Pharma Sam', 'Coastal Connect'],
    gender: 'Male',
    age: 38,
    risk_score: 9.1,
    primary_mo: 'MDMA / Hydroponic Weed Darknet Supply via Courier',
    associated_network_id: 'NET-NARCO-02',
    firs_involved: ['FIR-2026-MNG-0044', 'FIR-2026-UDU-0012', 'FIR-2026-BLR-0201'],
    districts_active: ['Dakshina Kannada (Mangaluru)', 'Udupi', 'Bengaluru Urban'],
    status: 'Under Surveillance',
    degree_centrality: 0.82,
  },
  {
    suspect_id: 'SUS-8094',
    full_name: 'Ramesh "Ranga" Reddy',
    aliases: ['Reddy Anna', 'Gold Ranga', 'Silk Board Ranga'],
    gender: 'Male',
    age: 45,
    risk_score: 7.8,
    primary_mo: 'Hawala Gold Transport & Extortion Racket',
    associated_network_id: 'NET-FIN-04',
    firs_involved: ['FIR-2026-BLR-0415', 'FIR-2026-KLB-0021'],
    districts_active: ['Bengaluru Urban', 'Kalaburagi'],
    status: 'On Bail',
    degree_centrality: 0.65,
  },
  {
    suspect_id: 'SUS-8095',
    full_name: 'Nisha "Cipher" Fernandes',
    aliases: ['Nisha_FX', 'CryptoQueen_90', 'Ananya Sharma'],
    gender: 'Female',
    age: 29,
    risk_score: 9.6,
    primary_mo: 'Fake Stock Trading App & Crypto Laundering',
    associated_network_id: 'NET-CYBER-01',
    firs_involved: ['FIR-2026-BLR-0091', 'FIR-2026-BLR-0512'],
    districts_active: ['Bengaluru Urban'],
    status: 'Absconding',
    degree_centrality: 0.91,
  },
  {
    suspect_id: 'SUS-8096',
    full_name: 'Basavaraj "Blade" Patil',
    aliases: ['Blade Basa', 'Patil Bhai', 'Border Blade'],
    gender: 'Male',
    age: 36,
    risk_score: 8.2,
    primary_mo: 'Highway Armed Robbery & Vehicle Hijacking',
    associated_network_id: 'NET-PROP-03',
    firs_involved: ['FIR-2026-BEL-0110', 'FIR-2026-KLB-0056'],
    districts_active: ['Belagavi', 'Kalaburagi'],
    status: 'Wanted',
    degree_centrality: 0.71,
  },
];

export const MOCK_NETWORK_GRAPH = {
  nodes: [
    // Suspects
    { id: 'SUS-8091', name: 'Imran Pasha', type: 'Suspect', risk_score: 9.4, district: 'Bengaluru Urban', firs_count: 3 },
    { id: 'SUS-8095', name: 'Nisha Fernandes', type: 'Suspect', risk_score: 9.6, district: 'Bengaluru Urban', firs_count: 2 },
    { id: 'SUS-8092', name: 'Venkatesh Gowda', type: 'Suspect', risk_score: 8.7, district: 'Belagavi', firs_count: 3 },
    { id: 'SUS-8093', name: 'Dr. Sameer Ahmed', type: 'Suspect', risk_score: 9.1, district: 'Dakshina Kannada (Mangaluru)', firs_count: 3 },
    { id: 'SUS-8094', name: 'Ramesh Reddy', type: 'Suspect', risk_score: 7.8, district: 'Bengaluru Urban', firs_count: 2 },

    // Aliases & Identities
    { id: 'ALIAS-01', name: 'CyberKing_99 (Telegram)', type: 'Alias', details: 'Used in 14 defrauded accounts' },
    { id: 'ALIAS-02', name: 'Ananya_Trade_Desk', type: 'Alias', details: 'Fake SEBI Advisor Handle' },
    { id: 'ALIAS-03', name: 'Pharma Sam (Signal)', type: 'Alias', details: 'Encrypted drug delivery' },

    // Modus Operandi (MO)
    { id: 'MO-01', name: 'WhatsApp "Digital Arrest" Fraud', type: 'ModusOperandi', details: 'Fake CBI/Police video calls demanding money' },
    { id: 'MO-02', name: 'USDT Crypto Laundering Node', type: 'ModusOperandi', details: 'Tron blockchain wallet auto-splitter' },
    { id: 'MO-03', name: 'Night Window Grille Shearing', type: 'ModusOperandi', details: 'Hydraulic cutter used on commercial shops' },
    { id: 'MO-04', name: 'Darknet Postal Dispatch', type: 'ModusOperandi', details: 'SpeedPost with forged Aadhaar IDs' },

    // Bank Accounts & IMEIs
    { id: 'BANK-302', name: 'Canara Bank A/C ...9842', type: 'BankAccount', details: 'Mule Account (Whitefield Branch)' },
    { id: 'BANK-303', name: 'HDFC A/C ...1104', type: 'BankAccount', details: 'Mule Account (Koramangala Branch)' },
    { id: 'IMEI-901', name: 'IMEI 86429104821...', type: 'Vehicle', details: 'Samsung S21 Ultra - Swapped 12 SIMs' },

    // Locations & Hotspots
    { id: 'LOC-101', name: 'Whitefield Tech Park Block-C', type: 'Location', district: 'Bengaluru Urban', details: 'Victim High Density Hub' },
    { id: 'LOC-102', name: 'Panambur Port Warehouse', type: 'Location', district: 'Dakshina Kannada (Mangaluru)', details: 'Contraband Staging Safehouse' },
    { id: 'LOC-103', name: 'NH-48 Belagavi Toll Plaza', type: 'Location', district: 'Belagavi', details: 'Vehicle Escape Route' },

    // FIRs
    { id: 'FIR-2026-BLR-0091', name: 'FIR-2026-BLR-0091', type: 'FIR', district: 'Bengaluru Urban', details: 'Whitefield Cybercrime PS | Loss: ₹42 Lakhs' },
    { id: 'FIR-2026-BLR-0142', name: 'FIR-2026-BLR-0142', type: 'FIR', district: 'Bengaluru Urban', details: 'Koramangala PS | Loss: ₹18 Lakhs' },
    { id: 'FIR-2026-MNG-0044', name: 'FIR-2026-MNG-0044', type: 'FIR', district: 'Dakshina Kannada (Mangaluru)', details: 'Pandeshwar PS | Commercial Narcotics' },
    { id: 'FIR-2026-BEL-0110', name: 'FIR-2026-BEL-0110', type: 'FIR', district: 'Belagavi', details: 'Belagavi APMC PS | ₹28 Lakh Jewelry Safe' },
  ] as NetworkNode[],

  links: [
    { source: 'SUS-8091', target: 'SUS-8095', relationship: 'CO_CONSPIRATOR', weight: 5 },
    { source: 'SUS-8091', target: 'ALIAS-01', relationship: 'USES_HANDLE', weight: 4 },
    { source: 'SUS-8095', target: 'ALIAS-02', relationship: 'USES_HANDLE', weight: 4 },
    { source: 'SUS-8091', target: 'MO-01', relationship: 'PRIMARY_TACTIC', weight: 5 },
    { source: 'SUS-8095', target: 'MO-02', relationship: 'PRIMARY_TACTIC', weight: 5 },
    { source: 'SUS-8091', target: 'BANK-302', relationship: 'BENEFICIARY', weight: 4 },
    { source: 'SUS-8095', target: 'BANK-303', relationship: 'BENEFICIARY', weight: 4 },
    { source: 'BANK-302', target: 'MO-02', relationship: 'FUNDS_ROUTED_TO', weight: 5 },
    { source: 'BANK-303', target: 'MO-02', relationship: 'FUNDS_ROUTED_TO', weight: 5 },
    { source: 'SUS-8091', target: 'FIR-2026-BLR-0091', relationship: 'NAMED_ACCUSED', weight: 5 },
    { source: 'SUS-8095', target: 'FIR-2026-BLR-0091', relationship: 'NAMED_ACCUSED', weight: 5 },
    { source: 'FIR-2026-BLR-0091', target: 'LOC-101', relationship: 'CRIME_SCENE', weight: 3 },
    { source: 'SUS-8091', target: 'IMEI-901', relationship: 'DEVICE_REGISTERED', weight: 4 },

    // Property Burglar Network
    { source: 'SUS-8092', target: 'MO-03', relationship: 'PRIMARY_TACTIC', weight: 5 },
    { source: 'SUS-8092', target: 'FIR-2026-BEL-0110', relationship: 'NAMED_ACCUSED', weight: 5 },
    { source: 'FIR-2026-BEL-0110', target: 'LOC-103', relationship: 'ESCAPE_PATH', weight: 4 },

    // Narcotics Network
    { source: 'SUS-8093', target: 'ALIAS-03', relationship: 'USES_HANDLE', weight: 4 },
    { source: 'SUS-8093', target: 'MO-04', relationship: 'PRIMARY_TACTIC', weight: 5 },
    { source: 'SUS-8093', target: 'FIR-2026-MNG-0044', relationship: 'NAMED_ACCUSED', weight: 5 },
    { source: 'FIR-2026-MNG-0044', target: 'LOC-102', relationship: 'STAGING_AREA', weight: 4 },
  ] as NetworkLink[],
};

export const MOCK_ANOMALIES: AnomalyAlert[] = [
  {
    id: 'ANOM-2026-01',
    title: 'Unusual Spike in Fake Police Call Cyber Frauds',
    district: 'Bengaluru Urban',
    police_station: 'Whitefield CEN Cybercrime PS',
    crime_category: 'Cybercrime',
    detected_at: '2026-07-24T08:15:00Z',
    baseline_hourly_avg: 1.8,
    current_spike_value: 9.4,
    percentage_increase: 422,
    description: 'Automated telemetry flagged 18 complaints in 3 hours reporting spoofed TRAI/CBI WhatsApp video calls asking for instant bank transfers.',
    recommended_action: 'Issue targeted SMS advisory to IT corridor cell towers and freeze mule bank accounts in Whitefield branch.',
    severity: 'Critical Spike',
  },
  {
    id: 'ANOM-2026-02',
    title: 'Synthetic Cannabinoid / MDMA Courier Interceptions',
    district: 'Dakshina Kannada (Mangaluru)',
    police_station: 'Pandeshwar PS (Mangaluru Town)',
    crime_category: 'Narcotics',
    detected_at: '2026-07-24T06:30:00Z',
    baseline_hourly_avg: 0.4,
    current_spike_value: 3.1,
    percentage_increase: 675,
    description: '3 consecutive postal parcel seizures containing high-purity Dutch MDMA pills concealed inside electronic speakers.',
    recommended_action: 'Deploy drug-sniffing canine unit at Mangaluru Head Post Office & coordinate with Customs SCRB desk.',
    severity: 'High Alert',
  },
  {
    id: 'ANOM-2026-03',
    title: 'Commercial Safe Breaches via Hydraulic Shearing',
    district: 'Belagavi',
    police_station: 'Belagavi APMC PS',
    crime_category: 'Property Crime',
    detected_at: '2026-07-23T23:45:00Z',
    baseline_hourly_avg: 0.8,
    current_spike_value: 4.2,
    percentage_increase: 425,
    description: '4 wholesale agro-mardi shops broken into between 01:00 and 03:30 AM using identical heavy hydraulic tool MO.',
    recommended_action: 'Set up overnight checkposts along NH-48 towards Maharashtra border.',
    severity: 'Warning',
  },
];

export const MOCK_PREDICTIVE_BEATS: PredictiveBeat[] = [
  {
    beat_id: 'BEAT-BLR-12',
    beat_name: 'Tech Corridor Beat 4 (Outer Ring Road)',
    police_station: 'Koramangala PS',
    district: 'Bengaluru Urban',
    predicted_crime_category: 'Cybercrime',
    risk_score: 92,
    time_window: '11:00 - 17:00',
    forecast_days: 'Next 7 Days',
    contributing_factors: [
      'High density of young tech workers',
      'Recent active phishing SIM-swap wave in pin code 560103',
      'Increased UPI transactions at pub/café clusters',
    ],
    recommended_patrol_units: 3,
  },
  {
    beat_id: 'BEAT-BLR-07',
    beat_name: 'Whitefield Export Zone Beat',
    police_station: 'Whitefield CEN Cybercrime PS',
    district: 'Bengaluru Urban',
    predicted_crime_category: 'Financial Fraud',
    risk_score: 88,
    time_window: '09:00 - 14:00',
    forecast_days: 'Next 7 Days',
    contributing_factors: [
      'High density of high-income tech professionals',
      'Fake trading application targeted social media ads',
      'Historical payday fraud spikes',
    ],
    recommended_patrol_units: 2,
  },
  {
    beat_id: 'BEAT-MYS-03',
    beat_name: 'Palace Heritage Market Beat',
    police_station: 'Lashkar Police Station',
    district: 'Mysuru',
    predicted_crime_category: 'Property Crime',
    risk_score: 76,
    time_window: '18:00 - 22:00',
    forecast_days: 'Next 7 Days',
    contributing_factors: [
      'Weekend tourist footfall surge',
      'Unlit parking pockets near Devaraja Market',
      'Active pickpocket gang flagged on transit camera',
    ],
    recommended_patrol_units: 2,
  },
  {
    beat_id: 'BEAT-MNG-09',
    beat_name: 'Panambur Port Coastal Patrol',
    police_station: 'Pandeshwar PS (Mangaluru Town)',
    district: 'Dakshina Kannada (Mangaluru)',
    predicted_crime_category: 'Narcotics',
    risk_score: 85,
    time_window: '23:00 - 04:00',
    forecast_days: 'Next 7 Days',
    contributing_factors: [
      'Night cargo vessel arrivals',
      'Isolated beach road access points',
      'Historical darknet courier drop locations',
    ],
    recommended_patrol_units: 4,
  },
];

// Seed detailed incidents
const DETAILED_INCIDENTS_SEED: Incident[] = [
  {
    incident_id: 'INC-2026-001',
    fir_number: 'FIR-2026-BLR-0091',
    district: 'Bengaluru Urban',
    police_station: 'Whitefield CEN Cybercrime PS',
    crime_category: 'Cybercrime',
    modus_operandi: 'WhatsApp Digital Arrest Fake CBI Extortion',
    timestamp: '2026-07-24T07:30:00Z',
    time_of_day_hour: 7,
    latitude: 12.9698,
    longitude: 77.75,
    status: 'Under Investigation',
    severity: 'Critical',
    loss_amount_inr: 4200000,
    suspect_ids: ['SUS-8091', 'SUS-8095'],
    victim_details: 'Senior Engineering Manager at IT Firm (Age 48)',
    beat_name: 'Whitefield Tech Corridor Beat 1',
  },
  {
    incident_id: 'INC-2026-002',
    fir_number: 'FIR-2026-BLR-0142',
    district: 'Bengaluru Urban',
    police_station: 'Koramangala PS',
    crime_category: 'Cybercrime',
    modus_operandi: 'SIM Swap & OTP Bypass on NetBanking',
    timestamp: '2026-07-24T02:15:00Z',
    time_of_day_hour: 2,
    latitude: 12.9352,
    longitude: 77.6245,
    status: 'Under Investigation',
    severity: 'Severe',
    loss_amount_inr: 1800000,
    suspect_ids: ['SUS-8091'],
    victim_details: 'Healthcare Executive (Age 39)',
    beat_name: 'Koramangala 8th Block Beat',
  },
  {
    incident_id: 'INC-2026-003',
    fir_number: 'FIR-2026-MNG-0044',
    district: 'Dakshina Kannada (Mangaluru)',
    police_station: 'Pandeshwar PS (Mangaluru Town)',
    crime_category: 'Narcotics',
    modus_operandi: 'MDMA Postal parcel consignment via foreign courier',
    timestamp: '2026-07-23T21:40:00Z',
    time_of_day_hour: 21,
    latitude: 12.861,
    longitude: 74.838,
    status: 'Charge Sheeted',
    severity: 'Critical',
    loss_amount_inr: 3500000,
    suspect_ids: ['SUS-8093'],
    victim_details: 'Public State Community Risk',
    beat_name: 'Panambur Port Coastal Patrol',
  },
  {
    incident_id: 'INC-2026-004',
    fir_number: 'FIR-2026-BEL-0110',
    district: 'Belagavi',
    police_station: 'Belagavi APMC PS',
    crime_category: 'Property Crime',
    modus_operandi: 'Hydraulic shears used on commercial gold safe',
    timestamp: '2026-07-23T01:30:00Z',
    time_of_day_hour: 1,
    latitude: 15.871,
    longitude: 74.521,
    status: 'Under Investigation',
    severity: 'Severe',
    loss_amount_inr: 2800000,
    suspect_ids: ['SUS-8092', 'SUS-8096'],
    victim_details: 'Jewelry Wholesale Trader',
    beat_name: 'Belagavi Agro Market Beat',
  },
  {
    incident_id: 'INC-2026-005',
    fir_number: 'FIR-2026-MYS-0033',
    district: 'Mysuru',
    police_station: 'Lashkar Police Station',
    crime_category: 'Violent Crime',
    modus_operandi: 'Armed Robbery with lethal weapon at commercial showroom',
    timestamp: '2026-07-22T22:10:00Z',
    time_of_day_hour: 22,
    latitude: 12.3112,
    longitude: 76.654,
    status: 'Closed',
    severity: 'Severe',
    loss_amount_inr: 950000,
    suspect_ids: ['SUS-8091'],
    victim_details: 'Showroom Cashier',
    beat_name: 'Palace Heritage Market Beat',
  },
  {
    incident_id: 'INC-2026-006',
    fir_number: 'FIR-2026-BLR-0512',
    district: 'Bengaluru Urban',
    police_station: 'Indiranagar PS',
    crime_category: 'Financial Fraud',
    modus_operandi: 'Fake SEBI Crypto Trading Platform Scam',
    timestamp: '2026-07-22T14:20:00Z',
    time_of_day_hour: 14,
    latitude: 12.9784,
    longitude: 77.6408,
    status: 'Under Investigation',
    severity: 'Critical',
    loss_amount_inr: 8500000,
    suspect_ids: ['SUS-8095'],
    victim_details: 'Retired PSU General Manager',
    beat_name: 'Indiranagar 100ft Road Beat',
  },
];

// Helper to generate 5,000 synthetic incident points distributed across Karnataka for smooth analytics
export function generateLargeDataset(): Incident[] {
  const incidents: Incident[] = [...DETAILED_INCIDENTS_SEED];
  
  const categories: CrimeCategory[] = [
    'Cybercrime',
    'Narcotics',
    'Property Crime',
    'Violent Crime',
    'Financial Fraud',
    'Organized Crime',
    'Human Trafficking',
  ];

  const districtsConfig = [
    { name: 'Bengaluru Urban', lat: 12.9716, lng: 77.5946, spread: 0.12, count: 2100 },
    { name: 'Mysuru', lat: 12.2958, lng: 76.6394, spread: 0.08, count: 650 },
    { name: 'Belagavi', lat: 15.8497, lng: 74.4977, spread: 0.09, count: 600 },
    { name: 'Dakshina Kannada (Mangaluru)', lat: 12.9141, lng: 74.856, spread: 0.07, count: 550 },
    { name: 'Hubballi-Dharwad', lat: 15.3647, lng: 75.124, spread: 0.06, count: 450 },
    { name: 'Kalaburagi', lat: 17.3297, lng: 76.8343, spread: 0.08, count: 400 },
    { name: 'Shivamogga', lat: 13.9299, lng: 75.5681, spread: 0.06, count: 300 },
  ];

  let idCounter = 7;

  districtsConfig.forEach((dist) => {
    for (let i = 0; i < dist.count; i++) {
      // Deterministic pseudo-randomness based on loop index
      const r1 = Math.sin(idCounter * 12.9898 + i) * 43758.5453 % 1;
      const r2 = Math.cos(idCounter * 78.233 + i) * 43758.5453 % 1;
      const r3 = Math.abs(Math.sin(i * 3.14159));
      
      const lat = dist.lat + (r1 - 0.5) * dist.spread;
      const lng = dist.lng + (r2 - 0.5) * dist.spread;
      
      const categoryIdx = Math.floor(Math.abs(r1 * 10)) % categories.length;
      const category = categories[categoryIdx];
      
      const hour = Math.floor(Math.abs(r2 * 24));
      
      // Days offset from current date
      const daysAgo = Math.floor(r3 * 90);
      const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      date.setHours(hour, Math.floor(r1 * 60));

      incidents.push({
        incident_id: `INC-2026-${String(idCounter).padStart(5, '0')}`,
        fir_number: `FIR-2026-${dist.name.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(4, '0')}`,
        district: dist.name,
        police_station: `${dist.name} Station ${Math.floor(i % 5) + 1}`,
        crime_category: category,
        modus_operandi: `${category} incident involving localized pattern #${(i % 20) + 1}`,
        timestamp: date.toISOString(),
        time_of_day_hour: hour,
        latitude: Number(lat.toFixed(5)),
        longitude: Number(lng.toFixed(5)),
        status: i % 4 === 0 ? 'Under Investigation' : i % 3 === 0 ? 'Charge Sheeted' : 'Closed',
        severity: i % 10 === 0 ? 'Critical' : i % 4 === 0 ? 'Severe' : 'Moderate',
        loss_amount_inr: category === 'Cybercrime' || category === 'Financial Fraud' ? Math.floor(r1 * 5000000) : 0,
        suspect_ids: i % 8 === 0 ? ['SUS-8091'] : i % 12 === 0 ? ['SUS-8092'] : [],
        beat_name: `${dist.name} Beat #${(i % 12) + 1}`,
      });

      idCounter++;
    }
  });

  return incidents;
}
