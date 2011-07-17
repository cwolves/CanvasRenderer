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
background-color background-repeat background-attachment background-position \
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