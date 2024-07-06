import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'lowdb'; // Import the whole lowdb package as a namespace
const { Low, JSONFile } = pkg; // Destructure Low and JSONFile from the package

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Use CORS to allow cross-origin requests
app.use(cors());
app.use(bodyParser.json());

// Set up LowDB
const file = path.join('/tmp', 'db.json'); // Use the /tmp directory for the database file
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Initialize the database with default values if it's empty
(async () => {
  await db.read();
  db.data ||= { reviews: [] };
  await db.write();
})();

// Endpoint to get reviews for a specific dining hall
app.get('/reviews/:diningHall', async (req, res) => {
  const diningHall = req.params.diningHall;
  await db.read();
  const reviews = db.data.reviews.filter(review => review.diningHall === diningHall);

  const totalRating = reviews.reduce((acc, review) => acc + Number(review.rating), 0);
  const averageRating = reviews.length ? (totalRating / reviews.length) : 0;

  res.json({ averageRating, reviews });
});

// Endpoint to post a new review
app.post('/reviews', async (req, res) => {
  const { diningHall, rating, comment } = req.body;
  const newReview = { diningHall, rating: Number(rating), comment: comment || '' };
  await db.read();
  db.data.reviews.push(newReview);
  await db.write();
  res.status(201).json(newReview);
});

// Endpoint to clear all reviews
app.delete('/reviews', async (req, res) => {
  await db.read();
  db.data.reviews = [];
  await db.write();
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});




