//2017.4.9
(function() {
	$.event.special.swipe = {
		setup: function() {
			var _this = $(this);
			var _start,_stop;
			_this.on("touchstart", _this_touchstart);
			function _this_touchstart(e){
				var data = e.originalEvent.touches[0];
				_start = {
					time: (new Date).getTime(),
					coords: [data.pageX, data.pageY]
				};
				_this.on("touchmove", _this_touchmove).one("touchend",_this_touchend);
			}//end func
			
			function _this_touchmove(e) {
				var data = e.originalEvent.changedTouches[0];
				_stop = {
					time: (new Date).getTime(),
					coords: [data.pageX, data.pageY]
				};
				if (Math.abs(_start.coords[1] - _stop.coords[1]) > 10 || Math.abs(_start.coords[0] - _stop.coords[0]) > 5) e.preventDefault();
			}//end func
			
			function _this_touchend(e) {
				_this.off("touchmove", _this_touchmove);
				if (_start && _stop) {
					if (_stop.time - _start.time < 1000) {
						if (Math.abs(_start.coords[1] - _stop.coords[1]) > 15 && Math.abs(_start.coords[0] - _stop.coords[0]) < 150) {
							_this.trigger("swipe").trigger(_start.coords[1] > _stop.coords[1] ? "swipeup" : "swipedown")
						} else if (Math.abs(_start.coords[0] - _stop.coords[0]) > 15 && Math.abs(_start.coords[1] - _stop.coords[1]) < 150) {
							_this.trigger("swipe").trigger(_start.coords[0] > _stop.coords[0] ? "swipeleft" : "swiperight")
						}
					}
				}
				_start = _stop = undefined;
			}//end func
		}//end setup
	};
	$.each({
		swipeleft: "swipe",
		swiperight: "swipe",
		swipedown: "swipe",
		swipeup: "swipe"
	}, function(e, sourceEvent) {
		$.event.special[e] = {
			setup: function() {
				$(this).on(sourceEvent, $.noop);
			}
		}
	});
})();