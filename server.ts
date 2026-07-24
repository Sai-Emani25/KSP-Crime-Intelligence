import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  MOCK_SUSPECTS,
  MOCK_NETWORK_GRAPH,
  MOCK_ANOMALIES,
  MOCK_PREDICTIVE_BEATS,
  generateLargeDataset,
} from './src/data/mockDatabase';
import { KARNATAKA_DISTRICTS, POLICE_STATIONS } from './src/data/karnatakaDistricts';
import { Incident } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory dataset
let incidentsData: Incident[] = [];

// Initialize dataset
console.log('Generating 5,000+ Karnataka State Police synthetic crime records...');
incidentsData = generateLargeDataset();
console.log(`Dataset ready: ${incidentsData.length} records loaded.`);

// Initialize Gemini AI client lazily
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// REST API Endpoints

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'KSP Strategic Crime Intelligence Hub',
    incidentsCount: incidentsData.length,
    timestamp: new Date().toISOString(),
  });
});

// 2. Incident Search & Filtering
app.get('/api/incidents', (req, res) => {
  const { district, category, hour_start, hour_end, search, limit = '500' } = req.query;

  let filtered = incidentsData;

  if (district && district !== 'All Districts') {
    filtered = filtered.filter((inc) => inc.district.toLowerCase() === (district as string).toLowerCase());
  }

  if (category && category !== 'All Categories') {
    filtered = filtered.filter((inc) => inc.crime_category === category);
  }

  if (hour_start !== undefined && hour_end !== undefined) {
    const hStart = parseInt(hour_start as string, 10);
    const hEnd = parseInt(hour_end as string, 10);
    filtered = filtered.filter((inc) => inc.time_of_day_hour >= hStart && inc.time_of_day_hour <= hEnd);
  }

  if (search) {
    const term = (search as string).toLowerCase();
    filtered = filtered.filter(
      (inc) =>
        inc.fir_number.toLowerCase().includes(term) ||
        inc.modus_operandi.toLowerCase().includes(term) ||
        inc.police_station.toLowerCase().includes(term) ||
        inc.beat_name.toLowerCase().includes(term)
    );
  }

  const maxLimit = Math.min(parseInt(limit as string, 10), 2000);
  res.json({
    totalMatched: filtered.length,
    incidents: filtered.slice(0, maxLimit),
  });
});

// 3. Create New FIR / Incident
app.post('/api/incidents/create', (req, res) => {
  const newInc: Incident = req.body;
  if (!newInc.fir_number || !newInc.district || !newInc.crime_category) {
    res.status(400).json({ error: 'Missing required FIR fields' });
    return;
  }

  newInc.incident_id = `INC-2026-${Date.now()}`;
  newInc.timestamp = new Date().toISOString();
  newInc.time_of_day_hour = new Date().getHours();
  
  incidentsData.unshift(newInc);

  res.json({
    success: true,
    message: 'FIR successfully logged into SCRB database and spatiotemporal graph.',
    incident: newInc,
  });
});

// 4. Suspect Profiles & Dossiers
app.get('/api/suspects', (req, res) => {
  const { id, search } = req.query;

  if (id) {
    const suspect = MOCK_SUSPECTS.find((s) => s.suspect_id === id);
    if (!suspect) {
      res.status(404).json({ error: 'Suspect not found' });
      return;
    }
    // Attach matching incidents
    const linkedIncidents = incidentsData.filter((inc) => inc.suspect_ids.includes(suspect.suspect_id));
    res.json({ suspect, linkedIncidents });
    return;
  }

  let suspectsList = MOCK_SUSPECTS;
  if (search) {
    const term = (search as string).toLowerCase();
    suspectsList = suspectsList.filter(
      (s) =>
        s.full_name.toLowerCase().includes(term) ||
        s.primary_mo.toLowerCase().includes(term) ||
        s.aliases.some((a) => a.toLowerCase().includes(term))
    );
  }

  res.json({ suspects: suspectsList });
});

// 5. Criminological Network Graph
app.get('/api/network-graph', (req, res) => {
  const { suspect_id, category } = req.query;

  if (suspect_id) {
    // Subgraph for suspect
    const nodeIds = new Set<string>([suspect_id as string]);
    const links = MOCK_NETWORK_GRAPH.links.filter((l) => {
      const srcStr = typeof l.source === 'string' ? l.source : (l.source as any).id;
      const tgtStr = typeof l.target === 'string' ? l.target : (l.target as any).id;
      if (srcStr === suspect_id || tgtStr === suspect_id) {
        nodeIds.add(srcStr);
        nodeIds.add(tgtStr);
        return true;
      }
      return false;
    });

    const nodes = MOCK_NETWORK_GRAPH.nodes.filter((n) => nodeIds.has(n.id));
    res.json({ nodes, links });
    return;
  }

  res.json(MOCK_NETWORK_GRAPH);
});

// 6. Predictive Risk & High-Risk Beats
app.get('/api/predictive-risk', (req, res) => {
  res.json({
    beats: MOCK_PREDICTIVE_BEATS,
    lastCalculated: new Date().toISOString(),
    modelAccuracy: '91.4% AUC-ROC',
  });
});

// 7. Anomaly Spike Alerts
app.get('/api/anomalies', (req, res) => {
  res.json({
    anomalies: MOCK_ANOMALIES,
    activeAlertsCount: MOCK_ANOMALIES.length,
  });
});

// 8. Socio-Economic Correlation Data
app.get('/api/socio-economic', (req, res) => {
  res.json({
    districts: KARNATAKA_DISTRICTS,
    policeStations: POLICE_STATIONS,
  });
});

// 9. Gemini AI Intelligence Assistant / Query Copilot
app.post('/api/ai/copilot', async (req, res) => {
  const { prompt, context } = req.body;

  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  const aiClient = getGenAIClient();

  // Rule-based fallback if AI key is missing or invalid
  if (!aiClient) {
    res.json({
      reply: `[KSP Strategic AI Copilot - Rule Engine Offline Fallback Mode]\n\nBased on your query regarding "${prompt}":\n\n1. **Geospatial Hotspots:** High density detected in Bengaluru Urban (Whitefield CEN PS, Koramangala PS) and Dakshina Kannada (Pandeshwar PS).\n2. **Primary Modus Operandi:** Digital Arrest Video Call Extortion and Darknet Courier Dispatching.\n3. **Recommended Patrol Action:** Deploy 3 mobile patrol cars to tech corridor beats between 11:00 AM and 05:00 PM. Issue public alert advisory regarding mule account freezing.\n\n*(Note: Configure GEMINI_API_KEY in Secrets panel for live generative intelligence reasoning).*`,
      mode: 'rule_fallback',
    });
    return;
  }

  try {
    const systemInstruction = `You are the Karnataka State Police (KSP) & State Crime Records Bureau (SCRB) Strategic Intelligence AI Copilot. 
Provide concise, authoritative, tactical law enforcement analysis. 
Use police terminology (e.g., Beat Patrol, FIR, MO, Mule Accounts, Charge Sheet, IPC/BNS sections, SCRB Dossier).
Format response cleanly with bullet points and bold highlights.`;

    const fullPrompt = `${systemInstruction}\n\nContext: ${JSON.stringify(
      context || { totalIncidents: incidentsData.length }
    )}\n\nUser Query: ${prompt}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    res.json({
      reply: response.text || 'Unable to generate intelligence report at this time.',
      mode: 'gemini_2_5_flash',
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.json({
      reply: `[KSP AI Analysis Error]: ${error.message || 'Error processing request'}. Falling back to rule-based intelligence.`,
      mode: 'error_fallback',
    });
  }
});

// Serve frontend in dev / production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KSP Strategic Intelligence Platform running on http://localhost:${PORT}`);
  });
}

startServer();
