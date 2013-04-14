/**
 * newProblem.js
 */
$(function() {
	var $newProblem = $('#newProblem');
	
	if(!$newProblem.length) {
		return;
	}

	var $modalBody = $newProblem.find('.modal-body');
	var $modalFooter = $newProblem.find('.modal-footer');
	
	var $newFileOption = $modalBody.find('#newFileLink');
	var $existingFileOption = $modalBody.find('#existingFileLink');

	var $modalContinueButton = $modalFooter.find('.btn-primary');
	var $modalBackButton = $modalFooter.find('#back');
	
	$newFileOption.on('click', function(ev) {
		activeFormSubmitButton = $modalBody.find('#newFileSubmitButton');
	});
	
	$existingFileOption.on('click', function(ev) {
		activeFormSubmitButton = $modalBody.find('#existingFileSubmitButton');
	});
	
	activeFormSubmitButton = $modalBody.find('#newFileSubmitButton');
	
	$('#newFileForm').iframePostForm({
		post : function() {
			//TODO: start waiting graphic
			return true;
		},
		complete : function(response) {
			//TODO: end waiting graphic
			$modalBody.html(response);
		}
	});
	
	$modalContinueButton.off('click');
	$modalContinueButton.on('click', function(ev) {
		activeFormSubmitButton.click();
	});
	
	//TODO: bind back button
});