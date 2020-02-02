const queryParamsStr = window.location.search.substr(1);
window.queryParams = queryParamsStr.split('&').reduce((obj, param) => {
	const [key, value] = param.split('=');
	obj[key] = decodeURIComponent(value);
	return obj;
}, {});

$('#mainNav > a[scrollTo]').click(function(event) {
	if (window.location.pathname === '/') {
		scrollTo($(this).attr('scrollTo'));
		event.preventDefault();
	}
});

$('[scrollTo]:not(#mainNav > a[scrollTo])').click(function(event) {
	scrollTo($(this).attr('scrollTo'));
	event.preventDefault();
});

function scrollTo(query) {
	var newPosition = $(query).offset();
	$('html, body')
		.stop()
		.animate({ scrollTop: newPosition ? newPosition.top : 0 }, 400);
}

$('countdown').each(function() {
	const countdownElem = $(this);

	const dayConversion = 1000 * 60 * 60 * 24;
	const hourConversion = 1000 * 60 * 60;
	const minuteConversion = 1000 * 60;

	const countdownToDate = countdownElem.attr('to');
	if (countdownToDate && countdownToDate.length > 0) {
		let countdownDate = new Date(countdownToDate).getTime();

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
				let countdownBtnId = countdownElem.attr('btn-id');
				if (countdownBtnId && countdownBtnId.length > 0) {
					$('#' + countdownBtnId).prop('disabled', true);
				}
				countdownElem.html('EXPIRED');
			}
		}
		countdownInterval = setInterval(setCountdown, 1000);
		setCountdown();
	}
});
