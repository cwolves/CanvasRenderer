html2canvas.prototype.renderBackgroundImage = function( node, rect, box, imgPath ){
	var bgImg = this.getImage( imgPath );

	if( !bgImg ){ return; } // image couldn't be loaded for some reason

	var bgRepeat = this.$.css('background-repeat')  ( node ),
	  bgPosition = this.$.css('background-position')( node ).split(' '),
	      bgSize = this.$.css('background-size')    ( node ),
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
