
/*
 * GET login page.
 */
var sql = require('msnodesql'),
	nconf = require('nconf');
	
exports.show = function(req, res){
	var login_failed = req.param('failed') == 'true';
	res.render('login', { title: 'prdxt', login_failed: login_failed });
};

exports.authenticate = function(req, res) {

	var select = "select userID, clientID from users where username_e = ? AND pwd_e = ?";
	nconf.env().file({ file: 'config.json' });
	var conn = nconf.get("SQL_CONN");

	sql.query(conn, select, [req.param('username'), req.param('password')], function(err, results) {
		if(err) throw err;
		
		if(results.length == 0) {
			// no match
			res.redirect('/login?failed=true');
		} else {
			// authenticated
			global.session.userID = results[0].userID;
			global.session.clientID = results[0].clientID;
			res.redirect('/start');
		}
	});
};

exports.start = function(req, res) {
	var userID = global.session.userID;
	var clientID = global.session.clientID;

	nconf.env().file({ file: 'config.json' });
	var conn = nconf.get("SQL_CONN");
	var userProblemsSQL = "SELECT problemID, problemName, dateCreated FROM problems WHERE userID = ?";
	sql.query(conn, userProblemsSQL, [ userID ], function(err, results, more) {
		if(err) throw err;
		if(!more) {
			res.render('problemList', { userID: userID, problems: results });
		}
	});
};