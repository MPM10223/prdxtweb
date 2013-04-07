/**
 * New node file
 */
var login = require('./login');

exports.init = function(app) {
	
	// login
	app.get('/', login.show);
	app.get('/login', login.show);
	app.post('/authenticate', login.authenticate);
	
	// home
	app.get('/start', function(req, res) {
		res.render('index');
	});
	
	// new problem wizard
	app.get('/newProblem', function(req, res) {
		res.render('newProblem', {wizardID: 'newProblemWizard'});
	});
	
	app.post('/newProblem/uploadFile', function(req, res) {
		//TODO: process uploaded file
		res.render('sourceData');
	});
	
	app.get('/newProblem/pickColumns', function(req, res) {
		res.render('pickColumns');
	});
	
	//app.post('/uploadFile', newProblem.uploadFile);
};
 
 