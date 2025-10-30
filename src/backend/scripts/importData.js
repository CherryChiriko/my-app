// scripts/importData.js
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const db = new sqlite3.Database("./flashcards.db");

// Read your JSON deck file
const deckData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../app/data/decks.json"), "utf8")
);

const deck = {
  name: "HSK 1",
  description: "Beginner Chinese vocabulary (HSK 1)",
  language: "Chinese",
  studyMode: "C",
  tags: ["old-hsk", "beginner"],
};

db.serialize(() => {
  const deckQuery = `
    INSERT INTO decks (name, description, language, studyMode, tags)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    deckQuery,
    [
      deck.name,
      deck.description,
      deck.language,
      deck.studyMode,
      JSON.stringify(deck.tags),
    ],
    function (err) {
      if (err) {
        console.error("Error inserting deck:", err);
        return;
      }

      const deckId = this.lastID;
      console.log(`✅ Deck created with ID: ${deckId}`);

      const cardQuery = `
        INSERT INTO cards (
          deckId, front, reading, back, audioUrl, 
          tones, strokeColors, isNew, learningStep
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0)
      `;

      const stmt = db.prepare(cardQuery);
      deckData.forEach((card) => {
        stmt.run(
          deckId,
          card.front,
          card.reading,
          card.back,
          card.audioUrl || null,
          JSON.stringify(card.tones || []),
          JSON.stringify(card.strokeColors || [])
        );
      });
      stmt.finalize();

      console.log(`✅ Imported ${deckData.length} cards`);

      db.close();
    }
  );
});
