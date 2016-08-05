/**
 * 
事件：
onEnd(num)
 * 
 * @param {Array} videoSrcArr
 * @param {Object} p
 * @param {Number} w
 * @param {Number} h
 * @param {Object} option
 * @p-config {Boolean} fullScreen	是否全屏(微信下无效，微信默认全屏)
 */
function lVideoArrCtrl(videoSrcArr,p,w,h,option)
{
	option = lInitOption(option)
	
	option.appP("fullScreen",false)
	
	var bigDiv=lDiv(p,0,0)
	
	var videoDiv=lDiv(bigDiv,0,0,w,h,"#000")
	
	var closeBtn = lDiv(videoDiv,0,0,640,50,"#000")
	var closeSp = lSpan("<关闭视频",closeBtn,10,10,25,"#fff")
	
	bigDiv.closeBtn = closeBtn
	
	lBtn(closeBtn,function () {
		bigDiv.closeVideo()
	},"none","none")
	
	var vh=w/4*3
	
	var videoArr=[]
	
	for (var i = 0; i < videoSrcArr.length; i++) 
	{
		videoArr[i] = lVideo(undefined,videoDiv,0,h/2-vh/2-h*0,w,vh)
		
		videoArr[i].video.addEventListener("ended",onEnd)
		videoArr[i].video.addEventListener("webkitendfullscreen",onEndFull)
		if(option.fullScreen==false)
		{
			videoArr[i].video.setPlaysinline()
		}
		//alert(videoArr[i].video)
	}
	
	var curVideoId=0
	
	function onEnd () {
		bigDiv.closeVideo()
		if(bigDiv.onEnd!=undefined) bigDiv.onEnd(curVideoId)
	}
	
	function onEndFull () {
		bigDiv.closeVideo()
		if(bigDiv.onEnd!=undefined) bigDiv.onEnd(curVideoId)
		
	}
	
	function showPlayer (num) {
		for (var i = 0; i < videoSrcArr.length; i++) {
			videoArr[i].style.visibility="hidden"
			videoArr[i].style.display="none"
		}
		
		videoArr[num].style.visibility="visible"
		videoArr[num].style.display=""
	}
	
	bigDiv.closeVideo=function () {
		videoArr[curVideoId].video.pause()
		//videoDiv.hide()
		//lRemoveChild(videoDiv)
		videoDiv.style.visibility="hidden"
		videoDiv.style.display="none"
	}
	
	function showVideo () 
	{
		//console.log(111111);
		videoDiv.style.visibility="visible"
		videoDiv.style.display=""
	}
	
	bigDiv.closeVideo ()
	
	videoDiv.appendChild(videoArr[0])
	
	var hasSrc=[]
	bigDiv.play=function (num) 
	{
		videoArr[curVideoId].video.pause()
		curVideoId=num
		showVideo()
		showPlayer(num)
		
		if(option.fullScreen==true)
		{
			videoArr[num].video.webkitEnterFullscreen()
		}
		
		try{
			videoArr[num].video.currentTime=0
		}catch(e){
		}
		
		if(hasSrc[num]==undefined)
		{
			videoArr[num].video.setVideoSrc(videoSrcArr[num])
			hasSrc[num]=true
		}
		
		
		videoArr[num].video.play()
	}
	
	return bigDiv
}
		
function lVideoCtrl (video,parent) 
{
	var uiDiv = lDiv(parent,0,0)
	
	uiDiv.pBarLW=100//进度条到最左边的距离
	uiDiv.pBarRW=100//进度条到最右边的距离
	uiDiv.muteBtnResizeOder="right"//静音按钮对齐方式
	uiDiv.muteBtnD=60//静音按钮距离边界的距离
	uiDiv.barH=85//控制条高
	
	uiDiv.onMouseTrack=false//是否用户正在拖动进度条
	uiDiv.onMouseDownPlayState=false//是否用户正在拖动进度条
	
	uiDiv.playBtn = lDiv(uiDiv,30,30,35,35,"#00ff00")//播放按钮
	uiDiv.pauseBtn = lDiv(uiDiv,30,30,35,35,"#ff0000")//暂停按钮
	
	uiDiv.playBtn.style.borderRadius=100+"px"
	
	uiDiv.pauseBtn.style.borderRadius=100+"px"
	
	lBtn(uiDiv.playBtn,playClick,{autoAlpha:1},{autoAlpha:0.8})
	lBtn(uiDiv.pauseBtn,pauseClick,{autoAlpha:1},{autoAlpha:0.8})
	
	//进度条div
	uiDiv.pBarW//条宽度
	uiDiv.pBarDiv = lDiv(uiDiv,uiDiv.pBarLW,30)
	
	
	uiDiv.pBgDiv = lDiv(uiDiv.pBarDiv,0,0,100,2,"#616161")//进度条背景
	uiDiv.pLoadedDiv = lDiv(uiDiv.pBarDiv,0,0,100,2,"#cecece")//进度条读取进度
	uiDiv.playedDiv = lDiv(uiDiv.pBarDiv,0,0,100,2,"#ff6b6b")//进度条播放进度
	
	uiDiv.pBtn = lDiv(uiDiv.pBarDiv,0,0,12,12,"#ffffff")//进度条按钮
	uiDiv.pBtn.style.borderRadius=100+"px"
	
	uiDiv.pAreaDiv = lDiv(uiDiv.pBarDiv,0,0,0,0,"rgba(255,0,0,0)")//进度条点击区域
	uiDiv.pAreaDiv.style.webkitUserSelect="none"
	uiDiv.pAreaDiv.style.webkitUserDrag="none"
	

	
	TweenMax.set(uiDiv.pBtn,{x:-6,y:-6})
	
	//静音按钮
	uiDiv.muteBtn = lDiv(uiDiv,0,30,30,30,"#ffffff")
	uiDiv.muteBtn.style.cursor="pointer";
	
	$(uiDiv.muteBtn).bind("click",muteClick)
	function muteClick () 
	{
		if(video.muted==true)
		{
			video.muted=false
		}else{
			video.muted=true
		}
		
		//alert(video.muted)
	}
	
	//进度条点击区域
	$(uiDiv.pAreaDiv).bind("mousedown",pAreaMouseDown)

	function pAreaMouseDown (e) 
	{
		$(uiDiv.pAreaDiv).bind("mouseup",stopTrack)
		$(uiDiv.pAreaDiv).bind("mouseleave",stopTrack)
		$(uiDiv.pAreaDiv).bind("mousemove",pAreaMouseMove)
		uiDiv.onMouseTrack=true
		uiDiv.onMouseDownPlayState = video.paused
		movePBtn(e)
		video.pause()
	}
	
	function pAreaMouseMove (e) 
	{
		movePBtn(e)
		//console.log(p)
	}
	
	function stopTrack (e) {
		$(uiDiv.pAreaDiv).unbind("mouseup",stopTrack)
		$(uiDiv.pAreaDiv).unbind("mouseleave",stopTrack)
		$(uiDiv.pAreaDiv).unbind("mousemove",pAreaMouseMove)
		uiDiv.onMouseTrack=false
		
		movePBtn(e)
		
		//恢复用户控制前的播放状态
		if(uiDiv.onMouseDownPlayState==false)
		{
			video.play()
		}
		
		//console.log("stopTrack")
	}
	//移动播放按钮
	function movePBtn (e) 
	{
		var posX = e.offsetX==undefined?e.layerX:e.offsetX;
		var posY = e.offsetY==undefined?e.layerY:e.offsetY;
		var p = posX/uiDiv.pBarW
		movePBar(p)
		video.currentTime = p*video.duration
	}
	
	//事件
	$(video).bind("progress",progress)
	$(video).bind("play",playing)
	$(video).bind("pause",pause)
	//$(video).bind("ended",ended)
	
	
	
	var lef = lEf(onEf)
	checkState ()
	
	function onEf () 
	{
		var p = video.currentTime/video.duration
		
		if(uiDiv.onMouseTrack==false)//是否用户在控制
		{
			movePBar(p)
		}
		
	}
	
	/**
	 * 移动播放条
	 * @param {number} p	进度百分比
	 */
	function movePBar(p) 
	{
		var pW = uiDiv.pBarW*p
		uiDiv.playedDiv.style.width=pW+"px"//播放进度条同步
		uiDiv.pBtn.style.left=pW+"px"//播放按钮同步
	}
	
	function playClick () {
		video.play()
		
	}
	function pauseClick () {
		video.pause()
		
	}
	
	function checkState () 
	{
		if(video.paused==true || video.ended==true)
		{
			$(uiDiv.playBtn).show()
			$(uiDiv.pauseBtn).hide()
			
			lef.stop()
		}else{
			$(uiDiv.playBtn).hide()
			$(uiDiv.pauseBtn).show()
			lef.start()
		}
	}
	function pause () 
	{
		checkState ()
		//console.log("pause")
	}
	function playing () {
		checkState()
		//console.log("play")
	}
	function progress (e) {
		//console.log(e,33333333)
	}
	
	//resizePBar(600,35)
	//调整进度条的宽度
	function resizePBar (w,h) 
	{
		uiDiv.pBarW = w
		
		uiDiv.pAreaDiv.style.width=w+"px"
		uiDiv.pAreaDiv.style.height=h+"px"
		
		uiDiv.pBgDiv.style.width=w+"px"
		uiDiv.pLoadedDiv.style.width=w+"px"
		uiDiv.playedDiv.style.width=w+"px"
		
		var tRect = lObjToRect(uiDiv.pAreaDiv)
		tRect.x=0
		tRect.y=0
		
		lAlign(uiDiv.pBgDiv,uiDiv.pBgDiv.offsetWidth,uiDiv.pBgDiv.offsetHeight,tRect,5,5)
		lAlign(uiDiv.pLoadedDiv,uiDiv.pBgDiv.offsetWidth,uiDiv.pBgDiv.offsetHeight,tRect,5,5)
		lAlign(uiDiv.playedDiv,uiDiv.pBgDiv.offsetWidth,uiDiv.pBgDiv.offsetHeight,tRect,5,5)
		lAlign(uiDiv.pBtn,uiDiv.pBgDiv.offsetWidth,uiDiv.pBgDiv.offsetHeight,tRect,5,5)
		
		//console.log(lObjToRect(pBarDiv),pBgDiv.offsetWidth,pBgDiv.offsetHeight)
	}
	
	
	//调整ui
	uiDiv.resize = function () 
	{
		//静音按钮
		if(uiDiv.muteBtnResizeOder=="right")
		{
			uiDiv.muteBtn.style.left=video.width-uiDiv.muteBtnD+"px";
		}else{
			uiDiv.muteBtn.style.left=uiDiv.muteBtnD+"px";
		}
		
		//进度条
		resizePBar(video.width-uiDiv.pBarLW-uiDiv.pBarRW,35)
		
		uiDiv.style.top=video.height-uiDiv.barH+"px"
	}
	uiDiv.resize()
	
	return uiDiv
}