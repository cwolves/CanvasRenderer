(function( $ ){
	var imgs = {},
	     cbs = [];

	html2canvas.images = {
		getImage : function( path ){
			return imgs[ path ] && imgs[ path ].img;
		},

		addImage : function( path, cb ){
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
		},

		preLoad : function( cb ){
			var   imgs = $.getElements( 'img' ),
			  allNodes = $.getElements( '*' ),
			       ctr = 1;

			function done(){
				if(!--ctr){ cb(); }
			}

			// pre-load all img nodes
			for(var i=0, l=imgs.length; i<l; i++){
				ctr++;
				this.addImage( imgs[i].src, done );
			}

			// pre-load all background images
			for(var i=0, l=allNodes.length; i<l; i++){
				var bgImage = $.backgroundImage( allNodes[i] );
				if(!bgImage || ( bgImage == 'none' )){ continue; }

				ctr++;
				this.addImage( bgImage, done );
			}
		}
	}
})( html2canvas.bridge );