const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middlewares/authMiddleware");

const listingController = require("../controllers/listingControllers")
const multer  = require('multer')
const {storage} = require("../cloudConfig")
const upload = multer({ storage })

router.route("/")
.get(listingController.getListings)
.post(isLoggedIn, upload.array("images"), listingController.createListing);

router.get('/:listingID', listingController.findListings)
router.get('/details/:listingID', listingController.listingDetails)


module.exports = router;