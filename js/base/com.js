//2018.8.23
var icom = importCom();
function importCom() {
	var com = {};

	//初始化
	com.init = function(callback) {
		var article=$('article');
		if(ibase.dir == 'portrait'){
			lock_dected();
		}//edn if
		else{
			html_resize();
			$(window).on('resize', window_orientation);
			lock_dected();
		} //end else
		
		function lock_dected() {
			if(ibase.lock) requestAnimationFrame(lock_dected);
			else if(callback) callback();
		} //edn func

		function window_orientation(e) {
			if(os.ios) for(var i=0; i<3; i++) setTimeout(html_resize, i*150);
			else html_resize();
		} //edn func
		
		function html_resize() {
			var dir=ibase.getOrient(true);
			if(dir == 'portrait') {
				var iphoneXFull=os.iphoneX && window.innerHeight>=650;
				if(ibase.landscapeScaleMode == 'cover' || ibase.landscapeScaleMode == 'contain') {
					var size = imath.autoSize([ibase.landscapeHeight, ibase.landscapeWidth], [window.innerWidth, iphoneXFull?window.innerHeight-ibase.iphoneXOffsetPortrait:window.innerHeight], ibase.landscapeScaleMode);
					var scale = size[0] / ibase.landscapeHeight;
					console.log('window size:' + window.innerHeight + '/' + window.innerWidth);
					console.log('auto scale:' + scale);
					ibase.landScapeScaleX=ibase.landScapeScaleY=scale;
					article.css({
						width: ibase.landscapeWidth,
						height: ibase.landscapeHeight,
						rotate: 90,
						scale: scale,
						x: os.iphoneX?0:(window.innerHeight / scale - ibase.landscapeWidth) * 0.5,
						y: -ibase.landscapeHeight + (ibase.landscapeHeight-window.innerWidth / scale) * 0.5
					});
				} //edn if
				else{
					var scale = [window.innerWidth / ibase.landscapeHeight, window.innerHeight / ibase.landscapeWidth];
					console.log('window size:' + window.innerHeight + '/' + window.innerWidth);
					console.log('auto scale:' + scale);
					ibase.landScapeScaleX=scale[0];
					ibase.landScapeScaleY=scale[1];
					article.css({
						width: ibase.landscapeWidth,
						height: ibase.landscapeHeight,
						rotate: 90,
						scaleX: scale[1],
						scaleY: scale[0],
						x: 0,
						y: -ibase.landscapeHeight
					});
				} //end else
			} //end if
			else{
				console.log('screen landscape');
				var iphoneXFull=os.iphoneX && window.innerHeight>=650;
				if(ibase.landscapeScaleMode == 'cover' || ibase.landscapeScaleMode == 'contain') {
					var size = imath.autoSize([ibase.landscapeWidth, ibase.landscapeHeight], [iphoneXFull?window.innerWidth-ibase.iphoneXOffsetLandscape*2:window.innerWidth, iphoneXFull?window.innerHeight-70:window.innerHeight], ibase.landscapeScaleMode);
					var scale = size[0] / ibase.landscapeWidth;
					console.log('window size:' + window.innerWidth + '/' + window.innerHeight);
					console.log('auto scale:' + scale);
					ibase.landScapeScaleX=ibase.landScapeScaleY=scale;
					article.css({
						width: ibase.landscapeWidth,
						height: ibase.landscapeHeight,
						rotate: 0,
						scale: scale,
						x: (window.innerWidth / scale - ibase.landscapeWidth) * 0.5 + iphoneXFull?ibase.iphoneXOffsetLandscape/scale:0,
						y: (window.innerHeight / scale - ibase.landscapeHeight) * 0.5
					});
				} //edn if
				else {
					var scale = [window.innerWidth / ibase.landscapeWidth, window.innerHeight / ibase.landscapeHeight];
					console.log('window size:' + window.innerHeight + '/' + window.innerWidth);
					console.log('auto scale:' + scale);
					ibase.landScapeScaleX=scale[0];
					ibase.landScapeScaleY=scale[1];
					article.css({
						width: ibase.landscapeWidth,
						height: ibase.landscapeHeight,
						rotate: 0,
						scaleX: scale[0] + iphoneXFull?ibase.iphoneXOffsetLandscape/scale[0]:0,
						scaleY: scale[1],
						x: 0,
						y: 0
					});
				} //end else
			} //end else
		} //edn func

	} //edn func
	
	//解锁屏幕滑动
	com.screenScrollEnable = function() {
		var article=$('article');
		var html=$('html');
		if(ibase.dir=='portrait'){
			article.css({'overflow-y': 'auto'});
			if(os.ios) html.css({'position': 'relative'});
			if(os.iphoneXFull) article.css({height: '100%'});
			$(document).off('touchmove', noScroll);
		}//edn if
		else{
			article.off('touchmove', noScroll);
		}//edn else
	} //end func

	//锁定屏幕滑动
	com.screenScrollUnable = function() {
		var article=$('article');
		var html=$('html');
		if(ibase.dir=='portrait'){
			article.css({ 'overflow-y': 'hidden'});
			if(os.ios) html.css({'position': 'fixed'});
			if(os.iphoneXFull) article.css({height: 'calc( 100% - 0.7rem )'});
			$(document).on('touchmove', noScroll);
		}//edn if
		else{
			article.on('touchmove', noScroll);
		}//edn else
	} //end func

	function noScroll(e) {
		e.preventDefault();
	} //end func

	//取代jquery的fadeIn
	com.fadeIn = function(obj, dur, callback) {
		if(obj) {
			dur = dur || 500;
			obj.show().css({
				opacity: 0
			}).transition({
				opacity: 1
			}, dur, function() {
				if(callback) callback($(this));
			});
		} //end if
	} //end func

	//取代jquery的fadeOut
	com.fadeOut = function(obj, dur, callback) {
		if(obj) {
			dur = dur || 500;
			obj.transition({
				opacity: 0
			}, dur, function() {
				$(this).hide().css({
					opacity: 1
				});
				if(callback) callback($(this));
			});
		} //end if
	} //end func
	
	//打开弹窗，会自动寻找a.close对象绑定关闭事件，并在关闭时执行回调
	com.popOn = function(obj, options) {
		if(obj && obj.length > 0) {
			var defaults = {
				closeEvent: 'touchend',
				closeType: 'button',
				fade: 500,
				closeBtn: obj.find('a.close'),
				remove: false
			};
			var opts = $.extend(defaults, options);
			if(opts.text) obj.find('.text').html(opts.text);
			if(opts.fade) com.fadeIn(obj, opts.fade);
			else obj.show();
			if(opts.closeBtn.length > 0 && opts.closeType == 'button') opts.closeBtn.one(opts.closeEvent, obj_close);
			else obj.one(opts.closeEvent, obj_close);
			obj.on('close', obj_close);
		} //end if
		function obj_close(e) {
			if(opts.closeBtn.length > 0 && opts.closeType == 'button') opts.closeBtn.off(opts.closeEvent, obj_close);
			else obj.off(opts.closeEvent, obj_close);
			if(opts.fade) com.fadeOut(obj, opts.fade, function() {
				if(opts.remove) obj.remove();
			});
			else if(opts.remove) obj.remove();
			else obj.hide();
			obj.off('close', obj_close);
			if(opts.onClose) opts.onClose(obj);
		} //end func
	} //end func
	
	//关闭使用popOn方法打开的弹窗
	com.popOff = function(obj) {
		if(obj && obj.length > 0) obj.trigger('close');
	} //end func

	//取代系统alert
	com.alert = function(text, callback) {
		if(text && text != '') {
			var box = $('<aside class="alertBox"><div><p class="text"></p><p class="btn"><a href="javascript:;" class="close">确定</a></p></div></aside>').appendTo(ibase.dir == 'landscape' ? 'article' : 'body');
			com.popOn(box, {
				text: text,
				onClose: callback,
				remove: true,
				closeEvent: 'click'
			});
		} //end if
	} //end func
	
	//带有“取消”和“确认”按钮的对话框
	com.confirm = function(text, callbackConfirm, callbackCancel, btnCancelText, btnConfirmText) {
		text=text||'';
		btnCancelText=btnCancelText||'取消';
		btnConfirmText=btnConfirmText||'确认';
		if(text != '') {
			var box = $('<aside class="confirmBox"><div><p class="text">'+text+'</p><p class="btn"><a href="javascript:;" class="cancel">'+btnCancelText+'</a><a href="javascript:;" class="confirm">'+btnConfirmText+'</a></p></div></aside>').appendTo(ibase.dir == 'landscape' ? 'article' : 'body');
			var btn=box.find('a');
			btn.one('click',function(e){
				if($(this).index()==0 && callbackCancel) callbackCancel();
				else if($(this).index()==1 && callbackConfirm) callbackConfirm();
				btn.off();
				box.remove();
			})
		} //end if
	} //end func

	//获得http url参数
	com.getQueryString = function(name) {
		if(name && name != '') {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if(r != null) return decodeURIComponent(r[2]);
			return null;
		} //end if
		else return null;
	} //end func

	//载入图片函数
	com.imageLoad = function(src, callback) {
		if(src && src != '') {
			var loader = new PxLoader();
			if($.type(src) === "string" && src != '') loader.addImage(src);
			else if($.type(src) === "array" && src.length > 0) {
				for(var i = 0; i < src.length; i++) {
					loader.addImage(src[i]);
				} //end for
			} //end else
			loader.addCompletionListener(function() {
				console.log('images load complete');
				loader = null;
				if(callback) callback(src);
			});
			loader.start();
		} //end if
	} //end func	

	//常用正则
	com.checkStr = function(str, type) {
		if(str && str != '') {
			type = type || 0;
			switch(type) {
				case 0:
					var reg = new RegExp(/^1[3-9]\d{9}$/); //手机号码验证
					break;
				case 1:
					var reg = new RegExp(/^[1-9]\d{5}$/); //邮政编码验证
					break;
				case 2:
					var reg = new RegExp(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/); //匹配EMAIL
					break;
				case 3:
					var reg = new RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/); //匹配身份证
					break;
				case 4:
					var reg = new RegExp(/^\d+$/); //是否为0-9的数字
					break;
				case 5:
					var reg = new RegExp(/^[a-zA-Z\u0391-\uFFE5]*[\w\u0391-\uFFE5]*$/); //不能以数字或符号开头
					break;
				case 6:
					var reg = new RegExp(/^\w+$/); //匹配由数字、26个英文字母或者下划线组成的字符串
					break;
				case 7:
					var reg = new RegExp(/^[\u0391-\uFFE5]+$/); //匹配中文
					break;
				case 8:
					var reg = new RegExp(/^[a-zA-Z\u0391-\uFFE5]+$/); //不能包含数字和符号
					break;
				case 9:
					var reg = new RegExp(/^\d{6}$/); //6位验证码验证
					break;
				case 10:
					var reg = new RegExp(/^\d{4}$/); //4位验证码验证
					break;
			} //end switch
			if(reg.exec($.trim(str))) return true;
			else return false;
		} //end if
		else return false;
	} //end func

	//解决ios下input、textarea无法自动失去焦点的问题
	com.keyboard = function(input) {
		input = input || $('input,textarea,[contenteditable="true"]');
		if(input.length > 0) {
			var body=$('body');
			if(os.ios) input.on('focus', ios_focus);
			else body.height(body[0].clientHeight);
		} //end if
		
		function ios_focus(e) {
			body.one('touchend', ios_blur);
		} //edn func

		function ios_blur(e) {
			if(e.target != input[0]) input.blur();
		} //edn func

	} //end func
	
	//解决ios下select无法自动失去焦点的问题
	com.select = function(select) {
		select = select || $('select');
		if(select.length > 0) {
			if(os.ios) {
				select.on('focus', function(e) {
					$(document).one('touchend', ios_select);
				});
			} //end if
		} //end if

		function ios_select(e) {
			if(e.target != select[0]) select.blur();
		} //edn func

	} //end func

	//物体抖动
	com.shake = function(box, options) {
		if(box && box.length > 0) {
			var defaults = {
				rx: 5,
				ry: 5,
				delay: 33,
				now: 0,
				max: 5,
				restore: true
			};
			var opts = $.extend(defaults, options);
			var x = imath.randomRange(-opts.rx, opts.rx);
			var y = imath.randomRange(-opts.ry, opts.ry);
			box.css({
				x: x,
				y: y
			});
			opts.now++;
			if(opts.now > opts.max) {
				if(opts.restore) box.css({
					x: 0,
					y: 0
				});
				if(opts.onComplete) opts.onComplete();
			} //end if
			else setTimeout(com.shake, opts.delay, box, opts);
		} //end if
	} //end func

	//获取textarea里的回车和空格
	com.textareaGet = function(textarea, row) {
		row = row || 0;
		var str1 = textarea.val();
		if(str1 == '') return '';
		else {
			var str2 = str1.replaceAll("\n", "<br/>");
			return row_cut(str2, row);
		} //end else
	} //edn func

	//输入textarea里的回车和空格
	com.textareaSet = function(textarea, str) {
		if(str == '') textarea.val('');
		else textarea.val(str.replaceAll("<br/>", "\n"));
	} //edn func

	//限制textarea输入文字的行数
	com.textareaLock = function(textarea) {
		if(textarea && textarea.length > 0) {
			var timer;
			var row = parseInt(textarea.attr('rows')) || 0;
			var col = parseInt(textarea.attr('cols')) || 0;
			var max = parseInt(textarea.attr('maxlength')) || 0;
			max = max == 0 ? row * col : max;
			if(row > 0 && col > 0 && max > 0) textarea.on('focus', textarea_focus).on('blur', textarea_blur);
		} //end if

		function textarea_focus(e) {
			timer = requestAnimationFrame(textarea_lock);
		} //edn func

		function textarea_blur(e) {
			cancelAnimationFrame(timer);
			var first = com.textareaGet(textarea, row);
			if(first.indexOf('<br/>') != -1) {
				var str2 = first.split('<br/>');
				var str3 = '';
				for(var i = 0; i < str2.length; i++) {
					str3 += col_break(str2[i], col);
					if(i < str2.length - 1) str3 += '<br/>';
				} //end for
				str3 = row_cut(str3, row);
				var final1 = str3.replaceAll("<br/>", "\n");
				textarea.val(final1);
			} //end if
		} //edn func

		function textarea_lock() {
			var first = com.textareaGet(textarea, row);
			if(first.indexOf('<br/>') == -1) textarea.attr({
				maxlength: max
			});
			else textarea.attr({
				maxlength: max + (first.split('<br/>').length - 1) * 2
			});
		} //edn func
	} //edn func

	function row_cut(str, row) {
		row = row || 0;
		var str2 = str.split('<br/>');
		if(row <= 0 || str2.length <= row) return str;
		else {
			var str3 = '';
			for(var i = 0; i < row; i++) {
				str3 += str2[i];
				if(i < row - 1) str3 += '<br/>';
			} //edn for
			return str3;
		} //end else
	} //end func

	function col_break(str, col) {
		var line = Math.ceil(str.length / col);
		if(line == 1) return str;
		else {
			var str1 = '';
			for(var i = 0; i < line; i++) {
				if(i == 0) str1 += str.substr(0, col) + '<br/>';
				else if(i < line - 1) str1 += str.substr(i * col, col) + '<br/>';
				else str1 += str.substr(i * col);
			} //edn for
			return str1;
		} //end else
	} //end func

	function col_cut(str, col) {
		if(str.length > col) return str.substr(0, col);
		else return str;
	} //end func

	//限制textarea输入文字的行数
	com.textareaUnlock = function(textarea) {
		textarea.off();
	} //edn func
	
	//切割单行文字成几行
	com.textToMulti = function(str,col) {
		if(str!='' && col>1){
			if(str.indexOf('\n') == -1 && str.length>col) {
				var str1='';
				var line=Math.ceil(str.length/col);
				console.log('line:'+line);
				for(var i = 0; i < line; i++) {
					if(i < line - 1) str1 += str.substr(i * col, col) + '\n';
					else str1 += str.substr(i * col);
				} //edn for
				return str1;
			} //end if
			else return str;
		}//edn if
		else return null;
	} //edn func
	
	//拼带参数的url链接
	com.url = function(url, para) {
		var now = -1;
		for(var key in para) {
			now++;
			if(now == 0) url += '?';
			else url += '&';
			url += key + '=' + para[key]
		} //end for
		return url;
	}; //end func

	//以帧为单位的setTimeout
	com.setTimeout = function(callback, frame) {
		if(frame > 0 && callback) return setTimer(callback, frame, false);
	} //edn func

	com.clearTimeout = function(timer) {
		if(timer && timer.timer) clearTimer(timer);
	} //edn func
	
	//以帧为单位的setInterval
	com.setInterval = function(callback, frame) {
		if(frame > 0 && callback) return setTimer(callback, frame, true);
	} //edn func

	com.clearInterval = function(timer) {
		if(timer && timer.timer) clearTimer(timer);
	} //edn func

	function clearTimer(timer) {
		cancelAnimationFrame(timer.timer);
		timer=null;
	} //edn func

	function setTimer(callback, frame, interval) {
		var timer = {
			now: 0,
			timer: null
		};
		timer_handler();
		return timer;

		function timer_handler() {
			timer.now++;
			var timeup=timer.now == frame;
			if(timeup) {
				timer.now = 0;
				callback();
			} //end if
			if(interval || (!interval && !timeup)) timer.timer = requestAnimationFrame(timer_handler);
		} //end func

	} //edn func
	
	//将canvas转成存在cdn服务器上的远程图片地址
	com.canvas_send = function(canvas, callback, secretkey, type, compress) {
		if(canvas) {
			secretkey = secretkey || 'test';
			type = type || 'jpg';
			compress = compress || 0.95;
			if(type == 'png') var base64 = canvas.toDataURL('image/png');
			else var base64 = canvas.toDataURL('image/jpeg', compress);
			this.base64_send(base64, callback, secretkey);
		} //edn if
	} //end func
	
	//将base64数据格式转成存在cdn服务器上的远程图片地址
	com.base64_send = function(base64, callback, secretkey) {
		if(base64) {
			secretkey = secretkey || 'test';
			$.post('http://tool.be-xx.com/cdn/base64', {
				data: base64,
				key: secretkey
			}, function(resp) {
				if(resp.errcode==0){
					if(callback) callback(resp.result);
				}//edn if
				else{
					console.log('errmsg:'+resp.errmsg);
				}//edn else
			},'json');
		} //edn if
	} //end func

	//将跨域的远程图片地址转成base64数据格式，解决图片跨域问题
	com.base64_get = function(link, callback, secretkey) {
		if(link) {
			secretkey = secretkey || 'test';
			$.post('http://tool.be-xx.com/image/base64', {
				link: link,
				key: secretkey
			}, function(resp) {
				if(callback) callback(resp);
			},'text');
		} //edn if
	} //end func
	
	//将字符串转成二维码，返回base64数据格式
	com.qrcode = function(txt,options) {
		var defaults = {size:200,color:'000000',bg:'ffffff',border:0,error:0};
		var data = $.extend(defaults, options);
		if(txt && txt!=''){
			var src='http://tool.be-xx.com/image/qrcode?txt='+txt+'&size='+data.size+'&color='+data.color+'&bg='+data.bg+'&border='+data.border+'&error='+data.error+(data.logo?'&logo='+data.logo:'');
			return src;
		}//edn if
		else return null;
	} //end func
	
	//将字符串转成条形码，返回base64数据格式
	com.barcode = function(txt,options) {
		var defaults = {width:400,height:200,color:'000000',bg:'ffffff',pure:true};
		var data = $.extend(defaults, options);
		if(txt && txt!=''){
			var src='http://tool.be-xx.com/image/barcode?txt='+txt+'&width='+data.width+'&height='+data.height+'&color='+data.color+'&bg='+data.bg+'&pure='+data.pure;
			return src;
		}//edn if
		else return null;
	} //end func
	
	//一键复制字符串到剪贴板
	com.clipboard=function(box,val,onComplete,onError){
		var support = !!document.queryCommandSupported;
		console.log('support:'+support);
		if(support){
			if(box.length>0 && val!=''){
				box.attr({'data-copy':val}).on('click',{callback:onComplete},copyText);
			}//edn if
		}//edn if
		else{
			console.log('浏览器不支持复制文本到剪贴板');
			if(onError) onError();
		}//end else
	}//edn func
	
	function copyText(e){
		var val=$(this).data('copy');
		var input=$('<textarea readonly="readonly"></textarea>').html(val).css({position:'absolute',left:0,top:0,width:1,height:1,visible:'hidden'}).appendTo('body');
		input[0].select();
		input[0].setSelectionRange(0, input[0].value.length);
		console.log('copy content:'+input.val())
		document.execCommand('Copy');
		input.remove();
		input=null;
		if(e.data.callback) e.data.callback();
	}//edn func
	
	//显示页面渲染fps
	com.fpsShow=function(shell,space){
		space=space||30;
		space=space<10?10:space;
		shell=shell||$('<div id="fpsShow"></div>').appendTo(ibase.dir == 'landscape' ? 'article' : 'body');
		requestAnimationFrame(function(){
			fps_dected(new Date().getTime(),-1);
		});
		
		function fps_dected(last,count){
			var now=new Date().getTime();
			var fps=Math.round(1000/(now-last));
			fps=fps>60?60:fps;
			count++;
			if(count%space==0){
				if(fps>=40) var classname='fpsFast';
				else if(fps>=20) var classname='fpsNormal';
				else var classname='fpsSlow';
				shell.removeClass().addClass(classname).html('fps:'+fps);
			}//edn if
			requestAnimationFrame(function(){
				fps_dected(now,count);
			});
		}//edn func
		
	}//edn func
	
	return com;

} //end import


String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}

/**
 * 扩展一个可以指定时间输出格式的 Date 的方法
 * 年(y)可以用 1-4 个占位符、月(M)、日(d)、季度(q)可以用 1-2 个占位符
 * 小时(h)、分(m)、秒(s)、毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * @param  fmt  | 格式化表达式
 */
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

$("article").on("click","[data-link]",function  () {
 	var href = $(this).attr("data-link");
 	setTimeout(function  () {
 		location.replace(href)
 	},300)
 	
 });