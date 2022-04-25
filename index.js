const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const { router } = require('./routes/routes.js');

app.use(cors());
app.use(express.json());

app.use('/api/fec2/rfp/qa', router);

app.listen(process.env.SERVER, ()=>console.log(`Listening on ${process.env.SERVER}`));

// curl -i http://localhost:3113/api/fec2/rfp/qa/questions?product_id=1