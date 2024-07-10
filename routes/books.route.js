import express from 'express';
import { addBook, getAllBooks, getBookById, getBookReviews, addBookReview } from '../controllers/bookController.js';

const router = express.Router();

router.post('/add-book', addBook);

// Get all books
router.get('/books', getAllBooks);

// Get book details by ID
router.get('/books/:id', getBookById);

// Get reviews for a book by ID
router.get('/books/:id/reviews', getBookReviews);

// Add a review for a book by ID
router.post('/books/:id/reviews', addBookReview);

export default router;