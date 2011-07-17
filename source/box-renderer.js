html2canvas.prototype.drawBoundingBox = function( node, rect ){
	var wTop = this.$.unitsToPx( this.$.borderTopWidth   ( node ), rect.height ),
	  wRight = this.$.unitsToPx( this.$.borderRightWidth ( node ), rect.width  ),
	 wBottom = this.$.unitsToPx( this.$.borderBottomWidth( node ), rect.height ),
	   wLeft = this.$.unitsToPx( this.$.borderLeftWidth  ( node ), rect.width  ),
	     box = { top : wTop, right : wRight, bottom : wBottom, left : wLeft },
	 bgColor = this.$.backgroundColor( node ),
	 bgImage = this.$.backgroundImage( node );

	// set global opacity
	this.setOpacity( node.opacity );

	// draw background color
	this.drawFilledRect( rect.left, rect.top, rect.width, rect.height, bgColor );

	// draw borders
	if( wTop    ){ this.drawLine( rect.left               , rect.top + wTop / 2      , rect.right             , rect.top + wTop / 2      , wTop   , this.$.borderTopColor   ( node ), this.$.borderTopStyle   ( node ) ); }
	if( wBottom ){ this.drawLine( rect.left               , rect.bottom - wBottom / 2, rect.right             , rect.bottom - wBottom / 2, wBottom, this.$.borderBottomColor( node ), this.$.borderBottomStyle( node ) ); }
	if( wLeft   ){ this.drawLine( rect.left + wLeft / 2   , rect.top                 , rect.left + wLeft / 2  , rect.bottom              , wLeft  , this.$.borderLeftColor  ( node ), this.$.borderLeftStyle  ( node ) ); }
	if( wRight  ){ this.drawLine( rect.right - wRight / 2 , rect.top                 , rect.right - wRight / 2, rect.bottom              , wRight , this.$.borderRightColor ( node ), this.$.borderRightStyle ( node ) ); }

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
			this.ctx.dashedLineTo( x1, y1, x2, y2, [3, 3] );
			break;
		case 'dotted':
			this.ctx.dashedLineTo( x1, y1, x2, y2, [1, 1] );
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