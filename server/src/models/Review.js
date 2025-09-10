import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        movieId: { type: Number, required: true }, // TMDB movie ID
        review: { type: String, required: true }
    },
    { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;