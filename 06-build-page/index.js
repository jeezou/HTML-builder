const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const targetPath = path.join(__dirname, 'project-dist');

const bundleAssets = async (from, to) => {
  const files = await fsp.readdir(from, { withFileTypes: true });

  files.forEach((el) => {
    const init = path.join(from, el.name);
    const target = path.join(to, el.name);
    if (el.isDirectory()) {
      fs.mkdir(target, { recursive: true }, (err) => {
        if (err) console.error(err);
        else {
          bundleAssets(init, target);
        }
      });
    } else {
      fsp.copyFile(init, target);
    }
  });
};

const bundleStyles = async (from, to) => {
  const files = await fsp.readdir(from, { withFileTypes: true });

  const readPromises = [];
  const writable = fs.createWriteStream(to, 'utf8');

  files.forEach((file) => {
    if (path.extname(path.join(from, file.name)) === '.css') {
      readPromises.push(
        new Promise((resolve, reject) => {
          const readable = fs.createReadStream(
            path.join(from, file.name),
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
};

const bundleComponents = async (template, components, target) => {
  let templateData = await fsp.readFile(template, 'utf8');
  const compsObj = {};

  const comps = await fsp.readdir(components, { withFileTypes: true });
  const readPromises = [];

  comps.forEach((comp) => {
    if (path.extname(path.join(components, comp.name)) === '.html') {
      readPromises.push(
        new Promise((resolve, reject) => {
          const name = comp.name.replace('.html', '');
          fs.readFile(path.join(components, comp.name), 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              reject();
            } else {
              compsObj[name] = data;
              resolve();
            }
          });
        })
      );
    }
  });

  Promise.all(readPromises).then(() => {
    const regExp = /{{.*}}/g;
    const matches = [...templateData.matchAll(regExp)];
    matches.forEach((match) => {
      const reg = /{{|}}/g;
      templateData = templateData.replace(
        match[0],
        compsObj[match[0].replace(reg, '')]
      );
    });

    fs.writeFile(target, templateData, (err) => {
      if (err) console.error(err);
    });
  });
};

const bundle = (targetPath) => {
  const assetsPath = path.join(__dirname, 'assets');
  const stylesPath = path.join(__dirname, 'styles');
  const compsPath = path.join(__dirname, 'components');
  const tempPath = path.join(__dirname, 'template.html');

  fs.mkdir(targetPath, { recursive: true }, (err) => {
    if (err) console.error(err);
    else {
      bundleAssets(assetsPath, path.join(targetPath, 'assets'));
      bundleStyles(stylesPath, path.join(targetPath, 'style.css'));
      bundleComponents(
        tempPath,
        compsPath,
        path.join(targetPath, 'index.html')
      );
    }
  });
};

fs.stat(targetPath, (err) => {
  if (err) bundle(targetPath);
  else {
    fs.rm(targetPath, { recursive: true }, (err) => {
      if (err) console.error(err);
      else bundle(targetPath);
    });
  }
});
