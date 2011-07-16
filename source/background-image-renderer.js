(function( $ ){
	html2canvas.renderBackgroundImage = function( node, rect, box, R, imgPath ){

		var bgRepeat = $.backgroundRepeat  ( node ),
		  bgPosition = $.unitsToPx( $.backgroundPosition( node ) ),
		     repeatX = (bgRepeat != 'no-repeat') && (bgRepeat != 'repeat-y'),
		     repeatY = (bgRepeat != 'no-repeat') && (bgRepeat != 'repeat-x'),
		       bgImg = html2canvas.images.getImage( imgPath ),
		           x = 0,
		           y = 0;

		if( !bgImg ){ return; } // image couldn't be loaded for some reason
		var w = bgImg.width,
		    h = bgImg.height;

		while( x < rect.width ){
			while( y < rect.height ){
				html2canvas.renderImage(
					bgImg,
					{
						top    : y + rect.top  + box.top,
						left   : x + rect.left + box.left,
						width  : w,
						height : h 
					}, {
						width  : rect.width  - x - box.left - box.right,
						height : rect.height - y - box.top  - box.bottom 
					}, R );

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
})( html2canvas.bridge );