File = {
	server : {},
	port : {},
	db : {},
	collection : {},
	collectionUrl : {},
	config : function(config) {
		console.log(config.server);
		File.server = config.server;
		File.port = config.port;
		File.db = config.db;
		File.collection = config.collection;
		File.collectionUrl = config.db + config.collection;
	},
	collectionExists : function() {
		System.import('../../../../bower_components/restful.js/dist/restful.min').then(function(m) {
			console.log('import ...');
			console.log(m);
			var api = m(File.server, File.port);
			console.log(api);
			api.one(File.collectionUrl, 1).get().then(function(response) {
				console.log(response);
			}, function(response) {
				// The reponse code is not >= 200 and < 400
				console.log(response);
				// throw new Error('Invalid response');
			});
		});
	}

};

export
{
	File
}