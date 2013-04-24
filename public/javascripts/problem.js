/**
 * problem.js
 */
$(function() {
	var $problemProgress = $('#problemProgress');
	var $champion = $('#champion');
	var $algosTable = $('#algosTable');
	var $problemID = $('#problemID');
	var $predictButton = $('btn#predict');
	
	if(!$problemProgress.length) {
		return;
	}
	
	var $problemProgressBar = $problemProgress.children('div');
	var $algoRows = $algosTable.find('tr[id*="algo"]');
	
	(function poll() {
		setTimeout(function() {
			$.ajax({
				url: "/problem/status?problemID=" + $problemID.attr('value')
				, success: function(data) {
					var problemProgress = data["problemProgress"];
					var problemSize = data["problemSize"];
					
					// update progress made on each algorithm
					$algoRows.each(function() {
						var row = $(this);
						var algoID = row.attr('id').replace('algo', '');
						var newData = data['algo' + algoID];
						
						// status text
						var status = newData.eval_status == null ? "Building " + newData.build_status : "Evaluation " + newData.eval_status;
						row.children("td:nth-child(2)").text(status);
						
						// progress bar
						var progress = (newData.build_progress + newData.eval_progress) / 2;
						var progressBar = row.find(".progress .bar");
						progressBar.attr('style', 'width: ' + progress * 100.0 + '%;');
						console.log('progress: ' + progress);
						if(progress >= 1.0) progressBar.removeClass("active");
						
						// accuracy
						if(newData.accuracy != null) {
							row.children("td:nth-child(4)").text(newData.accuracy);
						}
						
						// model link (if completed)
						if(newData.modelID != null) {
							var algoCell = row.children("td:nth-child(1)");
							if(!algoCell.children('a')) {
								var algoName = algoCell.text();
								algoCell.text('');
								algoCell.append('<a href="/model?modelID='+newData.modelID+'">'+algoName+'</a>');
							}
						}
					});
					
					// set the overall problem progress bar
					console.log('problemProgress: ' + problemProgress);
					$problemProgressBar.attr("style", "width: " + problemProgress / problemSize * 100.0 + "%;");
					if(problemProgress >= problemSize) {
						$problemProgressBar.removeClass("active");
					}
					
					// update the champion
					if(data.bestScore == Number.MIN_VALUE) {
						// no champion yet
						$champion.children('h4').text('Running algorithms...');
						$predictButton.hide();
					} else if (problemProgress < problemSize) {
						// still in progress, but have champion
						$champion.children('h4').text('Best score so far: ' + data.bestScore);
						$champion.children('a').attr('href','/predict/single?modelID=' + data.bestModelID);
						$predictButton.show();
					} else {
						// done
						$champion.children('h4').text('Finished with score of: ' + data.bestScore);
						$champion.children('a').attr('href','/predict?modelID=' + data.bestModelID);
						$predictButton.show();
					}
				}
				, dataType: "json"
				, complete: function() {
					if($problemProgressBar.attr('width') != '100%') {
						poll(); // recursion
					} else {
						console.log('completed!');
					}
				}
			});
		}, 5000);
	})();
});