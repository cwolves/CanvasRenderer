(function( $ ){
	var images = html2canvas.images = {
		getImage : function( src, cb ){
			var loadImg = loading[ src ];
			if( loadImg ){
				if( loadImg.loaded && cb ){
					cb( loadImg.img );

				}else if( cb ){
					loadImg.cbs.push( cb );
				}
				return;
			}

			var img = new Image();
			img.src = src;

			var loadImg = loading[ src ] = {
				img    : img,
				loaded : false,
				cbs    : [],
				onload : function( res ){
					this.loaded = true;
					for(var i=0, l=this.cbs.length; i<l; i++){
						this.cbs[ i ].call( null, this.img );
					}
				}
			};

			if( img.height ){
				cb && cb( img );
				loadImg.loaded = true;

			}else{
				img.onload = function(){
					loadImg.onload( loadImg.img );
				};

				img.onerror = function(){
					loadImg.onload( null );
				}
			}
		}
	}


	var loading = {},
	       imgs = $.getElements( 'img' ),
	   allNodes = $.getElements( '*' );

	// pre-load all img nodes
	for(var i=0, l=imgs.length; i<l; i++){
		images.getImage( imgs[i].src );
	}

	// pre-load all background images
	for(var i=0, l=allNodes.length; i<l; i++){
		var bgImage = $.backgroundImage( allNodes[i] );
		if(!bgImage || ( bgImage == 'none' )){ continue; }

		images.getImage( bgImage );
	}

})( html2canvas.bridge );