'use strict';
var fs = require('fs');
var version_generator = require('./version_generator')
var path = require('path');
var file_util = require('../public/file_util');
var config = require('./config');
function onBeforeBuildFinish(options,callback){
	Editor.log('onBeforeBuildFinish');
	callback();
}


function getMenifest(name,version){
	var url = config.url;
	var manifest = {
	    packageUrl: url+name+'/',
	    remoteManifestUrl: url+name+'/project.manifest',
	    remoteVersionUrl: url+name+'/version.manifest',
	    version: version,
	    assets: {},
	    searchPaths: []
	};	
	return manifest;
}

function onBuildFinish(options,callback){
	Editor.log('onBuildFinish');
	// parseModule(options,"douniu");
	parseLobby(options,'lobby');
	callback();
}

function isContain(list,dbPath){
	for (var i = 0; i < list.length; i++) {
		if(dbPath.indexOf(list[i]) >= 0){
			return true;
		}
	}
	return false;
}

function parseModule(options,moduleName){
	var dest = path.join(Editor.Project.path,'/remote-assets',moduleName);
	let list = config.data[moduleName].folders;
	if(list){
		var destPath = path.join(dest, 'res');
		var importPath = path.join(destPath,'import')
		file_util.delDir(dest);
    	file_util.mkdir(dest);
    	file_util.mkdir(destPath);	
    	file_util.mkdir(importPath);	
		var buildResults = options.buildResults;

		var assets = buildResults.getAssetUuids();
		for (var i = 0; i < assets.length; i++) {
			// 
			var dbPath = Editor.assetdb.uuidToUrl(assets[i]);
			Editor.log('parseModule dbPath '+dbPath); 
			if(isContain(list,dbPath)){
				// Editor.log('parseModule path '+dbPath);
				parseDepand(options,assets[i],destPath,importPath);
			}
			
		}
		parse_md5(options,dest,moduleName);		
	}

}

function parseDepand(options,resUuid,destPath,importPath){
    var buildResults = options.buildResults;
	var resPath = Editor.assetdb.uuidToUrl(resUuid);
	var resNativePath = buildResults.getNativeAssetPath(resUuid);

	move(options,resUuid,destPath,importPath);
    // 获得指定资源依赖的所有资源
    var depends = buildResults.getDependencies(resUuid);

    for (var i = 0; i < depends.length; ++i) {
        var uuid = depends[i];
        parseDepand(options,uuid,destPath,importPath);
    }

}

function move(options,uuid,destPath,importPath){
	
	let buildResults = options.buildResults;
    // 获得工程中的资源相对 URL（如果是自动图集生成的图片，由于工程中不存在对应资源，将返回空）
    let url = Editor.assetdb.uuidToUrl(uuid);
    Editor.log("url "+url);
    // 获取资源类型
    let type = buildResults.getAssetType(uuid);
    // 获得工程中的资源绝对路径（如果是自动图集生成的图片，同样将返回空）
    let rawPath = Editor.assetdb.uuidToFspath(uuid);
    // Editor.log("rawPath "+rawPath);
    // 获得构建后的原生资源路径（原生资源有图片、音频等，如果不是原生资源将返回空）
    let nativePath = buildResults.getNativeAssetPath(uuid);

    // Editor.log("nativePath "+nativePath);

    if(nativePath){
	    // Editor.log("nativePath "+nativePath);
	    // Editor.log("rawPath "+rawPath);
		let tag = 'res/'
		let srcFile = nativePath;
		// Editor.log("srcFile "+srcFile)
		let index = srcFile.indexOf(tag);
		// Editor.log("index "+index)
		let fileName = srcFile.substring(index+tag.length);
		let list = fileName.split('/');
		let dd = ""
		for (let i = 0; i < list.length - 1; i++) {
			if(i == 0){
				dd = list[i];
			}else{
				dd = path.join(dd,list[i]);
			}
			let dir = path.join(destPath,dd);
			// Editor.log("dir "+dir);
			if(!fs.existsSync(dir)){
				file_util.mkdir(dir);
			}
		}
		// Editor.log("fileName "+nativePath);
		let destFile = destPath+"/"+fileName
		// Editor.log("destFile "+destFile)
		// Editor.log("--------------------- ")
		
		if(fs.existsSync(srcFile)){
			file_util.copy(srcFile,destFile)
			file_util.deleteFile(srcFile);   
		}
		 	
    }else{
    	Editor.log("--------------------- ")
    	Editor.log("uuid "+uuid);
    	let head = uuid.substring(0,2);
    	Editor.log("head "+head)
    	let sp =path.join(options.dest,'res','import',head);
    	let jsonName =  uuid +".json";
    	let sf = sp + "/" + jsonName;
    	Editor.log("srcFile "+sf)
    	if(fs.existsSync(sf)){
    		
    		let destImport = path.join(destPath,'import',head);
    		file_util.mkdir(destImport)
    		let df = destImport +"/" + jsonName;
    		Editor.log("destFile "+df)
			file_util.copy(sf,df)
			file_util.deleteFile(sf);      		
    	}
    	Editor.log("-----------==========---------- ")
    	

    }

}

function parse_md5(options,src,moduleName){
	// var moduleName = 'lobby';
	var manifest = getMenifest(moduleName,config.data[moduleName].version);
	//Editor.log('Building ' + options.platform + ' to ' + options.dest+" Editor.projectPath "+Editor.Project.path); 
	var resPath = path.join(src, 'res');
	var dest = path.join(Editor.Project.path,'/remote-assets',moduleName)
	Editor.log("  dest "+dest);
	version_generator.readDir(resPath, manifest.assets,src);	
	version_generator.parse_md5(dest,manifest);	
}

function parseLobby(options,moduleName){
	let src = options.dest;
	// var moduleName = 'lobby';
	var manifest = getMenifest(moduleName,config.data[moduleName].version);
	//Editor.log('Building ' + options.platform + ' to ' + options.dest+" Editor.projectPath "+Editor.Project.path); 
	var srcPath = path.join(src, 'src');
	var resPath = path.join(src, 'res');
	var dest = path.join(Editor.Project.path,'/remote-assets',moduleName)
	version_generator.readDir(srcPath, manifest.assets,src);
	version_generator.readDir(resPath, manifest.assets,src);	
	file_util.delDir(dest);
	file_util.mkdir(dest);		

	version_generator.parse_md5(dest,manifest);	
	var destManifest = path.join(dest, 'project.manifest');
	file_util.copy(destManifest,path.join(Editor.Project.path,'/assets/project.manifest'));
	//file_util.copy(destVersion,path.join(Editor.Project.path,'/assets/version.manifest'));
	
	var destSrcPath = path.join(dest, 'src');
	var destResPath = path.join(dest, 'res');
	Editor.log('srcPath  '+srcPath+"  dest src "+destSrcPath);
	Editor.log('resPath  '+resPath+"  dest res "+destResPath);
	file_util.copyDir(srcPath,destSrcPath);
	file_util.copyDir(resPath,destResPath);
}


module.exports = {
  load () {
    // 当 package 被正确加载的时候执行
	Editor.log('build plush onload');
	Editor.Builder.on('before-change-files', onBeforeBuildFinish);
	Editor.Builder.on('build-finished', onBuildFinish);
	
  },

  unload () {
    // 当 package 被正确卸载的时候执行
	 Editor.Builder.removeListener('before-change-files', onBeforeBuildFinish);
	 Editor.Builder.removeListener('build-finished', onBuildFinish);
  },

};
