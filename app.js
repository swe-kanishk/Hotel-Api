require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const createError = require("http-errors");

const userRoutes = require("./routes/userRoutes");
const listingRoutes = require("./routes/listingRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const isLoggedIn = require("./middlewares/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Adjust based on your needs
  crossOriginResourcePolicy: { policy: "same-site" },
}));

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit process with failure
  }
})();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/reviews", reviewRoutes);

app.post('/api/auth/verify-token', isLoggedIn, (req, res) => {
  console.log('hiii i am kanisxkk')
  const user = req.user;
  res.status(200).json(user);
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404, "Not Found"));
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message,
      status,
    },
  });
});


// Wildcard route to handle all other routes
app.all('*', (req, res, next) => {
  next(createError(404, "Not Found"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
