var imgs = {},
     cbs = [];

html2canvas.prototype.sameOrigin = function( src ){
	var a = this.$.createElement('a');
	a.href = src;

	return (a.host === location.host) && (a.protocol === location.protocol);
};

html2canvas.prototype.getImage = function( path ){
	return imgs[ path ] && imgs[ path ].img;
};

html2canvas.prototype.addImage = function( path, cb ){
	if( !this.sameOrigin( path ) ){ return; }

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
		console.log(bgImage);

		ctr++;
		this.addImage( bgImage, done );
	}

	done();
});
