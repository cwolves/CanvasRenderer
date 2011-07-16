html2canvas.prototype.renderBackgroundImage = function( node, rect, box, imgPath ){
	var bgRepeat = this.$.backgroundRepeat  ( node ),
	  bgPosition = this.$.unitsToPx( this.$.backgroundPosition( node ) ),
	     repeatX = (bgRepeat != 'no-repeat') && (bgRepeat != 'repeat-y'),
	     repeatY = (bgRepeat != 'no-repeat') && (bgRepeat != 'repeat-x'),
	       bgImg = this.getImage( imgPath ),
	           x = 0,
	           y = 0;

	if( !bgImg ){ return; } // image couldn't be loaded for some reason
	var w = bgImg.width,
	    h = bgImg.height;

	while( x < rect.width ){
		while( y < rect.height ){
			this.renderImage(
				bgImg,
				{
					top    : y + rect.top  + box.top,
					left   : x + rect.left + box.left,
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