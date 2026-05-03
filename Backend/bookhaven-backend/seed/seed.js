// Yeh file ek baar chalao — list.json ka data MongoDB mein daal dega
// Command: npm run seed

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Book = require("../models/book.model");

dotenv.config();

// Sample books data (apna list.json ka data yahan paste karo ya as-is chalao)
const books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "1920s America mein ek mysterious millionaire aur uski khoya hua pyaar ki kahani.",
    genre: "Classic",
    category: "free",
    price: 0,
    image: "https://covers.openlibrary.org/b/id/8225261-L.jpg",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "Ek lawyer apne beton ko naitikta sikhata hai jab woh ek kale aadmi ka case ladta hai.",
    genre: "Classic",
    category: "free",
    price: 0,
    image: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "Ek dystopian future mein totalitarian government ke khilaf ek aadmi ki ladai.",
    genre: "Fiction",
    category: "free",
    price: 0,
    image: "https://covers.openlibrary.org/b/id/8575708-L.jpg",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "19vi sadi ki England mein romance, class aur social expectations ki kahani.",
    genre: "Classic",
    category: "free",
    price: 0,
    image: "https://covers.openlibrary.org/b/id/8739161-L.jpg",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "Chhoti aadatein kaise badi zindagi badal sakti hain — ek practical guide.",
    genre: "Self-Help",
    category: "paid",
    price: 299,
    image: "https://covers.openlibrary.org/b/id/10522545-L.jpg",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "Ek charvaha apne sapne ki talaash mein nikalti hai aur zindagi ka matlab dhundta hai.",
    genre: "Fiction",
    category: "paid",
    price: 199,
    image: "https://covers.openlibrary.org/b/id/8479536-L.jpg",
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    description: "Paisa kamane aur invest karne ke baare mein do dads ki alag soch.",
    genre: "Finance",
    category: "paid",
    price: 249,
    image: "https://covers.openlibrary.org/b/id/8091016-L.jpg",
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    description: "Ek orphan ladka discover karta hai ki woh ek jadugar hai aur Hogwarts school mein daakhila leta hai.",
    genre: "Fantasy",
    category: "paid",
    price: 349,
    image: "https://covers.openlibrary.org/b/id/10110415-L.jpg",
  },
];

const seedDB = async () => {
  try {
    // MongoDB connect karo
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB se connect ho gaya!");

    // Pehle purani saari books delete karo
    await Book.deleteMany({});
    console.log("🗑️  Purani books delete ho gayi");

    // Nayi books daalo
    await Book.insertMany(books);
    console.log(`✅ ${books.length} books MongoDB mein daal di gayi!`);

    process.exit(0); // Success se band karo

  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seedDB();
