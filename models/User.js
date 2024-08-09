const { Schema, model, Types } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const Listing = require('./Listing'); // Adjust the path as necessary
const Review = require("./Review");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required!"],
      minlength: [3, "Name must be at least 3 characters!"],
      maxlength: [29, "Name should be less than 30 characters!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address!",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: [8, "Password must be at least 8 characters!"],
      select: false,
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Listing' }]
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Generate JWT token for authentication
userSchema.methods.generateJWTToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY,
    }
  );
};

userSchema.methods.comparePassword = async function (plainTextPassword) {
  return await bcrypt.compare(plainTextPassword, this.password);
};

// Middleware to handle cascading delete
userSchema.pre('remove', async function(next) {
  try {
    await Listing.deleteMany({ owner: this._id });
    await Review.deleteMany({ userId: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

const User = model("User", userSchema);

module.exports = User;
