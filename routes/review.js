const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAysnc = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isOwner, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/review.js");

// Reviews POST Route
router.post("/", isLoggedIn, validateReview, wrapAysnc(reviewController.postReview));

// Delete Review Route
router.delete("/:reviewId", isReviewAuthor, wrapAysnc(reviewController.deleteReview));

module.exports = router;