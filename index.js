var http = require('http'),
	server = http.createServer(),
	url = require('url'),
	fs = require('fs'),
	path = require('path'),
	dbUtils = require('i3s-db-utils'),
	config = require('./config');

// Route requests
server.on('request', function (req, res) {

	var getAnimalURL = function (id) {
		return 'http://'+req.headers.host + '/' + id;
	}

	var addFGPLinks = function (fgp) {
		fgp.links = [
			{
				rel: 'animal',
				url: 'http://'+req.headers.host + reqPath
			}
		]
		return fgp;
	}

	var addAnimalLinks = function (id) {
		var result = {
			id: id
		};
		result.links = [
			{
				rel: 'animal',
				url: getAnimalURL(id)
			}
		];
		return result;
	}

	var url_parts = url.parse(req.url);
	var reqPath = decodeURIComponent(url_parts.path);

	if (config.env == 'development') console.log(req.method, reqPath);

	if (reqPath == '/') {
		// Fetch index of individuals
		var result = dbUtils.getAnimals(config.fgpDir);
		if (result) {
			result = result.map(addAnimalLinks);
		} else {
			result = [];
		}
	} else {
		// Fetch fingerprints for an individual
		var result = {
			id: reqPath.substr(1)
		};
		var fgps = dbUtils.getFingerprintsForAnimal(path.join(config.fgpDir, reqPath));
		if (fgps) {
			result.fgps = fgps.map(addFGPLinks);
		}
	}

	res.setHeader('Access-Control-Allow-Origin', '*');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	res.setHeader('Content-Type', 'application/json');

	res.end(JSON.stringify(result));
});

// Start server
server.listen(config.port);
