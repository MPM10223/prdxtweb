/**
 * model.js
 */
$(function() {
	var $modelFeaturesTable = $('#modelFeaturesTable');
	var $modelID = $('#modelID');
		
	if(!$modelFeaturesTable.length) {
		return;
	}
	
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
});