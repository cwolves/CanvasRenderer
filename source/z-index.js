/* Takes a top-level DOM Node and returns an 1-d array
 * of every nested element sorted by z-index
 */
html2canvas.prototype.getElementsByZIndex = function( node, running ){
	if(!running){
		running = {}; // running properties that can't be pulled from CSS directly
	}

	// running values need to go here
	var opacity = parseFloat( this.$.opacity( node ) ) * ( running.opacity == null ? 1 : running.opacity );
	node.opacity = opacity == null ? 1 : opacity;

	if(!node.childNodes.length){
		return [ node ];
	}

	var contexts = [], // new stacking contexts
	       elems = [], // elements not in any nested context
	    elem, zIndex, startsContext, stack;

	elems.zIndex = 0;
	elems.index  = 0;

	contexts.push(elems);
	elems   .push(node);

	for(var i=0, c=node.childNodes, l=c.length; i<l; i++){
		elem          = node.childNodes[i];
		zIndex        = this.$.zIndex( elem );
		startsContext = this.nodeStartsStackingContext( elem, zIndex, opacity );

		if(startsContext){
			contexts.push( stack = [] );
			stack.index  = contexts.length - 1;
			stack.zIndex = zIndex || 0;
		}else{
			stack = elems;
		}

		stack.push.apply( stack, this.getElementsByZIndex( elem, {
			opacity : opacity
		} ) );
	}

	// stable sort in all browsers using original index
	contexts.sort(function(a, b){
		return a.zIndex == b.zIndex
			? b.index  - a.index
			: a.zIndex - b.zIndex;
	});

	return contexts.concat.apply([], contexts);
};

html2canvas.prototype.nodeStartsStackingContext = function( node, zIndex, opacity ){
	var   pos = this.$.position( node ),
	      IE7 = this.$.browser.IE7,
	      IE8 = this.$.browser.IE8;

	if(opacity == null){ opacity = this.$.opacity ( node ); }
	if(zIndex  == null){ zIndex  = this.$.zIndex  ( node ) || 0; }

	zIndex  = parseInt(zIndex);
	opacity = ~-opacity;

	return (
		(opacity && !IE7 && !IE8)                                  // opacity < 1 in browsers that matter
		||
		((pos=='relative' || pos=='absolute') && (zIndex || IE7) ) // has positioning && zIndex (or IE7)
	);
}