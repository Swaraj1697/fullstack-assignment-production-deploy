import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movieId: { type: Number, required: true }, // TMDB movie ID
    movieTitle: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    liked: { type: Boolean, default: null },
});

const Ratings = mongoose.models.Rating || mongoose.model("Rating", ratingSchema);
export default Ratings;


