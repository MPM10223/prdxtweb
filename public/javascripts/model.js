/**
 * model.js
 */
$(function() {
	var $modelFeaturesTable = $('#modelFeaturesTable');
		
	if(!$modelFeaturesTable.length) {
		return;
	}
	
	var $modelID = $('#modelID');
	var $featureScatterplot = $('#featureScatterplot');
	var $modalBody = $featureScatterplot.find('.modal-body');
	
	google.load("visualization", "1", {packages:["corechart"], callback: drawCharts});

	function drawCharts() {
		var modelID = $modelID.attr('value');	
		$.ajax({
			url: "/model/elasticity?modelID=" + modelID
			, success: function(data) {
				$modelFeaturesTable.find('div[id*="featurePlot"]').each(function() {
					var featureID = $(this).attr('id').replace('featurePlot_', '');
					var featureData = data[featureID];
					
					var plotData = new google.visualization.DataTable();
					plotData.addColumn('number', 'feature');
					plotData.addColumn('number', 'prediction');
					
					for(i in featureData.plotData) {
						plotData.addRow([featureData.plotData[i].x, featureData.plotData[i].y]);
					}
					
					var options = {
						width: 100
						, height: 100
						, enableInteractivity: false
						, chartArea: { left: 0, top: 0, width: "100%", height: "100%" }
						, vAxis: { title: null, textPosition: 'none', baseline: featureData.avgPrediction
							, maxValue: data.maxPrediction, minValue: data.minPrediction }
						, hAxis: { title: null, textPosition: 'none', baseline: featureData.featureMean
							, maxValue: featureData.rangeMax, minValue: featureData.rangeMin }
						, curveType: 'function'
						, lineWidth: 3
						, pointSize: 0
						, legend: 'none'
					};
					
					var chart = new google.visualization.ScatterChart($(this)[0]);
					chart.draw(plotData, options);
				});
			}
			, dataType: "json"
		});
	}
	
	$modelFeaturesTable.find('a[id*="showFeature"]').on('click', function(ev) {
		var featureID = $(this).attr('id').replace('showFeature','');
		var modelID = $modelID.attr('value');
		
		$modalBody.html('<p>Loading...</p>');
		$featureScatterplot.modal('show');
		
		$.ajax({
			url: "/model/featureData?modelID=" + modelID + "&featureID=" + featureID
			, success: function(data) {
				var plotData = new google.visualization.DataTable();
				plotData.addColumn('number', 'feature');
				plotData.addColumn('number', 'prediction');
				
				for(i in data.plotData) {
					plotData.addRow([data.plotData[i].featureValue, data.plotData[i].dvValue]);
				}
				
				var options = {
					width: 800
					, height: 600
					, enableInteractivity: false
					, chartArea: { left: 100, top: 50, width: "90%", height: "80%" }
					, vAxis: { title: data.dvName, baseline: data.dvMean }
					, hAxis: { title: data.featureName, baseline: data.featureMean }
					, pointSize: 1
					, legend: 'none'
				};
				
				var chart = new google.visualization.ScatterChart($modalBody[0]);
				chart.draw(plotData, options);
			}
			, dataType: "json"
		});
	});
});