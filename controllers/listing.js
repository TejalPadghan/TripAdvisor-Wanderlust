const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    console.log(req.file);
    let path = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.image = { filename, url: path };
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listed Created!");
    res.redirect("/listings");
};

module.exports.editListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    console.log(originalImageUrl);
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    console.log(originalImageUrl);
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file != "undefined") {
        let path = req.file.path;
        let filename = req.file.filename;
        listing.image = { filename, url: path };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
};