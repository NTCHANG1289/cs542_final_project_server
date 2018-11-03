const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./router');

const app = express();

app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
app.use(morgan('combined'));
router(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);