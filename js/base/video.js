//2018.1.3
var ivideo=importVideo();

function importVideo(){
	var video={};
	
	video.add=function(options){
		if(options && options.src && options.shell){
			var defaults = {controls:false,autoplay:true,playsinline:true,x5:true,autosize:'fill'};
			var opts = $.extend(defaults,options);
			var container=$('<video></video>').attr({src:opts.src}).addClass(opts.classname).appendTo(opts.shell);
			if(opts.poster) container.attr({poster:opts.poster});
			if(opts.playsinline) container.attr({'playsinline':'','webkit-playsinline':''});
			if(opts.x5) container.attr({'x5-video-player-type':'h5'});
			if(opts.x5_orientation) container.attr({'x5-video-orientation':opts.x5_orientation});
			if(opts.x5_fullscreen) container.attr({'x5-video-player-fullscreen':'true'});
			if(opts.controls) container.attr({controls:''});
			if(opts.onLoadstart) container[0].addEventListener('progress',opts.onLoadstart,false);
			if(opts.onLoaded) container[0].addEventListener('loadedmetadata',opts.onLoaded,false);
			if(opts.onEnded) container[0].addEventListener('ended',opts.onEnded,false);
			if(opts.onTimeupdate) container[0].addEventListener('timeupdate',opts.onTimeupdate,false);
			if(opts.onPlay) container[0].addEventListener('play',opts.onPlay,false);
			if(opts.onPause) container[0].addEventListener('pause',opts.onPause,false);
			if(opts.onVolumechange) container[0].addEventListener('volumechange',opts.onVolumechange,false);
			if(opts.autosize) container.css({'object-fit':opts.autosize});
			if(opts.autoplay) container[0].play();
			return container[0];
		}//end if
	}//end func
	
	video.on=function(options){
		var defaults = {btn:$('a.btnVideo,#btnVideo'),autoplay:true,shell:'article'};
		var opts = $.extend(defaults,options);
		if(opts.btn.length>0) opts.btn.on('click',opts,video_play);
	}//end func
	
	video.getType=function(url){
		if(url.indexOf("youku.com")!=-1){
			return 'youku';
		}//edn if
		else if(url.indexOf("qq.com")!=-1){
			return 'qq';
		}//edn if
		else if(url.indexOf(".mp4")!=-1){
			return 'mp4';
		}//edn if
		else return false;
	}//end func
	
	video.getVid=function(url,type){
		if(type=='youku'){
			var str1=url.split('id_')[1];
			var str2=str1.split('.')[0];
			return str2;
		}//edn if
		else if(type=='qq'){
			if(url.indexOf('vid=')!=-1){
				var str1=url.split('vid=')[1];
				return str1;
			}//end if
			else{
				var str1=url.split('/');
				var str2=str1[str1.length-1].split('.')[0];
				return str2;
			}//edn else
		}//edn if
		else if(url.indexOf(".mp4")!=-1){
			return url;
		}//edn if
		else return url;
	}//end func
	
	function video_play(e){
		var autoplay=e.data.autoplay;
		var onOpen=e.data.onOpen;
		var onEnded=e.data.onEnded;
		var onClose=e.data.onClose;
		var box=$("<aside class='videoBox' id='videoBox'></aside>").appendTo($(e.data.shell)).show();
		var url=$(this).data('url');
		var type=video.getType(url);
		var vid=video.getVid(url,type);
		if(vid && vid!=''){
			if(onOpen) onOpen();
			var ht=window.innerWidth*9/16;
			var top=window.innerHeight/2-ht/2;
			if(type=='youku') $('<iframe width=100% height='+ht+' src=http://player.youku.com/embed/'+vid+ (autoplay?'?autoplay=true':'') + ' frameborder=0 allowfullscreen></iframe>').css({top:top}).appendTo(box);
			else if(type=='qq') $('<iframe width=100% height='+ht+' src=http://v.qq.com/iframe/player.html?vid='+vid+'&tiny=0&auto='+(autoplay?1:0)+' frameborder=0 allowfullscreen></iframe>').css({top:top}).appendTo(box);
			else if(type=='mp4'){
				if($(this).data('full')){
					$('.videoBox').css({background:"transparent"})
					var attr = os.android? {src:vid,poster:$(this).data('poster')}:{src:vid}
					var orientation = $(this).data('orientation')
					var container=$('<video   playsinline webkit-playsinline x-webkit-airplay="allow" x5-video-player-type="h5" x5-video-player-fullscreen="true" x5-video-orientation="'+orientation+'"></video>').attr(attr).appendTo(box);
					if(autoplay) container[0].play();
					if(onEnded) container[0].addEventListener('ended',onEnded,false);
				}else{
					var container=$('<video  playsinline webkit-playsinline ></video>').attr({src:vid,poster:$(this).data('poster')}).css({width:window.innerWidth,height:ht,top:top}).appendTo(box);
					if(autoplay) container[0].play();
					if(onEnded) container[0].addEventListener('ended',onEnded,false);
				}
				
			}//end else
		}//end if
		var close=$("<a class='close'></a>").appendTo(box).one('click',function(e){
			box.remove();
			if(onClose) onClose();
		});
	}//end event
	
	return video;
}//end import
