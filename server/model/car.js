let mongoose = require('mongoose');

// Car schema
let carModel = mongoose.Schema(
  {
    make: String,
    model: String,
    year: Number,
    price: Number,
    mileage: Number,
    condition: String,
    description: String,
  },
  {
    collection: 'CarData'
  }
);

module.exports = mongoose.model('Car', carModel);
