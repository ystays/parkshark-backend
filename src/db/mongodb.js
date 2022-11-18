const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose = require("mongoose")
const User = require("../models/user")
const Listing = require("../models/listing")
const Booking = require("../models/booking")

const ObjectId = mongoose.Types.ObjectId

// const schemas = require('../utils/schema.js')
// const Listing = schemas.Listing
// const Booking = schemas.Booking
// const User = schemas.User

const dbUrl = process.env.MONGODB_URL; 


mongoose.connect(dbUrl, { useNewUrlParser : true,
    useUnifiedTopology: true }, function(error) {
        if (error) {
            return console.log("Error!" + error);
        }
        console.log("Connected to DB");
    }
)

// ********************************************************************
// User API
// function createUser(userData){
//     const user = new User(userData);
//     user.save().then(() => {
//         console.log("Saved user successfully");
//     }).catch((error) => {
//         console.log("Error: ", error);
//     });

//     return user._id;
// }

// function queryUser(userId) {
//     return User.findById(userId);
// }

// function updateUser(userId) {
//     return;
// }  

// function removeUser(userId) {
//     return;
// }
  

function addBookingIdToUser(bookingId, renterId, type) {
    if (type === "renter"){
        User.findOneAndUpdate({"_id": renterId},
            {$push: {renter_bookings_id: [bookingId]} }, null, (err, docs) => {
                if (err) {
                    return console.log("Error: " + err);
                }
                // console.log("Original doc: " + docs)
            });
    } else if (type === "host"){
        User.findOneAndUpdate({"_id": renterId},
            {$push: {host_bookings_id: [bookingId]} }, null, (err, docs) => {
                if (err) {
                    return console.log("Error: " + err);
                }
                // console.log("Original doc: " + docs)
            });
    } else {
        console.log("Invalid type of renter to add bookingId!")
    }

}

// ********************************************************************
// Listing API

// function createListing(listingData) {
//     //listingData.userid = new ObjectId(listingData.userid);
//     const listing = new Listing(listingData);
//     listing.save().then(() => {
//         console.log("Saved listing successfully");
//     }).catch((error) => {
//         console.log("Error: ", error);
//     });
//     return listing._id;

// }

function queryListing(listingId){
    return Listing.findById(listingId);
}

function addBookingIdToListing(listingId, bookingId) {
    Listing.findOneAndUpdate({"_id": listingId},
        {$push: {bookings_id: [bookingId]}}, null, (err, docs) => {
            if (err) {
                return console.log("Error: " + err);
            }
            // console.log("Original doc: " + docs)
        })
}

function updateAvailability(listingId, bookingData){
    queryListing(listingId).then(listingObj =>{
        var availIdx = -1;
        
        for (var i = 0; i < listingObj.availability.length; i++){
            var currInt = listingObj.availability[i];
            console.log(currInt);
            if(bookingData.start_time >= currInt.start_time && bookingData.end_time <= currInt.end_time){
                availIdx = i;
                
                //only splice 1 interval
                if(bookingData.start_time.getTime() == currInt.start_time.getTime())
                    listingObj.availability.splice(availIdx, 1, {start_time:bookingData.end_time, end_time:currInt.end_time});
                else if(bookingData.end_time.getTime() == currInt.end_time.getTime())
                    listingObj.availability.splice(availIdx, 1, {start_time:currInt.start_time, end_time:bookingData.start_time});
                else//2 intervals
                    listingObj.availability.splice(availIdx, 1,{start_time:currInt.start_time, end_time:bookingData.start_time}, {start_time:bookingData.end_time, end_time:currInt.end_time});
                
                break;
            }
        }

        if(availIdx < 0){
            console.log("Availability not updated");
            
        } else{
            listingObj.save().then(() => {
                console.log("Added booking to listing successfully");
            }).catch((error) => {
                console.log("Error: ", error);
            });
        }
    });
}

// ********************************************************************
// Booking API
// do not export createBooking, bookings are created via addBooking
function createBooking (bookingData){
    const booking = new Booking(bookingData);
    booking.save().then(() => {
        console.log("Saved booking successfully");
    }).catch((error) => {
        console.log("Error: ", error);
    });
    return booking;
}

function addBooking(bookingData) {
    const listingId = bookingData.listing_id
    const renterId = bookingData.renter_id
    const hostId = bookingData.host_id

    if(!(bookingData.start_time instanceof Date))
        bookingData.start_time = new Date(bookingData.start_time);
  
    
    if(!(bookingData.end_time instanceof Date))
        bookingData.end_time = new Date(bookingData.end_time);
    
    const booking = createBooking(bookingData);
    addBookingIdToListing(listingId, booking._id);
    addBookingIdToUser(booking._id, renterId, "renter");
    addBookingIdToUser(booking._id, hostId, "host");
    updateAvailability(listingId, bookingData);
    return booking;
}

// module.exports = {createUser, queryUser, removeUser, updateUser, addBookingIdToUser, createListing, queryListing, addBookingIdToListing, updateAvailability, addBooking};
module.exports = {addBookingIdToUser, addBookingIdToListing, updateAvailability, addBooking};
