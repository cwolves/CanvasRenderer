(function( $ ){
	var _console = html2canvas.prototype.console = {};

	var methods = 'log trace'.split(' ');
	for(var i=0, l=methods.length; i<l; i++){
		(function( method ){
			_console[ method ] = function(){
				return console && console[ method ] && console[ method ].apply( console, arguments );
			};
		})( methods[i] );
	}
})( html2canvas.bridge );
