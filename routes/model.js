/**
 * model.js
 */
var nconf = require('nconf');
var sql = require('msnodesql');

exports.show = function(req, res) {
	var modelID = req.param('modelID');
	
	nconf.env().file({ file: 'config.json' });
	var conn = nconf.get("SQL_CONN");
	
	var modelSQL = "SELECT a.algoName, mt.modelTypeName, p.problemID, p.problemName FROM models m JOIN modelTypes mt ON m.modelTypeID = mt.modelTypeID JOIN algos a ON m.algoID = a.algoID JOIN problems p ON m.problemID = p.problemID WHERE m.modelID = ?";
	sql.query(conn, modelSQL, [ modelID ], function(err, results, more) {
		if(err) throw err;
		if(!more) {
			var algoName = results[0].algoName;
			var modelName = results[0].modelTypeName;
			var problemID = results[0].problemID;
			var problemName = results[0].problemName;
			
			var featuresSQL = "SELECT mf.inputIndex, mf.featureID, pf.featureName FROM modelFeatures mf JOIN problemFeatures pf ON mf.problemID = pf.problemID AND mf.featureID = pf.featureID WHERE mf.modelID = ?";
			sql.query(conn, featuresSQL, [ modelID ], function(err, results, more) {
				if(err) throw err;
				if(!more) {
					res.render("model", { 
						modelID: modelID
						, modelName: modelName
						, algoName: algoName
						, problemID: problemID
						, problemName: problemName
						, features: results
					});
				}
			});
		}
	});
};

exports.predict = function(req, res) {
	var modelID = req.param('modelID');
	
	nconf.env().file({ file: 'config.json' });
	var conn = nconf.get("SQL_CONN");
	
	var modelSQL = "SELECT a.algoName, mt.modelTypeName, p.problemID, p.problemName FROM models m JOIN modelTypes mt ON m.modelTypeID = mt.modelTypeID JOIN algos a ON m.algoID = a.algoID JOIN problems p ON m.problemID = p.problemID WHERE m.modelID = ?";
	sql.query(conn, modelSQL, [ modelID ], function(err, results, more) {
		if(err) throw err;
		if(!more) {
			var algoName = results[0].algoName;
			var modelName = results[0].modelTypeName;
			var problemID = results[0].problemID;
			var problemName = results[0].problemName;
			
			var featuresSQL = "SELECT mf.inputIndex, mf.featureID, pf.featureName, fa.avgValue FROM modelFeatures mf JOIN problemFeatures pf ON mf.problemID = pf.problemID AND mf.featureID = pf.featureID JOIN ( SELECT problemID, featureID, AVG(value) avgValue FROM problemData GROUP BY problemID, featureID ) fa ON fa.problemID = mf.problemID AND fa.featureID = mf.featureID WHERE mf.modelID = ?";
			sql.query(conn, featuresSQL, [ modelID ], function(err, results, more) {
				if(err) throw err;
				if(!more) {
					res.render("predict", { 
						modelID: modelID
						, modelName: modelName
						, algoName: algoName
						, problemID: problemID
						, problemName: problemName
						, features: results
					});
				}
			});
		}
	});
};

exports.predictSingle = function(req, res) {

	var modelID = req.body.modelID;
	
	nconf.env().file({ file: 'config.json' });
	var conn = nconf.get("SQL_CONN");
	
	var createRunSQL = "INSERT INTO applyModelRuns (modelID) SELECT ? SELECT scope_identity() as applyModelRunID";
	sql.query(conn, createRunSQL, [ modelID ], function(err, results, more) {
		if(err) throw err;
		if(!more) {
			var applyModelRunID = results[0].applyModelRunID;
			
			var createRunTargetSQL = "INSERT INTO applyModelTargets (applyModelRunID, identifier) SELECT ?, '[None - Individual]' SELECT scope_identity() as applyModelTargetID";
			sql.query(conn, createRunTargetSQL, [ applyModelRunID ], function(err, results, more) {
				if(err) throw err;
				if(!more) {
					var applyModelTargetID = results[0].applyModelTargetID;

					var inputDataSQL = "";
					for(field in req.body) {
						var pattern = /feature(\d+)/;
						if(pattern.test(field)) {
							var featureID = pattern.exec(field)[1];
							var featureValue = req.body[field];
							
							if(inputDataSQL.length > 0) inputDataSQL +=  " UNION ALL ";
							inputDataSQL += "SELECT " + featureID + " as featureID, " +  featureValue + " as value";
						}
					}
					
					var inputSQL = "INSERT INTO applyModelInputs (applyModelTargetID, modelID, inputIndex, value) SELECT ?, mf.modelID, mf.inputIndex, d.value FROM ("+inputDataSQL+") d JOIN modelFeatures mf ON mf.modelID = ? AND mf.featureID = d.featureID";
					
					sql.query(conn, inputSQL, [ applyModelTargetID, modelID ], function(err, results, more) {
						if(err) throw err;
						if(!more) {
							var jobArgs = modelID + " " + applyModelRunID;
							
							var jobQueueSQL = "INSERT INTO jobQueue (jobTypeID, args) SELECT 3, ? SELECT scope_identity() as jobID";
							sql.query(conn, jobQueueSQL, [ jobArgs ], function(err, results, more) {
								if(err) throw err;
								if(!more) {
									var jobID = results[0].jobID;
									var response = { success: true, jobID: jobID };
									
									res.write(JSON.stringify(response));
									res.end();
								}
							});							
						}
					});
				}
			});
		}
	});
};