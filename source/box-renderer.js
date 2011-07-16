(function( $ ){
	function drawBoundingBox( node, rect, R ){
		var wTop = $.unitsToPx( $.borderTopWidth   ( node ), node ),
		  wRight = $.unitsToPx( $.borderRightWidth ( node ), node ),
		 wBottom = $.unitsToPx( $.borderBottomWidth( node ), node ),
		   wLeft = $.unitsToPx( $.borderLeftWidth  ( node ), node ),
		     box = { top : wTop, right : wRight, bottom : wBottom, left : wLeft },
		 bgColor = $.backgroundColor( node ),
		 bgImage = $.backgroundImage( node );

		// draw borders
		if( wTop    ){ drawLine( rect.left               , rect.top + wTop / 2      , rect.right             , rect.top + wTop / 2      , wTop   , $.borderTopColor   ( node ), R ); }
		if( wBottom ){ drawLine( rect.left               , rect.bottom - wBottom / 2, rect.right             , rect.bottom - wBottom / 2, wBottom, $.borderBottomColor( node ), R ); }
		if( wLeft   ){ drawLine( rect.left + wLeft / 2   , rect.top                 , rect.left + wLeft / 2  , rect.bottom              , wLeft  , $.borderLeftColor  ( node ), R ); }
		if( wRight  ){ drawLine( rect.right - wRight / 2 , rect.top                 , rect.right - wRight / 2, rect.bottom              , wRight , $.borderRightColor ( node ), R ); }

		// draw background color
		drawFilledRect( rect.left + wLeft, rect.top + wTop, rect.width - wLeft - wRight, rect.height - wTop - wBottom, bgColor, R);

		if(bgImage){
			html2canvas.renderBackgroundImage( node, rect, box, R, bgImage );
		}

		return box;
	}

	function drawLine( x1, y1, x2, y2, width, color, R ){
		R.setStrokeColor( color )
		    .setLineWidth  ( width );

		R.ctx.beginPath();
		R.ctx.moveTo( x1, y1 );
		R.ctx.lineTo( x2, y2 );
		R.ctx.stroke();
	}

	function drawFilledRect( x1, y1, x2, y2, color, R ){
		R.setFillStyle( color );
		R.ctx.fillRect( x1, y1, x2, y2 );
	}

	html2canvas.renderBox = function( node, rect, renderer ){
		drawBoundingBox( node, rect, renderer );
	};
})( html2canvas.bridge );