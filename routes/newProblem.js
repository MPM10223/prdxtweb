
/*
 * GET home page.
 */
 var sql = require('msnodesql');

exports.show = function(req, res){
	res.render('newProblem', { arg1: 'test' });
};