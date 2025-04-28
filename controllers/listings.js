require('dotenv').config();
const Listing = require("../models/listing"); 
const mongoose = require("mongoose");
const axios = require('axios');
const maptilerKey = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };

  module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
  };


  module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path: "reviews" ,
      populate: {
         path: "author",
    },
  }).populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  };


  module.exports.createListing = async (req, res, next) => {
    try {
        const location = req.body.listing.location;
        const response = await axios.get('https://api.maptiler.com/geocoding/' + encodeURIComponent(location) + '.json', {
            params: {
                key: maptilerKey,
                limit: 1
            }
        });

        if (response.data.features.length > 0) {
            const geometryData = response.data.features[0].geometry; // Get geometry
            const newListing = new Listing(req.body.listing);

            let url = req.file.path;
            let filename = req.file.filename;
            newListing.owner = req.user._id;
            newListing.image = { url, filename };

            // Set correct geometry here
            newListing.geometry = geometryData;

            let savedListing = await newListing.save();
            console.log(savedListing);
            req.flash("success", "New Listing Created!");
            res.redirect("/listings");

        } else {
            req.flash("error", "Location not found!");
            return res.redirect("/listings/new");
        }

    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong!");
    }
};

  


  module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    console.log("Raw ID from request:", id); // Debugging
  
    id = id.trim(); // Remove spaces
    console.log("Trimmed ID:", id); // Debugging
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid ID format:", id);
      return res.status(400).send("Invalid Listing ID");
    }
  
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
  
    console.log("Fetched Listing:", listing); // Debugging
    
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_250,w_300");

    res.render("listings/edit.ejs", { listing ,originalImageUrl});
  };
  


  module.exports.updateListing = async (req, res) => {
    let { id } = req.params; // Make sure this is here
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Invalid Listing ID");
      return res.redirect("/listings");
    }
  
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   if( typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
   }
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
  
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
  };
  

  module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
  };