File = {
	server : {},
	db : {},
	collection : {},
	collectionUrl : {},
	rest : {},
	config : function(config) {
		this.server = config.server;
		this.db = config.db;
		this.collection = config.collection;
		this.collectionUrl = config.server + config.db + config.collection;
		this.rest = config.rest;
	},
	collectionExists : function(){
		var api = this.rest('localhost').port(8080);

		api.one('core9-backend/files', 1).get().then(function(response) {
			  //console.log(response);
		}, function(response) {
		    // The reponse code is not >= 200 and < 400
		    //console.log(response);
		    //throw new Error('Invalid response');
		});
	}

};

export
{
	File
}