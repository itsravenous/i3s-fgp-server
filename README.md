i3s-fgp-server
==============

Server app which exposes an I3S Finger Print database via a RESTful interface.

# Setup

1. Copy `config.example.js` to `config.js` and edit it to point to your I3S Classic database folder.
2. `node index.js` (or use your choice of `forever`, etc.)

# Usage
* Fetch all fingerprints for individual WS001: `GET http://i3s-server:8000/WS001`
* Fetch a specific fingerprint for individual WS001: `GET http://i3s-server:8000/WS001/WS001 - Hoadhum_LEFT.fgp`