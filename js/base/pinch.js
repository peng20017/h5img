//2018.8.19
(function() {
	$.event.special.pinch = {
		setup: function() {
			var _this = $(this);
			//touch 
			var mutiTouch;
			var posLast1=[],posLast2=[],disLast,disSt,rotateLast;
			
			_this.on('touchstart',this_touchstart);
			
			//单指双指触控
			function this_touchstart(e){
				$(this).on('touchmove',this_touchmove).one('touchend',this_touchend);
				if(e.originalEvent.touches.length==1){
					mutiTouch=false;
					posLast1=[e.originalEvent.touches[0].clientX,e.originalEvent.touches[0].clientY];
				}//end if
				else if(e.originalEvent.touches.length>=2){
					mutiTouch=true;
					posLast1=[e.originalEvent.touches[0].clientX,e.originalEvent.touches[0].clientY];
					posLast2=[e.originalEvent.touches[1].clientX,e.originalEvent.touches[1].clientY];
					disLast=imath.getDis(posLast1,posLast2);
					rotateLast=imath.getDeg(posLast1,posLast2);
				}//end if
			}//end func
			
			function this_touchmove(e){
				e.preventDefault();
				if(e.originalEvent.touches.length==1){
					var pos1=[e.originalEvent.touches[0].clientX,e.originalEvent.touches[0].clientY];
					_this.trigger("pinch").trigger('pinchmove',[pos1[0]-posLast1[0],pos1[1]-posLast1[1]]);
					posLast1[0]=pos1[0];
					posLast1[1]=pos1[1];
				}//end if
				else if(e.originalEvent.touches.length>=2){
					var pos1=[e.originalEvent.touches[0].clientX,e.originalEvent.touches[0].clientY];
					var pos2=[e.originalEvent.touches[1].clientX,e.originalEvent.touches[1].clientY];
					var dis=imath.getDis(pos1,pos2);
					if(Math.abs(dis-disLast)>0.5){
						_this.trigger("pinch").trigger('pinchscale',[0.025*(dis-disLast)/Math.abs(dis-disLast)]);
					}//end if
					var rotate=imath.getDeg(pos1,pos2);
					if(rotate!=rotateLast) _this.trigger("pinch").trigger('pinchrotate',[rotate-rotateLast]);
					posLast1[0]=pos1[0];
					posLast1[1]=pos1[1];
					posLast2[0]=pos2[0];
					posLast2[1]=pos2[1];
					disLast=dis;
					rotateLast=rotate;
				}//end if
			}//end func
		
			function this_touchend(e){
				$(this).off('touchmove');
			}//end func
		}//end setup
	};
	$.each({
		pinchmove: "pinch",
		pinchscale: "pinch",
		pinchrotate: "pinch",
	}, function(e, sourceEvent) {
		$.event.special[e] = {
			setup: function() {
				$(this).on(sourceEvent, $.noop);
			}
		}
	});
})();