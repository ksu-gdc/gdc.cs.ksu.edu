$('.show-more-btn').click(function() {
	const $this = $(this);
	const $content = $this.parent().prev('div.portfolio-content:first');
	if ($this.text().toUpperCase() === 'SHOW MORE') {
		const curHeight = $content.height();
		const autoHeight = $content.css('height', 'auto').height();
		$content.height(curHeight);
		$content.animate(
			{
				height: autoHeight
			},
			250
		);
		$this.text('Show less');
	} else {
		$content.animate(
			{
				height: '11.5em'
			},
			250
		);
		$this.text('Show more');
	}
});
