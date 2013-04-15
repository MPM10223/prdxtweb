/**
 * New node file
 */
var login = require('./login');
var upload = require('./upload');
var problem = require('./problem');

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
};
 
 