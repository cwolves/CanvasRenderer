(function( $ ){
	var node = $.createElement( 'DIV' ),
	  button = $.createElement( 'BUTTON' );

	node.style.cssText = 'position: fixed; bottom: 0px; right: 0px;';
	button.innerHTML   = 'Draw Page to Canvas';

	$.addEvent( button, 'click', function(){
		var canvas = new html2canvas();
		canvas.render();
		canvas.appendCanvasNodeTo( document.body );
	});

	node.appendChild( button );
	document.body.appendChild( node );
})( html2canvas.bridge );