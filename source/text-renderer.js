html2canvas.prototype.analyzeFont = function( txt, rect ){
	// font-style font-variant font-weight font-size/line-height font-family
	var    node = txt.parentNode,

	      style = this.$.fontStyle     ( node ),
	    variant = this.$.fontVariant   ( node ),
	     weight = this.$.fontWeight    ( node ),
	       size = this.$.fontSize      ( node ),
	     family = this.$.fontFamily    ( node ),
	      color = this.$.color         ( node ),
	  transform = this.$.textTransform ( node ),
	      align = this.$.textAlign     ( node ),
	     vAlign = this.$.verticalAlign ( node );

	this
		.setFillStyle   ( color )
		.setFont        ( style + ' ' + variant + ' ' + weight + ' ' + size + ' ' + family )
//		.setTextAlign   ( align )   // TODO: CSS has "justify", Canvas doesn't
		.setTextBaseline( 'bottom' ); // TODO: these don't match up between CSS & Canvas, adjust later
}

html2canvas.prototype.drawText = function( txt, rect ){
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

		this.ctx.fillText( splt[ ix ], rect.left, rect.top + rect.height);

		chrCtr += strLen + 1;
		ix++;
	}
}

html2canvas.prototype.renderText = function( txt, rect, renderer ){
	// text is empty
	if( !/\S/.test( this.$.textContent( txt ) ) ){ return; }

	this.analyzeFont( txt, rect, renderer );
	this.drawText   ( txt, rect, renderer );
};