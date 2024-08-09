const Review = require('../models/Review');

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { listingId, userId, rating, comment } = req.body;
    const review = new Review({ listingId, userId, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all reviews for a listing
exports.getReviewsByListingId = async (req, res) => {
  try {
    const { listingId } = req.params;
    const reviews = await Review.find({ listingId }).populate('userId', 'name');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const review = await Review.findByIdAndUpdate(id, { rating, comment }, { new: true });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
