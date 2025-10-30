const API_BASE = "http://localhost:5000";

async function testAPI() {
  console.log("🧪 Testing Flashcard API...\n");

  try {
    // Test 1: Health Check
    console.log("1️⃣ Testing health endpoint...");
    const health = await fetch(`${API_BASE}/health`);
    const healthData = await health.json();
    console.log("✅ Health:", healthData);
    console.log("");

    // Test 2: Get Decks
    console.log("2️⃣ Testing decks endpoint...");
    const decksRes = await fetch(`${API_BASE}/decks`);
    const decks = await decksRes.json();
    console.log(`✅ Found ${decks.length} deck(s)`);
    decks.forEach((deck) => {
      console.log(
        `   📚 ${deck.name}: ${deck.cardsCount} cards (${deck.due} due, ${deck.learning} learning)`
      );
    });
    console.log("");

    if (decks.length === 0) {
      console.log("⚠️  No decks found. Run: node scripts/importData.js");
      return;
    }

    const deckId = decks[0].id;

    // Test 3: Get Learning Cards
    console.log("3️⃣ Testing learning cards endpoint...");
    const learningRes = await fetch(
      `${API_BASE}/cards?deckId=${deckId}&mode=learning`
    );
    const learningCards = await learningRes.json();
    console.log(`✅ Found ${learningCards.length} cards in learning mode`);
    if (learningCards.length > 0) {
      const card = learningCards[0];
      console.log(
        `   📝 Sample: ${card.front} (${card.reading}) - Step ${card.learningStep}`
      );
    }
    console.log("");

    // Test 4: Get Review Cards
    console.log("4️⃣ Testing review cards endpoint...");
    const reviewRes = await fetch(
      `${API_BASE}/cards?deckId=${deckId}&mode=review`
    );
    const reviewCards = await reviewRes.json();
    console.log(`✅ Found ${reviewCards.length} cards due for review`);
    if (reviewCards.length > 0) {
      const card = reviewCards[0];
      console.log(`   📝 Sample: ${card.front} (${card.reading})`);
    }
    console.log("");

    // Test 5: Update a Card
    if (learningCards.length > 0) {
      console.log("5️⃣ Testing card update...");
      const testCard = learningCards[0];
      const updateData = {
        ...testCard,
        learningStep: (testCard.learningStep || 0) + 1,
        due: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      };

      const updateRes = await fetch(`${API_BASE}/cards/${testCard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const updated = await updateRes.json();
      console.log(`✅ Updated card ${testCard.id}`);
      console.log(`   Before: learningStep = ${testCard.learningStep}`);
      console.log(`   After:  learningStep = ${updated.learningStep}`);
      console.log("");
    }

    console.log("🎉 All tests passed!\n");
    console.log("Next steps:");
    console.log("1. Start your React app: npm start");
    console.log("2. Try learning mode with 5 new cards");
    console.log("3. Try review mode with due cards");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log("\nMake sure your backend is running:");
    console.log("  cd backend && npm start");
  }
}

// Run tests
testAPI();
