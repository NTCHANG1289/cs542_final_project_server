require('./config/config');
require('./db/redisClient');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./router');

//CORS middleware
var allowCrossDomain = function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  next();
}


const app = express();

app.use(allowCrossDomain);
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
app.use(morgan('combined'));
router(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);

module.exports.app = app;