// 导入node的文件模块
var fs = require('fs');
var path = require('path');
// 定义想要处理的svg文件夹路径，根据自己定义的文件夹名修改
const svgDir = path.resolve(__dirname, './icons');

// 读取单个文件
function readfile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(svgDir, filename), 'utf8', function(err, data) {
      if (err) reject(err);
      resolve({
        [filename.slice(0, filename.lastIndexOf('.'))]: data,
      });
    });
  });
}

// 读取SVG文件夹下所有svg
function readSvgs() {
  return new Promise((resolve, reject) => {
   fs.readdir(svgDir, function(err, files) {
     if (err) reject(err);
     Promise.all(files.map(filename => readfile(filename)))
      .then(data => resolve(data))
      .catch(err => reject(err));
   });
  });
}

// 在当前的目录下生成svgs.js
readSvgs().then(data => {
  let svgFile = 'export default ' + JSON.stringify(Object.assign.apply(this, data));
  fs.writeFile(path.resolve(__dirname, './icons.js'), svgFile, function(err) {
    if(err) throw new Error(err);
  })
}).catch(err => {
    throw new Error(err);
  });
