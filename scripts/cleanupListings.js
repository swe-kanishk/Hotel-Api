const mongoose = require('mongoose');
const Listing = require('../models/Listing');
const User = require('../models/User');

const cron = require('node-cron');
require('dotenv').config();

// Connect to the database
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to the database'))
.catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
});

// Function to delete listings with invalid or null owner references
const cleanupListings = async () => {
    try {
        const listings = await Listing.find().populate('owner');
        for (const listing of listings) {
            if (!listing.owner) {
                console.log(`Listing with invalid owner found: ${listing._id}`);
                await Listing.findByIdAndDelete(listing._id);
                console.log(`Deleted listing with ID: ${listing._id} due to null or invalid owner`);
            }
        }
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
};
cleanupListings();