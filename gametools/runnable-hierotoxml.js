var fs = require('fs');
var path = require('path');
var file_util = require('./public/file_util');

function readDir(res_path) {
		
	var fileData = file_util.readFile(res_path);
	//console.log(' fileData ',fileData,' res_path ',res_path)
	var exportText = parseTextToXML(fileData)
	console.log('',exportText)
	file_util.writeFile(res_path, exportText);
}

function parseTextToXML(text){
	let eText = '<?xml version="1.0"?>\r\n'+
	'<font>\r\n'+
	'  %{info} \r\n'+
	'  %{common} \r\n'+
	'  <pages>\r\n'+
	'    %{page}'+
	'  </pages>\r\n'+
	'  %{chars}'+
	'  %{char}'+
	'</chars>\r\n'+
	'</font>'
	
	var chars = ''
	var pages = ''
	
	let lines = text.split('\r\n')
	//console.log(' lines ',lines ,' lines length ',lines.length)
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i]
		if(line.indexOf('kernings')>=0){
			continue;
		}
		//console.log(' text ',text)
		var values = line.split((' '))
		var content = ''
		for (var j = 0; j < values.length; j++) {
			var value = values[j]
			if(value){
				value = value.trim();
				if(value.indexOf('=') >= 0){
					//console.log(' value11 ==',value)
					var texts = value.split('=')
					if(texts[1].indexOf('"') >= 0){
						content += texts[0]+'='+texts[1]+' '
					}else{
						content += texts[0]+'="'+texts[1]+'" '
					}
					
				}else{
					//console.log(' value22 ==',value)
					content += '<'+value+' '
				}
				
			}
			
		}
		// if(line.indexOf('chars') >= 0){
		// 	content+='>\r\n '
		// }else{
		// 	content+='/>\r\n  '
		// }
		
		//console.log(' line ',line)
		// console.log('line.indexOf(common)  ',line.indexOf('common') )
		if(line.indexOf('info')>=0){
			content+='/>\r\n  '
			eText = eText.replace('%{info}',content)
		}else if(line.indexOf('common') >= 0){
			// console.log(' %{common} repace ')
			content+='/>\r\n  '
			eText = eText.replace('%{common}',content)
		}else if(line.indexOf('chars') >= 0){
			content+='>\r\n '
			eText = eText.replace('%{chars}',content)
		}else if(line.indexOf('char') >= 0){
			content+='/>\r\n  '
			if(j == values.length - 1 ){
				chars += content+'\r '
			}else{
				chars += '  '+content+'\r  '
			}
			
		}else if(line.indexOf('page') >= 0){
			content+='/>\r\n  '
			pages += content +'\r';
		}
		//console.log(' content ',content)
		
	}
	//console.log('page  =====   ',eText)
	eText = eText.replace('%{page}',pages)
	//console.log('char  =====   ',eText)
	eText = eText.replace('%{char}',chars)
	return eText
}
console.log(' process.argv[2] ',process.argv[2])
readDir(process.argv[2])