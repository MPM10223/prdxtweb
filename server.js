/**
 * New node file
 */

 var server = require('./serverObj');
 var router = require('./router');
 var requestHandlers = require('./requestHandlers');
 
 var handle = {}
 handle['/'] = requestHandlers.login;
 handle['/login'] = requestHandlers.login;
 
 server.start(router.route, handle);