html2canvas.prototype.drawBoundingBox = function( node, rect ){
	var wTop = this.$.unitsToPx( this.$.borderTopWidth   ( node ), node ),
	  wRight = this.$.unitsToPx( this.$.borderRightWidth ( node ), node ),
	 wBottom = this.$.unitsToPx( this.$.borderBottomWidth( node ), node ),
	   wLeft = this.$.unitsToPx( this.$.borderLeftWidth  ( node ), node ),
	     box = { top : wTop, right : wRight, bottom : wBottom, left : wLeft },
	 bgColor = this.$.backgroundColor( node ),
	 bgImage = this.$.backgroundImage( node );

	// draw borders
	if( wTop    ){ this.drawLine( rect.left               , rect.top + wTop / 2      , rect.right             , rect.top + wTop / 2      , wTop   , this.$.borderTopColor   ( node ) ); }
	if( wBottom ){ this.drawLine( rect.left               , rect.bottom - wBottom / 2, rect.right             , rect.bottom - wBottom / 2, wBottom, this.$.borderBottomColor( node ) ); }
	if( wLeft   ){ this.drawLine( rect.left + wLeft / 2   , rect.top                 , rect.left + wLeft / 2  , rect.bottom              , wLeft  , this.$.borderLeftColor  ( node ) ); }
	if( wRight  ){ this.drawLine( rect.right - wRight / 2 , rect.top                 , rect.right - wRight / 2, rect.bottom              , wRight , this.$.borderRightColor ( node ) ); }

	// draw background color
	this.drawFilledRect( rect.left + wLeft, rect.top + wTop, rect.width - wLeft - wRight, rect.height - wTop - wBottom, bgColor );

	if(bgImage){
		this.renderBackgroundImage( node, rect, box, bgImage );
	}

	return box;
}

html2canvas.prototype.drawLine = function( x1, y1, x2, y2, width, color ){
	this.setStrokeColor( color )
	    .setLineWidth  ( width );

	this.ctx.beginPath();
	this.ctx.moveTo( x1, y1 );
	this.ctx.lineTo( x2, y2 );
	this.ctx.stroke();
}

html2canvas.prototype.drawFilledRect = function( x1, y1, x2, y2, color ){
	this.setFillStyle( color );
	this.ctx.fillRect( x1, y1, x2, y2 );
}

html2canvas.prototype.renderBox = function( node, rect ){
	this.drawBoundingBox( node, rect );
};