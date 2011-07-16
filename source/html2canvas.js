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
		},

		hide : function(){
			this.canvas.canvas.style.display = 'none';
		},

		show : function(){
			this.canvas.canvas.style.display = 'block';
		}
	};

	window.html2canvas = html2canvas;
})();