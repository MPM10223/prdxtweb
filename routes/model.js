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