/**
 * sourceData.js
 */
$(function() {
	var $newProblem = $('#newProblem');
	var $indexContent = $('#indexContent');
	
	if(!$newProblem.length) {
		return;
	}

	var $modalBody = $newProblem.find('.modal-body');
	var $modalFooter = $newProblem.find('.modal-footer');
	
	var $columnsForm = $newProblem.find('#columnsForm');
	var $columnHeaders = $newProblem.find('#columnHeaders');
	var $problemIDInput = $columnsForm.find('input[name="problemID"]');
	
	var $modalContinueButton = $modalFooter.find('.btn-primary');
	var $modalBackButton = $modalFooter.find('#back');
	
	$modalContinueButton.text('Finish');
	$modalContinueButton.off('click');
	$modalContinueButton.on('click', function(ev) {
		$columnsForm.submit();
	});
	
	//TODO: bind back button
	
	$columnHeaders.find('th').on('click', function(ev) {
		var ivInput = $(this).find('input[name*=iv]')[0];
		var dvInput = $(this).find('input[name*=dv]')[0];
		
		// if neither --> IV
		// if IV --> DV (clear all other DV)
		// if DV --> neither
		
		if(ivInput.value == '0' && dvInput.value == '0') {
			// set this to IV
			ivInput.value = '1';
			$(this).addClass('iv');
		} else if(ivInput.value == '1') {
			// clear all other DVs
			$columnHeaders.find('input[name*=dv]').each(function(index) {
				$(this)[0].value = '0';
			});
			$columnHeaders.find('th').removeClass('dv');
			
			// set this to DV
			ivInput.value = '0';
			dvInput.value = '1';
			$(this).removeClass('iv');
			$(this).addClass('dv');
		} else if(dvInput.value == '1') {
			// set this to neither
			dvInput.value = '0';
			$(this).removeClass('dv');
		} else {
			alert('invalid state');
		}
	});
});