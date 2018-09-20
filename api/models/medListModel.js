'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MedSchema = new Schema({
  upc: {
    type: String,
    required: 'upc'
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Meds', MedSchema);
