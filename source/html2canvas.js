function html2canvas( opts, loadCB ){
	this.$       = html2canvas.bridge;
	this.loadCB  = loadCB;

	for(i=0, l=this.initCtr=this.init.length; i<l; i++){
		this.init[i].call( this, opts );
	}
}

html2canvas.prototype = {
	init : [],
	doneInit : function(){
		var self = this;
		setTimeout(function(){ self._doneInit(); }, 1);
	},

	_doneInit : function(){
		
		--this.initCtr || this.loadCB();
	},

	hide : function(){
		this.canvas.style.display = 'none';

		return this;
	},

	show : function(){
		this.canvas.style.display = 'block';

		return this;
	}
};
