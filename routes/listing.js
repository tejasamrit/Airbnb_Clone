const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage})

router.get("/search", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.redirect("/listings");
  }

  // Create a regex-based search
  const listings = await Listing.find({
    $or: [
      { title: new RegExp(q, 'i') },
      { location: new RegExp(q, 'i') },
      { category: new RegExp(q, 'i') }, // if you have a category field
    ],
  }).populate("owner");

  res.render("listings/index", { listings });
});


router.route("/")
.get(wrapAsync(listingController.index))
.post(
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.createListing)
);

// new route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);



//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);


module.exports = router;
