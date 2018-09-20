'use strict';
const secrets = require('../../secrets.json');
const axios = require('axios');

var mongoose = require('mongoose'),
  Med = mongoose.model('Meds');

exports.list_all_meds = (req, res) => {
  Med.find({upc:{$regex: req.query.q ||'', $options: 'i'}})
   .sort('-createdDate')
   .limit(parseInt(req.query.count) || null)
   .exec((err, med) => {
     if (err)
       res.send(err);
     res.json(med);
   });
 };

exports.create_a_med = (req, res) => {
  let new_med = {...req.body, createdDate: Date.now()};
  //this is supposed to be PUT?
  Med.create(new_med, (err, med) => {
      if (err) {
        res.send(err);
      }
      else {
        res.json(med);
      }
    });
};

exports.read_a_med = (req, res) => {
  Med.findById(req.params.medId, (err, med) => {
    if (err)
      res.send(err);
    res.json(med);
  });
};

exports.update_a_med = (req, res) => {
  Med.findOneAndUpdate({upc: req.params.medId}, req.body,
          {new: true}, function(err, med) {
    if (err)
      res.send(err);
    res.json(med);
  });
};

exports.delete_a_med = (req, res) => {
  Med.remove({
      _id: req.params.medId
    }, function(err, med) {
      if (err)
        res.send(err);
      res.json({ message: 'Med successfully deleted' });
    });
};
