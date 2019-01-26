//2016.9.18
(function() {
	$.event.special.touched = {
		setup: function() {
			var _this = $(this);
			_this.one("touchstart", _this_touchstart);
			
			function _this_touchstart(e){
				_this.one("touchmove",_this_touchmove).one("touchend",_this_touchend);
			}//end func
			
			function _this_touchmove(e) {
				_this.off("touchend",_this_touchend).one("touchstart", _this_touchstart);
			}//end func
			
			function _this_touchend(e) {
				_this.off("touchmove",_this_touchmove).one("touchstart", _this_touchstart);
				_this.trigger("touched");
			}//end func
		}//end setup
	};
})();