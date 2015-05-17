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
		//var collection = this.rest.GET(this.collectionUrl);
		//console.log(collection);
	}

};

export
{
	File
}