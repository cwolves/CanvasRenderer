html2canvas.prototype.analyzeFont = function( txt, rect ){
	// font-style font-variant font-weight font-size/line-height font-family
	var    node = txt.parentNode,

	      style = this.$.css('font-style')     ( node ),
	    variant = this.$.css('font-variant')   ( node ),
	     weight = this.$.css('font-weight')    ( node ),
	       size = this.$.css('font-size')      ( node ),
	     family = this.$.css('font-family')    ( node ),
	      color = this.$.css('color')          ( node ),
	  transform = this.$.css('text-transform') ( node ),
	      align = this.$.css('text-align')     ( node ),
	     vAlign = this.$.css('vertical-align') ( node );

	this
		.setFillStyle   ( color )
		.setFont        ( style + ' ' + variant + ' ' + weight + ' ' + size + ' ' + family )
//		.setTextAlign   ( align )   // TODO: CSS has "justify", Canvas doesn't
		.setTextBaseline( 'bottom' ); // TODO: these don't match up between CSS & Canvas, adjust later

	switch(transform){
		case 'capitalize':
			txt.nodeValue = txt.nodeValue.replace(/(\W|^)(\w)/g, function(m, space, letter){
				return space + letter.toUpperCase();
			});
			break;
		case 'uppercase':
			txt.nodeValue = txt.nodeValue.toUpperCase();
			break;
		case 'lowercase':
			txt.nodeValue = txt.nodeValue.toLowerCase();
			break;
	}
}

html2canvas.prototype.drawText = function( txt, rect ){
	var range = document.createRange();
	range.selectNode( txt );

	// Try to draw each word, but if letter spacing is set, we can't draw per word since
	//   canvas letter-spacing can't be set, so we need to draw each letter.
	var   node = txt.parentNode,
	    lSpace = parseFloat( this.$.css('letter-spacing')( node ) ) || 0,
	      splt = range.toString().split(lSpace ? "" : /\b/),
	       len = splt.length,
	    chrCtr = 0,
	        ix = 0,
	    strLen;

	while(ix < len){
		while( (ix < len) && (!splt[ ix ] || (splt[ix] == ' ' )) ){ ix++; chrCtr++; } // skip past white-space
		if(ix >= len){ break; }

		strLen = splt[ ix ].length;

		range.setStart( txt, chrCtr );
		range.setEnd  ( txt, chrCtr + strLen );

		var rect = range.getBoundingClientRect();

		if(rect){
			this.ctx.fillText( splt[ ix ], rect.left, rect.top + rect.height);
		}

		chrCtr += strLen;// + 1;
		ix++;
	}
}

html2canvas.prototype.renderText = function( txt, rect, renderer ){
	// text is empty
	if( !/\S/.test( this.$.textContent( txt ) ) ){ return; }

	this.analyzeFont( txt, rect, renderer );
	this.drawText   ( txt, rect, renderer );
};
