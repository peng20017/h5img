$(document).ready(function () {

	//-----------------------------------------定义和初始化变量----------------------------------------
	var loadBox = $('aside.loadBox');
	var articleBox = $('article');
	var windowScale = window.innerWidth / 750;
	var imgShell = $('div.shell');
	var imgPanel = $('div.panel');
	var btnSubmit = $('a.btnSubmit');
	var btnCamera = $('a.btnCamera');
	var imgCanvas, imgLayer;
	var imgScaleMin = 0.5,
		imgScaleMax = 2,
		imgScaleTimer;
	var fileInput;
	var canvasScale = 1;
	var mySwiper;
	var slideaAtiveId;
	var elelayer;
	var widthOrg, heightOrg;


	//----------------------------------------页面初始化----------------------------------------
	icom.init(init); //初始化
	icom.screenScrollUnable(); //如果是一屏高度项目且在ios下，阻止屏幕默认滑动行为

	function init() {
		requestAnimationFrame(function () {
			//			loadBox.show();
			icom.fadeIn(articleBox);
			load_handler();
		});
	} //edn func


	//----------------------------------------加载页面图片----------------------------------------
	function load_handler() {
		var loader = new PxLoader();
		loader.addImage('images/common/turn_phone.png');
		loader.addImage('images/albumtips.png');
		loader.addImage('images/btn-next.png');
		loader.addImage('images/btn-prev.png');
		loader.addImage('images/btn-submit.png');
		loader.addImage('images/choosetitle.png');
		loader.addImage('images/loadingpage.png');
		loader.addImage('images/loadingpic.png');
		loader.addImage('images/loadingpic1.png');
		loader.addImage('images/loadingtxt.png');
		loader.addImage('images/pic1.png');
		loader.addImage('images/picmask1.png');
		loader.addImage('images/shellbg.png');
		loader.addImage('images/skip.png');
		loader.addImage('images/title1.png');
		loader.addImage('images/title2.png');
		loader.addImage('images/title3.png');
		loader.addImage('images/title4.png');
		loader.addImage('images/winebottle.png');

		//实际加载进度
		//		loader.addProgressListener(function(e) {
		//			var per=Math.round(e.completedCount/e.totalCount*50);
		//			loadPer.html(per+'%');
		//		});

		loader.addCompletionListener(function () {
			init_handler();
			//			load_timer(50);//模拟加载进度
			loader = null;
		});
		loader.start();
	} //end func

	//模拟加载进度
	function load_timer(per) {
		per = per || 0;
		per += imath.randomRange(1, 3);
		per = per > 100 ? 100 : per;
		loadPer.html(per + '%');
		if (per == 100) setTimeout(init_handler, 200);
		else setTimeout(load_timer, 33, per);
	} //edn func


	//----------------------------------------页面逻辑代码----------------------------------------
	function init_handler() {
		console.log('init handler');
		//		icom.fadeOut(loadBox,500);
		// setTimeout(albumshow,2000);
		initswiper();

		$('.guide .btn-close').on("click", guide_hide);

		// $('.myphoto .btn-prev').on('click',btnPrev);//上一步
		$('.myphoto .btn-choose').on('click', btnNext); //祝福语显示
		$('.congratulate p').on('click', confirmTitle); //确定一个title
		init1();
		monitor_handler();
	} //end func
	//loading加载完，选择相册模板页显示
	function albumshow() {
		icom.fadeOut($(".loadingpage"))
		setTimeout(function () {
			icom.fadeOut($(".index"))
			$('.choosealbum').show();
			initswiper();
		}, 2000)
	}
	// 隐藏引导层
	function guide_hide() {
		var guide = $(this).parents(".guide");
		icom.fadeOut(guide)
	}
	//上一步
	function btnPrev() {
		$('.choosealbum').show();
	}
	//下一步
	function btnNext() {
		$('.congratulate').show();
	}
	//确定一个title

	var itemList = []; //储存item对象
	var increaseId = 0; //自增id
	var selectId = 0; //当前选取的id
	var item = {}; //当前选取的对象
	function confirmTitle() {
		increaseId++;
		var left = ($(window).width() - 209) / 2; //初始化定位
		var top = ($(window).height() - 209) / 2;
		icom.fadeOut($('.congratulate '))
		// $(".myphoto .imgbox").html("");
		//添加图片编辑事件
		// elelayer=$('<span class="move active" > <a class="close"></a><a class="rotate"></a><a class="resize"></a></span>').appendTo(".myphoto .imgbox");
		elelayer = $('<span data-id=' + increaseId + ' class="move active" style="left:' + left + 'px;top:' + top + 'px"> <a class="close"></a><a class="rotate"></a></span>').appendTo(".myphoto .imgbox");
		var id = $(this).data("id");
		var src = $(this).find("img").attr("src");
		console.log($(this));
		imgChild = $('<img/>').attr({
			src: src
		}).appendTo(elelayer).addClass("wid" + id);
		// var x = $(this).offset().left;
		// var y = 300;
		widthOrg = elelayer.find("img").width();
		heightOrg = elelayer.find("img").height();
		console.log(widthOrg)
		console.log(heightOrg)

		var data = {
			id: increaseId,
			width: widthOrg,
			height: heightOrg,
			tx: 0, //move触摸点
			ty: 0,
			_tx: 0, //触摸距离
			_ty: 0,
			rx: 0, //rotate触摸点
			ry: 0,
			_rx: 0, //触摸距离
			_ry: 0,
			disPtoO: 0, //触摸点到圆心的距离
			scale: 1, //缩放比例
			left: left,
			top: top,
			anglePre: 0, //角度
			angleNext: 0,
			rotate: 0, //计算得出真正的旋转角度
			ox: left + widthOrg / 2, //圆心坐标
			oy: top + heightOrg / 2,
			r: Math.sqrt(widthOrg * widthOrg + heightOrg * heightOrg) / 2 //对角线的半
		}
		itemList[itemList.length] = data;

		console.log($(".imgbox").find('.move'))



	}


	$('.imgbox').on("touchstart", '.rotate ', function (e) {
		selectId = $(this).parent().attr('data-id');
		console.log(selectId, itemList)
		itemList.forEach(function (currentValue) {
			if (selectId == currentValue.id) {
				item = currentValue
			}
		})
		e.preventDefault();
		item.rx = e.offsetX;
		item.ry = e.offsetY;
		console.log(item.ox, item.oy, e.offsetX, e.offsetY)
		item.anglePre = getAngle(item.ox, item.oy, e.offsetX, e.offsetY);
		// item.anglePre = countDeg()
	})

	$('.imgbox').on("touchmove", '.rotate', function (e) {
		console.log(e)
		e.preventDefault();
		item.disPtoO = getDistancs(item.ox, item.oy, e.offsetX, e.offsetY);
		item.scale = (item.disPtoO / item.r).toFixed(2); //保留两位小数
		if (item.scale >= imgScaleMax) item.scale = imgScaleMax
		if (item.scale <= imgScaleMin) item.scale = imgScaleMin
		// 父元素放大
		item.angleNext = getAngle(item.ox, item.oy, e.offsetX, e.offsetY);
		item.rotate += item.angleNext - item.anglePre;
		console.log(item.rotate)
		$(this).parent().css({
			scale: item.scale,
			rotate: item.rotate
		})
		// 子元素按钮缩小
		$(this).css({
			scale: 1 / item.scale
		}).parent().find('.close').css({
			scale: 1 / item.scale
		})
		item.anglePre = item.angleNext;


	})


	$(".imgbox").on('touchstart', '.move img', function (e) {
		selectId = $(this).parent().attr('data-id');

		$(".move").removeClass('active');
		$(this).parents(".move").addClass('active');
		itemList.forEach(function (currentValue) {
			if (selectId == currentValue.id) {
				item = currentValue
			}
		})
		item.tx = e.offsetX;
		item.ty = e.offsetY;
	})




	$(".imgbox").on('touchmove', '.move img', function (e) {
		item._tx = e.offsetX - item.tx;
		item._ty = e.offsetY - item.ty;
		item.left += item._tx;
		item.top += item._ty;
		$(this).parent().css({
			left: item.left,
			top: item.top
		})
		// 重新赋值
		item.ox = +item.left + item.width / 2;
		item.oy = +item.top + item.height / 2;
		item.tx = e.offsetX;
		item.ty = e.offsetY;
	})

	$(".imgbox").on('touchend', '.move img', function (e) {
		itemList.forEach(function (currentValue) {
			if (selectId == currentValue.id) {
				currentValue = item;
			}
		})
	})

	$(".imgbox").on('touchend', '.close', function (e) {
		$(this).parents(".move").remove()
	})


	function getAngle(px, py, mx, my) {
		console.log(px, py, mx, my)
		var x = px - mx;
		var y = py - my;
		var angle = Math.atan2(y, x) * 360 / Math.PI;
		return angle;
	}

	function getDistancs(cx, cy, pointer_x, pointer_y) {
		var ox = pointer_x - cx;
		var oy = pointer_y - cy;
		return Math.sqrt(
			ox * ox + oy * oy
		);
	}













	//初始化swiper
	function initswiper() {
		myswiper = new Swiper('.choosealbum .swiper-container', {
			loop: true,
			effect: 'coverflow',
			grabCursor: true,
			centeredSlides: true,
			slidesPerView: 'auto',
			coverflowEffect: {
				rotate: 0,
				stretch: 50,
				depth: 200,
				modifier: 1,
				slideShadows: true,
			},
			on: {
				transitionEnd: function () {
					slideaAtiveId = this.realIndex + 1; //切换结束时，告诉我现在是第几个slide
					console.log(slideaAtiveId);
				},
			},

		});
	}

	//合成功能
	function init1() {
		//fileInput=$('<input type="file" capture="camera" accept="image/*" name="imageInput" />').appendTo(btnCamera); //capture="camera"会在新版微信ios内核下直接开启摄像头
		if (fileInput) fileInput.remove();
		fileInput = $('<input type="file" accept="image/*" name="imageInput" />').appendTo('body');
		fileInput.off().on('change', file_select);
		btnCamera.off().on('touchend', btnCamera_click);
		btnSubmit.on('touchend', btnSubmit_click);
		console.log('canvasScale', canvasScale);
		console.log('imgShell.width()', imgShell.width());
		console.log('imgShell.height()', imgShell.height());
		imgCanvas = $('<canvas></canvas>').attr({
			width: imgShell.width() * canvasScale,
			height: imgShell.height() * canvasScale,
			jcanvasScale: canvasScale
		}).css({
			scale: 1 / canvasScale
		}).prependTo(imgShell);
		imgCanvas[0].getContext("2d").imageSmoothingEnabled = true;
		console.log('imgCanvas.width()', imgCanvas.width());
		console.log('imgCanvas.height()', imgCanvas.height());
	} //end fun
	//---------------------------------------------------拍照事件
	function btnCamera_click(e) {
		fileInput.click();
	} //edn func

	//图片确定按钮，图片编辑步骤控制
	function btnSubmit_click(e) {

		loadBox.show();
		$('.congratulate').hide();
		$('.myphoto .btnbox').hide();
		var shareContent = $(".myphoto"); //需要截图的包裹的DOM 元素
		html2canvas(document.querySelector(".myphoto"), {
			logging: false,
			useCORS: true
		}).then(function (canvas) {
			loadBox.hide();
			var base64 = canvas.toDataURL("image/jpeg", 1);
			$(".imgbox img").attr("src", base64);
			// 上传服务器。返回一张绝对地址图片
			// icom.canvas_send(canvas,image_combine_complete,'loop_test','png');
			icom.fadeIn($(".finalphotopage"), 100);
		});

	} //end func

	function image_combine_complete(src) {
		loadBox.hide();
		console.log('image src:' + src);
	} //end func


	//拍照或打开本地图片
	function file_select(e) {
		console.log('file_select');
		var file = this.files[0];
		if (file) {
			console.log('file', file);
			loadBox.show();
			ireader.read({
				file: file,
				callback: function (resp, wd, ht) {
					if (resp) img_creat(resp, wd, ht);
					else loadBox.hide();

				}
			});
		} //end if

	} //end select

	//复制图片至canvas
	function img_creat(src, wd, ht) {
		console.log('src', src);
		console.log('wd', wd);
		console.log('ht', ht);
		loadBox.hide();
		imgPanel.show();
		btnSubmit.show();

		console.log('imgCanvas_w', imgCanvas.width());
		console.log('imgCanvas_h', imgCanvas.height());
		var size = imath.autoSize([wd, ht], [imgCanvas.width(), imgCanvas.height()], 1);
		console.log('size', size);
		imgCanvas.css({
				opacity: 0
			})
			.removeLayers()
			.drawImage({
				layer: true,
				source: src,
				width: size[0],
				height: size[1],
				x: imgCanvas.width() * 0.5,
				y: imgCanvas.height() * 0.5,
				scale: 1,
				rotate: 0,
				fromCenter: true,

			})
			.drawLayers();
		setTimeout(function () {
			imgCanvas.css({
				opacity: 1
			});
			$('.choosealbum').hide();
			var src_value = 'images/picmask' + slideaAtiveId + '.png'
			$(".photobox img").attr("src", src_value);
		}, 100);
		var layer = imgCanvas.getLayer(-1);
		imgLayer = layer;
		img_addEvent(imgShell, imgCanvas, layer);

	} //end func


	//添加图片编辑事件
	function img_addEvent(shell, canvas, layer) {
		// $(".tips").on('touchstart',  function() {$(".tips").hide();});

		shell.off().on('pinch', {
			layer: layer,
			canvas: canvas
		}, img_pinch).on('pinchmove', {
			layer: layer
		}, img_pinchmove).on('pinchscale', {
			layer: layer
		}, img_pinchscale).on('pinchrotate', {
			layer: layer
		}, img_pinchrotate);
	} //end func

	//单指双指触控
	function img_pinchmove(e, xOffset, yOffset) {
		var layer = e.data.layer;
		layer.x += xOffset;
		layer.y += yOffset;
	} //end func

	function img_pinchscale(e, scaleOffset) {
		var layer = e.data.layer;
		layer.scale += scaleOffset * 0.5;
		layer.scale = layer.scale <= imgScaleMin ? imgScaleMin : layer.scale;
		layer.scale = layer.scale >= imgScaleMax ? imgScaleMax : layer.scale;
	} //end func

	function img_pinchrotate(e, rotateOffset) {
		var layer = e.data.layer;
		layer.rotate += rotateOffset;
		layer.rotate = layer.rotate > 360 ? layer.rotate % 360 : layer.rotate;
		layer.rotate = layer.rotate < -360 ? -layer.rotate % 360 : layer.rotate;
	} //end func

	function img_pinch(e) {
		var canvas = e.data.canvas;
		canvas.drawLayers();
	} //end func

	//----------------------------------------页面监测代码----------------------------------------
	function monitor_handler() {
		imonitor.add({
			obj: $('a.btnCamera'),
			action: 'touchstart',
			category: 'default',
			label: '拍照按钮'
		});
		imonitor.add({
			obj: $('.myphoto .btn-prev'),
			action: 'touchstart',
			category: 'default',
			label: '上一步'
		});
		imonitor.add({
			obj: $('.myphoto .btn-next'),
			action: 'touchstart',
			category: 'default',
			label: '下一步'
		});
		imonitor.add({
			obj: $('.congratulate p'),
			action: 'touchstart',
			category: 'default',
			label: '确定title'
		});
		imonitor.add({
			obj: $('a.btnSubmit'),
			action: 'touchstart',
			category: 'default',
			label: '跳过按钮'
		});
	} //end func
}); //end ready