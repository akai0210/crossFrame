var fs = require('fs');

var mkdir = function(path) {
	try {
		fs.mkdirSync(path);
	} catch (e) {
		if (e.code != 'EEXIST') throw e;
	}
}

var rmfile = function(fileName){
    fs.unlinkSync(fileName);
}
var rmdir = function(path) {
	try {
		fs.rmdirSync(path);
	} catch (e) {
		if (e.code != 'EEXIST') throw e;
	}
}
//同步写文件
var writeFile = function(fileName, data) {
	fs.writeFileSync(fileName, data, 'utf-8');
}
var readFile = function(fileName){
	return fs.readFileSync(fileName, 'utf-8');
}

var deleteFile = function(fileName){
    fs.unlinkSync(fileName); //删除文件
}

var remove = function(_src){
    if(fs.statSync(_src).isDirectory()){
        delDir(_src);
    } else{
        deleteFile(_src);
    }    
}


var copy = function copy(src, dst) {
    fs.writeFileSync(dst, fs.readFileSync(src));
  // fs.copyFileSync(src,dst);
}

var copyDir = function(src,dst){
	mkdir(dst);
    let paths = fs.readdirSync(src); //同步读取当前目录
    paths.forEach(function(path){
        var _src=src+'/'+path;
        var _dst=dst+'/'+path;
        if(fs.statSync(_src).isDirectory() ){
			mkdir(_dst)
            copyDir(_src,_dst);
        } else {
            copy(_src,_dst);
        }		
    });
}
function delDir(path){
    let files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()){
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(path);
    }
}
module.exports.deleteFile = deleteFile;
module.exports.delDir = delDir;
module.exports.mkdir = mkdir;
module.exports.copy = copy;
module.exports.copyDir = copyDir;
module.exports.writeFile = writeFile;
module.exports.readFile = readFile;
module.exports.rmdir = rmdir;