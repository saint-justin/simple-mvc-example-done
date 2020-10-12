const mongoose = require('mongoose');

let DogModel = {};

const DogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  breed: {
    type: String,
    required: true,
    trim: true,
    unique: false,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },

});

DogSchema.statics.findByName = (name, callback) => {
  const search = {
    name,
  };

  return DogModel.findOne(search, callback);
};

// Create the cat model based on the schema. You provide it with a custom discriminator
// (the name of the object type. Can be anything)
// and the schema to make a model from.
// Look at the model variable definition above for more details.
DogModel = mongoose.model('Dog', DogSchema);

// export our public properties
module.exports = {
  DogModel,
  DogSchema,
};
