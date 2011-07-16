(function( $ ){
	function setFont( txt, rect, R ){
		// font-style font-variant font-weight font-size/line-height font-family
		var    node = txt.parentNode,

		      style = $.fontStyle     ( node ),
		    variant = $.fontVariant   ( node ),
		     weight = $.fontWeight    ( node ),
		       size = $.fontSize      ( node ),
		     family = $.fontFamily    ( node ),
		      color = $.color         ( node ),
		  transform = $.textTransform ( node ),
		      align = $.textAlign     ( node ),
		     vAlign = $.verticalAlign ( node );

		R
			.setFillStyle   ( color )
			.setFont        ( style + ' ' + variant + ' ' + weight + ' ' + size + ' ' + family )
			.setTextAlign   ( align )   // TODO: CSS has "justify", Canvas doesn't
			.setTextBaseline( 'bottom' ); // TODO: these don't match up between CSS & Canvas, adjust later
	}

	function renderText( txt, rect, R ){
		var range = document.createRange();
		range.selectNode( txt );
		var splt = range.toString().split(/\s/),
		     len = splt.length,
		  chrCtr = 0,
		      ix = 0,
		    strLen;

		while(ix < len){
			while( (ix < len) && !splt[ ix ] ){ ix++; chrCtr++; } // skip past white-space
			if(ix >= len){ break; }

			strLen = splt[ ix ].length;

			range.setStart( txt, chrCtr );
			range.setEnd  ( txt, chrCtr + strLen );

			var rect = range.getBoundingClientRect();

			R.ctx.fillText( splt[ ix ], rect.left, rect.top + rect.height);

			chrCtr += strLen + 1;
			ix++;
		}
	}

	html2canvas.renderText = function( txt, rect, renderer ){
		// text is empty
		if( !/\S/.test( $.textContent( txt ) ) ){ return; }

		setFont   ( txt, rect, renderer );
		renderText( txt, rect, renderer );
	};
})( html2canvas.bridge );