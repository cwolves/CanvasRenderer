html2canvas.prototype.drawBoundingBox = function( node, rect ){
	var wTop = this.$.unitsToPx( this.$.css('border-top-width')   ( node ), rect.height ),
	  wRight = this.$.unitsToPx( this.$.css('border-right-width') ( node ), rect.width  ),
	 wBottom = this.$.unitsToPx( this.$.css('border-bottom-width')( node ), rect.height ),
	   wLeft = this.$.unitsToPx( this.$.css('border-left-width')  ( node ), rect.width  ),
	     box = { top : wTop, right : wRight, bottom : wBottom, left : wLeft },
	 bgColor = this.$.css('background-color')( node ),
	 bgImage = this.$.css('background-image')( node );

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
			this.$.css('border-top-color')( node ),
			this.$.css('border-top-style')( node )
		);
	}
	if( wBottom ){
		this.drawLine(
			rect.left,
			rect.bottom - wBottom / 2,
			rect.right,
			rect.bottom - wBottom / 2,
			wBottom,
			this.$.css('border-bottom-color')( node ),
			this.$.css('border-bottom-style')( node )
		);
	}
	if( wLeft ){
		this.drawLine(
			rect.left + wLeft / 2,
			rect.top,
			rect.left + wLeft / 2,
			rect.bottom,
			wLeft,
			this.$.css('border-left-color')( node ),
			this.$.css('border-left-style')( node )
		);
	}
	if( wRight ){
		this.drawLine(
			rect.right - wRight / 2,
			rect.top,
			rect.right - wRight / 2,
			rect.bottom,
			wRight,
			this.$.css('border-right-color')( node ),
			this.$.css('border-right-style')( node )
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
