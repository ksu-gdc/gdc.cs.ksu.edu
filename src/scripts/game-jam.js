const queryGameJamYear = window.queryParams.year;
if (queryGameJamYear) {
	showGameJamSection(queryGameJamYear);
}

$('.showGameJamSectionBtn').click(function() {
	let clickedBtn = $(this);
	showGameJamSection(clickedBtn.html());
});

function showGameJamSection(yearStr) {
	let gameJamSectionId = 'gameJam' + yearStr;
	$('.showGameJamSectionBtn:contains("' + yearStr + '")').prop(
		'disabled',
		true
	);
	$(
		'.showGameJamSectionBtn:not(.showGameJamSectionBtn:contains("' +
			yearStr +
			'"))'
	).prop('disabled', false);
	$('.gameJamSection:not(#' + gameJamSectionId + ')').fadeOut(
		200,
		function() {
			$('#' + gameJamSectionId).fadeIn(200, function() {
				if (!$('#gameJamContent').is(':visible')) {
					$('#gameJamContent').slideDown(250);
				}
			});
		}
	);
}

$('#openGameJamSignup').click(function() {
	window.open('https://forms.gle/3wkvkFetcF37f64H9');
});
