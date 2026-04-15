/**
 * seedTestUser.js
 * ---------------------------------------------------------------
 * Creates a single, deterministic test society (user) and populates
 * it with 3 months of historical pickup data across all waste types.
 *
 * TEST CREDENTIALS
 * ─────────────────────────────────────────────────────────────────
 *  Society ID   : TEST-SOCIETY-001          ← use this as your login/societyId
 *  Society Name : Green Valley Residency
 *  Password     : GreenVal@123              ← stored in Firestore for reference
 *  Collector ID : COLLECTOR-TEST-01
 * ─────────────────────────────────────────────────────────────────
 *
 * Run once:  node seedTestUser.js
 */

const { db, admin } = require('./firebase');

// ── Scoring table (must match server.js) ──────────────────────────
const SCORES = {
  plastic:      8,
  paper:        5,
  metal:        15,
  glass:        3,
  ewaste:       20,
  fabric:       4,
  wood:         2,
  food:         1,
  rubber:       6,
  batteries:    18,
  chemicals:    25,
  construction: 3
};

// ── Deterministic IDs ─────────────────────────────────────────────
const SOCIETY_ID    = 'TEST-SOCIETY-001';
const COLLECTOR_ID  = 'COLLECTOR-TEST-01';

// ── Historical pickup template data ──────────────────────────────
// 24 pickups spread over ~90 days — realistic weight ranges per category
const HISTORY = [
  // Week 1 (today - 90 days)
  { daysAgo: 90, wasteType: 'plastic',      weight: 32.5, status: 'completed' },
  { daysAgo: 88, wasteType: 'paper',        weight: 18.0, status: 'completed' },
  { daysAgo: 85, wasteType: 'food',         weight: 55.0, status: 'completed' },
  // Week 2
  { daysAgo: 80, wasteType: 'metal',        weight: 14.2, status: 'completed' },
  { daysAgo: 78, wasteType: 'glass',        weight: 22.0, status: 'completed' },
  { daysAgo: 75, wasteType: 'fabric',       weight: 9.5,  status: 'completed' },
  // Week 3
  { daysAgo: 70, wasteType: 'ewaste',       weight: 6.8,  status: 'completed' },
  { daysAgo: 68, wasteType: 'wood',         weight: 40.0, status: 'completed' },
  { daysAgo: 65, wasteType: 'rubber',       weight: 17.0, status: 'completed' },
  // Week 4
  { daysAgo: 60, wasteType: 'batteries',    weight: 4.5,  status: 'completed' },
  { daysAgo: 58, wasteType: 'plastic',      weight: 28.0, status: 'completed' },
  { daysAgo: 55, wasteType: 'chemicals',    weight: 3.2,  status: 'completed' },
  // Week 5 – 6
  { daysAgo: 50, wasteType: 'construction', weight: 85.0, status: 'completed' },
  { daysAgo: 47, wasteType: 'paper',        weight: 21.5, status: 'completed' },
  { daysAgo: 44, wasteType: 'food',         weight: 62.0, status: 'completed' },
  { daysAgo: 40, wasteType: 'metal',        weight: 11.0, status: 'completed' },
  // Week 7 – 8
  { daysAgo: 35, wasteType: 'glass',        weight: 19.5, status: 'completed' },
  { daysAgo: 32, wasteType: 'ewaste',       weight: 8.3,  status: 'completed' },
  { daysAgo: 28, wasteType: 'plastic',      weight: 34.0, status: 'completed' },
  { daysAgo: 25, wasteType: 'fabric',       weight: 12.0, status: 'completed' },
  // Last 3 weeks
  { daysAgo: 18, wasteType: 'batteries',    weight: 6.0,  status: 'completed' },
  { daysAgo: 12, wasteType: 'rubber',       weight: 13.5, status: 'completed' },
  { daysAgo: 5,  wasteType: 'paper',        weight: 16.0, status: 'completed' },
  // Most recent — still pending (realistic)
  { daysAgo: 1,  wasteType: 'plastic',      weight: 0,    status: 'requested' }
];

// ── Helper ────────────────────────────────────────────────────────
const daysAgoDate = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

async function seedTestUser() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  RecycAI — Test User Seeder');
  console.log('═══════════════════════════════════════════════════\n');

  // 1. Create / overwrite collector
  const collectorRef = db.collection('collectors').doc(COLLECTOR_ID);
  await collectorRef.set({
    id: COLLECTOR_ID,
    name: 'Priya Mehta',
    phone: '9876543210',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  console.log(`✅  Collector created   → ${COLLECTOR_ID} (Priya Mehta)`);

  // 2. Calculate total credits from completed pickups
  let totalCredits = 0;
  for (const p of HISTORY) {
    if (p.status === 'completed') {
      totalCredits += Math.round(p.weight * (SCORES[p.wasteType] || 0));
    }
  }

  // 3. Create / overwrite society
  const societyRef = db.collection('societies').doc(SOCIETY_ID);
  await societyRef.set({
    id: SOCIETY_ID,
    name: 'Green Valley Residency',
    location: 'Koramangala, Bangalore',
    totalCredits,
    // Store plain-text password only for demo/testing purposes
    testPassword: 'GreenVal@123'
  });
  console.log(`✅  Society created     → ${SOCIETY_ID} (Green Valley Residency)`);
  console.log(`   Total Credits        : ${totalCredits}`);

  // 4. Write all historical pickups
  console.log('\n📦  Writing pickup history...\n');
  const batch = db.batch();

  for (const entry of HISTORY) {
    const pRef = db.collection('pickups').doc();
    const date = daysAgoDate(entry.daysAgo);
    const credits = entry.status === 'completed'
      ? Math.round(entry.weight * (SCORES[entry.wasteType] || 0))
      : 0;

    batch.set(pRef, {
      id: pRef.id,
      societyId:     SOCIETY_ID,
      societyName:   'Green Valley Residency',
      location:      'Koramangala, Bangalore',
      wasteType:     entry.wasteType,
      weight:        entry.weight,
      status:        entry.status,
      creditsAwarded: credits,
      collectorId:   COLLECTOR_ID,
      collectorName: 'Priya Mehta',
      date:          date.toISOString(),
      createdAt:     admin.firestore.Timestamp.fromDate(date)
    });

    const tag = entry.status === 'completed' ? '✔' : '⏳';
    console.log(
      `  ${tag}  ${entry.wasteType.padEnd(14)} | ${String(entry.weight).padStart(5)} kg | ` +
      `${String(credits).padStart(5)} credits | ${date.toDateString()}`
    );
  }

  await batch.commit();

  console.log('\n═══════════════════════════════════════════════════');
  console.log('  ✅  Done!  Use these credentials in your app:\n');
  console.log(`  Society ID  : ${SOCIETY_ID}`);
  console.log(`  Password    : GreenVal@123`);
  console.log(`  Society Name: Green Valley Residency`);
  console.log(`  Collector ID: ${COLLECTOR_ID}`);
  console.log(`  Total Credits accumulated: ${totalCredits}`);
  console.log('═══════════════════════════════════════════════════\n');
  process.exit(0);
}

seedTestUser().catch(err => {
  console.error('❌  Seeding failed:', err);
  process.exit(1);
});
