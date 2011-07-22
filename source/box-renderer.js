html2canvas.prototype.drawBoundingBox = function( node, rect ){
	var wTop = this.$.unitsToPx( this.$.css( node, 'border-top-width'    ), rect.height ),
	  wRight = this.$.unitsToPx( this.$.css( node, 'border-right-width'  ), rect.width  ),
	 wBottom = this.$.unitsToPx( this.$.css( node, 'border-bottom-width' ), rect.height ),
	   wLeft = this.$.unitsToPx( this.$.css( node, 'border-left-width'   ), rect.width  ),
	     box = { top : wTop, right : wRight, bottom : wBottom, left : wLeft },
	 bgColor = this.$.css( node, 'background-color' ),
	 bgImage = this.$.css( node, 'background-image' );

	// set global opacity
	this.setOpacity( node.opacity );

	// draw background color
	this.drawFilledRect( rect.left, rect.top, rect.width, rect.height, bgColor );

	// draw borders
	if( wTop ){
		this.drawLine(
			rect.left,
			rect.top + wTop / 2,
			rect.right,
			rect.top + wTop / 2,
			wTop,
			this.$.css( node, 'border-top-color' ),
			this.$.css( node, 'border-top-style' )
		);
	}
	if( wBottom ){
		this.drawLine(
			rect.left,
			rect.bottom - wBottom / 2,
			rect.right,
			rect.bottom - wBottom / 2,
			wBottom,
			this.$.css( node, 'border-bottom-color' ),
			this.$.css( node, 'border-bottom-style' )
		);
	}
	if( wLeft ){
		this.drawLine(
			rect.left + wLeft / 2,
			rect.top,
			rect.left + wLeft / 2,
			rect.bottom,
			wLeft,
			this.$.css( node, 'border-left-color' ),
			this.$.css( node, 'border-left-style' )
		);
	}
	if( wRight ){
		this.drawLine(
			rect.right - wRight / 2,
			rect.top,
			rect.right - wRight / 2,
			rect.bottom,
			wRight,
			this.$.css( node, 'border-right-color' ),
			this.$.css( node, 'border-right-style' )
		);
	}

	if(bgImage){
		this.renderBackgroundImage( node, rect, box, bgImage );
	}

	return box;
}

html2canvas.prototype.drawLine = function( x1, y1, x2, y2, width, color, style ){
	this.setStrokeColor( color )
	    .setLineWidth  ( width );

	this.ctx.beginPath();

	switch(style){
		case 'dashed':
			this.ctx.dashedLineTo( x1, y1, x2, y2, [3*width, 3*width] );
			break;
		case 'dotted':
			this.ctx.dashedLineTo( x1, y1, x2, y2, [width, width] );
			break;
		default:
			this.ctx.moveTo( x1, y1 );
			this.ctx.lineTo( x2, y2 );
			break;
	}
	this.ctx.stroke();
}

html2canvas.prototype.drawFilledRect = function( x1, y1, x2, y2, color ){
	this.setFillStyle( color );
	this.ctx.fillRect( x1, y1, x2, y2 );
}

html2canvas.prototype.renderBox = function( node, rect ){
	this.drawBoundingBox( node, rect );
};
