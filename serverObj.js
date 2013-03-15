var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

function start(route, handle) {
	var port = process.env.PORT || 1337;

	function onRequest(req, res) {
	  var filePath = '.' + req.url;
	  var extname = path.extname(filePath);
	  var contentType = 'text/html';
	  
	  switch (extname) {
	    case '.js':
	      contentType = 'text/javascript';
	      break;
	    case '.css':
	      contentType = 'text/css';
	      break;
	  }
	  
	  var pathname = url.parse(req.url).pathname;
	  
	  path.exists(filePath, function(exists) {
	    if(exists) {
	      // serve up the file directly
	      fs.readFile(filePath, function(error, content) {
	        if(error) {
	          res.writeHead(500);
	          res.write('error loading file: ' + filePath);
	          res.end();
	        } else {
	          console.log('successfully served ' + filePath);
	          res.writeHead(200, {'Content-Type': contentType });
	          res.end(content, 'utf-8');
	        }
	      });
	    } else {
	      // route
	      route(handle, pathname, res, req);
	    }
	  });
	}

	http.createServer(onRequest).listen(port);
	console.log('Server has started.');
}

exports.start = start;