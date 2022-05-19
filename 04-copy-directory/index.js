const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files');
const targetPath = path.join(__dirname, 'files-copy');

fs.mkdir(targetPath, { recursive: true }, (err) => {
  if (err) return console.error(err);

  fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
    if (err) console.error(err);
    else {
      files.forEach((file) => {
        if (!file.isDirectory()) {
          fs.promises.copyFile(
            path.join(dirPath, file.name),
            path.join(targetPath, file.name)
          );
        }
      });
    }
  });
});
