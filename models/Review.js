import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, "Comment should be under 500 characters."],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  const Review = mongoose.model("Review", reviewSchema);

export default Review;

  