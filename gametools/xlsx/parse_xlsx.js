var xlsx = require("node-xlsx");
var fs = require('fs');
var file_util = require('../public/file_util');
var path = require('path');
var coder = require('../public/coder')
var fileName = process.argv[2];

//if(fileName){
//var export_dir = "./";
//parseFile(fileName,export_dir);
//}
//表头列说明序号
const NAME = 0;
const VALUE = 0;

const LANG = 2;
const TEMPLATE = 1;
const DATA = 0;

// console.log(" fileName ",fileName);
var enums = "";
//语言表内容
var langObj = {};
// 索引表的内容


//每个key对应的索引值
var indexOfKey = {}

//解析Excel
function praseExcel(list, export_dir) {
	if (list.length <= 0) {
		return;
	}
	console.log("list.length ", list.length);

	var lang_path = export_dir + "lang/";
	var json_path = export_dir + "json/";
	var ts_path = export_dir + "ts/";
	//合并文件
	var bigObj = {};
	bigObj["data"] = {};
	var headConfig = list[0].data;
	console.log(" headconfig ", headConfig);

	var bigFileName = headConfig[NAME][VALUE];
	console.log("name is ", NAME, " value ", VALUE, " bigFileName ", bigFileName);
	for (var i = 1; i < list.length; i++) {
		if (!headConfig[i]) {
			continue;
		}
		langObj = {};
		var indexObj = {};
		var result = {}; //每张表的导出内容
		var keys = {}; // id列表，对应内容的索引。
		var excleData = list[i].data;
		var dataArray = [];
		var nameArray = excleData[0]; // 第一行 说明
		var keyArray = excleData[1]; //第二行 名称
		var typeArray = excleData[2]; // 第三行 类型
		var scArray = excleData[3]; // 第四行 导出类别 s 服务器  c 客户端 sc 服务器与客户端。
		var index = 0;

		var sheetName = headConfig[i][VALUE];
		console.log(" i ", i, " sheetname", sheetName);
		var enumName = sheetName.substring(0, 1).toUpperCase() + sheetName.substring(1);

		var enumObj = "export enum " + enumName + "Enum{\n\t%{data}\n}";
		var enums = "";
		var keyIndex = 0;
		for (var k = 1; k < keyArray.length; k++) {
			if (typeArray[k] != 'null') {
				var key = keyArray[k];
				enums += key + ",// " + nameArray[k] + "\n\t";
				indexOfKey[key] = keyIndex ++
			}
		}

		enumObj = enumObj.replace('%{data}', enums);

		for (var j = 4; j < excleData.length; j++) {
			var curData = excleData[j];
			if (curData.length == 0) continue;
			var item = changeObj(sheetName, curData, typeArray, keyArray, scArray,indexObj);
			keys[curData[0]] = index;
			index++;
			dataArray.push(item);
		}
		// index = 0;
		console.log('enumObj ',enumObj)

		if (dataArray.length > 0) {
			result["data"] = dataArray;
			result["key"] = keys;
			result["type"] = DATA;
			if (indexObj) {
				result["index"] = indexObj;
			}
			// console.log("list[i].name",sheetName);
			if (!bigFileName || bigFileName == "null") { //如果不合并 直接导出
				file_util.writeFile(json_path + sheetName + ".json", JSON.stringify(coder.pack(result,1)));
			} else {
				bigObj["data"][sheetName] = result;
			}
			if (langObj) {
				file_util.writeFile(lang_path + sheetName + "_lang.json", JSON.stringify(langObj));
			}
			
			file_util.writeFile(ts_path + enumName + "Enum.ts", enumObj);
		} else {
			console.log("内容为null ");
			console.log(' export file name ', json_path + sheetName + ".json")
		}



	}
	if (bigFileName && bigFileName != "null") {
		bigObj["type"] = TEMPLATE;
		let out = coder.pack(bigObj,1)
		file_util.writeFile(json_path + bigFileName + ".json", JSON.stringify(out));
	}
	console.log("qqq");
}
//转换数据类型
function changeObj(sheetName, curData, typeArray, keyArray, scArray,indexObj) {
	var id = curData[0];
	var obj = [];
	for (var i = 1; i < curData.length; i++) {
		// console.log("data "+curData[i]+" type "+typeArray[i]+" key "+keyArray[i]+" sc "+scArray[i]);
		//字母 
		if (typeArray[i] != 'null') {
			obj.push(changeValue(curData[i], typeArray[i], sheetName, id, keyArray[i], i - 1,indexObj));
		}

	}
	return obj;
}

function changeValue(value, type, sheetName, id, key, index,indexObj) {

	//console.log(" type ",type," value ",value,' sheetName ',sheetName,' index ',index);
	var start = type.indexOf('[');
	if (start >= 0) {
		if (value == null || value == "null" || value == "") return [];
		value = "" + value;
		var end = type.indexOf(']', type.length - 1);
		var t = type.substring(start + 1, end);
		// console.log(" end ",end," start ",start," t ",t);
		if (type.indexOf('[[') >= 0) {
			var list1 = value.split('|');
			var temp1 = [];
			for (var i = 0; i < list1.length; i++) {
				temp1.push(changeValue(list1[i], t, sheetName, id, key, index));
			}
			return temp1;
		} else {
			var list2 = value.split(',');
			var temp2 = [];
			var t2 = type.substring(start + 1, end);
			for (var i = 0; i < list2.length; i++) {
				temp2.push(changeValue(list2[i], t2, sheetName, id, key));
			}
			return temp2;
		}
	} else {
		switch (type) {
			case 'n':
				if (value == null || value == "null") return 0;
				let v = new Number(value)
				return v
			case 'i':
				if (value == null || value == "null") return 0;
				return parseInt(value);
			case 'f':
				if (value == null || value == "null") return 0.0;
				return parseFloat(value);
			case 's':
				if (value == null || value == "null") return "";
				return value;
			case 'lang': // 根据文件名key 和列名 生成ID并返回生成的ID
				if (value == null || value == "null") return "";
				var langID = sheetName + "_" + key + "_" + id;
				langObj[langID] = value;
				return langID;
			case 'index':
				var idx = indexOfKey[key]
				if (!indexObj[idx]) {
					indexObj[idx] = {}
				}
				if(value >= 0){
					if (!indexObj[idx][value]) {
						indexObj[idx][value] = []
					}
				//console.log("index  value ",value,' id ',id)
					indexObj[idx][value].push(id);
					return parseInt(value);
				}
				return 0;
			case 'any':
				return value;
			case 'null':
				return ""

		}

	}

	return "";
}

var ignoreFileList = ['脚本数据', 'test']
// 加密算法可以公开  
function encrypt(plainText, key) {
	return plainText ^ key;
}

// 解密算法也可以公开  
function decrypt(cipherText, key) {
	return cipherText ^ key;
}

function parseFile(fileName, exportPath) {
	console.log(" fileName ", fileName)
	for (var i = 0; i < ignoreFileList.length; i++) {
		if (fileName.indexOf(ignoreFileList[i]) >= 0) {
			return;
		}
	}
	praseExcel(xlsx.parse(fileName), exportPath);
}


function readDir(dir, exportPath) {
	var stat = fs.statSync(dir);
	if (!stat.isDirectory()) {
		return;
	}
	var subpaths = fs.readdirSync(dir),
		subpath;
	for (var i = 0; i < subpaths.length; ++i) {
		if (subpaths[i][0] === '.') {
			continue;
		}
		subpath = path.join(dir, subpaths[i]);
		stat = fs.statSync(subpath);
		if (stat.isDirectory()) {
			// readDir(subpath, obj);
		} else if (stat.isFile()) {
			// Size in Bytes
			// console.log(" subpath ",subpath);
			parseFile(subpath, exportPath);
		}
	}
}

module.exports = readDir
