(function( $ ){
	var canvas, visible, info;

	$.addEvent( document.body, 'click', function(){
		if( !canvas ){
			html2canvas.images.preLoad( function(){
				canvas = new html2canvas({ css : 'position: fixed; top: 0px; left: 0px; z-index: 10000' });
				canvas.render();
				canvas.appendCanvasNodeTo( document.body );

				info = $.createElement( 'DIV' );
				info.style.cssText = 'position : fixed; top: 0px; right: 0px; z-index: 10000; padding : 5px; border: 2px solid #EEE; border-width: 0 0 2px 2px;';
				document.body.appendChild( info );

				canvas[ visible ? 'hide' : 'show' ]();
				info.innerText = visible ? 'HTML' : 'Canvas';
				visible ^= 1;
			});
		}
	});
})( html2canvas.bridge );