// hover头像显示card
var loginUserid  = userid;
var $document = $(document);
(function creatorCardShow() {
	var cardHideTimer = null,
		cardShowTimer = null,
		authorsCardHideTimer = null,
		flowCardHideTimer = null,
		cardDataCache = {},
		$flowCard = null,
		delay = 100;
	$document.on("mouseenter", ".user-link > .name", function() {
		var $parent = $(this).closest(".user-link");
		$parent.find("[data-userid]").mouseenter();
	});

	$document.on("mouseleave", ".user-link > .name", function() {
		var $parent = $(this).closest(".user-link");
		$parent.find("[data-userid]").mouseleave();
	});

	$document.on("mouseenter", ".head-wrap", function() {
		var $this = $(this);
		$this.data("showFlag", true);
		clearTimeout(cardHideTimer);
		var userid = $this.data("userid");

		$this[0].cardShowTimer = setTimeout(function() {
			if ($flowCard == null || !$flowCard.length) {
				$("body").append('<div class="creator-item-card flow-card common-follow-card"><i class="arrow"></i></div>');
				$flowCard = $(".flow-card");

			} else {
				$flowCard.html('<i class="arrow"></i>');
			}

			if (cardDataCache[userid]) {
				$flowCard.empty().html('<i class="arrow"></i>').append(cardDataCache[userid]);
				$(".creator-wrap").css("opacity", 1);
				computeCardPosition($this, $flowCard, 1);

			} else {
				$flowCard.append('<span class="common-ajax-loading"></span>');
				computeCardPosition($this, $flowCard, 1);
				$.ajax({
					url: "/user/oneuser/userid-" + userid,
					type: "GET",
					data: {"new" : 1},
					success: function(res) {
						setTimeout(function() {
							if ($this.data("showFlag")) {
								$flowCard.empty().html('<i class="arrow"></i>').append(res);
								lazyImg(null, function() {
									cardDataCache[userid] = $flowCard.find(".creator-wrap").html();
								});
								setTimeout(function() {
									$(".creator-wrap").css("opacity", 1);
								}, 30);
								computeCardPosition($this, $flowCard);
							}
						}, 500);
					}
				});
			}
		}, delay);
	});

	$document.on("mouseleave", ".head-wrap", function() {
		var $this = $(this);
		clearTimeout($this[0].cardShowTimer);
		$this.data("showFlag", false);
		cardHideTimer = setTimeout(function() {
			if ($flowCard) {
				$flowCard.removeClass("open");
				setTimeout(function() {
					$flowCard.detach();
					$flowCard = null;
				}, 100);
			}
		}, 100);
	});

	$document.on("mouseenter", ".flow-card", function() {
		clearTimeout(authorsCardHideTimer);
		clearTimeout(cardHideTimer);
	});

	$document.on("mouseleave", ".flow-card", function() {
		var $this = $(this);
		flowCardHideTimer = setTimeout(function() {
			$this.removeClass("open");
			setTimeout(function() {
				$this.remove();
				$flowCard = null;
			}, 100);

			if ($authorsCard && $authorsCard != null) {
				$authorsCard.removeClass("open");
				setTimeout(function() {
					$authorsCard.remove();
					$authorsCard = null;
				}, 100);
			}
		}, 100);
	});

	$document.on("mouseenter", ".award-btn", function() {
		var $this = $(this),
			$liElem = $this.closest("li"),
		   $awardCon = $this.next();
		   $awardCon.show();
		   $this.addClass("active");
		   $liElem.addClass("zIndex-high").siblings("li").removeClass("zIndex-high");
	});

	$document.on("mouseleave", ".award-btn", function() {
		var $this = $(this),
		   $awardCon = $this.next();
		   $awardCon.hide();
		    $this.removeClass("active");
	});

	var $authorsCard;
	$document.on("mouseenter", ".authors-head-wrap", function() {
		if ($authorsCard && $authorsCard != null) {
			clearTimeout(authorsCardHideTimer);
			return;
		}
		var $this = $(this);
		var $authorsWrap = $this.closest(".user-info").find(".authors-wrap");
		var $clone = $authorsWrap.clone();
		$clone.addClass("flow-authors-card dn");
		$("body").append($clone);
		$authorsCard = $(".flow-authors-card");
		computeAuthorsPosition($this, $authorsCard, $authorsWrap);
		$authorsCard.removeClass("dn");
		setTimeout(function() {
			$authorsCard.addClass("open");
		}, 10);
 	});

 	$document.on("mouseleave", ".authors-head-wrap", function() {
		var $this = $(this);
		$authorsCard = $(".flow-authors-card");
		authorsCardHideTimer = setTimeout(function() {
			$authorsCard.removeClass("open");
			setTimeout(function() {
				console.log("remove");
				$authorsCard.remove();
				$authorsCard = null;
			}, 100);
		}, 100);

 	});

 	$document.on("mouseenter", ".authors-wrap", function() {
 		clearTimeout(flowCardHideTimer);
		clearTimeout(authorsCardHideTimer);
 	});

 	$document.on("mouseleave", ".authors-wrap", function() {
 		var $this = $(this);
 		authorsCardHideTimer = setTimeout(function() {
 			$this.removeClass("open");
			setTimeout(function() {
				$this.remove();
			}, 100);
 		}, 100);
 	});

 	function computeAuthorsPosition($headElem, $authorsCard, $curHideCard) {
 		var headPosRelDoc = {left: $headElem.offset().left, top: $headElem.offset().top},
 			headPosRelWindow = {},
 			lrMargin =  -$headElem.width() / 2 + 25,
			tbMargin = 5;

		// 计算相对窗口的位置
		headPosRelWindow.left = headPosRelDoc.left - $(window).scrollLeft();
		headPosRelWindow.top = headPosRelDoc.top - $(window).scrollTop();
		headPosRelWindow.right = $(window).width() - headPosRelWindow.left - $headElem.outerWidth("true");
		headPosRelWindow.bottom = $(window).height() - headPosRelWindow.top - $headElem.outerHeight("true");

		var isLeftPos = headPosRelWindow.left > headPosRelWindow.right && headPosRelWindow.right < $curHideCard.outerWidth("true"),

			isTopPos = headPosRelWindow.top > headPosRelWindow.bottom && headPosRelWindow.top > $curHideCard.outerHeight("true") && headPosRelWindow.bottom < $curHideCard.outerHeight("true");
		cardPotion = {
			left: isLeftPos ? headPosRelDoc.left - $curHideCard.outerWidth("true") + $headElem.outerWidth("true") + lrMargin : headPosRelDoc.left - lrMargin,
			top: isTopPos ? headPosRelDoc.top - $curHideCard.outerHeight("true") - tbMargin : headPosRelDoc.top + tbMargin + $headElem.outerHeight("true")
		};
		$authorsCard.css(cardPotion);

 	}

	function computeCardPosition($headElem, $cardElem, isAnimation) {
		var isAuthors = $headElem.closest(".authors-wrap").length,
			isAnimation = isAnimation ? isAnimation : 0,
			arrowElem = $cardElem.find(".arrow");

		// var isFilmplayPage = $headElem.closest(".filmplay-detail").length;

		$cardElem.removeClass("transition");
		// 相对文档位置
		var headPosRelDoc = {left: $headElem.offset().left, top: $headElem.offset().top},
			// 相对的窗口位置
			headPosRelWindow = {},
			cardPotion = {},
			lrMargin =  -$headElem.width() / 2 + 26,
			tbMargin = 10,
			cardMaxWidth = 360,
			cardMaxHeight = 240;


		// 计算相对窗口的位置
		headPosRelWindow.left = headPosRelDoc.left - $(window).scrollLeft();
		headPosRelWindow.top = headPosRelDoc.top - $(window).scrollTop();
		headPosRelWindow.right = $(window).width() - headPosRelWindow.left - $headElem.outerWidth("true");
		headPosRelWindow.bottom = $(window).height() - headPosRelWindow.top - $headElem.outerHeight("true");

		// 按最大宽高计算位置，保证loading和内容位置一致
		var isLeftPos = headPosRelWindow.left > headPosRelWindow.right && headPosRelWindow.right < cardMaxWidth,

			isTopPos = headPosRelWindow.top > headPosRelWindow.bottom && headPosRelWindow.bottom < cardMaxHeight + tbMargin;

		// 按真正宽高显示位置
		if (isAuthors) {

			// 计算arrow位置
			$cardElem.addClass(isLeftPos ? "right" : "left");

			arrowElem.addClass((isLeftPos ? "r2" : "l2") + " " + (isTopPos ? "b2" : "t2"));

			cardPotion = {
				left: isLeftPos ? headPosRelDoc.left - $cardElem.outerWidth("true") : headPosRelDoc.left + $headElem.outerWidth("true"),
				top: isTopPos ?  headPosRelDoc.top - $cardElem.outerHeight("true") + $headElem.outerHeight("true") : headPosRelDoc.top
			};

		} else {
			var arrowX, arrowY;

			$cardElem.addClass(isTopPos ? "bottom" : "top");


				if (isLeftPos) {
					arrowX = "r";
				} else {
					arrowX = "l";
				}

			arrowElem.addClass(arrowX + " " + (isTopPos ? "b" : "t"));

			cardPotion = {
				left: isLeftPos ? headPosRelDoc.left - $cardElem.outerWidth("true") + $headElem.outerWidth("true") + lrMargin : headPosRelDoc.left - lrMargin,
				top: isTopPos ? headPosRelDoc.top - $cardElem.outerHeight("true") - tbMargin : headPosRelDoc.top + tbMargin + $headElem.outerHeight("true")
			};
		}
		$cardElem.css(cardPotion);
		$cardElem.addClass(isAnimation ? (isTopPos ? "up" : "down") : "");

		setTimeout(function() {
			$cardElem.addClass("transition open");
		}, 10);
	}
	// 关注

	function followAction($followBtn, $cloneFlowCard) {
		var followBtnUserId = $followBtn.data("userid"),
			$fanElem = $followBtn.closest(".common-follow-card").find(".fan-counts"),
			cardMoreTenThousandFans = $fanElem.text().indexOf("w") != -1,
			fanCounts = parseInt($fanElem.text());

		var followIcon = $followBtn.find(".follow-icon"),
			followText = $followBtn.find(".follow-text");

		$followBtn[0]['followFlag'] = true;

		var creatorPageInfo = $followBtn.closest(".creator-info-wrap");

		var commonPopBox = $followBtn.closest(".filmplay-black-box");

		var recentPage = $followBtn.closest(".creators-list li");

		if (creatorPageInfo.length) {
			var $creatorPagefanElem = creatorPageInfo.find(".fans-counts"),
				creatorPagefanCounts = parseInt($creatorPagefanElem.data("counts"));
		}

		if (commonPopBox.length) {
			var $commonPopBoxfanElem = $followBtn.closest("li").find(".fan-counts"),
				commonPopBoxfanCounts = parseInt($commonPopBoxfanElem.data("counts"));
		}

		if (recentPage.length) {
			var $recentPagefanElem = recentPage.find(".fan-counts"),
				recentPagefanCounts = parseInt($recentPagefanElem.data("counts"));
		}

		if (followIcon.length) {
			followIcon.addClass("dn");
			followText.addClass("dn");
			$followBtn.append("<span class='common-ajax-loading'></span>");

		} else {
			$followBtn.text("").append("<span class='common-ajax-loading'></span>");
		}

		$cloneFlowCard = $cloneFlowCard || $flowCard;

		$.ajax({
			cache: false,
	        type: 'POST',
	        url: "/user/follow/ts-"+ ($followBtn[0]['isFollowed']  ? 'un' : 'do') +"?userid=" + followBtnUserId,
	        dataType: "json",
	        success: function(res) {

	           	if (followIcon.length) {
					$followBtn.toggleClass("followed");
					followIcon.removeClass("dn").toggleClass("icon-right")
					followText.removeClass("dn").text($followBtn[0]['isFollowed'] ? "关注" : "已关注");

				} else {
					$followBtn.text($followBtn[0]['isFollowed'] ? "关注" : "已关注").toggleClass("followed");
				}

				if (!cardMoreTenThousandFans) {
					$fanElem.text($followBtn[0]['isFollowed'] ? --fanCounts : ++fanCounts);
				}

				if (creatorPageInfo.length) {
					getLikeData(1, true);
					$creatorPagefanElem.text(toThousands($followBtn[0]['isFollowed'] ? --creatorPagefanCounts : ++creatorPagefanCounts)).data("counts", creatorPagefanCounts);
				}

				if (commonPopBox.length) {
					$commonPopBoxfanElem.text(toThousands($followBtn[0]['isFollowed'] ? --commonPopBoxfanCounts : ++commonPopBoxfanCounts)).data("counts", commonPopBoxfanCounts);
				}

				if (recentPage.length) {
					$recentPagefanElem.text($followBtn[0]['isFollowed'] ? --recentPagefanCounts : ++recentPagefanCounts).data("counts", recentPagefanCounts);
				}

				if ( $followBtn.closest(".flow-card").length) {
					var temp = cardDataCache[followBtnUserId];
					cardDataCache[followBtnUserId] = $cloneFlowCard.html();
				}

	           	$followBtn[0]['followFlag'] = false;

				$followBtn.find(".common-ajax-loading").remove();

				// $cloneFlowCard.remove();

	        }
	    });
	}

	$document.on("click", ".follow-btn", function(e) {
		e.stopPropagation();
		var $this = $(this);
		if (!loginUserid) {
			loginIframe.show();
			return false;
		}

		$this[0].isFollowed = $this.text() == '已关注';
		if (!$this[0]['followFlag']) {
			var userName = $this.data("username");

			if ($this[0].isFollowed) {
				var $cloneFlowCard = $flowCard;
				showSureDialogTip({
					title : "提示",
					content :"不再关注 "+ userName +" 了吗？",
					cancel : "继续关注",
					sure: "不再关注"
				},function(){
					followAction($this, $cloneFlowCard);
				});
			} else {
				followAction($this);
			}

	    }
	});
})();

$document.on("click", ".enter-creator-space", function(e) {
	var $this = $(this),
		userid = $this.data("userid");
	window.open( "/u" + userid);
	 e.stopPropagation();
});

$document.on("click", ".no-creator-space", function() {
	return false;
});

$document.on("click", ".filmplay-black-box .close", function() {
	$(this).closest(".filmplay-black-box").addClass("dn");
	allowPageScroll();
});

$document.on("click", ".enter-filmplay", function(e) {
	var $this = $(this),
		articleid = $this.data("articleid"),
		videoUrl = $this.data("videourl");

		if (!$(e.target).closest(".photo-operation").length && !$(e.target).closest(".li-bottom-good").length) {
			window.open("/a" + articleid + (videoUrl ? "?from="+ videoUrl : ""), "_blank");
		}

		return false;
});

function lazyImg(parent, callback) {
	var $lazyImg = parent ? parent.find(".lazy-img") : $(".lazy-img");
	// console.log($lazyImg)

	$lazyImg.each(function(index, elem) {
		var $this = $(this),
			image = new Image(),
			$thisImgSrc = $this.attr("_src");

		if ($thisImgSrc) {
			image.src = $thisImgSrc;
			image.onload = function() {
				$this.attr({"src": $thisImgSrc, "_src": ""}).addClass("lazy-img-show");
				callback && callback();
			}
		}
	});
}

$(function() {
	if (!$(".square-container").length) {
		lazyImg();
	}

	var $newMsgTip = $(".new-msg-tip"),
		$complexHeader = $(".complex-header"),
		$fixedHeader = $(".fixed-header"),
		$bannerWrap = $(".banner-wrap");

	if ($fixedHeader.hasClass("pf-up")) {
		$newMsgTip.removeClass("top");
	}

	// header有类fixed-header执行
	if ($fixedHeader.length) {
		scroll(function(direction) {
			if (direction == "up") {
				$fixedHeader.addClass("pf-normal").removeClass("pf-up");
				$newMsgTip.addClass("top");

			} else {
				$fixedHeader.addClass("pf-up").removeClass("pf-normal");
				$newMsgTip.removeClass("top");
			}
		});
	}

	// header有类complex-header执行
	if ($complexHeader.length) {
		if (scrollTop() < outerHeight($bannerWrap)) {
    	$complexHeader.addClass("header-v2 pa-normal").removeClass("pf-normal transition");
		$(".logo-wrap").addClass("white-logo").removeClass("red-logo");

	    } else {
			$complexHeader.removeClass("header-v2 pa-normal");
			$(".logo-wrap").addClass("red-logo").removeClass("white-logo");
			setTimeout(function() {
				$complexHeader.addClass("transition");
			}, 100);
	    }
	}

	function scroll( fn ) {

		var lastScrollTop = scrollTop();

		if ($complexHeader.length) {
			if (lastScrollTop < outerHeight($bannerWrap) - outerHeight($complexHeader)) {
				$complexHeader.addClass("header-v2 pa-normal");
			} else {
				$complexHeader.removeClass("header-v2 pa-normal");
			}
		}

	    fn = fn || function() {};

	    window.addEventListener("scroll", function() {
	        var currentScrollTop = scrollTop(),
	            delta = currentScrollTop - lastScrollTop;

	        if( delta === 0 ) return false;

	        if ($complexHeader.length) {
	        	// 滑到banner上
		        if (currentScrollTop < outerHeight($bannerWrap)) {
		        	$complexHeader.addClass("header-v2 pa-normal").removeClass("pf-normal transition");
		    		$(".logo-wrap").addClass("white-logo").removeClass("red-logo");

		    		if (currentScrollTop < 30) {
		    			$newMsgTip.addClass("top");
		    		} else {
		    			$newMsgTip.removeClass("top");
		    		}


		        } else {
	        		$complexHeader.removeClass("header-v2 pa-normal");
		    		$(".logo-wrap").addClass("red-logo").removeClass("white-logo");
		    		setTimeout(function() {
		    			$complexHeader.addClass("transition");
		    		}, 100);
		        	fn( delta > 0 ? "down" : "up" );
		        }
	    	}  else {
	    		if (currentScrollTop > 20) {
	    			fn( delta > 0 ? "down" : "up" );
	    		}
	    	}

	        lastScrollTop = currentScrollTop;

	    }, false);

	}

});

function scrollTop() {
	return $(window).scrollTop();
}


function outerHeight(elem) {

	return elem.outerHeight('true');

}

if (loginUserid) {
	var h_pace = 100;
	$('.new-msg-tip-close').on('click',function(){
		$('#h_xm_tip').fadeOut(h_pace);
		$.post('/index.php?app=message&ac=un',{t:0},function(re){
			$(".new-msginfo").hide();
		},'json');
	});
	setInterval(function(){
		interval();
	 },60000);
	// $('input, textarea').placeholder();

	interval();
};

function interval(h_pace){
	$.getJSON('/index.php?app=message&ac=my',{getMessageNum:1},
		function(res){

			if (res.all) {
				$("#show-msg").removeClass('dn');
			};

			var ss = $("#h_xm_tip >ul").find('li').length;
			if(!ss){
				$('#h_xm_tip').fadeOut(h_pace);
			}
			$("#h_xm_tip >ul").html('');

			if( parseInt(res.systemNum) ){
				$("#csystemNum").text('('+res.systemNum+')');
				var tmp = 	'<li class="clearfix">'+
								'<a class="msg_tip_l"  href="/index.php?app=message&ac=my&ts=system">' + res.systemNum + '条新通知</a>' +
								'<a class="msg_tip_r" href="javascript:void(0);" mark="5">忽略</a>'+
							'</li>';
				$(tmp).prependTo('#h_xm_tip > ul:eq(0)');
			}
			if( parseInt(res.replayNum) ){

				var tmp = 	'<li class="clearfix">'+
								'<a class="msg_tip_l"  href="/index.php?app=message&ac=my&ts=notice">' + res.replayNum + '条新评论回复</a>' +
								'<a class="msg_tip_r" href="javascript:void(0);" mark="3">忽略</a>'+
							'</li>';
				$(tmp).prependTo('#h_xm_tip > ul:eq(0)');
			}
			if( parseInt(res.selfNum) ){
				$("#cselfNum").text('('+res.selfNum+')');
				var tmp = 	'<li class="clearfix">'+
								'<a class="msg_tip_l"  href="/index.php?app=message&ac=my&ts=self">' + res.selfNum + '个新约片合作</a>' +
								'<a class="msg_tip_r" href="javascript:void(0);" mark="6">忽略</a>'+
							'</li>';
				$(tmp).prependTo('#h_xm_tip > ul:eq(0)');
			}
			if( parseInt(res.articleCommentNum) ){
				var tmp = 	'<li class="clearfix">'+
								'<a class="msg_tip_l"   href="/index.php?app=message&ac=my&ts=notice">'+res.articleCommentNum+'条新作品评论</a>' +
								'<a class="msg_tip_r" href="javascript:void(0);" mark="1">忽略</a>'+
							'</li>';
				$(tmp).prependTo('#h_xm_tip > ul:eq(0)');
			}
			if( parseInt(res.topicCommentNum) ){
					var tmp = 	'<li class="clearfix">'+
								'<a class="msg_tip_l"  href="/index.php?app=message&ac=my&ts=notice">'+res.topicCommentNum+'条新帖子评论</a>' +
								'<a class="msg_tip_r" href="javascript:void(0);" mark="2">忽略</a>'+
							'</li>';
				$(tmp).prependTo('#h_xm_tip > ul:eq(0)');

			}
			if( parseInt(res.projectCommentNum) ){
					var tmp = 	'<li class="clearfix">'+
								'<a class="msg_tip_l"  href="/index.php?app=message&ac=my&ts=notice">'+res.projectCommentNum+'条新拍摄计划评论</a>' +
								'<a class="msg_tip_r" href="javascript:void(0);" mark="7">忽略</a>'+
							'</li>';
				$(tmp).prependTo('#h_xm_tip > ul:eq(0)');

			}

			if( parseInt(res.fans )){
				var tmp = 	'<li class="clearfix">'+
								'<a class="msg_tip_l fans-tip"  href="javascript:;" data-link="/u'+ loginUserid + '">' + res.fans + '个新粉丝</a>' +
								'<a class="msg_tip_r" href="javascript:void(0);" mark="4">忽略</a>'+
							'</li>';
				$(tmp).prependTo('#h_xm_tip > ul:eq(0)');
			}
			if( parseInt(res.inviteNum) ){

				var tmp = 	'<li class="clearfix">'+
								'<a class="msg_tip_l"  href="/index.php?app=message&ac=my&ts=notice">' + res.inviteNum + '个邀请</a>' +
								'<a class="msg_tip_r" href="javascript:void(0);" mark="8">忽略</a>'+
							'</li>';
				$(tmp).prependTo('#h_xm_tip > ul:eq(0)');
			}

			if( parseInt(res.atNum) ){

				var tmp = 	'<li class="clearfix">'+
								'<a class="msg_tip_l"  href="/index.php?app=message&ac=my&ts=notice">' + res.atNum + '个@提醒</a>' +
								'<a class="msg_tip_r" href="javascript:void(0);" mark="9">忽略</a>'+
							'</li>';
				$(tmp).prependTo('#h_xm_tip > ul:eq(0)');
			}

			if( parseInt(res.approveNum) ){

				var tmp = 	'<li class="clearfix">'+
								'<a class="msg_tip_l"  href="/index.php?app=message&ac=my&ts=notice">获得' + res.approveNum + '个赞同</a>' +
								'<a class="msg_tip_r" href="javascript:void(0);" mark="10">忽略</a>'+
							'</li>';
				$(tmp).prependTo('#h_xm_tip > ul:eq(0)');
			}

			if( parseInt(res.lyNum) ){

				var tmp = 	'<li class="clearfix">'+
								'<a class="msg_tip_l"  href="/index.php?app=message&ac=my&ts=notice">' + res.lyNum + '条新留言</a>' +
								'<a class="msg_tip_r" href="javascript:void(0);" mark="16">忽略</a>'+
							'</li>';
				$(tmp).prependTo('#h_xm_tip > ul:eq(0)');
			}

			if( parseInt(res.stillsNum) ){

				var tmp = 	'<li class="clearfix">'+
								'<a class="msg_tip_l"  href="/index.php?app=message&ac=my&ts=notice">' + res.stillsNum + '条图集留言</a>' +
								'<a class="msg_tip_r" href="javascript:void(0);" mark="17">忽略</a>'+
							'</li>';
				$(tmp).prependTo('#h_xm_tip > ul:eq(0)');
			}
			if( parseInt(res.likeNum) ){
				var tmp = 	'<li class="clearfix">'+
								'<a class="msg_tip_l"  href="/index.php?app=message&ac=my&ts=notice">' + res.likeNum + '条新喜欢</a>' +
								'<a class="msg_tip_r" href="javascript:void(0);" mark="18">忽略</a>'+
							'</li>';
				$(tmp).prependTo('#h_xm_tip > ul:eq(0)');
			}

			if( parseInt(res.expCommentNum) ){
				var tmp = 	'<li class="clearfix">'+
								'<a class="msg_tip_l"  href="/index.php?app=message&ac=my&ts=notice">' + res.expCommentNum + '条新文章评论</a>' +
								'<a class="msg_tip_r" href="javascript:void(0);" mark="20">忽略</a>'+
							'</li>';
				$(tmp).prependTo('#h_xm_tip > ul:eq(0)');
			}

			var noticeNum = parseInt(res.topicCommentNum)+parseInt(res.articleCommentNum)+parseInt(res.replayNum);
			if(noticeNum){
				$("#cnoticeNum").text('('+noticeNum+')');
			}
			if( res.all){
				$('.new-msginfo').fadeIn(h_pace);
				$('#h_xm_tip').fadeIn(h_pace);
				$('#h_xm_tip a.msg_tip_r').bind('click',function(){
					var mark = $(this).attr('mark');
					if( $('#h_xm_tip > ul >li').length == 1 ){
						$('#h_xm_tip').fadeOut(h_pace);
						$(".new-msginfo").fadeOut(h_pace);
					}
					$(this).parent().remove();
					$.post('/index.php?app=message&ac=un',{t:mark},function(re){
					},'json');
				});
			}else{
				$('.new-msginfo').fadeOut(h_pace);
				$('#h_xm_tip').fadeOut(h_pace);
			}
	});
}

// 点击粉丝提醒
$(document).on("click", ".fans-tip", function() {
	var _this = $(this),
		link = _this.data("link");
	localStorage.setItem("open-fans-box", 1);
	setTimeout(function() {
		location.href = link;
	}, 0);
});

// 禁止和允许页面滚动
function banPageScroll() {
	$("html, body").addClass("overflow-hidden");
}

function allowPageScroll() {
	$("html, body").removeClass("overflow-hidden");
}

function banPageClick() {
	$("body").append("<span class='ban-click'>");
}

function allowPageClick() {
	$("body").find(".ban-click").remove();
}
function formatSecs(seconds) {
	if (seconds < 3600) {
		 return [
	        parseInt(seconds / 60 % 60),
	        parseInt(seconds % 60)
	    ]
	        .join(":")
	        .replace(/\b(\d)\b/g, "0$1");
	}
    return [
        parseInt(seconds / 60 / 60),
        parseInt(seconds / 60 % 60),
        parseInt(seconds % 60)
    ]
        .join(":")
        .replace(/\b(\d)\b/g, "0$1");
}
function myClearTimeout() {
	var timers = [].slice.call(arguments, 0);
	timers.forEach(function(v, k) {
		clearTimeout(v);
	});
}
function toThousands(num) {
    var result = '', counter = 0;
    num = (num || 0).toString();
    for (var i = num.length - 1; i >= 0; i--) {
        counter++;
        result = num.charAt(i) + result;
        if (!(counter % 3) && i != 0) { result = ',' + result; }
    }
    return result;
}

//弹窗提示
function xpcAlert(msg, ifNormal, o, clickMsk) {
    var options = $.extend({
        content: msg,
        title: '提示',
        fixed: true,
        skin: 'pop-wrapper',
        zIndex: 10007
    }, o);

    var d = dialog(options);
    if (clickMsk) {
        $(document).on('click','.ui-popup-backdrop',function(){
            d.close().remove();
        })

    }
    if (!ifNormal) {
        d.showModal();//如果非普通弹窗，则弹出模态框，有mask
    } else {
        d.show();//如果为true，则弹出普通弹窗，没有mask
    }

}

function getRequest() {
    var url = location.search;
    var theRequest = {};
    if (url.indexOf('?') != -1) {
        var str = url.substr(1);
        strs = str.split('&');
        for (var i = 0; i < strs.length; i++) {
            var kv = strs[i].split('=');
            theRequest[kv[0]] = decodeURIComponent(kv[1]);
        }
    }
    return theRequest;
}

//cookie的操作
window.cookie = {
    set: function (key, val, expiresDays) {//设置cookie方法
        var date = new Date(); //获取当前时间
        // expiresDays:过期时间的天数
        date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000); //格式化为cookie识别的时间
        document.cookie = key + "=" + val + ";expires=" + date.toGMTString() + ";domain=.xinpianchang.com;path=/";  //设置cookie
    },
    get: function (key) {//获取cookie方法
        /*获取cookie参数*/
        var getCookie = document.cookie.replace(/[ ]/g, "");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
        var arrCookie = getCookie.split(";");  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
        var tips;  //声明变量tips
        for (var i = 0; i < arrCookie.length; i++) {   //使用for循环查找cookie中的tips变量
            var arr = arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
            if (key == arr[0]) {  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
                tips = arr[1];   //将cookie的值赋给变量tips
                break;   //终止for循环遍历
            }
        }
        return tips;
    }
};