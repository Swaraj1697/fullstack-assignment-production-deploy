import { useState , useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Recommendations from "./pages/Recommendations";
import MyRatings from "./pages/MyRatings";
import MovieDetails from "./pages/MovieDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthLayout from "./components/AuthLayout";
import Search from "./pages/Search";
import MainLayout from "./components/MainLayout";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated, user, isLoading , setIsAuthenticated  , setUser} = useAuth();

  
  if (isLoading) {
    return <div>Loading...</div>; // or a spinner
  }

  return (
    <Router>
      {isAuthenticated && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <MainLayout>
                <Home user={user} />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
            </AuthLayout>
          }
        />

        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <MainLayout>
                <Dashboard user={user} />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/recommendations"
          element={
            isAuthenticated ? (
              <MainLayout>
                <Recommendations user={user} />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/my-ratings"
          element={
            isAuthenticated ? (
              <MainLayout>
                <MyRatings user={user} />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/movie/:movieId"
          element={
            isAuthenticated ? (
              <MainLayout>
                <MovieDetails user={user} />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/search"
          element={
            isAuthenticated ? (
              <MainLayout>
                <Search />
              </MainLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
