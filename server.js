const secrets = require('./secrets.json');
const cors = require('cors');
let express = require('express'),
  app = express(),
  port = process.env.PORT || 3001;

app.use(cors());

const dbConnString = secrets.dbConnString;

const  mongoose = require('mongoose'),
  Product = require('./api/models/medListModel'), //created model loading here
  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(dbConnString);

app.get('/*', function(req, res, next){
  res.setHeader('Last-Modified', (new Date()).toUTCString());
  next();
});

var medListRoutes = require('./api/routes/medListRoutes'); //importing route

medListRoutes(app);
app.listen(port);

console.log('meditrack RESTful API server started on: ' + port);
