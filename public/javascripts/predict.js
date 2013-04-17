/**
 * predict.js
 */
$(function() {
	var $predictOne = $('#predictOne');
	var $predictMany = $('#predictMany');
	
	if(!$predictOne.length) {
		return;
	}

	var $predictOneForm = $predictOne.find('form');
	var $predictOneButton = $predictOne.find('button[type="submit"]');
	var $prediction = $predictOne.find('#prediction');
	
	$predictOneForm.on('submit', function(ev) {
		$prediction.text('submitting...');
		$.ajax({
			type: "post"
			, url: "/predict/single"
			, data: $predictOneForm.serialize()
		}).done(function(res) {
			$prediction.text('processing...');
			$prediction.addClass('processing');
			
			var json = $.parseJSON(res);
			var jobID = json.jobID;
			
			// from http://techoctave.com/c7/posts/60-simple-long-polling-example-with-javascript-and-jquery
			(function poll() {
				setTimeout(function() {
					$.ajax({
						url: "/predict/single/result?jobID="+jobID
						, success: function(data) {
							if(data.completed) {
								$prediction.removeClass('processing');
								if(data.success) {
									$prediction.text(data.prediction);
								} else {
									$prediction.addClass('error');
									$prediction.text("An error occurred");
								}
							}
						}
						, dataType: "json"
						, complete: function() {
							if($prediction.hasClass('processing')) {
								poll(); // recursion
							}
						}
					});
				}, 5000);
			})();
		});
		return false;
	});
});