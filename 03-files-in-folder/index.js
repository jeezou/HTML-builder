const fs = require('fs');
const path = require('path');

const absolutePath = path.resolve(__dirname, 'secret-folder');

fs.readdir(absolutePath, { withFileTypes: true }, (err, files) => {
  if (err) console.error(err);
  else {
    files.forEach((file) => {
      if (!file.isDirectory()) {
        fs.stat(path.resolve(absolutePath, file.name), (error, stats) => {
          if (error) console.error(error);
          else {
            console.log(
              `${file.name.split('.')[0]} - ${path
                .extname(path.resolve(absolutePath, file.name))
                .slice(1)} - ${(stats.size / 1024).toFixed(3)}kb`
            );
          }
        });
      }
    });
  }
});
