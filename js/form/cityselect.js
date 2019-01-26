/*
2015.12.30
settings 参数说明
	prov:选择省份提示文字
	city:选择城市提示文字
	dist:选择区县提示文字
 */
(function($){
	
	$.fn.citySelect=function(cityData,settings){
		cityData=cityData||window.cityData;
		if(cityData){
			settings=$.extend({
				prov:'省份',
				city:'城市',
				dist:'区县'
			},settings);
			var $this=$(this);
			var provShell=$this.find(".prov");
			var cityShell=$this.find(".city");
			var distShell=$this.find(".dist");
			var provSelete=provShell.children("select");
			var citySelete=cityShell.children("select");
			var distSelete=distShell.children("select");
			var provTxt=provSelete.siblings();
			var cityTxt=citySelete.siblings();
			var distTxt=distSelete.siblings();
			var provId=-1,cityId=-1,distId=-1;
			init();
		}//end if
		
		function init(){
			var temp="";
			$.each(cityData,function(i,prov){
				temp+="<option value='"+prov.value+"'>"+prov.label+"</option>";
			});
			provTxt.html(settings.prov);
			provSelete.html(temp);
			cityTxt.html(settings.city);
			citySelete.empty().attr("disabled",true);
			distTxt.html(settings.dist);
			distSelete.empty().attr("disabled",true);
			provSelete.one("touchend",prov_handler);
		}//end func

		function prov_handler(){
			var selected=provSelete.children('option:selected');
			provTxt.html(selected.text());
			citySelete.empty().attr("disabled",true);
			distSelete.empty().attr("disabled",true);
			provId=selected.index();
			console.log('provId:'+provId);
			var temp="";
			$.each(cityData[provId].children,function(i,city){
				temp+="<option value='"+city.value+"'>"+city.label+"</option>";
			});
			cityTxt.html(settings.city);
			citySelete.html(temp).attr("disabled",false);
			cityId=-1;
			distTxt.html(settings.dist);
			distSelete.empty().attr("disabled",true);
			distId=-1;
			provSelete.one("change",prov_handler);
			citySelete.one("touchend",city_handler);
			distSelete.off();
		}//end func

		function city_handler(){
			var selected=citySelete.children('option:selected');
			cityTxt.html(selected.text());
			cityId=selected.index();
			distSelete.empty().attr("disabled",true);
			var temp="";
			$.each(cityData[provId].children[cityId].children,function(i,dist){
				temp+="<option value='"+dist.value+"'>"+dist.label+"</option>";
			});
			distTxt.html(settings.dist);
			distSelete.html(temp).attr("disabled",false);
			distId=-1;
			citySelete.one("change",city_handler);
			distSelete.one("touchend",dist_handler);
		}//end func
		
		function dist_handler(){
			var selected=distSelete.children('option:selected');
			distId=selected.index();
			distTxt.html(selected.text());
			distSelete.one("change",dist_handler);
		}//end func
	};
})(jQuery);