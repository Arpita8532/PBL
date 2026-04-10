const { db, admin } = require('./firebase');

async function clearDB() {
  console.log("Clearing existing data...");
  const collections = ['societies', 'pickups', 'collectors'];
  
  for (const collection of collections) {
    const snapshot = await db.collection(collection).get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`Cleared collection: ${collection}`);
  }
}

clearDB().catch(console.error);
