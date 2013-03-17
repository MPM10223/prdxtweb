
/*
 * GET login page.
 */
var formidable = require('formidable'),
	sql = require('msnodesql'),
	nconf = require('nconf');

exports.show = function(req, res){
	res.render('login', { title: 'prdxt' });
};

exports.authenticate = function(req, res){
	var form = new formidable.IncomingForm();

	var select = "select userID, clientID from users where username_e = '?' AND pwd_e = '?'";
	nconf.env().file({ file: 'config.json' });
	var conn = nconf.get("SQL_CONN");

	sql.query(conn, select, [req.param('username'), req.param('password')], function(err, results) {
		if(err)
			throw err;
		console.log(results);
		
		if(results.length == 0) {
			// no match
			res.redirect('/login?failed=true');
		} else {
			// authenticated
			res.redirect('/start');
		}
	});
  return;
};