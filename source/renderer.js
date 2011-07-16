(function( $ ){
	var NODES = {
		element : 1,
		text    : 3
	};

	var canvasRenderer = function( opts ){
		opts = $.extend({
			top    : 0,
			right  : 0,
			bottom : 0,
			left   : 0
		}, opts || {});

		var canvasSize = $.windowSize();
		canvasSize.height -= ( opts.top + opts.bottom );
		canvasSize.width  -= ( opts.left + opts.right );

		this.viewport = $.documentScroll();
		this.viewport.right  = this.viewport.left + canvasSize.width;
		this.viewport.bottom = this.viewport.top  + canvasSize.height;

		this.canvas = $.createElement( 'canvas ');
		this.canvas.width  = canvasSize.width;
		this.canvas.height = canvasSize.height;

		this.ctx    = this.canvas.getContext('2d');

		opts.css && ( this.canvas.style.cssText = opts.css );
	};

	canvasRenderer.prototype = {
		// ctx caching functions
		setStrokeColor  : function( color ){ ( this._strokeColor  == color ) || ( this.ctx.strokeStyle  = this._strokeColor  = color   ); return this; },
		setLineWidth    : function( width ){ ( this._lineWidth    == width ) || ( this.ctx.lineWidth    = this._lineWidth    = 0|width ); return this; },
		setFillStyle    : function( style ){ ( this._fillStyle    == style ) || ( this.ctx.fillStyle    = this._fillStyle    = style   ); return this; },
		setFont         : function( font  ){ ( this._font         == font  ) || ( this.ctx.font         = this._font         = font    ); return this; },
		setTextAlign    : function( align ){ ( this._textAlign    == align ) || ( this.ctx.textAlign    = this._textAlign    = align   ); return this; },
		setTextBaseline : function( base  ){ ( this._textBaseline == base  ) || ( this.ctx.textBaseline = this._textBaseline = base    ); return this; },

		render : function( node ){
			var rect = $.getBoundingRect( node ),
			    type = node.nodeType;

			if( type == NODES.element ){
				var box = html2canvas.renderBox( node, rect, this );

				switch( node.nodeName ){
					case 'IMG'   : html2canvas.renderImage ( node, rect, {}, this ); break;
					case 'CANVAS': html2canvas.renderCanvas( node, rect, {}, this ); break;
				}
			}else if( type == NODES.text ){
				html2canvas.renderText( node, rect, this);
			}

			var children = node.childNodes;
			for(var i=0, l=children.length; i<l; i++){
				this.render( children[ i ] );
			}

			return this;
		},

		appendCanvasNodeTo : function( node ){
			node.appendChild( this.canvas );
		}
	};

	window.html2canvas.canvasRenderer = canvasRenderer;
})( html2canvas.bridge );