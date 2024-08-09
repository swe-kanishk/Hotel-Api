const Listing = require('../models/Listing');

module.exports.createListing = async (req, res) => {
    try {
        const locationData = JSON.parse(req.body.location);
        const latlng = locationData.latlng;
        const location = locationData.label.replace(/^[^\w\s]+/, '').trim();

        const images = req.files.map(file => ({
            url: file.path,
            filename: file.filename,
        }));

        const { title, description, price, category, guestCount, roomCount, bathroomCount } = req.body;

        // Create new listing object
        const newListing = new Listing({
            title,
            description,
            location,
            price,
            category,
             guestCount,
             roomCount,
             bathroomCount,
            images,
            owner: req.user.id,
            geometry: {
                type: 'Point',
                coordinates: latlng,
            },
        });

        // Save listing to database
        let savedListing = await newListing.save();
        console.log(savedListing);

        // Respond with saved listing
        res.status(201).json(savedListing);
    } catch (error) {
        console.error("Error creating listing:", error);
        res.status(500).json({ error: "Failed to create listing" });
    }
};


module.exports.getListings = async (req, res) => {
    try {  
      let allListings = await Listing.find();
      res.status(200).json(allListings)
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Internal server error" });
    }
  };

  module.exports.findListings = async (req, res) => {
    let listings = await Listing.find()
    let response = listings.filter((listing) => listing.category === req.query.category)
     res.status(200).json(response)  
  }
  module.exports.listingDetails = async (req, res) => {
    const {listingID} = req.params
    console.log(listingID)
    let listing = await Listing.findById(listingID).populate('owner')
    res.status(200).json(listing)  
  }