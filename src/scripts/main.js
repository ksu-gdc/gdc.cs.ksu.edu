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
