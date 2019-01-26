//2018.2.26
var ishake=importShake();

function importShake(){
	var defaults = {hold:100,max:10,delay:100,stopDelay:500,type:0},opts;
	var $lev=0,$now=0,$lastTime,$lastX,$lastY,$lastZ,$pause;
	var $dirXLast=0,$dirYLast=0,$dirZLast=0;
	var $speedBar=$('.speedBar').children();
	var $rateZ=os.ios?1:0.1;
	var shake={};
	
	shake.on=function(options){
		opts = $.extend(defaults,options);
		this.init();
		window.addEventListener('devicemotion',devicemotion_handler,false);		
	}//end func

	shake.off=function(){
		window.removeEventListener('devicemotion',devicemotion_handler,false);
	}//end func
	
	shake.init=function(options){
		$lev=0;
		$now=0;
		$lastTime=null;
		$lastX=null;
		$lastY=null;
		$lastZ=null;
		$pause=null;
		$lastTime=new Date().getTime();
	}//end func
	
	function devicemotion_handler(event) {
		var curTime = new Date().getTime();
		var diffTime = curTime -$lastTime;
		if (diffTime>=opts.delay) {
			$lastTime = curTime;
			// 获取含重力的加速度
			var acceleration = event.accelerationIncludingGravity;
			var disX=acceleration.x-$lastX;
			var disY=acceleration.y-$lastY;
			var disZ=acceleration.z*$rateZ-$lastZ;
			var dirX=disX>0?1:-1;
			var dirY=disY>0?1:-1;
			var dirZ=disZ>0?1:-1;
			var speedX = Math.abs(disX)/diffTime*10000;
			var speedY = Math.abs(disY)/diffTime*10000;
			var speedZ = Math.abs(disZ)/diffTime*10000;
			if($speedBar.length>0){
				$speedBar.eq(0).html('speedX:'+speedX);
				$speedBar.eq(1).html('speedY:'+speedY);
				$speedBar.eq(2).html('speedZ:'+speedZ);
			}//edn if
			if ( (dirX!=$dirXLast && speedX>=opts.hold) || (dirY!=$dirYLast && speedY>=opts.hold) || (dirZ!=$dirZLast && speedZ>=opts.hold) ){
				$lev++;
				$now++;
				if(opts.onCount) opts.onCount($now);
				if($now==1 && opts.onStart) opts.onStart();
				else if( (!opts.type && $lev==opts.max) || (opts.type && $now==opts.max)  ){
					if(opts.onComplete) opts.onComplete();
					shake.off();
				}//end if
				clearTimeout($pause);
				$pause=setTimeout(function(){
					if(opts.onPause) opts.onPause();
				},opts.stopDelay);
			}//end if
			else{
				$lev--;
				$lev=$lev<0?0:$lev;
			}//end else 
			if(opts.onLevel) opts.onLevel($lev);
			$lastX=acceleration.x;
			$lastY=acceleration.y;
			$lastZ=acceleration.z*$rateZ;
			$dirXLast=dirX;
			$dirYLast=dirY;
			$dirZLast=dirZ;
		}//end if
	}//end event
	
	return shake;
	
}//end import