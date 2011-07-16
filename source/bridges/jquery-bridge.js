(function( $ ){
	var bridge = window.html2canvas.bridge = {
		createElement   : function( elem )        { return $('<' + elem + '></' + elem + '>').get(0); },
		getElements     : function( selector )    { return $(selector).get(); },
		camelCase       : $.camelCase,
		noop            : function(){},
		backgroundImage : function( node ){
			var bgImg = $( node ).css( 'background-image' );

			if(!bgImg || (bgImg == 'none')){ return ''; }

			return /\((.*?)\)/.exec( bgImg )[ 1 ];
		},
		extend          : $.extend,
		windowSize      : function(){
			return {
				width  : $(window).width(),
				height : $(window).height()
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

		// the point of this function is to accurately convert "3em", "30%", etc to px
		//   for now, just convert to a # and assume everything is in px
		unitsToPx : function( val, node ){
			return parseInt( val );
		},

		addEvent : function( node, event, fn ){
			$( node ).bind( event, fn );
		},
		trim : $.trim,
		textContent : function( node ){
			return node.nodeValue || node.innerText;
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
background-color background-repeat background-attachment background-position \
font-family font-style font-variant font-weight font-size color \
word-spacing letter-spacing text-decoration vertical-align text-transform text-align text-indent line-height white-space \
list-style-type list-style-image list-style-position '
	.split(' '), function( i, name ){
		if( !name ){ return; }

		bridge[ $.camelCase( name ) ] = function( n ){
			return $( n ).css( name );
		};
	});

})( jQuery );