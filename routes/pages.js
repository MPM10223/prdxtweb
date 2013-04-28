/**
 * New node file
 */
var login = require('./login');
var upload = require('./upload');
var problem = require('./problem');
var model = require('./model');

exports.init = function(app) {
	
	// public home
	app.get('/', function (req, res) { res.redirect('/home'); });
	app.get('/home', function (req, res) { global.session.userID = 0; res.render('home', {url: 'home'}); });
	app.get('/about', function (req, res) { res.render('about', {url: 'about'}); });
	app.get('/contact', function (req, res) { res.render('contact', {url: 'contact'}); });
	
	// login
	app.get('/login', login.show);
	app.post('/authenticate', login.authenticate);
	
	// user home
	app.get('/start', login.start);
	
	// new problem wizard
	app.get('/newProblem', function(req, res) {
		res.render('newProblem', { wizardID: 'newProblemWizard' });
	});
	
	app.post('/newProblem/uploadFile', upload.process);
	app.post('/newProblem/defineColumns', upload.defineColumns);
	
	// problems
	app.get('/problem', problem.show);
	app.get('/problem/status', problem.getStatus);
	
	// models
	app.get('/model', model.show);
	app.get('/model/elasticity', model.getElasticityData);
	app.get('/model/featureData', model.getFeatureData);
	app.get('/predict', model.predict);
	app.post('/predict/single', model.predictSingle);
	app.get('/predict/single/result', model.getPrediction);
};
 
 