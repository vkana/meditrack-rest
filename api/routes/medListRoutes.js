'use strict';
module.exports = function(app) {
  var medList = require('../controllers/medListController');

  // medList Routes
  app.route('/meds')
    .get(medList.list_all_meds)
    .post(medList.create_a_med);

  app.route('/meds/:medId')
    .get(medList.read_a_med)
    .put(medList.update_a_med)
    .delete(medList.delete_a_med);
};
