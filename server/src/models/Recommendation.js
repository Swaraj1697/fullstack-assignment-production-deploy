import mongoose from "mongoose";

const RecommendationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recommendations: { type: Array, default: [] },
    blurb: { type: String },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Recommendation", RecommendationSchema);
