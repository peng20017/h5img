//2015.9.20
var loop = new Loop({ keyname: 'loop_test', appkey: '', link: '' });
var iuser=importUser();

function importUser(){
	
	var user={};
	user.info={};
	
	user.init=function(callback) {
	    loop.login(function () {
		    loop.getuser(function (data) {
		    	initCallback(data,callback);
		    });
		});
	}//end func	
	
	function initCallback(data,callback){
//		console.table(data);
		user.info=data;
		if(callback) callback(data);
	}//end func
	
	return user;
	
}//end func


