import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'Title should be under 100 characters.'],
    },
    author: {
        type: String,
        required: true,
        trim: true,
        maxlength: [80, 'Author name should be under 80 characters.'],
    },
    genre: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'Genre should be under 50 characters.'],
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: [1000, 'Description should be under 1000 characters.'],
    },
}, {
    timestamps: true,
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
