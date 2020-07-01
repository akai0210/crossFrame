var url = 'http://192.168.1.10:8080/remote-assets/';

var data = {
	lobby:{
		version:"1.0.1",
		delete:false,
	},	
	douniu:{
		version:"1.0.1",
		delete:true,
		folders:[
			"Scene/douniu",
			"Texture/douniu",
			"resources/douniu",
		]
	},
}

module.exports.data = data;

module.exports.url = url;