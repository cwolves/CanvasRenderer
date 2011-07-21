(function(){
	var base = 'http://canvasrenderer.clientsite.me/dist/canvas-renderer-test-',
	     scr = document.createElement('SCRIPT');

	scr.src = jQuery
		? base + 'min.js'
		: base + 'jquery-min.js';

	scr.type = 'text/javascript';
	document.getElementsByTagName('HEAD')[0].appendChild(scr);
})();