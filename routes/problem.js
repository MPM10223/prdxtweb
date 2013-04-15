/**
 * upload.js
 */
var nconf = require('nconf');
var sql = require('msnodesql');

exports.show = function(req, res) {
	var problemID = req.param('problemID');
	
	nconf.env().file({ file: 'config.json' });
	var conn = nconf.get("SQL_CONN");
	
	// get the problemName
	var problemSQL = "SELECT problemName FROM problems WHERE problemID = ?";
	sql.query(conn, problemSQL, [ problemID ], function(err, results, more) {
		if(err) throw err;
		if(!more) {
			var problemName = results[0].problemName;
			
			// get the initial jobs list
			var jobsListSQL = "SELECT problemID, algoName, build_status, build_runTime, build_progress, eval_status, eval_runTime, eval_progress, accuracy FROM dbo.vw_problemProgress WHERE problemID = ?";
			sql.query(conn, jobsListSQL, [ problemID ], function(err, results, more) {
				if(err) throw err;
				if(!more) {
					// render the problem status page
					res.render('problem', {problemID: problemID, problemName: problemName, jobsList: results});
				}
			});			
		}
	});
};