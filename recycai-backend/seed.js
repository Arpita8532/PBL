const { db, admin } = require('./firebase');

const SCORES = {
  plastic: 8,
  paper: 5,
  metal: 15,
  glass: 3,
  ewaste: 20,
  fabric: 4,
  wood: 2,
  food: 1
};
const WASTE_TYPES = Object.keys(SCORES);
const LOCATIONS = ['Sector 1, New Delhi', 'Andheri West, Mumbai', 'Koramangala, Bangalore', 'Salt Lake, Kolkata', 'Banjara Hills, Hyderabad', 'Viman Nagar, Pune'];

const societyNames = [
  'Lotus Gardens', 'Orchid Residency', 'Tulip Enclave', 'Rosewood Apartments',
  'Jasmine Court', 'Lily Valley', 'Daffodil Springs', 'Sunflower Heights',
  'Marigold Crest', 'Hibiscus Villas', 'Pinecone Ridge', 'Maple Grove',
  'Oakwood Estate', 'Cedar Point', 'Willow Brook', 'Birchwood Park',
  'Elm Street Society', 'Ashwood Courts', 'Chestnut Hill', 'Walnut Manor'
];

const collectorNames = [
  'Amit Patel', 'Rajesh Gupta', 'Vikram Singh', 'Sanjay Kumar', 
  'Arun Sharma', 'Anil Verma', 'Sunil Yadav', 'Manoj Tiwari',
  'Prakash Joshi', 'Ravi Desai'
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function seed() {
  console.log("Starting data generation...");

  // 1. Create 3 Recycling Collector accounts (reduced from 10)
  const recyclingCollectors = [];
  for (let i = 0; i < 3; i++) {
    // Offset by 4 to avoid overwriting COLLECTOR-01 to COLLECTOR-04
    const idNum = String(i + 5).padStart(2, '0');
    const kRef = db.collection('collectors').doc(`COLLECTOR-${idNum}`);
    const kData = {
      id: kRef.id,
      name: collectorNames[i],
      phone: `987654321${i}`,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    await kRef.set(kData);
    recyclingCollectors.push(kData);
    console.log(`Created Recycling Collector: ${kData.name} (${kData.id})`);
  }

  // 2. Create 5 Societes (reduced from 20)
  const societies = [];
  for (let i = 0; i < 5; i++) {
    const sRef = db.collection('societies').doc(); // Auto ID
    const sData = {
      id: sRef.id,
      name: societyNames[i],
      location: LOCATIONS[i % LOCATIONS.length],
      totalCredits: 0
    };
    await sRef.set(sData);
    societies.push(sData);
    console.log(`Created Society: ${sData.name} (${sData.id})`);
  }

  // 3. Create Pickups for each society
  console.log("Generating recycling pickup data...");
  for (const society of societies) {
    let societyTotalCredits = 0;
    
    // Create 1 to 3 pickups per society (reduced from 3-6)
    const numPickups = Math.floor(Math.random() * 3) + 1; 
    
    for (let j = 0; j < numPickups; j++) {
      const pRef = db.collection('pickups').doc();
      const wasteType = WASTE_TYPES[Math.floor(Math.random() * WASTE_TYPES.length)];
      
      // Random date in the past 30 days
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 30));
      
      // 80% chance completed, 20% pending
      const isCompleted = Math.random() < 0.8;
      
      let weight = 0;
      let credits = 0;
      
      if (isCompleted) {
        weight = Math.round((Math.random() * 40 + 5) * 10) / 10; // 5kg to 45kg
        credits = Math.round(weight * SCORES[wasteType]);
        societyTotalCredits += credits;
      }
      
      const pData = {
        id: pRef.id,
        societyId: society.id,
        societyName: society.name,
        location: society.location,
        wasteType: wasteType,
        status: isCompleted ? "completed" : "requested",
        weight: weight,
        creditsAwarded: credits,
        date: pastDate.toISOString(), // For sorting manually if needed
        createdAt: admin.firestore.Timestamp.fromDate(pastDate)
      };
      
      // Always assign a collector to ensure fair distribution across Recycling Collectors
      const randomCollector = recyclingCollectors[Math.floor(Math.random() * recyclingCollectors.length)];
      pData.collectorId = randomCollector.id;
      pData.collectorName = randomCollector.name;
      
      await pRef.set(pData);
    }
    
    // Update society with actual calculated totals
    await db.collection('societies').doc(society.id).update({
      totalCredits: societyTotalCredits
    });
    
    console.log(`Generated pickups for ${society.name} -> Total Credits: ${societyTotalCredits}`);
    await sleep(200); // Prevent rate limiting
  }

  console.log("✅ Data generation complete!");
  process.exit(0);
}

seed().catch(console.error);
