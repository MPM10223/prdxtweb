/**
 * upload.js
 */
var nconf = require('nconf');
var fs = require('fs');
var lazy = require('lazy');
var sql = require('msnodesql');
var exec = require('child_process').exec;

exports.process = function(req, res) {
	var path = req.files.uploadFile.path;
	var name = req.files.uploadFile.name;
	var type = req.files.uploadFile.type;
	
	var problemName = req.param('problemName');
	
	var tableName = 'raw_' + name.replace('.csv', '');
	var viewName = 'vw_' + name.replace('.csv', '');
	var idColumn = 'rowID';
	
	nconf.env().file({ file: 'config.json' });
	var username = nconf.get('SQL_UID');
	var password = nconf.get('SQL_PWD');
	var serverFull = nconf.get('SQL_SERVER_FULL');
	var server = nconf.get('SQL_SERVER_SHORT');
	var database = nconf.get('SQL_DATABASE');
	
	// 1) comb header of CSV to get column names
	new lazy(fs.createReadStream(path))
		.lines
		.take(1)
		.map(function(line) {
			var columns = line.toString().trim().split(',');
			
			// 2.1) DROP destination table in SQL if it already exists
			var conn = nconf.get("SQL_CONN");
			
			//TODO: handle file name collisions
			var dropIfExistsSQL = "IF object_id('"+tableName+"') IS NOT NULL DROP TABLE ["+tableName+"]";
			sql.query(conn, dropIfExistsSQL, function(err, results) {
			
				if(err) throw err;
			
				// 2.2) CREATE destination table in SQL
				var createSQL = "CREATE TABLE dbo.["+tableName+"] (["+idColumn+"] int not null identity(1,1)";
				columns.forEach(function(column) {
					//TODO: make sure the order is guaranted to be preserved
					createSQL += ", ["+column+"] varchar(50)"
				});
				createSQL += ", CONSTRAINT [PK__"+tableName+"] PRIMARY KEY (["+idColumn+"]) )";
				
				sql.query(conn, createSQL, function(err, results) {
				
					if(err) throw err;
				
					// 2.3) DROP BCP destination view in SQL if it already exists
					var dropViewIfExistsSQL = "IF object_id('"+viewName+"') IS NOT NULL DROP VIEW ["+viewName+"]";
					sql.query(conn, dropViewIfExistsSQL, function(err, results) {

						if(err) throw err;
					
						// 2.3) CREATE BCP destination view in SQL (trick to get around identity column)
						var viewSQL = "CREATE VIEW dbo.["+viewName+"] AS SELECT ";
						columns.forEach(function(column, index) {
							//TODO: make sure the order is guaranted to be preserved
							if(index != 0) viewSQL += ",";
							viewSQL += "["+column+"]";
						});
						viewSQL += "FROM dbo.["+tableName+"]";
						
						sql.query(conn, viewSQL, function(err, results) {

							if(err) throw err;
						
							// 3) run command-line bcp to push raw, pivoted data into SQL
							var cmd = 'bcp dbo.[' + viewName + '] in ' + path + ' -S ' + serverFull + ' -d ' + database + ' -U ' + username + '@' + server + ' -P ' + password + ' -c -t , -F 2';
							exec(cmd, function(err, stdout, stderr) {
								
								if(err) throw err;
								
								// %d rows copied.
								var pattern = /(\d+) rows copied./;
								var numRows = pattern.exec(stdout)[1];
								
								// 4) run stored procedure to parse pivoted data into normalized problem data
								var parseSQL = "exec p_parseRawInputData '"+tableName+"', '"+problemName+"', "+global.session.userID+", '"+idColumn+"'";
								console.log(parseSQL);
								
								sql.query(conn, parseSQL, function(err, results) {
								
									if(err) {
										console.log(err);
									}
								
									// 5) send back a list of columns and row count
									res.render('sourceData', { filepath : path, fname : name, filetype : type, columns: columns, numRows: numRows } );
								});
							});
						});
					});
				});
			});
		});
};
 