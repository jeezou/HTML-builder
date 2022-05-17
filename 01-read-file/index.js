const fs = require('fs');
const path = require('node:path');
const process = require('node:process');

const absolutePath = path.resolve(__dirname, 'text.txt');
const readStream = fs.createReadStream(absolutePath, 'utf8');

readStream.on('data', (chunk) => process.stdout.write(chunk));
