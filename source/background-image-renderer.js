html2canvas.prototype.renderBackgroundImage = function( node, rect, box, imgPath ){
	var bgImg = this.getImage( imgPath ),
	        x = 0,
	        y = 0;

	if( !bgImg ){ return; } // image couldn't be loaded for some reason

	var bgRepeat = this.$.backgroundRepeat  ( node ),
	  bgPosition = this.$.backgroundPosition( node ).split(' '),
	     repeatX = (bgRepeat != 'no-repeat') && (bgRepeat != 'repeat-y'),
	     repeatY = (bgRepeat != 'no-repeat') && (bgRepeat != 'repeat-x'),
               w = bgImg.width,
               h = bgImg.height;
	 bgPositionX = this.$.unitsToPx( bgPosition[0], rect.width , w ),
	 bgPositionY = this.$.unitsToPx( bgPosition[1], rect.height, h );

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