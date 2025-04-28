const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const {isLoggedIn, isOwner , validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router
.route("/")
.get(wrapAsync(listingController.index))
.post( isLoggedIn ,upload.single("listing[image]") ,validateListing, wrapAsync(listingController.createListing));


//New Route
  router.get("/new",isLoggedIn,listingController.renderNewForm );


router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


//Edit Route

// router.get(
//   "/listings/:id/edit",
//   wrapAsync(async (req,res)=>{
//     let { id } = req.params.id.trim();
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs",{ listing });
//   })
// );

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));



//update route
// router.put("/:id",isLoggedIn, validateListing,wrapAsync(async (req, res) => {
//   if(!req.body.listing){
//     throw new ExpressError(400,"send valid data for listing");
//   }
//   let { id } = req.params;
//   let listing = await Listing.findById(id);
//   if(!listing.owner._id.equals(res.locals.currUser._id)) {
//    req.flash("error","You dont have permission to edit");
//    res.redirect(`/listings/${id}`);
//   }


//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   req.flash("success","Listing Updated!");
//   res.redirect(`/listings/${id}`);
// }));

// delete



module.exports = router;

