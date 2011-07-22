(function(){
	var base = 'http://canvasrenderer.clientsite.me/',
	    path = 'dist/canvas-renderer-ui-',
	     scr = document.createElement('SCRIPT');

	scr.src = base + path +
		(window.jQuery
			? 'min.js'
			: 'jquery-min.js'
		);

	scr.type = 'text/javascript';

	scr.onload = function(){
		if(window.html2canvas){
			html2canvas.baseHref = base;
			scr.onload = function(){};
		}else{
			setTimeout( scr.onload, 100 );
		}
	};

	scr.onreadystatechange = function () {
		if ( ~' complete loaded '.indexOf( this.readyState ) ){
			scr.onload();
		}
	}

	document.getElementsByTagName('HEAD')[0].appendChild(scr);
})();