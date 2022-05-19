const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files');
const targetPath = path.join(__dirname, 'files-copy');

const copyFiles = () => {
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
};

fs.mkdir(targetPath, { recursive: true }, (err) => {
  if (err) return console.error(err);

  fs.readdir(targetPath, { withFileTypes: true }, (err, files) => {
    if (err) return console.error(err);

    const delPromises = [];

    files.forEach((file) => {
      delPromises.push(
        new Promise((resolve, reject) => {
          fs.unlink(path.join(targetPath, file.name), (err) => {
            if (err) {
              reject(err);
              console.error(err);
            } else {
              resolve();
            }
          });
        })
      );
    });

    Promise.all(delPromises).then(copyFiles);
  });
});
