const { createReadStream } = require('fs');
const path = require('path');
const pg = require('pg');
const csv = require('csv-parser');

createReadStream('./csv/product.csv')
  .pipe(csv())
  .on('data', data=>console.log(data))
