html2canvas.prototype.NODETYPES = {
	element : 1,
	text    : 3
};

html2canvas.prototype.init.push(function( opts ){
	opts = this.$.extend({
		top    : 0,
		right  : 0,
		bottom : 0,
		left   : 0
	}, opts || {});

	var canvasSize     = this.$.bodySize();

	canvasSize.height -= ( opts.top + opts.bottom );
	canvasSize.width  -= ( opts.left + opts.right );

	this.viewport        = this.$.documentScroll();
	this.viewport.right  = this.viewport.left + canvasSize.width;
	this.viewport.bottom = this.viewport.top  + canvasSize.height;

	this.canvas        = this.$.createElement( 'canvas ');
	this.canvas.width  = canvasSize.width;
	this.canvas.height = canvasSize.height;

	this.ctx = this.canvas.getContext('2d');

	// pre-fill the canvas with white
	this.ctx.fillStyle = '#FFF';
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	opts.css && ( this.canvas.style.cssText = opts.css );

	this.doneInit();
});

// ctx caching functions
html2canvas.prototype.setStrokeColor  = function( color   ){ ( this._strokeColor  == color   ) || ( this.ctx.strokeStyle  = this._strokeColor  = color   ); return this; };
html2canvas.prototype.setLineWidth    = function( width   ){ ( this._lineWidth    == width   ) || ( this.ctx.lineWidth    = this._lineWidth    = 0|width ); return this; };
html2canvas.prototype.setFillStyle    = function( style   ){ ( this._fillStyle    == style   ) || ( this.ctx.fillStyle    = this._fillStyle    = style   ); return this; };
html2canvas.prototype.setFont         = function( font    ){ ( this._font         == font    ) || ( this.ctx.font         = this._font         = font    ); return this; };
html2canvas.prototype.setTextAlign    = function( align   ){ ( this._textAlign    == align   ) || ( this.ctx.textAlign    = this._textAlign    = align   ); return this; };
html2canvas.prototype.setTextBaseline = function( base    ){ ( this._textBaseline == base    ) || ( this.ctx.textBaseline = this._textBaseline = base    ); return this; };
html2canvas.prototype.setOpacity      = function( opacity ){ ( this._globalAlpha  == opacity ) || ( this.ctx.globalAlpha  = this._globalAlpha  = opacity ); return this; };

html2canvas.prototype.render = function( node ){
	var nodes = this.getElementsByZIndex( node );

	for(var i=0, l=nodes.length; i<l; i++){
		var node = nodes[i],
		    rect = this.$.getBoundingRect( node ),
		    type = node.nodeType;

		if( type == this.NODETYPES.element ){
			var box = this.renderBox( node, rect, this );

			switch( node.nodeName ){
				case 'IMG'   : this.renderImage ( node, rect, {}, this ); break;
				case 'CANVAS': this.renderCanvas( node, rect, {}, this ); break;
			}
		}else if( type == this.NODETYPES.text ){
			this.renderText( node, rect, this);
		}
	}

	return this;
};

html2canvas.prototype.appendToNode = function( node ){
	node.appendChild( this.canvas );
};
