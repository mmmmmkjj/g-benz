
PIXI.DisplayObject.prototype.__defineGetter__("autoAlpha",function () {
	return this.alpha
})
PIXI.DisplayObject.prototype.__defineSetter__("autoAlpha",function (v) {
	if(v<=0)
	{
		this.alpha=v
		this.visible=false
	}else{
		this.alpha=v
		if(v>0 && this.visible==false)
		{
			this.visible=true
		}
	}
})

PIXI.DisplayObject.prototype.__defineGetter__("scaleX",function () {
	return this.scale.x
})
PIXI.DisplayObject.prototype.__defineSetter__("scaleX",function (v) {
	this.scale.x=v
})

PIXI.DisplayObject.prototype.__defineGetter__("scaleY",function () {
	return this.scale.y
})
PIXI.DisplayObject.prototype.__defineSetter__("scaleY",function (v) {
	this.scale.y=v
})

PIXI.DisplayObject.prototype.__defineGetter__("rotationD",function () {
	return this.rotation * (180 / Math.PI)
})
PIXI.DisplayObject.prototype.__defineSetter__("rotationD",function (v) {
	this.rotation=Math.PI / 180 * v
})

var lPixiBtnEnable=true
function lPixiBtn (t,onClickF) {
	//需完善click，及误触发
	t.buttonMode = true;
	t.interactive = true;
	t.on('mouseup', onClick)
	t.on('touchend', onClick)
	
	function onClick (e) {
		if(lPixiBtnEnable)
		{
			if(onClickF!=undefined) onClickF(e)	
		}
		
	}
	
	
	t.lActive=function () {
		t.buttonMode = true;
		t.interactive = true;
	}
	t.lDeactive=function () {
		t.buttonMode = false;
		t.interactive = false;
	}
}

/**
 * 设置中心点
 * @param {Object} t	对象
 * @param {Object} ox	中心点百分比
 * @param {Object} oy	中心点百分比
 * @param {Object} tw	对象宽
 * @param {Object} th	对象高
 */
function lPixiSetOrigin (t,ox,oy,tw,th) 
{
	t.pivot.x=tw*ox
	t.x+=tw*ox
	t.pivot.y=th*oy
	t.y+=th*oy
}

/**
 * 创建容器
 */
function lPixiContainer (p,x,y) {
	var t = new PIXI.Container()
	if(p!=undefined) p.addChild(t)
	if(x!=undefined) t.x=x
	if(y!=undefined) t.y=y
	return t
}

/**
 * 创建Texture
 */
function lPixiTexture (src,p,x,y) {
	var t = PIXI.Sprite.fromImage(src)
	if(p!=undefined) p.addChild(t)
	if(x!=undefined) t.x=x
	if(y!=undefined) t.y=y
	return t
}

/**
 * 创建Graphics
 */
function lPixiGraphics (p,x,y) {
	var t = new PIXI.Graphics();
	if(p!=undefined) p.addChild(t)
	if(x!=undefined) t.x=x
	if(y!=undefined) t.y=y
	return t
}