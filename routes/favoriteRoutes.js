const express = require('express');
const User = require('../models/User');
const isLoggedIn = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', isLoggedIn, async (req, res) => {
  const { userId, listingId } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if listingId is already in favorites
    const isFavorite = user.favorites.includes(listingId);

    if (isFavorite) {
      // Remove from favorites
      user.favorites.pull(listingId);
    } else {
      // Add to favorites
      user.favorites.push(listingId);
    }

    await user.save();

    const message = isFavorite
      ? 'Listing removed from favorites successfully'
      : 'Listing added to favorites successfully';

    res.status(200).json({ message, user });
  } catch (error) {
    console.error('Error adding/removing listing to/from favorites:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/check/:id', isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFav = user.favorites.includes(req.body.listingId); // Assuming req.params.id is the listingId
    console.log(isFav)
    res.status(200).json({ isFav: isFav });
  } catch (error) {
    console.error("Error checking favorite:", error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
