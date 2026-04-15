const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const os = require('os');
const { db, admin } = require('./firebase');

const app = express();
const PORT = 5000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Scoring system for green credits (credits per kg) — matches README spec
const SCORES = {
  plastic:      8,
  paper:        5,
  metal:        15,
  glass:        6,
  ewaste:       20,
  fabric:       7,
  wood:         4,
  food:         3,
  rubber:       5,
  batteries:    25,
  chemicals:    35,
  medical:      30,
  construction: 3
};

/**
 * 1. POST /society/register
 * Register a new society
 */
app.post('/society/register', async (req, res) => {
  try {
    const { name, location } = req.body;
    if (!name || !location) {
      return res.status(400).json({ error: "Name and location are required." });
    }

    const societyRef = db.collection('societies').doc();
    const societyData = {
      id: societyRef.id,
      name,
      location,
      totalCredits: 0
    };

    await societyRef.set(societyData);
    res.status(201).json(societyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 2. POST /pickup/request
 * Request a pickup for a society
 */
app.post('/pickup/request', async (req, res) => {
  try {
    const { societyId, societyName, location, wasteType } = req.body;
    if (!societyId || !wasteType) {
      return res.status(400).json({ error: "societyId and wasteType are required." });
    }

    // Randomly assign to a Recycling Collector to ensure distribution
    const collectorsSnapshot = await db.collection('collectors').get();
    let assignedCollectorId = 'UNASSIGNED';
    let assignedCollectorName = 'Unassigned Collector';

    if (!collectorsSnapshot.empty) {
      const recyclingCollectors = collectorsSnapshot.docs;
      const randomDoc = recyclingCollectors[Math.floor(Math.random() * recyclingCollectors.length)];
      assignedCollectorId = randomDoc.id;
      assignedCollectorName = randomDoc.data().name;
    }

    const pickupRef = db.collection('pickups').doc();
    const pickupData = {
      id: pickupRef.id,
      societyId,
      societyName: societyName || "Unknown Society",
      location: location || "No location provided",
      wasteType,
      weight: 0,
      status: "requested",
      collectorId: assignedCollectorId,
      collectorName: assignedCollectorName,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await pickupRef.set(pickupData);
    res.status(201).json(pickupData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 3. POST /pickup/confirm
 * Recycling Collector confirms pickup, updates weight, and calculates credits
 */
app.post('/pickup/confirm', async (req, res) => {
  try {
    const { pickupId, weight } = req.body;
    if (!pickupId || weight === undefined) {
      return res.status(400).json({ error: "pickupId and weight are required." });
    }

    const pickupRef = db.collection('pickups').doc(pickupId);
    const pickupDoc = await pickupRef.get();

    if (!pickupDoc.exists) {
      return res.status(404).json({ error: "Pickup not found." });
    }

    const pickupData = pickupDoc.data();
    const wasteType = pickupData.wasteType.toLowerCase();
    
    // Calculate credits
    const scorePerKg = SCORES[wasteType] || 0;
    const credits = weight * scorePerKg;

    // Update pickup status
    await pickupRef.update({
      status: "completed",
      weight: weight,
      creditsAwarded: credits
    });

    // Update society total credits
    const societyId = pickupData.societyId;
    const societyRef = db.collection('societies').doc(societyId);
    
    await societyRef.update({
      totalCredits: admin.firestore.FieldValue.increment(credits)
    });

    res.status(200).json({
      message: "Pickup confirmed",
      creditsGenerated: credits
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 4. GET /pickups
 * Get all pickups (for Recycling Collector dashboard). Can be filtered by collectorId.
 */
app.get('/pickups', async (req, res) => {
  try {
    const { collectorId } = req.query;
    const pickupsSnapshot = await db.collection('pickups')
      .orderBy('createdAt', 'desc')
      .get();

    let pickups = pickupsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (collectorId) {
      pickups = pickups.filter(p => p.collectorId === collectorId);
    }

    res.status(200).json(pickups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 4b. GET /pickup/list
 * Alias for /pickups (used by society dashboard)
 */
app.get('/pickup/list', async (req, res) => {
  try {
    const pickupsSnapshot = await db.collection('pickups')
      .orderBy('createdAt', 'desc')
      .get();

    const pickups = pickupsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(pickups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 5. GET /leaderboard
 * Get societies sorted by totalCredits descending
 */
app.get('/leaderboard', async (req, res) => {
  try {
    const societiesSnapshot = await db.collection('societies')
      .orderBy('totalCredits', 'desc')
      .get();

    const leaderboard = societiesSnapshot.docs.map(doc => ({
      name: doc.data().name,
      totalCredits: doc.data().totalCredits
    }));

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 5b. GET /stats/citywide
 * Get aggregated municipal statistics
 */
app.get('/stats/citywide', async (req, res) => {
  try {
    // 1. Total waste diverted (sum of weight from completed pickups)
    const pickupsSnapshot = await db.collection('pickups')
      .where('status', '==', 'completed')
      .get();
    
    let totalWaste = 0;
    pickupsSnapshot.forEach(doc => {
      totalWaste += (doc.data().weight || 0);
    });

    // 2. Active societies (count)
    const societiesSnapshot = await db.collection('societies').get();
    const activeSocieties = societiesSnapshot.size;

    // 3. Green credits generated (sum of totalCredits from all societies)
    let totalCredits = 0;
    societiesSnapshot.forEach(doc => {
      totalCredits += (doc.data().totalCredits || 0);
    });

    res.status(200).json({
      wasteDiverted: totalWaste,
      activeSocieties: activeSocieties,
      greenCredits: totalCredits
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Multer config for image uploads (stored in memory) ──
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed.'));
  }
});

// ── Waste classification knowledge base ──
const WASTE_INFO = {
  plastic: {
    wasteType: 'Plastic',
    decompositionTime: '450 years',
    recyclingSuggestion: 'Rinse and place in the plastic recycling stream. Avoid mixing with food-contaminated plastics.'
  },
  paper: {
    wasteType: 'Paper / Cardboard',
    decompositionTime: '2–6 weeks',
    recyclingSuggestion: 'Keep dry and flatten cardboard boxes. Remove any plastic tape before recycling.'
  },
  metal: {
    wasteType: 'Metal',
    decompositionTime: '200–500 years',
    recyclingSuggestion: 'Rinse aluminium cans and tin containers. Crush to save space and place in metal recycling.'
  },
  glass: {
    wasteType: 'Glass',
    decompositionTime: '1 million+ years',
    recyclingSuggestion: 'Separate by color if possible. Remove caps and rinse before placing in glass recycling.'
  },
  ewaste: {
    wasteType: 'E-Waste',
    decompositionTime: 'Does not decompose naturally',
    recyclingSuggestion: 'Take to an authorized e-waste collection center. Never dispose in regular waste.'
  },
  fabric: {
    wasteType: 'Fabric / Textile',
    decompositionTime: '20–200 years',
    recyclingSuggestion: 'Donate usable clothing. Torn fabrics can be recycled into industrial rags or insulation.'
  },
  wood: {
    wasteType: 'Wood',
    decompositionTime: '10–15 years',
    recyclingSuggestion: 'Untreated wood can be composted or repurposed. Treated wood should go to specialized facilities.'
  },
  food: {
    wasteType: 'Organic / Food Waste',
    decompositionTime: '1–6 months',
    recyclingSuggestion: 'Compost at home or use municipal composting services. Avoid mixing with dry recyclables.'
  },
  rubber: {
    wasteType: 'Rubber',
    decompositionTime: '50–80 years',
    recyclingSuggestion: 'Old tyres and rubber items should be taken to designated rubber recycling points. Never burn rubber.'
  },
  batteries: {
    wasteType: 'Batteries',
    decompositionTime: '100 years+',
    recyclingSuggestion: 'Return batteries to retail drop-off points or certified hazardous waste facilities. Never bin in regular waste.'
  },
  chemicals: {
    wasteType: 'Hazardous / Chemical Waste',
    decompositionTime: 'Varies (decades to centuries)',
    recyclingSuggestion: 'Hand over to a licensed hazardous waste handler. Never pour chemicals down the drain or into soil.'
  },
  construction: {
    wasteType: 'Construction & Demolition Debris',
    decompositionTime: 'Varies (concrete 100+ years)',
    recyclingSuggestion: 'Segregate concrete, bricks, and metals on-site. Use authorised C&D waste processors for disposal.'
  },
  medical: {
    wasteType: 'Medical / Bio-hazard Waste',
    decompositionTime: 'Varies (100+ years for plastics)',
    recyclingSuggestion: 'Use red-bag/yellow-bag segregation per hospital waste rules. Never mix medical waste with regular recycling.'
  }
};

const WASTE_KEYS = Object.keys(WASTE_INFO);

/**
 * 6. POST /detect-waste
 * Accept an image upload and return waste classification using Python inference script.
 */
app.post('/detect-waste', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided.' });
    }

    // Save uploaded file buffer to a temporary file
    const tempFilePath = path.join(os.tmpdir(), `upload-${Date.now()}-${Math.round(Math.random() * 1000)}.jpg`);
    fs.writeFileSync(tempFilePath, req.file.buffer);

    // Call predict.py
    const scriptPath = path.join(__dirname, 'waste_detector', 'predict.py');
    const pythonProcess = spawnSync('python', [scriptPath, tempFilePath], { encoding: 'utf-8' });

    // Clean up temporary file
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    if (pythonProcess.error) {
      console.error("Failed to start python process:", pythonProcess.error);
      return res.status(500).json({ error: 'Failed to run waste detection model.' });
    }

    // Parse Python stdout
    let predictionResult;
    try {
      // Find JSON block in stdout in case of TF logs
      const outputLines = pythonProcess.stdout.trim().split('\n');
      const jsonLine = outputLines[outputLines.length - 1]; // Assume last line is the JSON
      predictionResult = JSON.parse(jsonLine);
    } catch (e) {
      console.error("Failed to parse python output. stdout:", pythonProcess.stdout, "stderr:", pythonProcess.stderr);
      return res.status(500).json({ error: 'Failed to parse model output.' });
    }

    if (predictionResult.error) {
      console.error("Python script error:", predictionResult.error);
      return res.status(500).json({ error: predictionResult.error });
    }

    const predictedClass = predictionResult.predicted_class || '';

    // Map Python prediction to WASTE_INFO keys
    const classMapping = {
      'plastic':      'plastic',
      'paper':        'paper',
      'cardboard':    'paper',
      'metal':        'metal',
      'glass':        'glass',
      'fabric':       'fabric',
      'textile':      'fabric',
      'wood':         'wood',
      'food':         'food',
      'foliage':      'food',
      'organic':      'food',
      'rubber':       'rubber',
      'tyre':         'rubber',
      'battery':      'batteries',
      'batteries':    'batteries',
      'chemical':     'chemicals',
      'hazardous':    'chemicals',
      'construction': 'construction',
      'debris':       'construction',
      'ewaste':       'ewaste',
      'electronic':   'ewaste'
    };

    let matchedKey = classMapping[predictedClass.toLowerCase()];
    
    // If we couldn't map exactly, try guessing or give a generic response
    let info;
    if (matchedKey && WASTE_INFO[matchedKey]) {
      info = { ...WASTE_INFO[matchedKey], confidence: predictionResult.confidence };
    } else {
      info = {
        wasteType: predictedClass.charAt(0).toUpperCase() + predictedClass.slice(1),
        decompositionTime: 'Varies',
        recyclingSuggestion: 'Please check local municipal guidelines for proper disposal.',
        confidence: predictionResult.confidence
      };
    }

    res.status(200).json(info);
  } catch (error) {
    console.error("Express Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ── EcoBot: AI Chat via Ollama (local LLM, no API key needed) ──

const ECOLOOP_SYSTEM_PROMPT = `
You are EcoBot, the intelligent recycling assistant embedded inside EcoLoop —
a smart municipal recycling platform used by housing societies in India.

YOUR PERSONALITY:
- Friendly, concise, and encouraging. Never preachy or lecture-y.
- You speak like a knowledgeable friend, not a textbook.
- Use "your society", "your pickup", "your credits" — make it personal.
- Keep answers under 4 sentences unless the user asks for detail.
- Occasionally use a single relevant emoji at the end of a message (not every message).

YOUR KNOWLEDGE DOMAIN:
1. Waste disposal rules — what goes in which category (plastic, metal, paper,
   e-waste, glass, batteries, textiles, organic, medical, chemicals, rubber)
2. Green Credits system — explain how credits are earned per kg per waste type:
   Plastic=8, Paper=5, Metal=15, E-Waste=20, Glass=6, Batteries=25,
   Textiles=7, Organic=3, Rubber=5, Medical=30, Chemicals=35
3. Environmental impact — CO₂ savings, why recycling each material matters
4. EcoLoop features — how to request a pickup, track history, read the leaderboard,
   earn badges (First Step, Consistent, Green Champion, E-Warrior, Century Club)
5. Indian recycling context — local kabadiwala system, municipal rules,
   Swachh Bharat guidelines, common Indian household waste patterns

STRICT RULES:
- If asked something outside recycling, waste, environment, or EcoLoop features,
  say: "I'm specialized in recycling and EcoLoop — ask me anything about that!"
- Never make up credit values or statistics. Use only the values listed above.
- Never give medical advice even if "medical waste" is mentioned.
- If unsure, say "I'm not certain — I'd recommend checking with your local
  municipal authority for that specific item."

EXAMPLE GOOD RESPONSES:
User: "Can I recycle a broken phone?"
You: "Yes! Broken phones are e-waste and earn you 20 credits/kg — the highest
standard rate. Just schedule an e-waste pickup from your dashboard. ♻️"

User: "What's the point of recycling paper?"
You: "Recycling 1 kg of paper saves 0.9 kg of CO₂ and reduces deforestation.
Your society gets 5 credits/kg too — small weight adds up fast over a month."
`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        stream: true,
        messages: [
          { role: 'system', content: ECOLOOP_SYSTEM_PROMPT },
          ...(messages || [])
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      res.write(`data: ${JSON.stringify({ error: `Ollama error: ${errText}` })}\n\n`);
      res.end();
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) { res.end(); break; }
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.message?.content) {
            res.write(`data: ${JSON.stringify({ token: parsed.message.content })}\n\n`);
          }
        } catch (_) { /* ignore parse errors on partial chunks */ }
      }
    }
  } catch (err) {
    console.error('EcoBot /api/chat error:', err.message);
    res.write(`data: ${JSON.stringify({ error: 'Could not reach Ollama. Is it running on localhost:11434?' })}\n\n`);
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
