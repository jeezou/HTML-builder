const fs = require('fs');
const readline = require('node:readline');
const process = require('node:process');
const path = require('node:path');

const absolutePath = path.resolve(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(absolutePath, 'utf8');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const exitProcess = () => {
  console.log('\nComplete Write Session');
  rl.close();
  writeStream.end();
  process.exit();
};

process.on('exit', exitProcess);

const recReadLine = () => {
  rl.question('', (answer) => {
    if (answer.trim() === 'exit') process.exit();
    else {
      writeStream.write(answer);
      recReadLine();
    }
  });
};

console.log('Hi There! Lets write smthng\n');
recReadLine();
