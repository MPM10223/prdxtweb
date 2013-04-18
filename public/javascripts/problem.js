/**
 * problem.js
 */
$(function() {
	var $problemProgress = $('#problemProgress');
	var $algosTable = $('#algosTable');
	var $problemID = $('#problemID');
	
	if(!$algosTable.length) {
		return;
	}
	
	var $problemProgressBar = $problemProgress.children('div');
	var $algoRows = $algosTable.find('tr[id*="algo"]');
	
	(function poll() {
		setTimeout(function() {
			$.ajax({
				url: "/problem/status?problemID=" + $problemID.attr('value')
				, success: function(data) {
					var problemProgress = 0.0;
					var problemSize = 0.0;
					
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
						
						problemProgress += progress;
						problemSize += 1.0;
					});
					
					// set the overall problem progress bar
					$problemProgressBar.attr("style", "width: " + problemProgress / problemSize * 100.0 + "%;");
					if(problemProgress == problemSize) $problemProgressBar.removeClass("active"); 
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