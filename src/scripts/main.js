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
		.animate({ scrollTop: newPosition.top }, 400);
}
