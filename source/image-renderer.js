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