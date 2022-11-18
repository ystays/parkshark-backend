const mongoose = require("mongoose");
mongoose.set('debug', true);
const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
        name: String,
        phone: String,
        dob: Date,
        email: String,
        host_bookings_id: [mongoose.Types.ObjectId],
        renter_bookings_id: [mongoose.Types.ObjectId],
        listings_id: [mongoose.Types.ObjectId]
    }, {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema, 'users');

module.exports = User