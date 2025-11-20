let mongoose = require('mongoose');

// Car schema
let carModel = mongoose.Schema(
  {
    make: String,
    model: String,
    year: Number,
    price: Number,
    mileage_km: Number,
    condition: String,
    description: String,
    imageUrl: String
  },
  {
    collection: 'CarData'
  }
);

module.exports = mongoose.model('Car', carModel);
