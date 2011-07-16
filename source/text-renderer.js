(function( $ ){
	function setFont( txt, rect, R ){
		// font-style font-variant font-weight font-size/line-height font-family
		var   style = $.fontStyle     ( txt ),
		    variant = $.fontVariant   ( txt ),
		     weight = $.fontWeight    ( txt ),
		       size = $.fontSize      ( txt ),
		     family = $.fontFamily    ( txt ),
		      color = $.color         ( txt ),
		  transform = $.textTransform ( txt ),
		      align = $.textAlign     ( txt ),
		     vAlign = $.verticalAlign ( txt );

		R
			.setFillStyle   ( color )
			.setFont        ( style + ' ' + variant + ' ' + weight + ' ' + size + ' ' + family )
			.setTextAlign   ( align )   // TODO: CSS has "justify", Canvas doesn't
			.setTextBaseline( vAlign ); // TODO: these don't match up between CSS & Canvas, adjust later
	}

	function renderText( txt, rect, R ){
		// TODO: ???
	}

	html2canvas.renderText = function( txt, rect, renderer ){
		// text is empty
		if( !/\S/.test( $.textContent( txt ) ) ){ return; }

		setFont   ( txt, rect, renderer );
		renderText( txt, rect, renderer );
	};
})( html2canvas.bridge );