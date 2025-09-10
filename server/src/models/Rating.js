import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movieId: { type: Number, required: true }, // TMDB movie ID
    rating: { type: Number, required: true, min: 1, max: 5 },
});

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
