require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/User");
const Deck = require("./models/Deck");
const Card = require("./models/Card");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany({});
  await Deck.deleteMany({});
  await Card.deleteMany({});

  const passwordHash = await bcrypt.hash("password123", 10);
  const user = new User({
    email: "test@example.com",
    passwordHash,
    name: "Test User",
  });
  await user.save();

  const deck = new Deck({
    title: "Spanish Basics",
    description: "Common words",
    owner: user._id,
  });
  await deck.save();

  const cards = [
    { deckId: deck._id, front: "Hola", back: "Hello", owner: user._id },
    { deckId: deck._id, front: "Adiós", back: "Goodbye", owner: user._id },
    { deckId: deck._id, front: "Gracias", back: "Thank you", owner: user._id },
    { deckId: deck._id, front: "Por favor", back: "Please", owner: user._id },
  ];

  await Card.insertMany(cards);

  console.log("Seed complete. User: test@example.com / password123");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
