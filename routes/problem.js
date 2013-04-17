/**
 * problem.js
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
			var jobsListSQL = "SELECT algoID, algoName, build_status, build_runTime, build_progress, eval_status, eval_runTime, eval_progress, modelID, accuracy FROM dbo.vw_problemProgress WHERE problemID = ? ORDER BY accuracy DESC";
			sql.query(conn, jobsListSQL, [ problemID ], function(err, results, more) {
				if(err) throw err;
				if(!more) {
					var problemProgress = 0.0;
					var problemSize = 0.0;
					for(row in results) {
						problemProgress += (results[row].build_progress + results[row].eval_progress) / 2;
						problemSize += 1;
					}
				
					// render the problem status page
					res.render('problem', {
						problemID: problemID
						, problemName: problemName
						, problemProgress: problemProgress
						, problemSize: problemSize
						, jobsList: results
					});
				}
			});
		}
	});
};

exports.getStatus = function(req, res) {
	var problemID = req.param('problemID');
	
	nconf.env().file({ file: 'config.json' });
	var conn = nconf.get("SQL_CONN");
	
	var jobsListSQL = "SELECT algoID, build_status, build_progress, eval_status, eval_progress, modelID, accuracy FROM dbo.vw_problemProgress WHERE problemID = ?";
	sql.query(conn, jobsListSQL, [ problemID ], function(err, results, more) {
		if(err) throw err;
		if(!more) {
			var response = {};
			
			for(row in results) {
				var result = results[row];
			
				response["algo" + result.algoID] = {
					build_status: result.build_status
					, build_progress: result.build_progress
					, eval_status: result.eval_status
					, eval_progress: result.eval_progress
					, modelID: result.modelID
					, accuracy: result.accuracy
				};
			}
			
			res.write(JSON.stringify(response));
			res.end();
		}
	});
};