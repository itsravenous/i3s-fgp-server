var http = require('http'),
	server = http.createServer(),
	url = require('url'),
	fs = require('fs'),
	path = require('path'),
	dbUtils = require('i3s-db-utils'),
	config = require('./config');

// Route requests
server.on('request', function (req, res) {

	var addFGPLinks = function (fgp) {
		fgp.links = [
			{
				rel: 'animal',
				url: req.headers.host + reqPath
			}
		]
		return fgp;
	}

	var url_parts = url.parse(req.url);
	var reqPath = decodeURIComponent(url_parts.path);

	if (reqPath == '/') {
		// Fetch fingerprints for all individuals
		var result = dbUtils.getAllFingerprints(config.fgpDir);
		result = [].concat.apply(result);
		result.map(addFGPLinks);
	} else {
		// Fetch fingerprints for an individual
		var result = dbUtils.getFingerprintsForIndividual(path.join(config.fgpDir, reqPath));
		result = result.map(addFGPLinks);
	}

	res.end(JSON.stringify(result));	
});

// Start server
server.listen(config.port);