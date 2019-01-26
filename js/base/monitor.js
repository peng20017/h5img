//2017.12.19

//百度监测贴这里
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?61a9c036e7b18ccbd5401a90b0faa552";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();


//ga监测贴这里
//(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
//(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
//m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
//})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
//ga('create', 'UA-55069627-11', 'auto');
//ga('send', 'pageview');

var imonitor = importMonitor();

function importMonitor() {
	var monitor = {};

	monitor.add = function(options) {
		if(options) {
			var defaults = {
				action: 'touchend',
				category: 'default',
				label: ''
			};
			var opts = $.extend(defaults, options);
			if(opts.obj && opts.obj.length > 0) {
				opts.obj.each(function(i,n) {
					$(n).on(opts.action, {action:opts.action,category:opts.category,label:opts.label+(i+1)}, event_bind);
				});
			} //end if
			else {
				opts.action = 'script'
				event_bind(null, opts);
			} //end else
		} //end if
	} //end func

	function event_bind(e, data) {
		if(e) event_handler(e.data);
		else event_handler(data);
	} //end func

	function event_handler(data) {
		if(window._hmt) window._hmt.push(['_trackEvent', data.category, data.action, data.label]);
		if(window.ga) window.ga('send', 'event', data.category, data.action, data.label);
		if(window.gtag) window.gtag('event', data.action, {
			'event_category': data.category,
			'event_label': data.label
		});
		if(window.console) window.console.log('事件：' + ' | ' + '类别：' + data.category + ' | ' + '标签：' + data.label);
	} //end func

	return monitor;
} //end import