var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var file_util = require('../public/file_util')

var readDir = function  (dir, obj,src) {
    var stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
        return;
    }
    var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;
    for (var i = 0; i < subpaths.length; ++i) {
        if (subpaths[i][0] === '.') {
            continue;
        }
        subpath = path.join(dir, subpaths[i]);
        stat = fs.statSync(subpath);
        if (stat.isDirectory()) {
            readDir(subpath, obj,src);
        }
        else if (stat.isFile()) {
            // Size in Bytes
            size = stat['size'];
            md5 = crypto.createHash('md5').update(fs.readFileSync(subpath)).digest('hex');
            compressed = path.extname(subpath).toLowerCase() === '.zip';

            relative = path.relative(src, subpath);
            relative = relative.replace(/\\/g, '/');
            relative = encodeURI(relative);
            if(relative){
                obj[relative] = {
                    'size' : size,
                    'md5' : md5
                };
                if (compressed) {
                    obj[relative].compressed = true;
                }                 
            }else{
                 Editor.log("relative error "+relative+" src "+src+" subpath "+subpath);
            }
            // 
            // if(!obj){
            //    
            // }else{
               
            // }

        }
    }
}
var parse_md5 = function(dest,manifest){
	
	// Iterate res and src folder
	Editor.log('parse_md5  '+dest);


	var destManifest = path.join(dest, 'project.manifest');
	var destVersion = path.join(dest, 'version.manifest');



	file_util.writeFile(destManifest, JSON.stringify(manifest));

	delete manifest.assets;
	delete manifest.searchPaths;
	file_util.writeFile(destVersion, JSON.stringify(manifest));	

}

module.exports.parse_md5 = parse_md5;
module.exports.readDir = readDir;


