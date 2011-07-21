/*!
 * Canvas Renderer v0.1.0
 *
 * Copyright 2011, Mark Kahn
 *
 * Date: Thu Jul 21 15:13:04 2011 -0700
 */
function html2canvas( opts, loadCB ){
	this.$       = html2canvas.bridge;
	this.loadCB  = loadCB;

	for(i=0, l=this.initCtr=this.init.length; i<l; i++){
		this.init[i].call( this, opts );
	}
}

html2canvas.prototype = {
	init : [],
	doneInit : function(){
		var self = this;
		setTimeout(function(){ self._doneInit(); }, 1);
	},

	_doneInit : function(){
		
		--this.initCtr || this.loadCB();
	},

	hide : function(){
		this.canvas.style.display = 'none';

		return this;
	},

	show : function(){
		this.canvas.style.display = 'block';

		return this;
	}
};
(function( $ ){
	var bridge = window.html2canvas.bridge = {
		// IE7/8/9 detection needex for z-index logic
		browser : {
			IE7 : false,
			IE8 : false,
			IE9 : false
		},
		createElement   : function( elem )        { return $('<' + elem + '></' + elem + '>').get(0); },
		getElements     : function( selector )    { return $(selector).get(); },
		camelCase       : $.camelCase,
		noop            : function(){},
		trim            : $.trim,
		extend          : $.extend,

		backgroundImage : function( node ){
			var bgImg = $( node ).css( 'background-image' );

			if(!bgImg || (bgImg == 'none')){ return ''; }

			return /\("?(.*?)"?\)/.exec( bgImg )[ 1 ];
		},

		windowSize      : function(){
			return {
				width  : $(window).width(),
				height : $(window).height()
			};
		},

		bodySize        : function(){
			return {
				width  : $(document).width(),
				height : $(document).height()
			};
		},

		documentScroll  : function(){
			var $body = $(document.body);

			return {
				top  : $body.scrollTop(),
				left : $body.scrollLeft()
			};
		},

		getBoundingRect : function( node ){
			var $node = $( node ),
			   offset = $node.offset()
			    width = $node.outerWidth(),
			   height = $node.outerHeight();

			offset.bottom = offset.top + height;
			offset.right  = offset.left + width;
			offset.height = height;
			offset.width  = width;

			return offset;
		},

		unitsToPx : function( val, mult, mult2 ){
			if( val == null ){ return; }

			var percent = ~val.indexOf('%'),
			        val = parseFloat( val );

			if(percent){
				val = (mult || 0) * val/100 - (mult2 || 0) * val/100;
			}

			return val;
		},

		addEvent : function( node, event, fn ){
			$( node ).bind( event, fn );
		},

		textContent : function( node ){
			return node.nodeValue || node.innerText;
		},

		isVisible : function( node ){
			return (bridge.display( node ) != 'none') &&
				(bridge.visibility( node ) != 'hidden');
		}
	};

	// DOM Properties
	jQuery.each(
'offset width height'
		.split(' '), function( i, name ){
			if( !name ){ return; }

			bridge[ $.camelCase( name ) ] = function( n ){
				return $( n )[ name ]();
			};
		});

	// CSS Properties
	jQuery.each(
'margin-top margin-right margin-bottom margin-left \
padding-top padding-right padding-bottom padding-left \
border-top-width border-right-width border-bottom-width border-left-width \
border-top-color border-right-color border-bottom-color border-left-color \
border-top-style border-right-style border-bottom-style border-left-style \
outline-top-width outline-right-width outline-bottom-width outline-left-width \
outline-top-color outline-right-color outline-bottom-color outline-left-color \
outline-top-style outline-right-style outline-bottom-style outline-left-style \
background-color background-repeat background-attachment background-position background-size \
font-family font-style font-variant font-weight font-size color \
word-spacing letter-spacing text-decoration vertical-align text-transform text-align text-indent line-height white-space \
list-style-type list-style-image list-style-position opacity position z-index visibility display'
	.split(' '), function( i, name ){
		if( !name ){ return; }

		bridge[ $.camelCase( name ) ] = function( n ){
			// can't get CSS on text nodes
			if( 1 != n.nodeType ){ return; }

			return $( n ).css( name );
		};
	});

})( jQuery );
var imgs = {},
     cbs = [];

html2canvas.prototype.getImage = function( path ){
	return imgs[ path ] && imgs[ path ].img;
};

html2canvas.prototype.addImage = function( path, cb ){
	if( imgs[ path ] ){
		if( imgs[ path ].loaded ){
			cb();
		}else{
			imgs[ path ].cbs.push( cb );
		}

		return;
	}

	var img = new Image(),
	    cbs = [ cb ],

	 imgObj = {
		img    : img,
		cbs    : cbs,
		loaded : false
	 };

	img.onload = function(){
		this.loaded = true;
		for(var i=0, l=cbs.length; i<l; i++){ cbs[i](); }
	};
	img.onerror = function(){
		imgObj.img    = null;

		img.onload();
	};
	img.src = path;

	// if image is already loaded
	img.width && setTimeout(img.onload, 1);

	imgs[ path ] = imgObj;
};

html2canvas.prototype.init.push(function( opts ){
	var   imgs = this.$.getElements( 'img' ),
	  allNodes = this.$.getElements( '*' ),
	       ctr = 1,
	      self = this;

	function done(){
		if(!--ctr){ self.doneInit(); }
	}

	// pre-load all img nodes
	for(var i=0, l=imgs.length; i<l; i++){
		ctr++;
		this.addImage( imgs[i].src, done );
	}

	// pre-load all background images
	for(var i=0, l=allNodes.length; i<l; i++){
		var bgImage = this.$.backgroundImage( allNodes[i] );
		if(!bgImage || ( bgImage == 'none' )){ continue; }

		ctr++;
		this.addImage( bgImage, done );
	}

	done();
});
(function( $ ){
	var _console = html2canvas.prototype.console = {};

	var methods = 'log trace'.split(' ');
	for(var i=0, l=methods.length; i<l; i++){
		(function( method ){
			_console[ method ] = function(){
				return console && console[ method ] && console[ method ].apply( console, arguments );
			};
		})( methods[i] );
	}
})( html2canvas.bridge );
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
html2canvas.prototype.renderImage = function( img, rect, constrain ){
	img = this.getImage( img.src ); // get original image, no width/height set, etc

	constrain.width  || (constrain.width  = Infinity);
	constrain.height || (constrain.height = Infinity);
	var dW = rect.width  > constrain.width  ? constrain.width  : rect.width ,
	    dH = rect.height > constrain.height ? constrain.height : rect.height,
	    dX = rect.left,
	    dY = rect.top,
	    sX = 0,
	    sY = 0,
	    sW = img.width  * ( dW / rect.width  ),
	    sH = img.height * ( dH / rect.height );

	try{
		this.ctx.drawImage(
			img,
			sX, sY, sW, sH,
			dX, dY, dW, dH
		);
	}catch(err){}
};
html2canvas.prototype.renderBackgroundImage = function( node, rect, box, imgPath ){
	var bgImg = this.getImage( imgPath );

	if( !bgImg ){ return; } // image couldn't be loaded for some reason

	var bgRepeat = this.$.backgroundRepeat  ( node ),
	  bgPosition = this.$.backgroundPosition( node ).split(' '),
	      bgSize = this.$.backgroundSize    ( node ),
	  bgSizeSplt = bgSize.split(' '),
	     repeatX = (bgRepeat != 'no-repeat') && (bgRepeat != 'repeat-y'),
	     repeatY = (bgRepeat != 'no-repeat') && (bgRepeat != 'repeat-x'),
               w = bgImg.width,
               h = bgImg.height;
	 bgPositionX = this.$.unitsToPx( bgPosition[0], rect.width , repeatX ? rect.width  : w ),
	 bgPositionY = this.$.unitsToPx( bgPosition[1], rect.height, repeatY ? rect.height : h ),
	     bgSizeX = this.$.unitsToPx( bgSizeSplt[0], rect.width  ),
	     bgSizeY = this.$.unitsToPx( bgSizeSplt[1], rect.height ),
	           x = 0,
	           y = 0;

	if(bgSizeX){ w = bgSizeX; }
	if(bgSizeY){ h = bgSizeY; }

	while( x < rect.width ){
		while( y < rect.height ){
			this.renderImage(
				bgImg,
				{
					top    : y + rect.top  + box.top  + bgPositionY,
					left   : x + rect.left + box.left + bgPositionX,
					width  : w,
					height : h 
				}, {
					width  : rect.width  - x - box.left - box.right,
					height : rect.height - y - box.top  - box.bottom 
				});

			if(repeatY){
				y += h;
			}else{
				y = rect.height;
			}
		}
		y = 0;

		if(repeatX){
			x += w;
		}else{
			x = rect.width;
		}
	}
};
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
	    lSpace = parseFloat( this.$.letterSpacing( node ) ) || 0,
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
/* Takes a top-level DOM Node and returns an 1-d array
 * of every nested element sorted by z-index
 */
html2canvas.prototype.getElementsByZIndex = function( node, running ){
	if(!running){
		running = {}; // running properties that can't be pulled from CSS directly
	}

	var visible = this.$.isVisible( node );
	if(!visible){ return []; }

	// running values need to go here
	var opacity = this.$.opacity( node );
	    opacity = parseFloat( opacity == null ? 1 : opacity ) * ( running.opacity == null ? 1 : running.opacity );
	node.opacity = opacity == null ? 1 : opacity;

	if(!node.childNodes.length){
		return [ node ];
	}

	var contexts = [], // new stacking contexts
	       elems = [], // elements not in any nested context
	    elem, zIndex, startsContext, stack;

	elems.zIndex = 0;
	elems.index  = 0;

	contexts.push(elems);
	elems   .push(node);

	for( var i=0, c=node.childNodes, l=c.length; i<l; i++ ){
		elem          = node.childNodes[i];
		zIndex        = this.$.zIndex( elem );
		startsContext = this.nodeStartsStackingContext( elem, zIndex, opacity );

		if(startsContext){
			contexts.push( stack = [] );
			stack.index  = contexts.length - 1;
			stack.zIndex = zIndex || 0;
		}else{
			stack = elems;
		}

		stack.push.apply( stack, this.getElementsByZIndex( elem, {
			opacity : opacity
		} ) );
	}

	// stable sort in all browsers using original index
	contexts.sort( function( a, b ){
		return a.zIndex == b.zIndex
			? b.index  - a.index
			: a.zIndex - b.zIndex;
	});

	return contexts.concat.apply( [], contexts );
};

html2canvas.prototype.nodeStartsStackingContext = function( node, zIndex, opacity ){
	var   pos = this.$.position( node ),
	      IE7 = this.$.browser.IE7,
	      IE8 = this.$.browser.IE8;

	if(opacity == null){ opacity = this.$.opacity ( node ); }
	if(zIndex  == null){ zIndex  = this.$.zIndex  ( node ) || 0; }

	zIndex  = parseInt(zIndex);
	opacity = ~-opacity;

	return (
		(opacity && !IE7 && !IE8)                                  // opacity < 1 in browsers that matter
		||
		((pos=='relative' || pos=='absolute') && (zIndex || IE7) ) // has positioning && zIndex (or IE7)
	);
}
CanvasRenderingContext2D.prototype.dashedLineTo = function (fromX, fromY, toX, toY, pattern) {
	// Our growth rate for our line can be one of the following:
	//   (+,+), (+,-), (-,+), (-,-)
	// Because of this, our algorithm needs to understand if the x-coord and
	// y-coord should be getting smaller or larger and properly cap the values
	// based on (x,y).
	var lt = function (a, b) { return a <= b; };
	var gt = function (a, b) { return a >= b; };
	var capmin = function (a, b) { return Math.min(a, b); };
	var capmax = function (a, b) { return Math.max(a, b); };

	var checkX = { thereYet: gt, cap: capmin };
	var checkY = { thereYet: gt, cap: capmin };

	if (fromY - toY > 0) {
		checkY.thereYet = lt;
		checkY.cap      = capmax;
	}
	if (fromX - toX > 0) {
		checkX.thereYet = lt;
		checkX.cap      = capmax;
	}

	this.moveTo(fromX, fromY);
	var offsetX = fromX;
	var offsetY = fromY;
	var idx = 0, dash = true;
	while (!(checkX.thereYet(offsetX, toX) && checkY.thereYet(offsetY, toY))) {
		var ang = Math.atan2(toY - fromY, toX - fromX);
		var len = pattern[idx];

		offsetX = checkX.cap(toX, offsetX + (Math.cos(ang) * len));
		offsetY = checkY.cap(toY, offsetY + (Math.sin(ang) * len));

		if (dash) this.lineTo(offsetX, offsetY);
		else this.moveTo(offsetX, offsetY);

		idx  = (idx + 1) % pattern.length;
		dash = !dash;
	}
};
// Creates a // UI to select parts of the page to highlight
