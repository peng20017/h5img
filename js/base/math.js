//2018.4.23
var imath = importMath();
function importMath() {
	var math = {};

	//获得范围内随机整数
	math.randomRange = function(min, max) {
		var randomNumber;
		randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
		return randomNumber;
	} //end func 

	//获得随机颜色
	math.randomColor = function() {
		var str = "0123456789abcdef";
		var s = "#";
		for(j = 0; j < 6; j++) s += str.charAt(Math.random() * str.length);
		return s;
	} //end func

	//随机打乱一个数组
	math.randomSort = function(ary) {
		if(ary && ary.length > 1) ary.sort(function() {
			return 0.5 - Math.random();
		});
	} //end func 

	//随机正负
	math.randomPlus = function() {
		return Math.random() < 0.5 ? -1 : 1;
	} //end func 

	//等比缩放,分cover模式和contain模式
	math.autoSize = function(aryNum, aryMax, scaleMode) {
		if(scaleMode === 1 || scaleMode === 0) scaleMode = scaleMode === 1 ? 'cover' : 'contain';
		else scaleMode = scaleMode || 'cover';
		var aryNow = [];
		var aryRate = aryNum[0] / aryNum[1];
		aryNow[0] = aryMax[0];
		aryNow[1] = Math.round(aryNow[0] / aryRate);
		if(scaleMode == 'height') {
			aryNow[1] = aryMax[1];
			aryNow[0] = Math.round(aryNow[1] * aryRate);
		} //edn else if
		else if(scaleMode == 'contain') {
			if(aryNow[1] > aryMax[1]) {
				aryNow[1] = aryMax[1];
				aryNow[0] = Math.round(aryNow[1] * aryRate);
			} //end if
		} //edn else if
		else if(scaleMode == 'cover') {
			if(aryNow[1] < aryMax[1]) {
				aryNow[1] = aryMax[1];
				aryNow[0] = Math.round(aryNow[1] * aryRate);
			} //end if
		} //edn else if
		else if(scaleMode == 'full') aryNow = [aryMax[0], aryMax[1]];
		return aryNow;
	} //end func

	//缓动函数
	math.ease = function(_now, _tar, _speed, _space) {
		_speed = _speed || 10;
		_space = _space || 0.1;
		var _dis = _tar - _now;
		if(Math.abs(_dis) > _space) return _dis / _speed + _now;
		else return _tar;
	} //end func

	//角度转弧度
	math.toRadian = function(degree) {
		return degree * Math.PI / 180;
	} //end func 

	//弧度转角度
	math.toDegree = function(radian) {
		return radian / Math.PI * 180;
	} //end func 

	//获得2点之间的距离
	math.getDis = function(source, target) {
		var lineX = target[0] - source[0];
		var lineY = target[1] - source[1];
		return Math.sqrt(Math.pow(Math.abs(lineX), 2) + Math.pow(Math.abs(lineY), 2));
	} //end func 

	//获得2点之间的夹角
	math.getDeg = function(source, target) {
		var deg;
		if(source[0] == target[0] && source[1] == target[1]) {
			deg = 0;
		} else {
			var disX = target[0] - source[0];
			var disY = target[1] - source[1];
			deg = Math.atan(disY / disX) * 180 / Math.PI;
			if(disX < 0) {
				deg = 180 + deg;
			} 
			else if(disY < 0) {
				deg = 360 + deg;
			}
		} //end else
		return deg;
	} //end func

	//测试2个jquery对象是否重合
	math.hitTest = function(source, target, scaleX, scaleY) {
		scaleX = scaleX != null ? scaleX : 1;
		scaleY = scaleY != null ? scaleY : 1;
		if(source && target) {
			var pos1 = [source.offset().left + source.outerWidth() * scaleX * 0.5, source.offset().top + source.outerHeight() * scaleY * 0.5];
			var pos2 = [target.offset().left + target.outerWidth() * scaleX * 0.5, target.offset().top + target.outerHeight() * scaleY * 0.5];
			var disX = Math.abs(pos2[0] - pos1[0]);
			var disY = Math.abs(pos2[1] - pos1[1]);
			var disXMin = (source.outerWidth() + target.outerWidth()) * scaleX * 0.5;
			var disYMin = (source.outerHeight() + target.outerHeight()) * scaleY * 0.5;
			if(disX <= disXMin && disY <= disYMin) return true;
			else return false;
		} //end if
		else return false;
	} //end func

	//测试2个带data().x,data().y的jquery对象是否重合
	math.hitObject = function(source, target) {
		if(source && target) {
			var pos1 = [source.data().x + source.outerWidth() * 0.5, source.data().y + source.outerHeight() * 0.5];
			var pos2 = [target.data().x + target.outerWidth() * 0.5, target.data().y + target.outerHeight() * 0.5];
			var disX = Math.abs(pos2[0] - pos1[0]);
			var disY = Math.abs(pos2[1] - pos1[1]);
			var disXMin = (source.outerWidth() + target.outerWidth()) * 0.5;
			var disYMin = (source.outerHeight() + target.outerHeight()) * 0.5;
			if(disX <= disXMin && disY <= disYMin) return true;
			else return false;
		} //end if
		else return false;
	} //end func

	//测试一个点和一个DOM对象是否重合
	math.hitPoint = function(source, target, scaleX, scaleY) {
		scaleX = scaleX != null ? scaleX : 1;
		scaleY = scaleY != null ? scaleY : 1;
		if(source && target) {
			var area = [target.offset().left, target.offset().left + target.outerWidth() * scaleX, target.offset().top, target.offset().top + target.outerHeight() * scaleY];
			if(source[0] >= area[0] && source[0] <= area[1] && source[1] >= area[2] && source[1] <= area[3]) return true;
			else return false;
		} //end if
		else return false;
	} //end func

	//把一个数组转成数字
	math.arrayToInt = function(ary) {
		var num = 0;
		for(var i = 0; i < ary.length; i++) num += ary[i] * Math.pow(10, (ary.length - 1 - i));
		return num;
	} //end func

	//深度复制
	math.deepClone = function(source) {
		function getClone(_source) {
			var clone = math.dataType(_source) == "array" ? [] : {};
			for(var i in _source) {
				if(math.dataType(_source[i]) != 'object' && math.dataType(_source[i]) != 'array') clone[i] = _source[i];
				else clone[i] = getClone(_source[i]);
			} //end for
			return clone;
		} //edn func
		return getClone(source);
	} //end func

	//判断是数组还是对象
	math.dataType = function(o) {
		if(typeof(o) === 'object') return Array == o.constructor ? 'array' : 'object';
		else return null;
	} //end func

	//获得Object的长度
	math.objectLength = function(obj) {
		return Object.keys(obj).length;
	} //end func

	//合并2个object，重复索引的值由后者替换前者
	math.extend = function(obj1, obj2) {
		if(obj1 && typeof(obj1) === 'object' && Object.keys(obj1).length > 0) {
			if(obj2 && typeof(obj2) === 'object' && Object.keys(obj2).length > 0) {
				for(var key in obj1) {
					if(obj2.hasOwnProperty(key)) continue; //有相同的属性则略过 
					obj2[key] = obj1[key];
				} //edn for
				return obj2;
			} //edn if
			else return obj1;
		} //end if
		else return obj2;
	} //edn func

	//将数字格式化
	math.formatNumber = function(value) {
		value = value.toString();
		if(value.length <= 3) return value;
		else return this.formatNumber(value.substr(0, value.length - 3)) + ',' + value.substr(value.length - 3);
	} //end func

	//截取小数点后几位，非四舍五入
	math.float = function(value, pt) {
		pt = pt || 2;
		value = value.toString();
		if(value.indexOf('.') == -1) return value;
		else {
			var str1 = value.split('.');
			var str2 = str1[0] + '.' + str1[1].substr(0, pt);
			return Number(str2);
		} //end else
	} //edn func

	//将颜色值转换成rgb值
	math.colorToRgb = function(color) {
		if(color.match(/^#?([0-9a-f]{6}|[0-9a-f]{3})$/i)) {
			var value = color.slice(color.indexOf('#') + 1),
				isShortNotation = (value.length === 3),
				r = isShortNotation ? (value.charAt(0) + value.charAt(0)) : value.substring(0, 2),
				g = isShortNotation ? (value.charAt(1) + value.charAt(1)) : value.substring(2, 4),
				b = isShortNotation ? (value.charAt(2) + value.charAt(2)) : value.substring(4, 6);
			return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
		} //end if
		else return [0, 0, 0];
	} //end func

	//获取路径
	math.path = function(path) {
		if(path && path != '') return path.substr(0, path.lastIndexOf('/') + 1);
		else return false;
	} //edn func
	
	//去除空格
	math.trim=function(str,middle){
		middle=middle||false;
        var str=str.replace(/<\/?[^>]*>/gim,"");//去掉所有的html标记
        var result=str.replace(/(^\s+)|(\s+$)/g,"");//去掉前后空格
        if(middle )return  result.replace(/\s/g,"");//去除文章中间空格
        else return result;
	}//edn fun

	return math;

} //end import