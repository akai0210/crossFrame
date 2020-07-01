
var parse_xlsx = require("./parse_xlsx");
var parse_lang = require("./parse_lang");
var parse_ts = require("./parse_ts");

var file_util = require("../public/file_util");
console.log(' process.argv[2]',process.argv[2])
var moduleName = process.argv[2];
var data_path = process.argv[3];
var export_dir = process.argv[4];
let projectPath = process.argv[5];
let projectEnemFilePath = process.argv[6];


var lang_path = export_dir +"lang/";
var json_path = export_dir +"json/";
var ts_path   = export_dir + "ts/";

console.log(" exportPath ",export_dir)
console.log(" data_path ",data_path)
console.log(" lang_path ",lang_path)
console.log(" json_path ",json_path)
console.log(" ts_path ",ts_path)
console.log(" moduleName`11111 ",moduleName)
var main = function(moduleName){
	
	//创建目录
	var langFile = moduleName+"_lang_zh.json"
	//file_util.delDir(export_dir);
	file_util.mkdir(export_dir);
	file_util.mkdir(json_path);
	file_util.mkdir(lang_path);
	file_util.mkdir(ts_path);	
	console.log(" moduleName2222 ",moduleName)
	parse_xlsx(data_path,export_dir);
	parse_lang(moduleName,export_dir);
	parse_ts(moduleName,export_dir);
	console.log('projectPath  ===',projectPath," json_path ",json_path,'langFile',langFile)
	if(projectPath){
		file_util.copyDir(json_path,projectPath)
		file_util.copy(export_dir+langFile,projectPath+langFile)		
	}
	if(projectEnemFilePath){
		var moduleName = moduleName.substring(0, 1).toUpperCase() + moduleName.substring(1);
		let enumFile = moduleName+'EnumConfig.ts'		
		file_util.copy(export_dir+enumFile,projectEnemFilePath+enumFile)
	}
	
}

main(moduleName);
