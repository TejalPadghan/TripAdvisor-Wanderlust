const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Search Route - GET /listings/search?location=...
router.get("/search", wrapAsync(listingController.searchListings));

router.route("/")
    .get(wrapAsync(listingController.index))  // Index Route (show all listings)
    .post(isLoggedIn, upload.single("listing[image][url]"), validateListing, wrapAsync(listingController.createListing));  // Create Route

// New Listing Form
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))  // Show Route
    .put(isLoggedIn, isOwner, upload.single("listing[image][url]"), validateListing, wrapAsync(listingController.updateListing))  // Update Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));  // Delete Route

// Edit Listing Form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;
