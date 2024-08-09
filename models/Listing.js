const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./Review'); // Ensure the path is correct
const User = require("./User");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [{
        url: {
            type: String,
            required: true,
        },
        filename: {
            type: String,
            required: true,
        }
    }],
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    location: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    guestCount: {
        type: Number,
        required: true,
        min: 1,
    },
    roomCount: {
        type: Number,
        required: true,
        min: 1,
    },
    bathroomCount: {
        type: Number,
        required: true,
        min: 1,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    }
}, { timestamps: true });

listingSchema.pre('remove', async function(next) {
    try {
        await Review.deleteMany({ listingId: this._id });
        next();
    } catch (error) {
        next(error);
    }
});

listingSchema.post('findOneAndDelete', async function(doc, next) {
    if (doc) {
        await Review.deleteMany({ listingId: doc._id });
        await User.updateMany(
            { favorites: doc._id },
            { $pull: { favorites: doc._id } }
        );
    }
    next();
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
