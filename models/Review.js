const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  listingId: {
    type: Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    cleanliness: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    checkIn: { type: Number, required: true },
    communication: { type: Number, required: true },
    location: { type: Number, required: true },
    value: { type: Number, required: true },
  },
  comment: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
