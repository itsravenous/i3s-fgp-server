var http = require('http'),
	server = http.createServer(),
	url = require('url'),
	fs = require('fs'),
	path = require('path'),
	fgpReader = require('i3s-fgp-reader'),
	config = require('./config');

var fgpDir = config.fgpDir;

/**
 * Provides the image filename corresponding to a fingerprint
 * @param {String} fingerprint filename
 * @return {String} image filename
 */
function getFGPImageName (fgpFile) {
	return fgpFile.split('.fgp')[0]+'.jpg';
}

/**
 * Fetches fingerprints for an individual
 * @param {String} individual ID
 * @return {Array}
 */
function getFingerprintsForIndividual(id) {
	var dir = path.join(config.fgpDir, id);
	if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
		return false;
	}

	var fgpFiles = fs.readdirSync(dir).filter(function (entry) {
		return entry.split('.').pop().toLowerCase() == 'fgp';
	});
	var fgps = [];
	fgpFiles.forEach(function (fgpFile) {
		fgpFile = path.join(dir, fgpFile);
		var fgpData = fgpReader(fgpFile);
		fgps.push({
			fgp: fgpData,
			img64: fs.readFileSync(getFGPImageName(fgpFile)).toString('base64')
		});
	});
	return fgps;
}

/**
 * Fetches fingerprints for all individuals
 * @return {Array}
 */
function getAllFingerprints() {
	var ids = fs.readdirSync(config.fgpDir);
	var fgps = ids.map(getFingerprintsForIndividual).filter(function (id) { return id});
	return fgps;
}

// Route requests
server.on('request', function (req, res) {
	var url_parts = url.parse(req.url);
	var reqPath = decodeURIComponent(url_parts.path);

	if (reqPath == '/') {
		// Fetch fingerprints for all individuals
		var result = getAllFingerprints();
	} else {
		var result = getFingerprintsForIndividual(reqPath);
	}

	res.end(JSON.stringify(result));	
});

// Start server
server.listen(config.port);