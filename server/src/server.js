import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import connectDB from "./db.js";
import mongoose from "mongoose";
import Users from "./models/User.js";
import Ratings from "./models/Rating.js";
import Review from "./models/Review.js";
import cron from "node-cron";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Recommendation from "./models/Recommendation.js";



connectDB();

dotenv.config();

console.log(process.env.TMDB_KEY);
console.log(process.env.TMDB_TOKEN);

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Health check
app.get("/", (req, res) => {
    res.send("✅ Backend running...");
});

app.get("/test-db", async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            res.json({ status: "✅ MongoDB is connected" });
        } else {
            res.json({ status: "❌ MongoDB is NOT connected" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/users/add", async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = new Users({ name, email });
        await user.save();
        res.json({ success: true, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to add user" });
    }
});

app.post("/ratings/add", async (req, res) => {
    try {
        const { userId, movieId, rating } = req.body;
        const newRating = new Ratings({ userId, movieId, rating });
        await newRating.save();
        res.json({ success: true, rating: newRating });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to add rating" });
    }
});

app.get("/ratings/:userId", async (req, res) => {
    try {
        const ratings = await Ratings.find({ userId: req.params.userId }).populate("userId");
        res.json(ratings);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch ratings" });
    }
});

app.get("/debug/users", async (req, res) => {
    const users = await Users.find();
    res.json(users);
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});
  

app.get("/movies/search", async (req, res) => {
    const { query } = req.query; 

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/search/movie`,
            {
                params: {
                    api_key: process.env.TMDB_KEY, 
                    query,
                },
            }
        );

        res.json(response.data.results); // return movie list
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch movies" });
    }
});

// Add rating
app.post("/ratings/add", async (req, res) => {
    try {
        const { userId, movieId, rating } = req.body;
        const newRating = new Ratings({ userId, movieId, rating });
        await newRating.save();
        res.json({ success: true, rating: newRating });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to add rating" });
    }
});

// Get ratings for a user
app.get("/ratings/:userId", async (req, res) => {
    try {
        const ratings = await Ratings.find({ userId: req.params.userId }).populate("userId");
        res.json(ratings);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch ratings" });
    }
});

app.post("/ratings", async (req, res) => {
    try {
        const { userId, movieId, rating } = req.body;

        const updated = await Ratings.findOneAndUpdate(
            { userId, movieId },          // search condition
            { rating },                   // update rating
            { new: true, upsert: true }   // create if not exists
        );

        res.status(201).json(updated);
    } catch (err) {
        console.error("Error adding/updating rating:", err.message);
        res.status(500).json({ error: "Failed to add/update rating" });
    }
});

app.delete("/ratings/:userId/:movieId", async (req, res) => {
    try {
        await Ratings.findOneAndDelete({
            userId: req.params.userId,
            movieId: req.params.movieId,
        });
        res.json({ success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to delete rating" });
    }
});
  
app.get("/ratings/:userId/movies", async (req, res) => {
    try {
        const ratings = await Ratings.find({ userId: req.params.userId });

        // Fetch TMDB details for each rated movie
        const movieDetails = await Promise.all(
            ratings.map(async (r) => {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${r.movieId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
                        },
                    }
                );
                return {
                    ...r._doc,
                    movie: response.data, // full TMDB movie object
                };
            })
        );

        res.json(movieDetails);
    } catch (err) {
        console.error("Error fetching rated movies:", err.message);
        res.status(500).json({ error: "Failed to fetch rated movies" });
    }
});

app.get("/recommendations/:userId", async (req, res) => {
    try {
        const ratings = await Ratings.find({ userId: req.params.userId });

        if (!ratings.length) {
            return res.json({ recommendations: [] });
        }

        const topRated = ratings.filter((r) => r.rating >= 4);

        if (!topRated.length) {
            return res.json({ recommendations: [] });
        }

        const genreCounts = {};
        let lastLikedMovie = null;

        // fetch genres for each top-rated movie
        for (let r of topRated) {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/${r.movieId}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
                    },
                }
            );

            response.data.genres.forEach((g) => {
                genreCounts[g.id] = (genreCounts[g.id] || 0) + 1;
            });

            // keep track of the last liked movie for recommendation reason
            lastLikedMovie = response.data;
        }

        const topGenreId = Object.keys(genreCounts).reduce((a, b) =>
            genreCounts[a] > genreCounts[b] ? a : b
        );

        const recResponse = await axios.get(
            `https://api.themoviedb.org/3/discover/movie?with_genres=${topGenreId}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
                },
            }
        );

        // attach reason to each recommendation
        const recommendations = recResponse.data.results.map((movie) => ({
            ...movie,
            reason: `Because you liked ${lastLikedMovie.title}`,
        }));

        res.json({ recommendations });
    } catch (err) {
        console.error("Error fetching recommendations:", err.message);
        res.status(500).json({ error: "Failed to fetch recommendations" });
    }
});

// Add a new review
app.post("/reviews", async (req, res) => {
    try {
        const { userId, movieId, review } = req.body;
        const newReview = new Review({ userId, movieId, review });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        console.error("Error adding review:", err.message);
        res.status(500).json({ error: "Failed to add review" });
    }
});

// Get reviews for a movie
app.get("/reviews/:movieId", async (req, res) => {
    try {
        const reviews = await Review.find({ movieId: req.params.movieId }).populate("userId", "name email");
        res.json(reviews);
    } catch (err) {
        console.error("Error fetching reviews:", err.message);
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
});
  
// 📊 Get user stats
app.get("/users/:userId/stats", async (req, res) => {
    try {
        const ratings = await Ratings.find({ userId: req.params.userId });

        if (!ratings.length) {
            return res.json({ total: 0, avg: 0, genre: "N/A" });
        }

        const total = ratings.length;
        const avg = ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;

        const genreCount = {};

        for (const r of ratings) {
            // fetch movie details from TMDB using movieId
            const tmdbRes = await axios.get(
                `https://api.themoviedb.org/3/movie/${r.movieId}`,
                { params: { api_key: process.env.TMDB_KEY } }
            );

            if (tmdbRes.data.genres) {
                tmdbRes.data.genres.forEach((g) => {
                    genreCount[g.name] = (genreCount[g.name] || 0) + 1;
                });
            }
        }        
        
        const mostWatched =
            Object.keys(genreCount).length > 0
                ? Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0][0]
                : "N/A";

        res.json({
            total,
            avg: avg.toFixed(2),
            genre: mostWatched,
        });
    } catch (err) {
        console.error("Error fetching user stats:", err.message);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});
  
// AI blurb based on rating submissions
const generateRecommendations = async (userId) => {
    try {
        const ratings = await Ratings.find({ userId });

        if (ratings.length === 0) {
            return {
                recommendations: [],
                blurb: "You haven’t rated any movies yet. Start rating to get personalized recommendations!"
            };
        }


        const topRating = ratings.sort((a, b) => b.rating - a.rating)[0];
        const movieId = topRating.movieId;


        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}`,
            { params: { api_key: process.env.TMDB_KEY } }
        );

        const movieTitle = response.data.title;
        const movieGenreId = response.data.genres?.[0]?.id;
        const movieGenreName = response.data.genres?.[0]?.name || "movies";

        let similarMovies = [];
        if (movieGenreId) {
            const genreResponse = await axios.get(
                `https://api.themoviedb.org/3/discover/movie`,
                {
                    params: {
                        api_key: process.env.TMDB_KEY,
                        with_genres: movieGenreId,
                        sort_by: "popularity.desc",
                        page: 1,
                    },
                }
            );
            similarMovies = genreResponse.data.results.slice(0, 5);
        }

        const aiBlurb = `Because you loved *${movieTitle}*, we think you’ll enjoy these ${movieGenreName} movies.`;

        return { recommendations: similarMovies, blurb: aiBlurb };
    } catch (err) {
        console.error("Error generating recommendations:", err.message);
        return { recommendations: [], blurb: "Could not generate recommendations right now." };
    }
};

// recoomendations API
app.get("/recommendations/daily/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const recs = await generateRecommendations(userId);
        res.json(recs);
    } catch (err) {
        console.error("Error in /recommendations/daily:", err.message);
        res.status(500).json({ error: "Failed to generate recommendations" });
    }
});
  
// REGISTER
app.post("/auth/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;


        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Users({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
            isAdmin: false,
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Error registering user:", err.message);
        res.status(500).json({ error: "Failed to register user" });
    }
});

// LOGIN

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // ✅ sign JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }   // 1 hour session
        );

        res.json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email },
            token,
        });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
  
  
  
  

app.listen(5000, () =>
    console.log("🚀 Server started on http://localhost:5000")
);
