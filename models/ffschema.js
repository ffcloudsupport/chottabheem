// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var fforderSchema = new Schema({
  //orderno: { type: String, required: true, unique: true },
  orderno: { type: String, required: true },
  pullno: { type: String, required: true },
  pullname: { type: String, required: true },
  status: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  remarks: String
});

// the schema is useless so far
// we need to create a model using it
var FFSchema = mongoose.model('FFSchema', fforderSchema);

// make this available to our users in our Node applications
module.exports = FFSchema;