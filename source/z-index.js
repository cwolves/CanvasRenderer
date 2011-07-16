/* Takes a top-level DOM Node and returns an 1-d array
 * of every nested element sorted by z-index
 */
html2canvas.prototype.getElementsByZIndex = function( node ){
	var contexts = [], // new stacking contexts
	       elems = [], // elements not in any nested context
	    elem, zI, sC, stack;

	elems.zIndex = 0;
	elems.index  = 0;
	contexts.push(elems);

	for(var i=0, c=node.childNodes, l=c.length; i<l; i++){
		elem = node.childNodes[i];
		zI   = this.$.zIndex( elem );
		sC   = this.nodeStartsStackingContext( elem );

		if(sC){
			contexts.push( stack = [] );
			stack.index  = contexts.length - 1;
			stack.zIndex = zI || 0;
		}else{
			stack = elems;
		}

		stack.push( elem );
		if( elem.childNodes ){
			stack.push.apply( stack, this.getElementsByZIndex( elem ) );
		}
	}

	// stable sort in all browsers using original index
	contexts.sort(function(a, b){
		return a.zIndex == b.zIndex
			? b.index  - a.index
			: a.zIndex - b.zIndex;
	});

	return contexts.concat.apply([], contexts);
};

html2canvas.prototype.nodeStartsStackingContext = function( node ){
	var pos = this.$.position( node ),
	   opac = this.$.opacity ( node ),
	     zI = this.$.zIndex  ( node ),
	    IE7 = this.$.browser.IE7,
	    IE8 = this.$.browser.IE8;

	zI   = parseInt(zI);
	opac = ~-opac;

	return (
		(opac && !IE7 && !IE8)                                    // opacity < 1 in browsers that matter
		|| ((pos=='relative' || pos=='absolute') && (zI || IE7) ) // has positioning && zIndex (or IE7)
	);
}