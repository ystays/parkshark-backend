const mongoose = require("mongoose");
mongoose.set('debug', true);
const Schema = mongoose.Schema;

const pointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const listingSchema = new Schema(
    {
        location: {
          type: pointSchema,
          index: '2dsphere'
      },
        userid: mongoose.Types.ObjectId,
        address: {
             state:String,
             city:String,
             postal_code:String,
             line_1:String,
             line_2:String
        },
        description:String,
        image:String,
        price:Number,
        availability:[
            {
            start_time:Date, 
            end_time:Date
          }
        ],
        bookings_id: [mongoose.Types.ObjectId],
     }, {
      timestamps: true
     }
);

const Listing = mongoose.model("Listing", listingSchema, 'listings');

module.exports = Listing