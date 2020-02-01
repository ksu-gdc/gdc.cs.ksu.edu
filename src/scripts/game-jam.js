const queryGameJamYear = window.queryParams.year;
if (queryGameJamYear) {
	showGameJamSection(queryGameJamYear);
}

$('.showGameJamSectionBtn').click(function() {
	let clickedBtn = $(this);
	showGameJamSection(clickedBtn.html());
});

const countdownElem = $('#countdown');
// Set the date we're counting down to
if (countdownElem) {
	const dayConversion = 1000 * 60 * 60 * 24;
	const hourConversion = 1000 * 60 * 60;
	const minuteConversion = 1000 * 60;

	let countdownDate = new Date(countdownElem.attr('toDate')).getTime();

	let countdownInterval;
	function setCountdown() {
		let now = new Date().getTime();
		let distance = countdownDate - now;
		let days = Math.floor(distance / dayConversion);
		let hours = Math.floor((distance % dayConversion) / hourConversion);
		let minutes = Math.floor(
			(distance % hourConversion) / minuteConversion
		);
		let seconds = Math.floor((distance % minuteConversion) / 1000);

		countdownElem.html(
			days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's '
		);

		if (distance < 0) {
			clearInterval(countdownInterval);
			$('#openGameJamSignUp').prop('disabled', true);
			countdownElem.html('EXPIRED');
		}
	}
	countdownInterval = setInterval(setCountdown, 1000);
	setCountdown();
}

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

function openGameJamSignup() {
	window.open('https://forms.gle/3wkvkFetcF37f64H9');
}
