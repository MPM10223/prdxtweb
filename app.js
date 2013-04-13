
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');
  
var pages = require('./routes/pages');
global.session = require('./session');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  
  app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.use(express.logger('dev'));
  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  
  pages.init(app);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
