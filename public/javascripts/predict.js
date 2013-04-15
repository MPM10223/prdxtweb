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
			type: $predictOneForm.attr('method')
			, url: $predictOneForm.attr('action')
			, data: $predictOneForm.serialize()
		}).done(function(res) {
			$prediction.text('processing...');
		});
		return false;
	});
});