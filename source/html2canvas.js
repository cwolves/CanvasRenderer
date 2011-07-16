(function(){
	function html2canvas( opts ){
		this.canvas = new html2canvas.canvasRenderer( opts );
	}

	html2canvas.prototype = {
		render : function(){
			this.canvas.render( document.body );
		},

		appendCanvasNodeTo : function( node ){
			this.canvas.appendCanvasNodeTo( node );
		}
	};

	window.html2canvas = html2canvas;
})();