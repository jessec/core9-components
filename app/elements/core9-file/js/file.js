File = {
	server : {},
	db : {},
	collection : {},
	collectionUrl : {},
	config : function(config) {
		this.server = config.server;
		this.db = config.db;
		this.collection = config.collection;
		this.collectionUrl = config.server + config.db + config.collection;
	},
	collectionExists : function() {
		System.import('../../../../bower_components/restful.js/dist/restful.min').then(function(m) {
			console.log('import ...');
			console.log(m);
			var api = m('localhost', 8080);
			console.log(api);
			api.one('core9-backend/files', 1).get().then(function(response) {
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