
/*
 * GET new problem wizard.
 */
 var sql = require('msnodesql'),
	nconf = require('nconf');

exports.show = function(req, res){
	res.render('index', { title: 'prdxt' });
};