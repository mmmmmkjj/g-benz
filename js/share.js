var appid = "wxe4062e5a17930928"; //微信公众号appid-----------需要修改
var new_str = "9498624a23fd5d6e8f07e056ccd1fd3c"; //微信公众号secret---需要修改
$(document).ready(function() {
	$.ajax({
		type: "GET",
		url: "http://www.rwcamp.com:8031/phpshare/share_api.php", //返回签名接口
		data: {
			url: location.href.split('#')[0],
			appid: appid,
			new_str: new_str
		},
		cache: false,
		error: function() {},
		jsonp: "jsonpcallback",
		dataType: "jsonp",
		success: function(result) {
			wx.config({
				debug: false,
				appId: appid, // 必填，公众号的唯一标识
				timestamp: result.timestamp, // 必填，生成签名的时间戳
				nonceStr: result.noncestr, // 必填，生成签名的随机串
				signature: result.signature, // 必填，签名
				jsApiList: [
					'onMenuShareTimeline', //分享到朋友圈
					'onMenuShareQQ', //分享到QQ
					'onMenuShareWeibo', //分享到微博
					'onMenuShareAppMessage' //发送给朋友
				]
			});
		}
	});
});
var link = window.location.href;
var title = '智者，大成';
var imgUrl = "http://special.mercedes-benz.com.cn/thenewe-classteaser/mobile/img/share.jpg";
var desc = "4年，1,200个顶尖工程师，1,600,000公里，只为1个目标";
var shareData = {
	title: title,
	link: link,
	imgUrl: imgUrl,
	desc:desc,
	success: function() {
		//分享成功后，可在此调用其他逻辑代码
	}
}
var shareData1 = {
	title: "4年，1,200个顶尖工程师，1,600,000公里，只为1个目标",
	link: link,
	imgUrl: imgUrl,
	success: function() {
		//分享成功后，可在此调用其他逻辑代码
	}
}
wx.ready(function() {
	wx.onMenuShareTimeline(shareData1);
	wx.onMenuShareAppMessage(shareData);
	wx.onMenuShareQQ(shareData);
	wx.onMenuShareWeibo(shareData);
});