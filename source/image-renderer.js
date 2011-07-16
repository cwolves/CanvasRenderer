(function( $ ){
	html2canvas.renderImage = function( img, rect, renderer ){
		html2canvas.renderBox( img, rect, renderer );
		renderer.ctx.drawImage( img, rect.left, rect.top, rect.width, rect.height );
	};
})( html2canvas.bridge );