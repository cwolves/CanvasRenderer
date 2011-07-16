(function( $ ){
	var canvas, visible, info, loaded;

	function toggleText(){
		canvas[ visible ? 'hide' : 'show' ]();
		info.innerText = visible ? 'HTML' : 'Canvas';
		visible ^= 1;
	}		

	$.addEvent( document.body, 'click', function(){
		if( !canvas ){
			canvas = new html2canvas(
				{ css : 'position: absolute; top: 0px; left: 0px; z-index: 10000' },
				function(){
					canvas
						.render      ( document.body )
						.appendToNode( document.body );

					info               = $.createElement( 'DIV' );
					info.style.cssText = 'position : fixed; top: 0px; right: 0px; z-index: 10000; padding : 5px; border: 2px solid #EEE; border-width: 0 0 2px 2px;';
					document.body.appendChild( info );

					toggleText();
					loaded = true;
				}
			);
		}

		loaded && toggleText();
	});
})( html2canvas.bridge );