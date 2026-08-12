import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client lazily / securely
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not set. Gemini endpoints will return simulated diagnostic results.');
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'AeroFix MRO Backend', timestamp: new Date().toISOString() });
  });

  // AI Maintenance Assistant endpoint
  app.post('/api/ai/troubleshoot', async (req, res) => {
    try {
      const { query, aircraftModel, systemName, faultHistory } = req.body;

      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query parameter is required' });
      }

      const ai = getGenAI();

      if (!ai) {
        // Structured fallback response if API key is not configured in environment
        return res.json({
          disclaimer: 'DEMO / SIMULATED AI DIAGNOSTIC - VERIFY WITH AUTHORITATIVE MANUFACTURE DOCUMENTATION (AMM/FIM) BEFORE MAINTENANCE',
          aircraftModel: aircraftModel || 'Boeing 737-800',
          symptomSummary: query,
          clarifyingQuestions: [
            'Did the defect occur during taxi, takeoff, or engine startup?',
            'Are there associated EICAS or ECAM warning messages reported in the flight deck log?',
            'Have hydraulic pressure gauges readings fluctuated or remained steady?'
          ],
          possibleCauses: [
            { cause: 'Nose Wheel Steering Actuator internal seal leakage or binding', probability: 'High (45%)', system: 'ATA 32 Landing Gear' },
            { cause: 'Steering Metering Valve LVDT feedback sensor decalibration', probability: 'Medium (30%)', system: 'ATA 32 Landing Gear' },
            { cause: 'Hydraulic System B pressure supply fluctuation or clogged return filter', probability: 'Medium (15%)', system: 'ATA 29 Hydraulic Power' },
            { cause: 'Handwheel / Rudder Pedal steering interconnect cable tension fault', probability: 'Low (10%)', system: 'ATA 27 Flight Controls' }
          ],
          mostLikelyCause: 'Nose Wheel Steering Actuator internal seal leakage or Metering Valve LVDT decalibration',
          recommendedSteps: [
            '1. Perform visual inspection of the nose gear well for hydraulic fluid leakage around actuator ports.',
            '2. Connect ground hydraulic cart and pressurize System B to 3,000 PSI.',
            '3. Perform NWS operational test per AMM Task 32-51-00-100-801.',
            '4. Measure resistance across LVDT terminals at connector P402 using multimeter.',
            '5. If feedback signal is out of tolerance (+/- 0.25V), replace steering metering valve transducer.'
          ],
          requiredTools: [
            'Multimeter Fluke 87V (Calibrated)',
            'Ground Hydraulic Servicing Cart (3,000 PSI)',
            'Nose Landing Gear Towing Pin / Safety Lock',
            'Pressure Gauge 0-5,000 PSI calibrated'
          ],
          relevantSystems: ['ATA 32 - Landing Gear', 'ATA 29 - Hydraulic Power', 'ATA 31 - Indicating System'],
          possibleComponents: ['Nose Steering Actuator', 'Metering Valve Module', 'Steering LVDT Sensor', 'Hydraulic Return Filter'],
          relatedPartNumbers: ['65-46321-12', '3251-882-01', 'CAGE 73389-9801', 'HYD-FIL-322'],
          applicableTasks: ['AMM 32-51-00-100-801 (NWS Operational Test)', 'AMM 32-51-11-400-801 (Steering Actuator R&I)'],
          requiredInspections: ['Inspector Sign-off on Hydraulic Leak Test', 'FOD check in gear well', 'Rudder pedal centering clearance check'],
          safetyWarnings: [
            'WARNING: Ensure Nose Landing Gear Ground Lock Pin is installed before applying hydraulic pressure.',
            'WARNING: High pressure hydraulic fluid hazard (3,000 PSI). Wear eye protection and fluid-resistant gloves.',
            'CAUTION: Do not turn nose wheel beyond 78 degrees with steering depressurization valve unlatched.'
          ],
          approvedReferences: [
            'Boeing 737-800 AMM Chapter 32-51-00',
            'Boeing 737 FIM Task 32-51-01',
            'Service Bulletin SB 737-32A1182'
          ]
        });
      }

      const prompt = `
You are an expert commercial aviation MRO systems engineer and maintenance specialist.
The user is asking about an aircraft maintenance defect or system issue:
User Query: "${query}"
Context Aircraft: ${aircraftModel || 'Not specified'}
Context System: ${systemName || 'Not specified'}
${faultHistory ? `Fault Context: ${JSON.stringify(faultHistory)}` : ''}

Provide a structured technical response in strict JSON format matching this schema:
{
  "disclaimer": "AI-GENERATED TECHNICAL RECOMMENDATION - MUST BE VERIFIED AGAINST AUTHORITATIVE AMM/FIM/IPC DOCUMENTATION PRIOR TO MAINTENANCE EXECUTION.",
  "symptomSummary": "string",
  "clarifyingQuestions": ["string", "string"],
  "possibleCauses": [
    {"cause": "string", "probability": "High/Medium/Low", "system": "ATA Chapter"}
  ],
  "mostLikelyCause": "string",
  "recommendedSteps": ["string"],
  "requiredTools": ["string"],
  "relevantSystems": ["string"],
  "possibleComponents": ["string"],
  "relatedPartNumbers": ["string"],
  "applicableTasks": ["string"],
  "requiredInspections": ["string"],
  "safetyWarnings": ["string"],
  "approvedReferences": ["string"]
}

Important Safety Directive:
- Include accurate technical terminology, ATA chapter numbers, realistic troubleshooting steps, and safety warnings.
- Explicitly emphasize safety protocols (tagout, ground locks, pressure safety, electrical discharge).
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const rawText = response.text || '{}';
      try {
        const parsed = JSON.parse(rawText);
        return res.json(parsed);
      } catch (e) {
        return res.json({ textResponse: rawText, raw: true });
      }
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({
        error: 'Failed to execute AI troubleshooting query',
        details: error.message,
      });
    }
  });

  // Vite development middleware vs Static Production
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
    console.log(`AeroFix Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
