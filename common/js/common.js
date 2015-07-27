$(function(){
'use strict';

/* ---------------------------------------------------------------------
	画面幅取得
---------------------------------------------------------------------*/

var getScreenWidth = function() {
    if (window.innerWidth) {
        return window.innerWidth;
    } else if (document.documentElement && document.documentElement.clientWidth !== 0) {
        return document.documentElement.clientWidth;
    } else if (document.body) {
        return document.body.clientWidth;
    }
    return 0;
};
var windowSize = getScreenWidth();

/* ---------------------------------------------------------------------
	smoothScroll & SP menu
---------------------------------------------------------------------*/
 function smoothScrol(){
	window.smoothScroll = function(self){
		var speed = 500;
		var href= $(self).attr("href");
		var target = $(href == "#" || href == "" ? 'html' : href);
		var position = target.offset().top;
		$("html, body").animate({scrollTop:position}, speed, "swing");
	};

	var $spBtn = $("#js-sp-btn");
	var $toggleContent = $("#gloval-nav");
 	$spBtn.each(function(){
    //toggle contents
	   $(this).on({
	     'touchstart': function() {
	          this.isTouch = true;
	     },
	     'touchmove': function() {
	          this.isTouch = false;
	     },
	     'touchend': function() {
	     if(this.isTouch === true){                  
	       if($toggleContent.css("display")==="block"){
	         $toggleContent.stop().slideToggle('fast');
	         $(this).find("span").removeClass("genericon-close-alt").addClass("genericon-menu");
	         return false; 
	        }else{
	         $toggleContent.stop().slideToggle('fast');
	         $(this).find("span").removeClass("genericon-menu").addClass("genericon-close-alt");
	         return false;
	        }
	      }
	     }
	    });
		});

	$('a[href^=#]').click(function(){
		if(windowSize <= 1034 ) {
			$spBtn.find("span").removeClass("genericon-close-alt").addClass("genericon-menu");
			$toggleContent.stop().slideToggle('fast');  
		}
		smoothScroll(this);
		return false;
	});
}smoothScrol();

/* ---------------------------------------------------------------------
	slide-visual
---------------------------------------------------------------------*/
	function slider(){
		var Wrapper = $("#box-slidevisual").prepend('<p class="back"><a href="#"></a></p><p class="next"><a href="#"></a></p>');
		var obj = $(Wrapper),
		bnrList = $(obj).find("#list-slide-visual"),
		bnrListWidth = 0,
		bnrListSize = 0,
		bnrItem = $(obj).find("#list-slide-visual").find("li"),
		bnrNum = $(bnrItem).length,
		btnBack = $(obj).find(".back").find("a"),
		btnNext = $(obj).find(".next").find("a"),
		defaultImageSize = 800,//max-slide-visual-size
		slideSpeed = 300, //slide speed
		loopSpeed = 5000, //loop speed
		anmFlg = false,
		bnrListResize;

		if (windowSize >= defaultImageSize) {
			//GET List width
			for(var i=0; bnrNum+1 > i; i++){
				bnrListWidth = bnrListWidth + $(bnrItem[i]).width();
			}
			//Write slide list width
			$(bnrList).css({width:bnrListWidth});
		}else{
			//Write slide list width (window size)
			bnrListResize = bnrNum * windowSize;
			$(bnrItem).css("width", windowSize);
			bnrList.css("width", bnrListResize);
			defaultImageSize = windowSize;
		}

		//for accessibility
		$(bnrItem).css({'display':'table-cell'});

		//Next Button
		$(btnNext).click(function(){
			moveSlide(true);
			return false;
		});

		//Back Button
		$(btnBack).click(function(){
			moveSlide(false);
			return false;
		});

		//Stop timer
		Wrapper.each(function(){
			$(this).mouseover(function(){
				stopTimer(true,false);
			 });

			 $(this).mouseleave(function(){
					stopTimer(false,false);
			 });
		});

		//Stop timer
		var arrayItem = [btnNext,btnBack];
		$.each(arrayItem, function(){
		     this.focus(function(){ // stop timer by focus
				stopTimer(false,true);
		     });
			this.blur(function(){ // start timer by focus out
				stopTimer(false,false);
		     });
		});


/* -----------------------------------
	MainVisual Function
----------------------------------- */

		//Reload
		function reloadFunction(){
			window.onload = function() {
				if(defaultImageSize > windowSize){
					defaultImageSize = windowSize;
				}
			};
		}
		//reload
		reloadFunction();

		//Resize
		function resizeFunction() {
			$(window).resize(function() {
				windowSize = getScreenWidth();
				bnrListResize = bnrNum * windowSize;			
				$(bnrItem).css("width", windowSize);
				bnrList.css("width", bnrListResize);
				defaultImageSize = windowSize;
			});
		}
		//resize
		resizeFunction();

		//Slider
		function moveSlide(status) {
			if(anmFlg === false){
				anmFlg = true;
				//Animation move right
				if(status === true) {
					$(bnrList).animate({marginLeft : -defaultImageSize},slideSpeed,function(){
					$(bnrList).css({marginLeft : 0});
					$(bnrList).find("li:last").after($(bnrList).find("li").eq(0));
					anmFlg = false;
					});
					return false;
					//Animation move left
				}else if(status === false) {
					$(bnrList).css({marginLeft : -defaultImageSize});
					$(bnrList).find("li").eq(0).before($(bnrList).find("li:last"));
					$(bnrList).animate({marginLeft : 0},slideSpeed,function(){
					anmFlg = false;
				});
					return false;
				}
			}else{
				return false;
			}
		}

		//Timer
		var loopSlideTimer = setInterval(function(){
		moveSlide(true);
		},loopSpeed);

		//Stop timer function
		function stopTimer(mouseOver, focusIn) {
			    if(mouseOver === true && focusIn === false) {
			    	clearInterval(loopSlideTimer);
			    }else if(mouseOver === false && focusIn === true) {
			    	clearInterval(loopSlideTimer);
			    }else{
			    	clearInterval(loopSlideTimer);
			    	loopSlideTimer = setInterval(
					function(){moveSlide(true);},loopSpeed);
			    }
	  	}

      /*フリック操作*/
      function flick() { 
        var startX,startY,diffX,diffY,moveRate = 0;
        $(bnrItem).bind("touchstart touchmove touchend", function (e){
          var touch = e.originalEvent.touches[0];
            if (e.type === "touchstart") {
              startX = touch.pageX;
              startY = touch.pageY;
              clearInterval(loopSlideTimer);
            } else if (e.type === "touchmove") {
                diffX = touch.pageX - startX;
                diffY = touch.pageY - startY;
                moveRate = diffX / diffY;
                //縦スクロール有効化
                if(moveRate > Math.tan(15 * Math.PI/180)) {
                  e.preventDefault();
                }
            } else if (e.type === "touchend") {
                if (diffX < -40) {
                  clearInterval(loopSlideTimer);
                  moveSlide(true);
                } else if (diffX > 40) {
                  clearInterval(loopSlideTimer);
                 	moveSlide(false);
                }
            }
        });
      }flick();

	}slider();

});