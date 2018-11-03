const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
// var dbConfig = require('./dbconfig.js');
const router = require('./router');

const app = express();
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
app.use(morgan('combined'));
router(app);

// user register?
// review insert
// review update

const PORT = process.env.PORT || 5000;
app.listen(PORT);