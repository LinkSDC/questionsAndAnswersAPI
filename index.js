const express = require('express');
const cors = require('cors');
const router = require('./routes/routes.js');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json())

app.use('/api/fec2/rfp/qa', router);

app.listen(process.env.SERVER, ()=>console.log(`Listening on ${process.env.SERVER}`));