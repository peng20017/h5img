var iTb = importTaobao();

function importTaobao() {
	var s = this;
	//是否授权
	s.isAuth = false;
	s.tid = null;

	
	//==================== 内部方法 ========================
	function login(callback) {
		Tida.isLogin(function(data) {
			//console.log(data);
			if(data.isLogin) {
				callback(true);
			} else {
				callback(false);
			}
		});
	}

	function auth(callback) {
		Tida.doAuth(function(data) {
			if(data.finish) {
				// 授权成功 可以顺利调用需要授权的接口了
				var options = {};
				Tida.mixNick(options, function(data) {
					callback(data.mixnick);
				});
			} else {
				// 未能成功授权
				callback(null);
			}
		});
	}
	//==================== 内部方法 ========================
	function init(callback,hideTitle) {
		callback = callback || function(){};
		hideTitle=hideTitle||0;
		if(s.isAuth){
			callback(true);
			return;
		}
		Tida.ready({
			// console : 1//1代表开启debug
		}, function(data) {
			try {
				if(hideTitle) Tida.hideTitle();//隐藏标题就是全屏了
				login(function(value) {
					if(value) {
						auth(function(value) {
							if(value) {
								s.isAuth = true;
								s.tid = value;
								callback(true);
							} else {
								callback(false);
								icom.alert('拒绝授权');
							}
						});
					}
				});
			} catch(e) {
				//TODO handle the exception
				console.error(e.message);
				callback(false);
			}
		});
	}
	function share(url, title, text, image){
		Tida.share({
            url: url,
            title: title,
            text: text,
            image: image
        }, function (e) {
              console.log(JSON.stringify(e));
        });
	}

	//========================
	s.init = init;
	s.share = share;

	return s;
}//edn import