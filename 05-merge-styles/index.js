const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'styles');
const targetPath = path.join(__dirname, 'project-dist/bundle.css');

fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
  if (err) console.error(err);

  const readPromises = [];
  const writable = fs.createWriteStream(targetPath, 'utf8');

  files.forEach((file) => {
    if (path.extname(path.join(dirPath, file.name)) === '.css') {
      readPromises.push(
        new Promise((resolve, reject) => {
          const readable = fs.createReadStream(
            path.join(dirPath, file.name),
            'utf8'
          );

          readable.on('data', (chunk) => {
            writable.write(chunk);
          });

          readable.on('end', () => resolve());
          readable.on('error', (e) => reject(e));
        })
      );
    }
  });

  readPromises.reduce((prev, curr) => prev.then(() => curr));
});
