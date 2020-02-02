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

const countdownDayConversion = 1000 * 60 * 60 * 24;
const countdownHourConversion = 1000 * 60 * 60;
const countdownMinuteConversion = 1000 * 60;
$('countdown').each(function() {
	const countdownElem = $(this);

	const countdownToDateStr = countdownElem.attr('to');
	if (countdownToDateStr && countdownToDateStr.length > 0) {
		const countdownToDate = new Date(countdownToDateStr).getTime();
		let countdownInterval;
		countdownInterval = setInterval(setCountdown, 1000, countdownElem, countdownToDate, countdownInterval);
		setCountdown(countdownElem, countdownToDate, countdownInterval);

	}
});

function setCountdown(countdownElem, countdownToDate, countdownInterval) {
	let now = new Date().getTime();
	let distance = countdownToDate - now;
	let days = Math.floor(distance / countdownDayConversion);
	let hours = Math.floor((distance % countdownDayConversion) / countdownHourConversion);
	let minutes = Math.floor(
		(distance % countdownHourConversion) / countdownMinuteConversion
	);
	let seconds = Math.floor((distance % countdownMinuteConversion) / 1000);

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
