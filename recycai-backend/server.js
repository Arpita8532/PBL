const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { db, admin } = require('./firebase');

const app = express();
const PORT = 5000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Scoring system for green credits
const SCORES = {
  plastic: 8,
  paper: 5,
  metal: 15,
  ewaste: 20
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

    const pickupRef = db.collection('pickups').doc();
    const pickupData = {
      id: pickupRef.id,
      societyId,
      societyName: societyName || "Unknown Society",
      location: location || "No location provided",
      wasteType,
      weight: 0,
      status: "requested",
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
 * Kabadiwala confirms pickup, updates weight, and calculates credits
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
 * Get all pickups (for Kabadiwala dashboard)
 */
app.get('/pickups', async (req, res) => {
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
  }
};

const WASTE_KEYS = Object.keys(WASTE_INFO);

/**
 * 6. POST /detect-waste
 * Accept an image upload and return waste classification.
 * Currently uses filename-heuristic + random fallback as a stub.
 * Replace the classification logic with real MINC model inference when ready.
 */
app.post('/detect-waste', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided.' });
    }

    // Stub classification: check filename for known keywords, else pick random
    const filename = (req.file.originalname || '').toLowerCase();
    let matched = WASTE_KEYS.find(key => filename.includes(key));
    if (!matched) {
      // Pick a weighted-random category for demo purposes
      matched = WASTE_KEYS[Math.floor(Math.random() * WASTE_KEYS.length)];
    }

    const info = WASTE_INFO[matched];
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
