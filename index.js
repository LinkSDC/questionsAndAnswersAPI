const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const { router } = require('./routes/routes.js');

const cluster = require('cluster');
const { cpus } = require('os');
const process = require('process');

const numCPUs = cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {

  app.use(cors());
  app.use(express.json());

  app.use('/api/fec2/rfp/qa', router);

  app.listen(process.env.SERVER, ()=>console.log(`Listening on ${process.env.SERVER}`));

  console.log(`Worker ${process.pid} started`);
}

// curl -i http://localhost:3113/api/fec2/rfp/qa/questions?product_id=1