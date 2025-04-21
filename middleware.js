const Listing=require("./models/listing");
const Review=require("./models/review");
const {listingSchema, reviewSchema}= require("./schema.js");
const ExpressError=require("./utils/ExpressError.js")

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to create listing.");
    res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(req.user._id)) {
    req.flash("error", "You are not authorized to do that!");
    return res.redirect(`/listings/${id}`);
}
  // if (!currUser && listing.owner._id.equals(res.locals.currUser._id)) {
  //   req.flash("error", "You are not the owner of this listing");
  //   return res.redirect(`/listings/${id}`);
  // }
  next();
};


module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); // ✅ matches the schema
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.isReviewAuthor = async (req, res, next) => {
  let {id, reviewId } = req.params;
  let listing = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};