/**
 * New node file
 */
var login = require('./login');
var upload = require('./upload');
var problem = require('./problem');
var model = require('./model');

exports.init = function(app) {
	
	// login
	app.get('/', login.show);
	app.get('/login', login.show);
	app.post('/authenticate', login.authenticate);
	
	// home
	app.get('/start', login.start);
	
	// new problem wizard
	app.get('/newProblem', function(req, res) {
		res.render('newProblem', { wizardID: 'newProblemWizard' });
	});
	
	app.post('/newProblem/uploadFile', upload.process);
	app.post('/newProblem/defineColumns', upload.defineColumns);
	
	// problems
	app.get('/problem', problem.show)
	app.get('/model', model.show)
	app.get('/predict', model.predict)
};
 
 