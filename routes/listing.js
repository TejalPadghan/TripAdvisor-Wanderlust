const express = require("express")
const router = express.Router();
const wrapAysnc = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
    .get(wrapAysnc(listingController.index))  //Index Route
    .post(isLoggedIn, upload.single("listing[image][url]"), validateListing, wrapAysnc(listingController.createListing));  //Create Route
    
// New Add Listing Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAysnc(listingController.showListing))  //Show Route
    .put(isLoggedIn, isOwner, upload.single("listing[image][url]"), validateListing, wrapAysnc(listingController.updateListing))  //Update Route
    .delete(isLoggedIn, isOwner, wrapAysnc(listingController.deleteListing));  //Delete Route

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAysnc(listingController.editListing));

module.exports = router;