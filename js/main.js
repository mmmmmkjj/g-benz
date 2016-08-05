var proxyF
$(window).ready(function () {
	var imgPath="img/"
	document.title="智者，大成"
	//var playBtn=[0,0,0,1,0,0]
	var playBtn=[0,0,0,1,0,0]
	var videoArr=[
	"video/1.mp4",
	"video/2.mp4",
	"video/3.mp4",
	"video/4.mp4",
	"video/tvc.mp4"
	]
	
	var urlObj=lUrlToObj()
	
	var hiQ=lIsIos()
	
	if(lIsMobile()==false)
	{
		hiQ=true
	}
	
	var curPage=0
	var dftInMinD=1600//40
	var dftOutMinD=12100//110
	
	
	var myW=640,myH=1040;
	var renderer = new PIXI.CanvasRenderer(myW, myH,{backgroundColor : 0xffffff});
	
	var mainDiv = lDiv(document.body, 0, 0, 640, "100%", "#fff")
	mainDiv.style.overflow = "hidden"
	
	
	var userM=true
	//音乐
	function musicB(p,x,y) {
		if(x==undefined) x=640-30-25
		if(y==undefined) y=25
		
		var music = lAudio(imgPath+"music.mp3",false,true,onPlay,onPause)
		
		var mDiv=lDiv(p,x,y,30,30)
		var m_off = lImg(imgPath+"m_off.png",mDiv,0,0)
		var m_on = lImg(imgPath+"m_on.png",mDiv,0,0)
		
		var mFrame = lFrameSimple([m_off,m_on])
		lBtn(mDiv,function () {
			//music.paused ? music.play() : music.pause()
			if(music.paused==true)
			{
				music.play()
				track("用户开启音乐")
				userM=true
			}else{
				music.pause()
				track("用户关闭音乐")
				userM=false
			}
		})
		
		lAddClickArea(mDiv)
		
		//播放时触发
		function onPlay () {
			document.removeEventListener("WeixinJSBridgeReady",mDiv.play)
			mFrame.gotoPage(1)
			TweenMax.killTweensOf(m_on)
		}
		//播放时触发暂停时触发
		function onPause () {
			mFrame.gotoPage(0)
			TweenMax.killTweensOf(m_on)
		}
		
		//播放
		mDiv.play = function () {
			//本地模式时不会播放
			//if(lIsLAN()==false) music.play()
			music.play()
		}
		//停止
		mDiv.stop = function () {
			music.pause()
		}
		
		//设置自动播放(本地模式时不会播放)
		mDiv.autoPlay = function () {
			mDiv.play()
			document.addEventListener("WeixinJSBridgeReady",mDiv.play)
			
		}
		
		return mDiv
	}
	

	
	mainDiv.appendChild(renderer.view)
	renderer.view.style.position="absolute"
	renderer.view.style.left="0px"
	renderer.view.style.top="0px"
	
	var mBtn = musicB(mainDiv,550,910)
	mBtn.autoPlay()
	
	var stage = new PIXI.Container();
	
	//back=PIXI.Sprite.fromImage('img/back.jpg');
	var back = lPixiTexture(imgPath+"back.jpg",stage)
	
	//背景线
	var backGraphics = lPixiGraphics(stage)
	
	var tempGf=lPixiGraphics(stage)
	
	//横屏提示
	var tipDiv=lDiv(undefined,0,0,"100%","100%","#eaeaea")
	var tipBk=lImg(imgPath+"ass084.jpg",tipDiv,0,0,"100%","100%")
	//var tipSp=lSpan("为了更好的体验，请使用竖屏浏览",tipDiv,"50%","50%",20)
	var ass086=lImg(imgPath+"ass086.png",tipDiv,18,14)
	var ass085=lImg(imgPath+"ass085.png",tipDiv,"50%","50%")
	TweenMax.to(ass085,0,{x:"-50%",y:"-50%"})
	//TweenMax.to(tipSp,0,{x:"-50%",y:"-50%"})
	//tipSp.style.position="fixed"
	var onBd=false
	lOrientationTip(function(h) {
		if(onBd==false)
		{
			
			if(h==true)
			{
				tipDiv.style.width=window.innerWidth+"px"
				tipDiv.style.height=window.innerHeight+"px"
				//tipSp.style.fontSize=20*(window.innerWidth/640)+"px"//调整字大小
				TweenMax.to(ass085,0,{scale:window.innerWidth/640})
				document.body.appendChild(tipDiv)
				mainDiv.hide()
				isRenderBh=false
				isRenderBackDot=false
				videoClose()
			}else{
				lRemoveChild(tipDiv)
				mainDiv.show()
				isRenderBh=true
				isRenderBackDot=true
			}
		}
	})
	
	//数据
	var zhiInPoint=["222_280|221_299|198_318|199_339|185_352|","213_333|253_331|282_333|312_327|","266_330|255_346|265_370|264_423|247_444|235_470|204_484|188_499|","181_400|225_402|272_401|301_405|318_403|","270_447|284_442|291_460|313_468|314_477|","370_336|380_366|362_377|376_404|371_435|376_460|","400_342|419_334|427_338|","468_322|461_339|472_375|459_399|469_419|469_447|464_460|","402_457|413_467|427_455|","234_518|242_541|229_561|244_582|227_613|241_643|232_669|241_670|","271_523|288_522|317_515|328_531|352_528|367_520|388_532|","266_587|288_580|310_588|332_587|357_578|377_587|387_585|","269_660|300_653|330_651|342_661|363_654|382_654|","427_521|412_536|433_545|414_572|426_599|411_613|421_622|429_650|415_675|"];
	var zhiOutPoint=["217_270|206_290|186_318|165_351|188_374|215_347|234_312|237_292|230_274|","187_318|253_318|299_316|340_317|337_344|286_347|233_348|188_348|","246_318|243_372|234_443|197_477|158_498|173_529|218_503|252_474|273_433|277_381|280_315|","158_387|159_418|208_418|264_417|316_417|346_417|347_388|291_388|216_388|","276_419|256_445|276_474|325_498|338_467|316_454|286_436|","354_318|355_379|355_432|355_479|386_477|389_422|389_379|396_317|","398_319|419_320|447_316|446_348|425_352|407_352|386_349|","449_317|450_393|448_476|484_477|480_419|485_373|485_315|","388_444|412_443|447_444|448_458|448_474|424_478|386_478|","219_511|216_588|218_689|255_688|253_621|254_556|253_508|","255_511|328_510|403_511|400_541|352_539|297_538|256_539|","255_571|311_572|368_570|387_570|400_570|402_598|366_600|334_600|308_600|285_601|254_600|","256_639|291_640|308_640|328_640|344_640|400_640|400_668|364_670|307_668|255_668|","400_510|401_556|400_570|402_626|400_669|400_690|438_692|438_648|438_601|438_555|438_510|"];
	
	var newPoin={}
	newPoin.zhiOutPoint_np1_bh9="105_336|96_570|99_843|170_843|171_741|172_482|172_340|";
	newPoin.zhiInPoint_np1_bh9="137_401|146_482|117_510|152_575|125_641|149_699|123_769|140_806|"
	
	newPoin.zhiOutPoint_np1_bh10="171_343|291_341|468_339|468_400|361_401|242_401|173_402|";
	newPoin.zhiInPoint_np1_bh10="194_375|238_360|278_384|323_373|410_373|444_358|350_383|"
	
	newPoin.zhiOutPoint_np1_bh11="172_481|264_483|319_482|395_481|465_482|463_539|392_540|330_538|276_538|235_539|172_542|"
	newPoin.zhiInPoint_np1_bh11="195_524|230_511|292_525|318_515|359_525|422_531|451_508|"
	
	newPoin.zhiOutPoint_np1_bh12="172_604|237_607|284_604|397_609|435_605|464_602|465_666|393_665|233_664|170_667|"
	newPoin.zhiInPoint_np1_bh12="193_646|229_636|316_634|360_647|426_653|458_628|"
	
	newPoin.zhiOutPoint_np1_bh13="471_342|472_403|468_457|465_603|466_798|468_844|538_845|538_763|544_572|541_479|535_352|"
	newPoin.zhiInPoint_np1_bh13="506_408|496_464|515_497|481_529|484_617|515_658|485_703|514_768|492_827|"
	
	newPoin.zhiOutPoint_np1_bh3="172_740|174_802|237_803|331_797|392_802|465_801|463_742|352_741|240_743|"
	newPoin.zhiInPoint_np1_bh3="230_771|288_782|316_774|357_783|426_761|"
	
	//发动机
	newPoin.zhiOutPoint_fdj_bh10="178_300|329_297|483_297|482_358|393_359|242_360|177_360|"
	newPoin.zhiInPoint_fdj_bh10="222_328|265_343|326_318|364_342|392_318|424_340|458_327|"
	newPoin.zhiOutPoint_fdj_bh11="176_425|245_429|335_425|412_422|483_425|487_490|412_486|345_486|288_486|241_491|175_489|"
	newPoin.zhiInPoint_fdj_bh11="198_466|237_449|276_475|330_451|377_468|431_453|475_466|"
	newPoin.zhiOutPoint_fdj_bh12="177_570|246_572|318_568|363_569|406_566|483_570|482_632|410_634|286_629|177_632|"
	newPoin.zhiInPoint_fdj_bh12="237_602|284_612|327_603|371_616|403_590|451_611|"
	
	//日
	newPoin.zhiOutPoint_fdj3_bh9="156_370|157_512|158_651|215_651|212_569|215_464|214_370|"
	newPoin.zhiInPoint_fdj3_bh9="182_383|204_407|167_434|198_474|189_511|199_541|188_595|191_632|"
	newPoin.zhiOutPoint_fdj3_bh10="215_371|327_369|441_369|441_416|384_417|296_416|215_416|"
	newPoin.zhiInPoint_fdj3_bh10="236_399|260_389|298_403|327_388|356_404|398_387|433_391|"
	newPoin.zhiOutPoint_fdj3_bh11="216_464|296_465|345_465|389_465|442_464|443_511|388_512|339_510|301_510|262_512|213_512|"
	newPoin.zhiInPoint_fdj3_bh11="233_496|259_490|304_501|328_490|358_500|404_497|433_486|"
	newPoin.zhiOutPoint_fdj3_bh12="216_572|266_572|300_573|352_571|386_571|441_571|441_617|386_619|295_617|216_618|"
	newPoin.zhiInPoint_fdj3_bh12="237_608|259_595|298_601|325_596|359_605|413_594|"
	newPoin.zhiOutPoint_fdj3_bh13="442_370|442_440|444_512|443_551|442_615|442_649|497_649|497_585|498_513|500_440|499_370|"
	newPoin.zhiInPoint_fdj3_bh13="474_381|451_405|483_430|455_471|485_489|467_510|482_544|461_572|483_616|"
	
	//qi
	newPoin.zhiOutPoint_qi_bh9="203_255|189_283|140_353|174_383|233_309|240_283|230_250|"
	newPoin.zhiInPoint_qi_bh9="218_262|228_276|208_296|210_318|186_318|201_339|173_338|169_356|"
	newPoin.zhiOutPoint_qi_bh10="210_321|324_317|436_316|435_361|357_361|268_364|209_364|"
	newPoin.zhiInPoint_qi_bh10="235_349|259_334|281_351|304_334|344_348|376_334|411_349|"
	newPoin.zhiOutPoint_qi_bh11="203_390|262_390|345_390|380_389|432_389|431_433|385_434|351_434|310_434|263_436|204_436|"
	newPoin.zhiInPoint_qi_bh11="223_418|249_409|283_421|318_413|341_420|385_412|410_421|"
	newPoin.zhiOutPoint_qi_bh12="172_463|232_462|270_462|301_462|361_461|417_460|418_510|331_511|234_512|173_512|"
	newPoin.zhiInPoint_qi_bh12="201_479|252_492|297_490|329_494|369_489|404_492|"
	newPoin.zhiOutPoint_qi_bh13="355_511|361_572|380_643|405_686|445_711|488_713|498_622|482_619|447_641|420_584|417_509|"
	newPoin.zhiInPoint_qi_bh13="369_525|403_564|398_534|389_580|418_622|405_655|437_670|470_686|478_647|"
	
	//三条线
	newPoin.zhiOutPoint_fdj2_bh10="197_331|287_335|429_343|427_357|366_350|248_343|197_343|"
	newPoin.zhiInPoint_fdj2_bh10="228_337|260_337|288_341|318_343|346_342|374_343|401_350|"
	newPoin.zhiOutPoint_fdj2_bh11="190_432|284_439|376_442|430_444|483_445|483_459|443_456|390_454|328_451|251_447|190_444|"
	newPoin.zhiInPoint_fdj2_bh11="220_440|263_440|315_447|356_445|400_449|431_449|460_451|"
	newPoin.zhiOutPoint_fdj2_bh12="243_543|283_544|330_544|387_545|432_546|478_545|481_560|413_557|325_556|243_556|"
	newPoin.zhiInPoint_fdj2_bh12="271_548|314_552|360_550|407_551|436_554|459_554|"

	var e5_yuan_out= ["170_298|231_249|317_239|397_277|441_322|487_385|507_447|513_506|490_594|449_639|396_654|311_639|197_538|163_451|152_390|"]
	var e5_yuan_in= ["163_360|206_275|260_249|364_266|418_305|460_358|499_410|515_535|474_616|430_646|345_651|281_617|239_588|178_502|154_415|294_234|158_334|"]
	
	//车灯
	newPoin.data_yanOut=["47_595|71_551|95_475|112_443|249_409|355_397|501_373|543_378|584_371|623_392|599_428|579_474|544_501|487_561|430_578|381_608|325_608|185_627|93_615|"]
	newPoin.data_yanIn=["119_491|192_484|126_551|187_510|199_562|230_475|249_497|258_540|235_567|322_561|326_475|297_427|468_393|437_442|363_503|356_572|430_551|453_507|484_491|549_418|"]
	
	//var CollectXY="27_177|254_101|16_415|2_331|574_492|370_73|549_56|621_221|621_550|20_720|330_499|326_688|326_804|609_693|";
	var muInArr=["222_280|221_299|198_318|199_339|185_352|","213_333|253_331|282_333|312_327|","266_330|255_346|265_370|264_423|247_444|235_470|204_484|188_499|","181_400|225_402|272_401|301_405|318_403|","270_447|284_442|291_460|313_468|314_477|","370_336|380_366|362_377|376_404|371_435|376_460|","400_342|419_334|427_338|","468_322|461_339|472_375|459_399|469_419|469_447|464_460|","402_457|413_467|427_455|","234_518|242_541|229_561|244_582|227_613|241_643|232_669|241_670|","271_523|288_522|317_515|328_531|352_528|367_520|388_532|","266_587|288_580|310_588|332_587|357_578|377_587|387_585|","269_660|300_653|330_651|342_661|363_654|382_654|","427_521|412_536|433_545|414_572|426_599|411_613|421_622|429_650|415_675|"]
	//console.log(explainTxt(outlineAll));
	
	//停车
	newPoin.zhiOutPoint_tc_bh5="148_234|156_365|147_562|145_682|236_684|239_506|240_415|242_234|"
	newPoin.zhiInPoint_tc_bh5="190_299|216_392|181_460|221_532|180_576|204_629|"
	newPoin.zhiOutPoint_tc_bh6="241_233|327_240|406_233|404_328|338_332|290_333|240_331|"
	newPoin.zhiInPoint_tc_bh6="267_303|326_309|371_291|"
	newPoin.zhiOutPoint_tc_bh7="407_233|408_520|407_686|502_680|500_578|502_401|505_234|"
	newPoin.zhiInPoint_tc_bh7="474_284|427_329|479_375|444_460|479_508|440_591|480_640|"
	
	//停车2
	newPoin.zhiOutPoint_tc2_bh5="185_233|184_339|184_517|184_671|210_670|210_574|211_403|213_232|"
	newPoin.zhiInPoint_tc2_bh5="197_288|195_372|193_456|200_521|194_575|201_637|"
	newPoin.zhiOutPoint_tc2_bh6="213_233|292_233|438_233|438_260|382_261|265_258|213_257|"
	newPoin.zhiInPoint_tc2_bh6="254_241|325_250|401_242|"
	newPoin.zhiOutPoint_tc2_bh7="439_234|436_433|437_667|465_668|463_574|463_403|463_234|"
	newPoin.zhiInPoint_tc2_bh7="455_283|448_338|457_381|450_423|458_505|447_560|456_637|"
	
	var tc2_out=["149_666|175_670|193_671|242_668|244_698|219_696|173_694|149_695|"]
	var tc2_in=["168_681|190_685|212_679|228_683|"]
	var tc3_out=["406_668|420_669|446_670|500_671|498_696|480_696|440_695|407_697|"]
	var tc3_in=["419_682|444_680|465_679|485_684|"]
	
	//yin
	var yin_out=[
	"308_222|341_220|364_220|362_276|359_300|308_299|307_252|",
	"145_302|196_304|253_301|310_301|388_302|458_299|503_301|501_348|420_346|358_349|285_347|223_344|174_347|144_346|",
	"240_344|285_349|288_385|282_401|301_447|245_447|240_423|236_388|233_360|",
	"356_348|418_347|421_374|426_407|432_434|426_447|379_448|372_417|378_392|",
	"104_446|156_452|242_449|300_451|337_448|400_450|465_452|511_449|544_448|544_493|497_493|436_495|350_495|313_495|272_497|221_494|154_499|107_494|"
	]
	var yin_in=[
	"344_239|330_271|",
	"187_325|228_331|248_326|283_334|331_337|363_315|398_323|434_319|469_326|",
	"271_361|253_393|273_431|",
	"402_371|387_408|409_433|",
	"145_470|192_482|222_469|261_480|299_460|334_473|378_483|438_469|501_469|"
	]
	
	
	newPoin.zhiOutPoint_np2_bh9="186_535|184_659|186_778|234_776|234_707|235_614|234_536|"
	newPoin.zhiInPoint_np2_bh9="206_546|226_573|197_593|222_623|213_654|220_681|201_707|216_751|"
	
	newPoin.zhiOutPoint_np2_bh10="234_536|333_535|431_535|429_575|380_575|305_574|236_575|"
	newPoin.zhiInPoint_np2_bh10="272_556|305_562|330_553|359_562|374_546|401_566|414_551|"
	
	newPoin.zhiOutPoint_np2_bh11="236_616|308_617|354_616|385_617|430_616|431_657|383_656|342_655|307_656|277_658|234_657|"
	newPoin.zhiInPoint_np2_bh11="254_646|278_632|304_644|332_637|359_643|383_635|411_644|"
	
	newPoin.zhiOutPoint_np2_bh12="235_709|279_710|308_709|351_708|381_707|429_707|428_747|382_748|306_748|236_748|"
	newPoin.zhiInPoint_np2_bh12="272_728|305_740|330_730|357_738|382_720|405_740|"
	
	newPoin.zhiOutPoint_np2_bh13="431_535|431_615|431_656|432_692|430_746|431_775|478_777|477_720|478_659|479_598|479_536|"
	newPoin.zhiInPoint_np2_bh13="456_547|443_568|463_584|442_600|464_630|446_662|465_698|452_730|461_759|"
	
	//音箱
	var yinCp_out=["216_376|332_280|414_238|461_245|488_308|495_342|506_401|508_516|497_575|430_585|365_598|244_606|140_590|112_556|126_488|173_430|"]
	var yinCp_in=["336_331|393_286|436_265|397_391|423_416|428_463|471_474|391_453|412_530|461_555|484_535|385_499|357_562|336_501|321_537|299_559|276_500|256_532|187_556|191_508|234_471|210_444|242_416|273_426|274_461|295_454|298_434|325_416|341_371|293_372|241_375|339_390|424_327|"]
	
	//智能
	newPoin.zhiOutPoint_zn_bh0="172_289|156_324|124_369|105_393|141_425|173_387|200_351|209_322|197_286|"
	newPoin.zhiInPoint_zn_bh0="194_315|173_333|167_362|145_375|136_398|"
	
	newPoin.zhiOutPoint_zn_bh1="162_360|218_346|266_345|347_345|346_388|297_387|236_386|175_388|"
	newPoin.zhiInPoint_zn_bh1="194_370|240_362|269_376|312_365|"
	
	newPoin.zhiOutPoint_zn_bh2="215_388|216_430|201_523|165_555|100_595|119_636|162_613|202_587|254_526|259_469|262_388|"
	newPoin.zhiInPoint_zn_bh2="249_410|234_430|244_467|220_508|225_547|191_550|173_587|122_599|"
	
	newPoin.zhiOutPoint_zn_bh3="100_444|100_487|185_483|260_485|318_486|356_485|357_446|262_445|188_444|"
	newPoin.zhiInPoint_zn_bh3="125_460|166_469|214_463|281_473|320_464|"
	
	newPoin.zhiOutPoint_zn_bh4="259_490|243_547|286_573|325_594|346_553|317_535|283_514|"
	newPoin.zhiInPoint_zn_bh4="263_520|266_543|290_540|304_566|323_561|"
	
	newPoin.zhiOutPoint_zn_bh5="393_359|393_451|392_523|394_582|436_582|437_517|440_449|441_360|"
	newPoin.zhiInPoint_zn_bh5="414_390|408_424|425_459|405_482|420_520|409_560|"
	
	newPoin.zhiOutPoint_zn_bh6="441_361|481_365|520_360|518_407|486_408|466_408|438_406|"
	newPoin.zhiInPoint_zn_bh6="451_385|481_394|502_387|"
	
	newPoin.zhiOutPoint_zn_bh7="520_359|522_462|521_582|567_580|567_530|568_447|568_360|"
	newPoin.zhiInPoint_zn_bh7="537_387|552_420|530_442|540_474|551_498|530_541|549_565|"
	
	newPoin.zhiOutPoint_zn_bh8="438_534|471_534|517_535|520_557|520_583|486_582|437_581|"
	newPoin.zhiInPoint_zn_bh8="455_551|473_568|495_551|"
	
	var zn_yuan_out=[
	"67_303|114_282|202_233|268_191|325_212|441_234|496_246|533_298|605_410|639_476|624_528|603_641|600_689|564_717|455_803|422_830|371_835|291_838|255_846|219_825|95_735|41_685|11_539|16_456|",
	"130_344|161_325|215_290|233_273|272_274|387_287|479_324|525_387|555_443|572_475|569_517|555_601|546_636|512_675|437_734|401_761|345_764|267_758|216_748|167_700|106_635|85_592|76_480|90_408|",
	"181_406|249_359|334_341|441_380|505_492|476_621|344_700|226_675|150_579|143_482|",
	"215_474|263_419|331_406|396_428|441_499|422_583|339_635|261_622|214_558|"
	]
	
	var zn_yuan_in=[
	"146_246|382_206|488_259|578_338|621_599|505_785|333_852|191_819|123_776|23_639|0_496|20_408|",
	"182_297|289_263|353_268|446_293|550_410|555_479|578_566|486_724|304_776|117_681|99_585|62_512|117_380|",
	"294_355|386_351|466_441|499_557|423_663|279_693|173_625|137_527|155_444|",
	"236_443|298_405|370_414|421_459|434_544|387_613|297_623|229_590|207_515|"
	]
	
	newPoin.zhiOutPoint_fwd_bh1="160_295|219_296|284_295|325_295|326_338|261_338|221_335|160_338|"
	newPoin.zhiInPoint_fwd_bh1="193_316|234_324|262_306|305_325|"
	
	newPoin.zhiOutPoint_fwd_bh2="116_295|116_375|115_471|116_579|116_684|158_684|158_625|158_543|159_471|159_384|159_294|"
	newPoin.zhiInPoint_fwd_bh2="143_316|127_360|131_404|136_436|129_496|144_551|147_599|139_642|"
	
	newPoin.zhiOutPoint_fwd_bh3="159_472|159_506|195_507|227_506|255_507|285_507|286_470|252_471|206_473|"
	newPoin.zhiInPoint_fwd_bh3="181_489|209_499|222_489|249_495|271_484|"
	
	newPoin.zhiOutPoint_fwd_bh5="363_293|363_360|362_449|362_507|405_506|408_423|406_339|392_293|"
	newPoin.zhiInPoint_fwd_bh5="383_321|380_361|388_403|377_419|391_450|381_484|"
	
	newPoin.zhiOutPoint_fwd_bh7="487_292|488_393|487_508|531_507|531_456|532_376|533_292|"
	newPoin.zhiInPoint_fwd_bh7="511_306|499_333|520_349|507_398|517_425|504_460|518_489|"
	
	newPoin.zhiOutPoint_fwd_bh8="406_460|438_461|484_462|486_486|485_508|453_508|406_505|"
	newPoin.zhiInPoint_fwd_bh8="424_479|448_492|464_476|"
	
	newPoin.zhiOutPoint_fwd_bh9="287_471|287_568|285_678|329_679|328_632|330_554|330_471|"
	newPoin.zhiInPoint_fwd_bh9="311_491|299_518|318_541|306_575|315_607|298_627|318_653|302_670|"
	
	newPoin.zhiOutPoint_fwd_bh10="158_472|206_473|286_471|285_507|226_505|186_506|159_507|"
	newPoin.zhiInPoint_fwd_bh10="172_483|190_496|211_484|235_497|250_485|265_502|278_487|"
	
	newPoin.zhiOutPoint_fwd_bh11="160_625|187_625|222_623|253_623|285_623|285_659|253_658|228_658|207_659|184_659|159_658|"
	newPoin.zhiInPoint_fwd_bh11="170_645|186_637|208_647|223_639|238_649|256_636|269_651|"
	
	newPoin.zhiOutPoint_fwd_bh12="159_625|186_625|208_625|233_623|257_622|285_624|285_660|252_659|204_659|159_660|"
	newPoin.zhiInPoint_fwd_bh12="175_642|207_646|225_638|240_649|255_639|269_652|"
	
	newPoin.zhiOutPoint_fwd_bh13="487_509|487_550|488_587|489_617|487_645|488_681|531_681|529_642|531_595|531_551|530_507|"
	newPoin.zhiInPoint_fwd_bh13="510_517|501_536|518_561|500_573|512_596|501_613|518_628|507_648|516_671|"
	
	
	//en103
	var end103_out=[
	"144_350|182_351|237_351|292_354|294_408|238_408|199_408|199_447|240_450|285_468|306_512|305_554|284_589|249_599|187_600|142_597|144_574|171_549|243_546|254_514|227_503|198_502|156_499|142_494|142_444|143_416|144_379|",
	"308_355|296_406|318_411|336_455|330_508|306_541|281_543|273_518|273_458|276_438|294_410|317_409|308_353|271_355|243_377|227_414|223_444|223_485|222_527|248_582|300_605|350_588|370_557|380_509|380_449|375_411|359_380|334_359|"
	
	]
	var end103_int=[
	"158_360|177_375|227_372|277_384|156_396|168_419|171_473|238_477|271_501|282_537|262_572|228_575|171_573|",
	"306_381|328_385|357_410|343_443|360_455|345_486|354_528|333_554|321_571|288_575|252_563|259_528|249_486|243_440|261_414|282_397|254_383|"
	]
	console.log(newPoin.data_yanOut);
	
	
	//需要渲染的笔画
	var RenderBhArr=[]
	

	
	
	//生成数据=================================================================
	var yanBh = binBhData(newPoin.data_yanOut,newPoin.data_yanIn,"yan");
	var zhiBhArr=binBhData(zhiOutPoint,zhiInPoint,"zhi");
	var e5_yuanBhArr=binBhData(e5_yuan_out,e5_yuan_in,"e5Yuan");
	var tc2_BhArr=binBhData(tc2_out,tc2_in,"tc2");
	var tc3_BhArr=binBhData(tc3_out,tc3_in,"tc3");
	var yinBhArr=binBhData(yin_out,yin_in,"yin");
	var yinCpBhArr=binBhData(yinCp_out,yinCp_in,"yinCp");
	var znYuanBhArr=binBhData(zn_yuan_out,zn_yuan_in,"znYuan");
	var end103BhArr=binBhData(end103_out,end103_int,"end103");
	console.log(yanBh);
	
	
	
	//loading
	
	function AssetsManager()
	{
		this.onProgress=null;
		this.onComplete=null;
		var assetsToLoad_home=[imgPath+"back.jpg",imgPath+"qiu.png"];
		
		var path
		var jumpArr=[72,73,74,75,76,77]
		for (var i = 1; i < 87; i++) {
			if(jumpArr.indexOf(i)==-1)
			{
				
				if(i==84)
				{
					path = imgPath+"ass"+lPad(i,3)+".jpg"
				}else{
					path = imgPath+"ass"+lPad(i,3)+".png"
				}
				
				//console.log(path);
				assetsToLoad_home.push(path)
			}
			
		}
	
		this.start=function()
		{
			var loader=new PIXI.loaders.Loader();
			loader.add(assetsToLoad_home);
			loader.on("progress",this.onProgress);
			loader.on("complete",this.onComplete);
			loader.load();
		}
	};

	var loadDotAll=[];
	var loadDotLine1=[0,1,2,0];
	var loadDotLine2=[3,4,5,6,7,8];
	var loadDotLine3=[0,1,2];
	var loadDotLine4=[3,4,5,6,7,8];
	var loadDotImg=[];
	var loadAOff=false;
	var loadingCom=false
	
	var loadMC= new PIXI.Container();
	var loadTxtC= lPixiContainer(loadMC,0,120)
	loadMC.x=320;
	loadMC.y=400;
	var ass103 = lPixiTexture(imgPath+"ass103.png",loadMC)
	ass103.anchor.x=0.5
	ass103.y=110
	
	var loadTitle=PIXI.Sprite.fromImage(imgPath+'ass087.png');
	loadTitle.anchor.x = 0.5;
	loadMC.addChild(loadTitle);
	loadTitle.y=-150;
	stage.addChild(loadMC)
	/*
	var loadTxtY=513 - 500
	var ass091 = lPixiTexture(imgPath+"ass091.png",loadTxtC,256-320,loadTxtY)
	var ass092 = lPixiTexture(imgPath+"ass092.png",loadTxtC,252-320,loadTxtY)
	var ass093 = lPixiTexture(imgPath+"ass093.png",loadTxtC,219-320,loadTxtY)
	var ass094 = lPixiTexture(imgPath+"ass094.png",loadTxtC,215-320,loadTxtY)
	var ass095 = lPixiTexture(imgPath+"ass095.png",loadTxtC,246-320,loadTxtY)
	var ass096 = lPixiTexture(imgPath+"ass096.png",loadTxtC,240-320,loadTxtY)
	var ass097 = lPixiTexture(imgPath+"ass097.png",loadTxtC,220-320,loadTxtY)
	var ass098 = lPixiTexture(imgPath+"ass098.png",loadTxtC,252-320,loadTxtY)
	//back= PIXI.Sprite.fromImage(imgPath+'back.jpg');
	//stage.addChild(back,loadMC);
	
	var loadTxtArr=[ass091,ass092,ass093,ass094,ass095,ass096,ass097,ass098]
	var loadAni=new TimelineMax({repeat:-1,paused:true})
	loadAni.to(loadTxtArr,0,{autoAlpha:0})
	loadAni.staggerTo(loadTxtArr,3,{y:-30,ease:SlowMo.ease.config(0.7, 0.3, false)},2.5)
	loadAni.staggerTo(loadTxtArr,1,{autoAlpha:1,ease:Power0.easeNone},2.5,0)
	loadAni.staggerTo(loadTxtArr,1,{autoAlpha:0,ease:Power0.easeNone},2.5,2)
	loadAni.render(0)
	
	loadAni.play()*/
	
	loadAssets();
	
	function loadAssets(){
		assetsManager=new AssetsManager();
		assetsManager.onProgress=function(e)
		{
			//console.log(Math.floor(e.progress));
			loadTxt.text=Math.floor(e.progress);
		};
		assetsManager.onComplete=function()
		{
			console.log("图片加载完成！");
			loadingCom=true
			//setLayer();
			
			var page
			if(urlObj.sec==0 || urlObj.sec==undefined)
			{
				ani_home.play()
			}else if(urlObj.sec==1)
			{
				pageFdj.onIntro()//发动机
			}else if(urlObj.sec==2)
			{
				pageTc.onIntro()//自动泊车
			}else if(urlObj.sec==3)
			{
				pageYx.onIntro()//音响
			}else if(urlObj.sec==4)
			{
				pageZn.onIntro()//智能
			}else if(urlObj.sec==5)
			{
				pageFwd.onIntro()//64
			}else if(urlObj.sec>=6)
			{
				pageEnd.onIntro()//尾页
			}
			
			
			stage.removeChild(loadMC)
			//loadAni.stop()
			
		};
		loadSetAnimation();
		assetsManager.start();
	}

	function loadSetAnimation(){
		var i,dot,temp;

		loadMCGraphics= new PIXI.Graphics();
		for(i=0;i<3;i++){
			temp=PIXI.Sprite.fromImage(imgPath+'loading.png');
			temp.anchor.x = 0.5;
			temp.anchor.y = 0.5;
			temp.rotation=2.2*i;
			temp.anglexsd=(Math.random()*2-1)/100;
			loadMC.addChild(temp);
			loadDotImg.push(temp);
		}
		for(i=0;i<9;i++){
			dot={};
			if(i<3){
				dot.diameter=45+10*Math.random()-5;
				dot.angle=2.2*i;
				dot.anglexsd=0.01
			}else{
				dot.diameter=60+20*Math.random()-10;
				dot.angle=i-3;
				dot.anglexsd=(Math.random()*4-2)/100;
			}
			dot.r=3;
			dot.x=0;
			dot.y=0;
			loadDotAll.push(dot);
		}
		loadTxt = new PIXI.Text('00', { font: '35px Desyrel',align: 'center' });
		loadTxt.anchor.x = 0.5;
		loadTxt.anchor.y = 0.5;
	
	   // loadTxt.x=-5;
		loadAOff=true;
		loadMC.addChild(loadMCGraphics,loadTxt);
	}
	
	function loadAnimation() {
		var i,j,dot,dotA,dx,dy,dist,temp;
		if(!loadAOff)return;
		loadMCGraphics.clear();
		loadMCGraphics.lineStyle(1, 0x000,.3);
		for(i=0;i<loadDotLine1.length;i++){
			dot=loadDotAll[loadDotLine1[i]];
			if(i==0){
				loadMCGraphics.moveTo(dot.x, dot.y);
			}else{
				loadMCGraphics.lineTo(dot.x, dot.y);
			}
		}
		for(i=0;i<loadDotLine2.length;i++){
			dot=loadDotAll[loadDotLine2[i]];
			for(j=0;j<loadDotLine2.length-1;j++){
				dotA=loadDotAll[loadDotLine2[j]];
				dx=dot.x-dotA.x;
				dy=dot.y-dotA.y;
				dist=Math.sqrt(dx*dx+dy*dy);
				if(dist<70){
					loadMCGraphics.moveTo(dot.x, dot.y);
					loadMCGraphics.lineTo(dotA.x, dotA.y);
				}
			}
		}
	
		for(i=0;i<loadDotLine4.length;i++){
			dot=loadDotAll[loadDotLine4[i]];
			for(j=0;j<loadDotLine3.length;j++){
				dotA=loadDotAll[loadDotLine3[j]];
				dx=dot.x-dotA.x;
				dy=dot.y-dotA.y;
				dist=Math.sqrt(dx*dx+dy*dy);
				if(dist<80){
					loadMCGraphics.moveTo(dot.x, dot.y);
					loadMCGraphics.lineTo(dotA.x, dotA.y);
				}
			}
		}
		loadMCGraphics.endFill();
		loadMCGraphics.beginFill(0x000,.6);
		for ( i = 0; i < loadDotAll.length; i++)
		{
			dot=loadDotAll[i];
			dot.angle+=dot.anglexsd;
			dot.x=Math.cos(dot.angle)*dot.diameter;
			dot.y=Math.sin(dot.angle)*dot.diameter;
			loadMCGraphics.drawCircle(dot.x, dot.y,dot.r);
		}
		loadMCGraphics.endFill();
		for(i=0;i<loadDotImg.length;i++){
			temp=loadDotImg[i];
			temp.rotation+=temp.anglexsd;
		}
	}
	/*
	var d1 = lDiv(mainDiv,0,0,100,100,"#ff0000")
	var d2 = lDiv(mainDiv,100+10,0,100,100,"#ff0000")
	var d3 = lDiv(mainDiv,200+20,0,100,100,"#ff0000")
	
	lBtn(d1,function () {
		mainDiv.scrollTop=0
	})
	lBtn(d2,function () {
		mainDiv.style.top="0px"
	})
	lBtn(d3,function () {
		mainDiv.style.height="1008px"
	})*/
	
	//首页（智）=========================================
	var page0=lPixiContainer(stage)
	//var ass012 = lPixiTexture(imgPath+"ass012.png",page0,184,740)
	var ass055 = lPixiTexture(imgPath+"ass055.png",page0,131,740+30)
	var ass056 = lPixiTexture(imgPath+"ass056.png",page0,128,740+50+20)
	//var ass057 = lPixiTexture(imgPath+"ass057.png",page0,320-285/2,740+100)
	
	ass055.autoAlpha=0
	ass056.autoAlpha=0
	//ass057.autoAlpha=0
	
	//lPixiSetOrigin(ass012,0.5,0.5,278,107)
	//ass012.autoAlpha=0
	
	var qiu = lPixiTexture(imgPath+"qiu.png",page0)
	
	//动画智
	var ani_home=new TimelineMax({repeat:-0,paused:true})
	ani_home.to(ass055,0,{y:"+=100",autoAlpha:0})
	ani_home.to(ass056,0,{y:"+=100",autoAlpha:0})
	//ani_home.to(ass057,0,{y:"+=100",autoAlpha:0})
	ani_home.to(qiu,0,{autoAlpha:1})
	ani_home.to(page0,3,{onStart:ani_p1_f1})
	ani_home.to(page0,0,{onStart:ani_home_f1})
	ani_home.to(ass055,1,{y:"-=100",autoAlpha:1,ease:Power4.easeOut})
	ani_home.to(ass056,1,{y:"-=100",autoAlpha:1,ease:Power4.easeOut})
	//ani_home.to(ass057,1,{y:"-=100",autoAlpha:1,ease:Power4.easeOut})
	//ani_home.to(ass012,1.2,{scaleX:1,scaleY:1,autoAlpha:1,ease:Power4.easeOut,onStart:ani_home_f1},"-=1")
	
	//
	
	function ani_home_f1 () {
		startNextPage()
	}
	function ani_p1_f1 () {
		
		addRenderBh(zhiBhArr)
		
		//飞进智
		for (var i = 0; i < zhiBhArr.length; i++) 
		{
			bhAni (zhiBhArr[i],"flyIn",{delay:0.2*i,minTime:1,maxTime:2})
		}
	}
	
	//车灯页==================================================
	var page1=lPixiContainer(stage)
	lPixiSetOrigin(page1,0.5,0.5,640,1008)
	
	var ass002 = lPixiTexture(imgPath+"ass002.png",page1,77,204,487)
	var ass003 = lPixiTexture(imgPath+"ass003.png",page1,115,245,411)
	var ass004 = lPixiTexture(imgPath+"ass004.png",page1,44,310,571)
	var ass068 = lPixiTexture(imgPath+"ass068.png",page1,52,268,571)
	var ass005 = lPixiTexture(imgPath+"ass005.png",page1,121,702,398)
	var ass006 = lPixiTexture(imgPath+"ass006.png",page1,172,123,482)
	var ass007 = lPixiTexture(imgPath+"ass007.png",page1,51,776,532)
	var ass008 = lPixiTexture(imgPath+"ass008.png",page1,295,569,137)
	var ass009 = lPixiTexture(imgPath+"ass009.png",page1,417,661,164)
	var ass058 = lPixiTexture(imgPath+"ass058.png",page1,190,843,164)
	var ass069 = lPixiTexture(imgPath+"ass069.png",page1,0,416,164)
	var ass070 = lPixiTexture(imgPath+"ass070.png",page1,0,434,164)
	var ass071 = lPixiTexture(imgPath+"ass071.png",page1,13,451,164)
	
	
	lPixiSetOrigin(ass068,0.5,0.5,571,267)
	lPixiSetOrigin(ass003,0.5,0.5,410,410)
	lPixiSetOrigin(ass002,0.5,0.5,487,485)
	lPixiSetOrigin(ass009,0.5,0.5,164,72)
	lPixiSetOrigin(ass004,0.5,0.5,517,267)
	
	//var p1_imgYArr = [28,204,245,301,702,123,776,569,661,924]
	//var p1_imgWArr = [235,487,411,571,398,482,532,137,164,57]
	for (var i = 0; i < page1.children.length; i++) {
		page1.children[i].autoAlpha=0
	}
	//ass068.autoAlpha=0
	
	//ass004.autoAlpha=1
	
	
	page1.addChildAt(qiu,0)
	
	//http://lzy.oss-cn-qingdao.aliyuncs.com/tclcolor/3.mp4

	
	var vDiv = lDiv(mainDiv,0,0,640,"100%","rgba(0,0,0,0.5)")
	vDiv.hide()
	
	var vCtrl = lVideoArrCtrl(videoArr,vDiv,640,400,{fullScreen:false})
	vCtrl.style.top="230px"
	lRemoveChild(vCtrl.closeBtn)
	
	var ass047_v=lImg(imgPath+"ass047.png",vDiv,"50%",700)
	TweenMax.to(ass047_v,0,{x:"-50%"})
	
	lBtn(ass047_v,function () {
		track("关闭视频")
		videoClose()
		isRenderBh=true
		isRenderBackDot=true
	})
	
	var videoName=["(车灯)","(空调)","(自动泊车)","(音响)","TVC"];
	vCtrl.onEnd=function (num) {
		console.log("播放完成",num);
		track2("播放完成"+videoName[num])
		//onNexp ()
		videoClose()
	}
	
	//var v1=lVideo(undefined,mainDiv,0,100,640,640)
	//v1.video.setPlaysinline()
	//console.log(v1.video.innerHTML);
	//lRemoveChild(v1)
	
	lPixiBtn(ass009,function () {
		
		console.log("curPage",curPage,playBtn[curPage-1]);
		if(playBtn[curPage-1]==1)
		{
			track("观看视频(车灯)")
			track2("观看视频(车灯)")
			
			vCtrl.play(0)
			//ass009.visible=false
			
			onVideoPlay ()
		}else{
			//popSpan.innerHTML="敬请期待"
			popDiv.openPop("qd")
		}
		
	})
	function onVideoPlay () {
		isRenderBh=false
		isRenderBackDot=false
		
		ass002Tl.stop()
		mBtn.stop()
		
		vDiv.show()
		lPixiBtnEnable=false
		
		//stage.interactive=false
		//TweenMax.killTweensOf(ass002)
	}
	//var ani_p1_2 = new TimelineMax({repeat:-0,paused:true})
	

	
	
	page1.onOut=function () {
		isRenderBh=true
		isRenderBackDot=true
		//ani_p1_2.play()
		TweenMax.to(page1,0.3,{autoAlpha:0,scaleX:0.8,scaleY:0.8})
		ani_p1_2.stop()
	}
	
	/*var td1=lDiv(mainDiv,0,0,100,100,"#ff0000")
	lBtn(td1,function () {
		vCtrl.play(0)
		//v1.video.setVideoSrc(videoArr[0])
	})
	
	var td2=lDiv(mainDiv,100+10,0,100,100,"#ff0000")
	lBtn(td2,function () {
		vCtrl.play(1)
		//v1.video.setVideoSrc(videoArr[1])
		//v1.video.load()
	})*/

	TweenMax.to(qiu,0,{autoAlpha:0})
	
	//动画（车灯）
	var ani_p1=new TimelineMax({repeat:-0,paused:true})
	ani_p1.to(ass055,0.3,{autoAlpha:0})
	ani_p1.to(ass056,0.3,{autoAlpha:0},0)
	//ani_p1.to(ass057,0.3,{autoAlpha:0},0)
	//ani_p1.to(ass012,0.7,{autoAlpha:0,scaleX:0.8,scaleY:0.8,ease:Power4.easeIn})
	ani_p1.to(qiu,2,{autoAlpha:0,onStart:ani_p1_f2},"-=1")//目出来
	ani_p1.to(ass058,1,{autoAlpha:1})
	ani_p1.to(page1,2,{})
	ani_p1.to(page1,2,{onStart:ani_p1_f3})//目飞走
	ani_p1.to(ass058,0.5,{autoAlpha:0},"-=1")
	ani_p1.to(page1,3,{onStart:ani_p1_f4})//车灯轮廓进场
	
	ani_p1.to(ass068,0,{scaleX:2,scaleY:2})
	ani_p1.to(ass003,0,{})
	ani_p1.to(ass002,0,{scaleX:3,scaleY:3})
	ani_p1.to(ass004,0,{scaleX:0.8,scaleY:0.8})
	ani_p1.to(ass008,0,{x:"-=20"})
	ani_p1.to(ass009,0,{scaleX:0.5,scaleY:0.5})
	ani_p1.to(ass006,0,{y:"-=30"})
	ani_p1.to(ass007,0,{y:"+=30"})
	
	ani_p1.to(page1,0,{onStart:ani_p1_f5})//车灯轮廓飞走
	ani_p1.to(ass004,0.3,{scaleX:1,scaleY:1,autoAlpha:1})//车灯
	ani_p1.to(ass004,2.0,{})
	ani_p1.to(ass004,0.3,{autoAlpha:0})//车灯
	binTl1(0,ani_p1,ass068,ass006,ass007,ass008,ass009,"-=0.3")
	ani_p1.to(page1,0,{onStart:ani_p1_f8})
	//ani_p1.to(ass068,0.7,{scaleX:1,scaleY:1,autoAlpha:1,ease:Power4.easeOut,onComplete:ani_p1_f8})
	//ani_p1.to(ass003,0.7,{autoAlpha:1,ease:Power4.easeOut},"-=0.7")
	//ani_p1.to(ass002,0.7,{scaleX:1,scaleY:1,autoAlpha:1,ease:Power4.easeOut,onStart:ani_p1_f6},"-=0.6")
	//ani_p1.to(ass008,0.4,{autoAlpha:1,x:"+=20"},"-=0.6")
	//ani_p1.to(ass009,0.2,{scaleX:1,scaleY:1,autoAlpha:1},"-=0.3")
	//ani_p1.to(ass006,1,{autoAlpha:1,y:"+=30",ease:Power4.easeOut},"-=0.5")
	//ani_p1.to(ass007,1,{autoAlpha:1,y:"-=30",ease:Power4.easeOut},"-=1")
	//ani_p1.to(ass007,0,{onStart:ani_p1_f7})
	
	
	
	var ani_p1_2=new TimelineMax({repeat:-1,paused:true})
	ani_p1_2.to(ass069,0.4,{autoAlpha:1})
	ani_p1_2.to(ass070,0.4,{autoAlpha:1})
	ani_p1_2.to(ass071,0.4,{autoAlpha:1})
	ani_p1_2.to(ass071,1,{})
	ani_p1_2.to([ass069,ass070,ass071],0.3,{autoAlpha:0})
	ani_p1_2.to(ass071,0.3,{})
	
	//ani_p1_2.render(0)
	
	
	//ani_p1.play()
	function ani_p1_f8 () {
		ani_p1_2.play()
	}
	
	//console.log(pic_1.width);
	function ani_p1_f7 () {
		startNextPage()
	}
	
	var ass002Tl = new TimelineMax({repeat:-1,paused:true})
	ass002Tl.to(ass002,44,{rotation:5,ease:Power0.easeNone})
	
	function ani_p1_f6 () {
		//console.log(111111111111111);
		//TweenMax.to(ass002,0,{rotation:0})
		ass002Tl.play()
	}
	function ani_p1_f5 () {
		bhAni (yanBh[0],"flyOut",{delay:0,minTime:1,maxTime:2,ease:Power3.easeOut})
		stopBkBall()
	}

	function ani_p1_f2 ()
	{
		//变成目
		var outMinD
		var inMinD
		var r=0
		var delayT=0
		for (var i = 0; i < zhiBhArr.length; i++) {
			if(i==3 ||i==9 || i==10 || i==11 || i==12 || i==13)
			{
				delayT=0
				outMinD=90000
				inMinD=22500
				if(i==10)
				{
					inMinD=22500*0.4
				}else if(i==11){
					inMinD=22500*0.2
				}else if(i==12){
					inMinD=22500*0.5
				}else if(i==3){
					inMinD=22500*0.4
				}
				
				if(i==3) delayT=1
				
				bhAni (zhiBhArr[i],"newPoint2",{
					scale:1.5,
					minTime:1,
					maxTime:1.2,
					pScale:0.7,
					fixX:60,
					fixY:40,
					outMinD:outMinD,
					inMinD:inMinD,
					delay:0.1*i+delayT,
					newP:[newPoin["zhiOutPoint_np1_bh"+i],newPoin["zhiInPoint_np1_bh"+i]]
				})
			}else{
				r+=20
				bhAni (zhiBhArr[i],"flyOut2",{delay:0.1*i,rotation:180+r,minTime:1,maxTime:1.2})
			}
			
		}
	}
	function ani_p1_f3 () {
		//目飞走
		for (var i = 0; i < zhiBhArr.length; i++) 
		{
			bhAni (zhiBhArr[i],"flyOut",{delay:0.05*i,minTime:1,maxTime:2})
		}
		

		showBkBall ()
	}
	function ani_p1_f4 () {
		//眼进场
		//RenderBhArr = RenderBhArr.concat(yanBh)
		addRenderBh(yanBh[0])
		
		console.log(yanBh[0]);
		yanBh[0].inMinD=25000
		yanBh[0].outMinD=25000
		yanBh[0].outLineAlpha=0.3
		
		for (var i = 0; i < yanBh[0].all.length; i++) {
			
			yanBh[0].all[i].oy-=64
			
			if(Math.random()>=0.8)
			{
				yanBh[0].all[i].r=lRandomRange(5,9)
			}else{
				yanBh[0].all[i].r=lRandomRange(1,3)
			}
		}
		bhAni (yanBh[0],"flyIn2",{delay:0,minTime:1,maxTime:4})
	}
	
	//背景球=
	var bgBallObj={}
	bgBallObj.type="free"
	bgBallObj.all=[]
	bgBallObj.alpha=1
	for (var i = 0; i < 25; i++) {
		bgBallObj.all[i]={x:0,y:0,scale:1,r:10,alpha:1}
	}
	
	//console.log(ass001);
	var psef=lPsEfByLayout(bgBallObj.all,function (tl,img,i) {
		
		var tp = lAngleToVectorByP({x:320,y:1008/2},360/bgBallObj.all.length*i,600)
		var tp2 = lAngleToVectorByP({x:320,y:1008/2},360/bgBallObj.all.length*i+30,200)
		tl.to(img,0,{x:320,y:1008/2,scale:0,alpha:0})
		//tl.to(img.scale,0,{x:0,y:0},0)
		tl.to(img,1,{bezier:[{x:tp2.x,y:tp2.y}, {x:tp.x,y:tp.y}],scale:3,alpha:1,ease:Power4.easeIn})
		//tl.to(img.scale,1,{x:1.5,y:1.5,ease:Power4.easeIn},0)
		
		tl.timeScale(lRandomRange(0.1,0.5))
		
	},true)
	//
	
	
	function showBkBall () {
		if(rBgDot)
		{
			
			TweenMax.to(bgBallObj,0,{alpha:0})
			TweenMax.to(bgBallObj,1,{alpha:1})
			RenderBhArr.push(bgBallObj)
			psef.play()
		}
	}
	
	function stopBkBall () {
		if(rBgDot)
		{
			TweenMax.to(bgBallObj,1,{alpha:0,onComplete:function () {
				removeRenderBh(bgBallObj)
				psef.stop()
			}})
		}
	}
	//ani01 ()
	
	/*
	var b1=new PIXI.filters.BlurFilter()
	ass001.filters=[b1]
	b1.blur=20
	console.log(ass001);
	console.log(b1);
	
	ass001.tint=0xff0000*/
	//TweenMax.to(b1,5,{blur:999999})
	
	//空调============================================================
	var pageFdj = lPixiContainer(stage)
	lPixiSetOrigin(pageFdj,0.5,0.5,640,1008)
	
	var ass013 = lPixiTexture(imgPath+"ass013.png",pageFdj,143,248,345)
	var ass014 = lPixiTexture(imgPath+"ass014.png",pageFdj,161,706,319)
	var ass015 = lPixiTexture(imgPath+"ass015.png",pageFdj,170,123,403)
	var ass016 = lPixiTexture(imgPath+"ass060.png",pageFdj,52,776,532)
	var ass017 = lPixiTexture(imgPath+"ass017.png",pageFdj,76,173,490)
	var ass018 = lPixiTexture(imgPath+"ass018.png",pageFdj,319,639)
	var ass009_fdj = lPixiTexture(imgPath+"ass009.png",pageFdj,417,682)
	var ass059 = lPixiTexture(imgPath+"ass059.png",pageFdj,230,843)
	
	lPixiSetOrigin(ass017,0.5,0.5,490,568)
	lPixiSetOrigin(ass013,0.5,0.5,345,406)
	
	for (var i = 0; i < pageFdj.children.length; i++) {
		pageFdj.children[i].autoAlpha=0
	}
	
	lPixiBtn(ass009_fdj,function () {
		
		console.log("curPage",curPage,playBtn[curPage-1]);
		if(playBtn[curPage-1]==1)
		{
			track("观看视频(空调)")
			track2("观看视频(空调)")
			vCtrl.play(1)
			//ass009_fdj.visible=false
			
			onVideoPlay ()
		}else{
			//popSpan.innerHTML="敬请期待"
			popDiv.openPop("qd")
		}
		
	})
	
	pageFdj.onIntro=function () {
		console.log("pageFdj.onIntro");
		curPage=2
		ani_fdj.play()
		pageFdj.addChildAt(ass003,0)
		pageFdj.addChildAt(ass002,0)
		console.log(curPage);
		//TweenMax.to(ass003,0,{autoAlpha:1})
	}
	pageFdj.onOut=function () {
		isRenderBh=true
		isRenderBackDot=true
		TweenMax.to(pageFdj,0.3,{autoAlpha:0,scaleX:0.8,scaleY:0.8})
	}
	
	var ani_fdj=new TimelineMax({repeat:-0,paused:true})
	ani_fdj.to(ass017,0,{scaleX:0.8,scaleY:0.8})
	binTl1_init(ani_fdj,ass013,ass015,ass016,ass018,ass009_fdj)
	
	ani_fdj.to(pageFdj,2,{onStart:ani_fdj_f6})//飞进日
	ani_fdj.to(pageFdj,1.5,{onStart:ani_fdj_f7})//变成气
	ani_fdj.to(ass059,0.5,{autoAlpha:1},"-=0.5")
	
	ani_fdj.to(pageFdj,0.5,{})//变成气
	
	ani_fdj.to(pageFdj,1.5,{onStart:ani_fdj_f3})//变成发动机
	ani_fdj.to(ass059,0.5,{autoAlpha:0},"-=0.5")
	ani_fdj.to(pageFdj,2,{onStart:ani_fdj_f4})
	
	ani_fdj.to(ass017,2,{scaleX:1,scaleY:1,autoAlpha:1,ease:Power4.easeOut},"-=1")
	ani_fdj.to(pageFdj,0,{onStart:ani_fdj_f5})//飞走
	ani_fdj.to(ass017,0.7,{autoAlpha:0})
	
	binTl1 (1,ani_fdj,ass013,ass015,ass016,ass018,ass009_fdj,"-=0.7")
	ani_fdj.to(ass014,0.3,{autoAlpha:1},"-=1")
	
	
	function ani_fdj_f7 () {
		var riArr=[zhiBhArr[9],zhiBhArr[10],zhiBhArr[11],zhiBhArr[12],zhiBhArr[13]]
		var riNum=[9,10,11,12,13]
		addRenderBh(riArr)
		
		for (var i = 0; i < riNum.length; i++) 
		{
			//zhiBhArr[riNum[i]].inMinD=dftInMinD*2
			//zhiBhArr[riNum[i]].outMinD=dftOutMinD*2
			
			bhAni (zhiBhArr[riNum[i]],"newPoint2",{
				delay:0.05*i,
				minTime:1,
				maxTime:1.2,
				newP:[newPoin["zhiOutPoint_qi_bh"+riNum[i]],newPoin["zhiInPoint_qi_bh"+riNum[i]]]
			})
		}
	}
	
	function ani_fdj_f6 () {
		var riArr=[zhiBhArr[9],zhiBhArr[10],zhiBhArr[11],zhiBhArr[12],zhiBhArr[13]]
		var riNum=[9,10,11,12,13]
		addRenderBh(riArr)
		
		//飞进智
		for (var i = 0; i < riNum.length; i++) 
		{
			zhiBhArr[riNum[i]].inMinD=dftInMinD*2
			zhiBhArr[riNum[i]].outMinD=dftOutMinD*2
			
			bhAni (zhiBhArr[riNum[i]],"flyIn",{
				delay:0.1*i,
				minTime:1,
				maxTime:2,
				newP:[newPoin["zhiOutPoint_fdj3_bh"+riNum[i]],newPoin["zhiInPoint_fdj3_bh"+riNum[i]]]
			})
		}
	}
	
	function ani_fdj_f5 () {
		var tArr=[e5_yuanBhArr[0],zhiBhArr[10],zhiBhArr[11],zhiBhArr[12]]
		for (var i = 0; i < tArr.length; i++) {
			
			bhAni (tArr[i],"flyOut",{
				delay:0.1*i,
				minTime:0.5,
				maxTime:1,
				scale:1,
				ease:Power4.easeOut
			})
		}
	}
	
	function ani_fdj_f4 () {
		addRenderBh(e5_yuanBhArr)
		
		bhAni (e5_yuanBhArr[0],"flyIn2",{
			delay:0,
			minTime:1,
			maxTime:2,
			outMinD:dftOutMinD*5,
			inMinD:dftInMinD*5
		})
	}
	
	function ani_fdj_f3() {
		
		var tArr=[10,11,12]
		var i
		for (var j = 0; j < tArr.length; j++) {
			
			i=tArr[j]
			bhAni (zhiBhArr[i],"newPoint2",{
				delay:0.1*i,
				minTime:1,
				maxTime:2,
				scale:1,
				//outMinD:dftOutMinD,
				inMinD:dftInMinD,
				newP:[newPoin["zhiOutPoint_fdj2_bh"+i],newPoin["zhiInPoint_fdj2_bh"+i]]
			})
		}
		
		var riArr=[zhiBhArr[9],zhiBhArr[13]]
		var riNum=[9,13]
		
		for (var i = 0; i < riArr.length; i++) {
			bhAni (riArr[i],"flyOut2",{
				delay:0.1*i,
				minTime:1,
				maxTime:1.5,
				scale:1,
				rotation:210+i*180,
				ease:Power4.easeIn
			})
		}
	}
	
	function ani_fdj_f2 ()
	{
		console.log("ani_fdj_f2");
		var startR=180
		var tr
		var outMinD
		var inMinD
		for (var i = 0; i < zhiBhArr.length; i++) 
		{	
			outMinD=90000
			inMinD=22500
			tr=startR
			
			if(i==9) tr=180
			if(i==13) tr=0
			
			if(i==10 || i==11 || i==12)
			{
								
				if(i==11) inMinD*=0.4
				if(i==12) inMinD*=0.4
				
				bhAni (zhiBhArr[i],"newPoint2",{
					delay:0.1*i,
					minTime:1,
					maxTime:1.2,
					scale:2,
					outMinD:outMinD,
					inMinD:inMinD,
					newP:[newPoin["zhiOutPoint_fdj_bh"+i],newPoin["zhiInPoint_fdj_bh"+i]]
				})
				
			}else{
				bhAni (zhiBhArr[i],"flyOut2",{delay:0.01*i+0.5,minTime:1,maxTime:1.2,rotation:tr})
			}
			
			startR+=20
		}
	}
	
	function ani_fdj_f1 () 
	{
		addRenderBh(zhiBhArr)
		
		//飞进智
		for (var i = 0; i < zhiBhArr.length; i++) 
		{
			zhiBhArr[i].inMinD=dftInMinD
			zhiBhArr[i].outMinD=dftOutMinD
			
			bhAni (zhiBhArr[i],"flyIn",{delay:0.1*i,minTime:1,maxTime:2})
		}
	}
	
	//pageFdj.onIntro()
	
	//停车============================================================
	var pageTc = lPixiContainer(stage)
	lPixiSetOrigin(pageTc,0.5,0.5,640,1008)
	
	var ass061 = lPixiTexture(imgPath+"ass061.png",pageTc,229,843,113)
	var ass019 = lPixiTexture(imgPath+"ass019.png",pageTc,143,248)
	var ass020 = lPixiTexture(imgPath+"ass020.png",pageTc,148,230+10)
	var ass021 = lPixiTexture(imgPath+"ass021.png",pageTc,193,123,160)
	var ass022 = lPixiTexture(imgPath+"ass022.png",pageTc,51,766-10,532)
	var ass023 = lPixiTexture(imgPath+"ass023.png",pageTc,319,637-20,113)
	var ass009_tc = lPixiTexture(imgPath+"ass009.png",pageTc,417,682-20,113)
	var ass062 = lPixiTexture(imgPath+"ass062.png",pageTc,56,304,113)
	var ass089 = lPixiTexture(imgPath+"ass089.png",pageTc,91,629,113)
	
	lPixiSetOrigin(ass019,0.5,0.5,256,519)
	lPixiSetOrigin(ass020,0.5,0.5,344,465)
	lPixiSetOrigin(ass062,0.5,0.5,520,314)
	
	for (var i = 0; i < pageTc.children.length; i++) {
		pageTc.children[i].autoAlpha=0
	}
	
	lPixiBtn(ass009_tc,function () {
		console.log("curPage",curPage,playBtn[curPage-1]);
		if(playBtn[curPage-1]==1)
		{
			track("观看视频(自动泊车)")
			track2("观看视频(自动泊车)")
			vCtrl.play(2)
			//ass009_tc.visible=false
			
			onVideoPlay ()
		}else{
			//popSpan.innerHTML="敬请期待"
			popDiv.openPop("qd")
		}
		
	})
	
	
	var ani_tc=new TimelineMax({repeat:-0,paused:true})
	ani_tc.to(ass019,0,{rotation:lDegree2radian(90),x:950,y:840})
	//
	binTl1_init(ani_tc,ass062,ass021,ass022,ass023,ass009_tc)
	ani_tc.to(pageFdj,2,{onStart:ani_fdj_f1})//显示智
	ani_tc.to(pageFdj,2,{onStart:ani_tc_f1})//分离
	ani_tc.to(ass061,0.5,{autoAlpha:1},"-=0.5")//分离
	ani_tc.to(pageFdj,1,{onStart:ani_tc_f2})//变细
	ani_tc.to(pageFdj,0,{onStart:ani_tc_f3},"-=0.2")//门下面的
	ani_tc.to(ass019,0.1,{autoAlpha:1})
	ani_tc.to(ass019,1.5,{x:-100})
	ani_tc.to(ass061,0.2,{autoAlpha:0},"-=1")//分离
	ani_tc.to(ass019,0.5,{x:"+=5",ease:Back.easeOut})
	ani_tc.to(ass019,2,{rotation:lDegree2radian(0),bezier:[{x:268-30, y:759-30}, {x:324,y:477}],ease:Power1.easeInOut})
	ani_tc.to(ass019,0.5,{y:"+=5",ease:Back.easeOut})
	ani_tc.to(ass020,0.5,{autoAlpha:1},"-=0.5")
	ani_tc.to(pageFdj,0.5,{})
	ani_tc.to(pageFdj,0.7,{onStart:ani_tc_f4})//飞走
	ani_tc.to(ass020,0.3,{autoAlpha:0},"-=0.3")
	ani_tc.to(ass019,0.3,{autoAlpha:0},"-=0.3")
	
	binTl1(2,ani_tc,ass062,ass021,ass022,ass023,ass009_tc,"-=0.1")
	ani_tc.to(ass089,0.3,{autoAlpha:1},"-=1")
	

	function ani_tc_f4 () {
		var tArr=[tc2_BhArr[0],tc3_BhArr[0],zhiBhArr[5],zhiBhArr[6],zhiBhArr[7]]
		for (var i = 0; i < tArr.length; i++) {
			
			//tArr[i].outMinD=dftOutMinD
			//tArr[i].inMinD=dftInMinD
			
			bhAni (tArr[i],"flyOut3",{
				delay:0.1*i,
				outMinD:dftOutMinD,
				inMinD:dftInMinD,
				minTime:1,
				maxTime:1.2,
				scale:1,
				ease:Power2.easeIn
			})
		}
	}
	function ani_tc_f3 () 
	{
		addRenderBh(tc2_BhArr)
		addRenderBh(tc3_BhArr)
		

		bhAni (tc2_BhArr[0],"flyIn3",{delay:0,minTime:1,maxTime:2})
		bhAni (tc3_BhArr[0],"flyIn3",{delay:0,minTime:1,maxTime:2})
	}
	
	function ani_tc_f2 () {
		//变瘦
		var tArr=[5,6,7]
		var i
		for (var j = 0; j < tArr.length; j++) {
			
			i=tArr[j]
			bhAni (zhiBhArr[i],"newPoint2",{
				delay:0.1*i,
				minTime:1,
				maxTime:2,
				scale:1,
				//outMinD:dftOutMinD,
				inMinD:dftInMinD*10,
				newP:[newPoin["zhiOutPoint_tc2_bh"+i],newPoin["zhiInPoint_tc2_bh"+i]]
			})
		}
	}
	
	function ani_tc_f1 () {
		//分离口
		var startR=210
		var tr
		var outMinD
		var inMinD
		var indexArr=[0,1,2,3,4,11,12,13,5,6,7,8,9,10]
		for (var i = 0; i < zhiBhArr.length; i++) 
		{	
			outMinD=90000
			inMinD=22500
			tr=startR
			
			//if(i==9) tr=180
			//if(i==13) tr=0
			
			if(i==5 || i==6 || i==7)
			{
								
				if(i==11) inMinD*=0.4
				if(i==12) inMinD*=0.4
				
				zhiBhArr[i].outMinD=outMinD
				
				bhAni (zhiBhArr[i],"newPoint2",{
					delay:0.1*indexArr[i],
					minTime:1,
					maxTime:1.2,
					scale:2,
					outMinD:outMinD,
					inMinD:inMinD,
					newP:[newPoin["zhiOutPoint_tc_bh"+i],newPoin["zhiInPoint_tc_bh"+i]]
				})
				
			}else{
				bhAni (zhiBhArr[i],"flyOut2",{delay:0.1*indexArr[i],minTime:1,maxTime:1.2,rotation:tr})
			}
			
			startR-=15
		}
	}

	
	pageTc.onIntro=function () 
	{
		curPage=3
		pageTc.addChildAt(ass003,0)
		pageTc.addChildAt(ass002,0)
		ani_tc.play()
	}
	pageTc.onOut=function () 
	{
		isRenderBh=true
		isRenderBackDot=true
		TweenMax.to(pageTc,0.3,{autoAlpha:0,scaleX:0.8,scaleY:0.8})
	}
	
	//pageTc.onIntro()
	
	//音箱============================================================
	var pageYx = lPixiContainer(stage)
	lPixiSetOrigin(pageYx,0.5,0.5,640,1008)
	
	var ass024 = lPixiTexture(imgPath+"ass024.png",pageYx,141,99,360)
	var ass025 = lPixiTexture(imgPath+"ass025.png",pageYx,51,776,530)
	var ass026 = lPixiTexture(imgPath+"ass026.png",pageYx,295,616,137)
	var ass027 = lPixiTexture(imgPath+"ass027.png",pageYx,115,240,395)
	var ass009_yx= lPixiTexture(imgPath+"ass009.png",pageYx,417,661)
	var ass064= lPixiTexture(imgPath+"ass064.png",pageYx,256,843)
	var ass090= lPixiTexture(imgPath+"ass090.png",pageYx,121,702)
	
	lPixiSetOrigin(ass027,0.5,0.5,395,365)
	//lPixiSetOrigin(ass020,0.5,0.5,344,465)
	
	for (var i = 0; i < pageYx.children.length; i++) {
		pageYx.children[i].autoAlpha=0
	}
	
	lPixiBtn(ass009_yx,function () {
		console.log("curPage",curPage,playBtn[curPage-1]);
		if(playBtn[curPage-1]==1)
		{
			track("观看视频(音响)")
			track2("观看视频(音响)")
			vCtrl.play(2);
			//ass009_yx.visible=false
			
			onVideoPlay ()
		}else{
			//popSpan.innerHTML="敬请期待"
			popDiv.openPop("qd")
		}
		
	})
	
	var ani_yx = new TimelineMax({repeat:-0,paused:true})
	binTl1_init (ani_yx,ass027,ass024,ass025,ass026,ass009_yx)
	ani_yx.to(pageFdj,2,{onStart:ani_fdj_f1})//显示智
	ani_yx.to(pageFdj,2,{onStart:ani_yx_f1})//分离日
	ani_yx.to(pageFdj,2,{onStart:ani_yx_f2},"-=1")//飞进音
	ani_yx.to(ass064,1,{autoAlpha:1},"-=1")//
	ani_yx.to(pageFdj,2,{onStart:ani_yx_f3})//音飞走
	ani_yx.to(ass064,0.5,{autoAlpha:0},"-=1")//飞进音
	ani_yx.to(pageFdj,2,{onStart:ani_yx_f4},"-=0.5")//飞进产品线框
	ani_yx.to(pageFdj,0,{onStart:ani_yx_f5})//产品线框飞走
	binTl1 (3,ani_yx,ass027,ass024,ass025,ass026,ass009_yx)
	ani_yx.to(ass090,0.3,{autoAlpha:1},"-=1")

	
	function ani_yx_f5 () {
		//showBkBall()
		stopBkBall()
		var tArr=yinCpBhArr
		for (var i = 0; i < tArr.length; i++) {
			
			//tArr[i].outMinD=dftOutMinD
			//tArr[i].inMinD=dftInMinD
			
			bhAni (tArr[i],"flyOut3",{
				delay:0.1*i,
				minTime:1,
				maxTime:2,
				scale:1,
				ease:Power2.easeOut
			})
		}
	}
	
	//ani_yx.play()
	function ani_yx_f4 () {
		addRenderBh(yinCpBhArr)
		
		//飞进音
		for (var i = 0; i < yinCpBhArr.length; i++) 
		{
			yinCpBhArr[i].inMinD=dftInMinD*7
			yinCpBhArr[i].outMinD=dftOutMinD*2
			yinCpBhArr[i].rType=1
			
			for (var j = 0; j < yinCpBhArr[i].inArr.length; j++) {
				
				if(Math.random()>=0.8)
				{
					yinCpBhArr[i].inArr[j].r=lRandomRange(4,6)
				}
			}
			
			bhAni (yinCpBhArr[i],"flyIn2",{
				scale:5,
				scale:1.5,
				minTime:1,maxTime:2,
				ease:Power4.easeOut
			})
		}
	}
	function ani_yx_f3 () {
		var fArr=[
			yinBhArr[4],
			yinBhArr[2],
			yinBhArr[1],
			yinBhArr[0],
			yinBhArr[3],
			zhiBhArr[13],
			zhiBhArr[12],
			zhiBhArr[9],
			zhiBhArr[10],
			zhiBhArr[11]]
		
		
		for (var i = 0; i < fArr.length; i++) {
			bhAni (fArr[i],"flyOut2",{delay:0.1*i,minTime:1,maxTime:1.2,rotation:180+i*50})
		}
	}
	
	function ani_yx_f2 () 
	{
		showBkBall()
		addRenderBh(yinBhArr)
		
		//飞进音
		for (var i = 0; i < yinBhArr.length; i++) 
		{
			yinBhArr[i].inMinD=dftInMinD*2
			yinBhArr[i].outMinD=dftOutMinD*2
			
			bhAni (yinBhArr[i],"flyIn4",{
				delay:0.1*i,
				sScale:5,
				pScale:0.8,
				fixX:60,
				fixY:50,
				scale:1.5,
				rotation:180+i*40,
				minTime:1,maxTime:1.2,
				ease:Power4.easeOut
			})
		}
	}
	
	function ani_yx_f1 () {
		//分离日
		var startR=180
		var tr
		var outMinD
		var inMinD
		var indexArr=[0,1,2,3,4,11,12,13,5,6,7,8,9,10]
		for (var i = 0; i < zhiBhArr.length; i++) 
		{	
			outMinD=90000
			inMinD=22500
			tr=startR
			
			//if(i==9) tr=180
			//if(i==13) tr=0
			
			if(i==9 || i==10 || i==11 || i==12 || i==13)
			{
				outMinD=90000
				inMinD=22500
				if(i==10)
				{
					inMinD=22500*0.4
				}else if(i==11){
					inMinD=22500*0.2
				}
				
				bhAni (zhiBhArr[i],"newPoint2",{
					minTime:1,maxTime:1.2,
					scale:1.5,
					pScale:0.8,
					fixX:30,
					fixY:30,
					outMinD:dftOutMinD*2,
					inMinD:dftInMinD*2,
					delay:0.1*i,
					newP:[newPoin["zhiOutPoint_np2_bh"+i],newPoin["zhiInPoint_np2_bh"+i]]
				})
				
			}else{
				bhAni (zhiBhArr[i],"flyOut2",{delay:0.1*i,minTime:1,maxTime:1.2,rotation:tr})
			}
			
			startR+=20
		}
	}
	
	pageYx.onIntro=function () 
	{
		curPage=4
		pageYx.addChildAt(ass003,0)
		pageYx.addChildAt(ass002,0)
		ani_yx.play()
	}
	pageYx.onOut=function () 
	{
		//console.log(11111111111111);
		isRenderBh=true
		isRenderBackDot=true
		TweenMax.to(pageYx,0.3,{autoAlpha:0,scaleX:0.8,scaleY:0.8})
	}
	
	//pageYx.onIntro()
	
	//智能============================================================
	var pageZn = lPixiContainer(stage)
	lPixiSetOrigin(pageZn,0.5,0.5,640,1008)
	
	var ass029= lPixiTexture(imgPath+"ass029.png",pageZn,69-5,115+25)
	var ass028= lPixiTexture(imgPath+"ass028.png",pageZn,35,771)
	var ass030= lPixiTexture(imgPath+"ass030.png",pageZn,170,123)
	var ass031= lPixiTexture(imgPath+"ass031.png",pageZn,51,752)
	var ass032= lPixiTexture(imgPath+"ass032.png",pageZn,0,217)
	var ass080= lPixiTexture(imgPath+"ass080.png",pageZn,0,265)
	var ass078P=lPixiContainer(pageZn)
	var ass078= lPixiTexture(imgPath+"ass078.png",ass078P,-11,218)
	var ass078_2= lPixiTexture(imgPath+"ass078.png",ass078P,-11,218)
	var ass079= lPixiTexture(imgPath+"ass079.png",pageZn,-11,378)
	//var ass009_zn= lPixiTexture(imgPath+"ass009.png",pageZn,35,771)
	
	var ass079Ani = new TimelineMax({repeat:-1,paused:true})
	ass079Ani.to(ass079,0.1,{x:-90,ease:Power0.easeNone})
	ass079Ani.render(0)
	
	
	lPixiSetOrigin(ass032,0.5,0.5,640,464)
	lPixiSetOrigin(ass080,0.5,0.5,640,365)
	lPixiSetOrigin(ass078,0.5,0.5,689,463)
	lPixiSetOrigin(ass078_2,0.5,0.5,689,463)
	//lPixiSetOrigin(ass020,0.5,0.5,344,465)
	
	for (var i = 0; i < pageZn.children.length; i++) {
		pageZn.children[i].autoAlpha=0
	}
	
	var rdEf = lPsEfByLayout([ass078,ass078_2],function (tl,img,i) {
		tl.to(img,0,{scaleX:0.8,scaleY:0.8,autoAlpha:0})
		tl.to(img,1,{scaleX:1,scaleY:1,autoAlpha:1,ease:Sine.easeIn})
		tl.to(img,0.5,{autoAlpha:1},0)
		tl.to(img,0.5,{autoAlpha:0},1-0.5)
		return tl
	})
	
	//ass078P.autoAlpha=1
	//rdEf.play()
	
	
	
	
	//ass080.autoAlpha=1
	//ass078.autoAlpha=1
	//ass079.autoAlpha=1
	
	var ani_zn = new TimelineMax({repeat:-0,paused:true})
	ani_zn.to(ass029,0,{y:"-=50"})
	ani_zn.to(ass028,0,{y:"+=50"})
	ani_zn.to(ass019,0,{y:"+=700"})
	ani_zn.to(ass080,0,{scaleX:0.8,scaleY:0.8})
	//ani_zn.to(ass078,0,{scaleX:0.8,scaleY:0.8})
	binTl1_init (ani_zn,undefined,ass030,ass031,undefined,undefined) 
	
	ani_zn.to(pageZn,2.5,{onStart:ani_zn_f5})//显示知
	//ani_zn.to(pageZn,4,{onStart:ani_zn_f1})//留下知
	ani_zn.to(pageZn,2,{onStart:ani_zn_f2})//飞走知
	ani_zn.to(pageZn,0,{onStart:ani_zn_f3},"-=1")//飞进圆
	ani_zn.to(ass019,0,{autoAlpha:1},"-=0.5")
	ani_zn.to(ass019,1,{y:"-=700",ease:Power1.easeOut},"-=0.5")
	ani_zn.to(ass019,0.5,{y:"+=5",ease:Back.easeOut})
	ani_zn.to(ass029,0.6,{y:"+=50",autoAlpha:1},"-=0.5")
	ani_zn.to(ass028,0.6,{y:"-=50",autoAlpha:1},"-=0.6")
	ani_zn.to(ass028,2,{})
	ani_zn.to(pageZn,0,{onStart:ani_zn_f4},"-=0")//圆飞走
	ani_zn.to(ass029,0.3,{y:"-=50",autoAlpha:0})
	ani_zn.to(ass028,0.3,{y:"+=50",autoAlpha:0},"-=0.3")
	//ani_zn.to(ass019,0.3,{autoAlpha:0},"-=0.3")
	ani_zn.to(ass019,1,{rotationD:"+=90",x:289,y:454,scaleX:0.5,scaleY:0.5,ease:Power3.easeInOut},"-=0.3")
	ani_zn.to(ass080,0.5,{scaleX:1,scaleY:1,autoAlpha:1},"-=0.3")
	ani_zn.to(ass078P,0.5,{scaleX:1,scaleY:1,autoAlpha:1,onStart:ani_zn_f7},"-=0.3")
	ani_zn.to(ass079,0.5,{autoAlpha:1,onStart:ani_zn_f6},"-=0.3")
	binTl1 (4,ani_zn,undefined,ass030,ass031,undefined,undefined,"-=0.3",false) 
	
	function ani_zn_f7 () {
		rdEf.play()
	}
	
	function ani_zn_f6 () {
		ass079Ani.play()
	}
	function ani_zn_f5 () {
		
		var tArr=[zhiBhArr[0],zhiBhArr[1],zhiBhArr[2],zhiBhArr[3],zhiBhArr[4],zhiBhArr[5],zhiBhArr[6],zhiBhArr[7],zhiBhArr[8]]
		addRenderBh(tArr)
		//飞进智
		for (var i = 0; i < tArr.length; i++) 
		{
			tArr[i].inMinD=dftInMinD*2
			tArr[i].outMinD=dftOutMinD*2
			
			bhAni (tArr[i],"flyIn",{
				delay:0.1*i,minTime:1,maxTime:2,
				scale:1.5,
				newP:[newPoin["zhiOutPoint_zn_bh"+i],newPoin["zhiInPoint_zn_bh"+i]]
			})
		}
	}
	
	function ani_zn_f4 () {
		for (var i = 0; i < znYuanBhArr.length; i++) {
			
			bhAni (znYuanBhArr[i],"flyOut3",{
				delay:0.1*i,
				minTime:1,
				maxTime:1,
				alpha:0,
				scale:1,
				ease:Power2.easeIn
			})
		}
	}
	function ani_zn_f3 () {
		addRenderBh(znYuanBhArr)
		
		//飞进音
		for (var i = 0; i < znYuanBhArr.length; i++) 
		{
			znYuanBhArr[i].inMinD=dftInMinD*5
			znYuanBhArr[i].outMinD=dftOutMinD*3
			
			bhAni (znYuanBhArr[i],"flyIn5",{
				delay:0.1*i,
				sScale:5,
				scale:1.5,
				minTime:1,maxTime:1.2,
				ease:Power4.easeOut
			})
		}
	}
	
	function ani_zn_f2 () {
		for (var i = 0; i < 9; i++) 
		{	

			bhAni (zhiBhArr[i],"flyOut2",{
				minTime:1,maxTime:1.2,
				delay:0.1*i,
				rotation:180+(i)*40
			})
		}
	}
	
	function ani_zn_f1 () {
		var tr
		var outMinD
		var inMinD
		for (var i = 0; i < zhiBhArr.length; i++) 
		{	
			outMinD=90000
			inMinD=22500
			
			if(i<9)
			{
				bhAni (zhiBhArr[i],"newPoint2",{
					minTime:1,maxTime:1.2,
					scale:1.5,
					outMinD:dftOutMinD*2,
					inMinD:dftInMinD*2,
					delay:0.1*i+1.2,
					newP:[newPoin["zhiOutPoint_zn_bh"+i],newPoin["zhiInPoint_zn_bh"+i]]
				})
				
			}else{
				bhAni (zhiBhArr[i],"flyOut2",{delay:0.1*i,minTime:1,maxTime:1.2,rotation:180-(i-9)*34})
			}
			
		}
	}
	pageZn.onIntro=function () 
	{
		curPage=5
		pageZn.addChild(ass019)
		TweenMax.to(ass019,0,{autoAlpha:0,x:319+15,y:524,rotationD:180})
		//TweenMax.to(ass019,0,{autoAlpha:1,x:289,y:454,rotationD:180+90,scaleX:0.5,scaleY:0.5})
		
		pageZn.addChildAt(ass003,0)
		pageZn.addChildAt(ass002,0)
		ani_zn.play()
	}
	pageZn.onOut=function () 
	{
		//console.log(11111111111111);
		isRenderBh=true
		isRenderBackDot=true
		TweenMax.to(pageZn,0.3,{autoAlpha:0,scaleX:0.8,scaleY:0.8})
		ass079Ani.stop()
		rdEf.stop()
	}
	
	//pageZn.onIntro()
	
	//氛围灯============================================================
	var pageFwd = lPixiContainer(stage)
	lPixiSetOrigin(pageFwd,0.5,0.5,640,1008)
	
	var ass033= lPixiTexture(imgPath+"ass033.png",pageFwd,203,843)
	var ass034= lPixiTexture(imgPath+"ass034.png",pageFwd,0,219)
	var ass034_2= lPixiTexture(imgPath+"ass034_2.png",pageFwd,0,219)
	var ass035= lPixiTexture(imgPath+"ass035.png",pageFwd,320,124)
	var ass036= lPixiTexture(imgPath+"ass036.png",pageFwd,51,751+20)
	ass035.anchor.x = 0.5;
	//TweenMax.to(ass035,4,{rotationD:360,repeta:-1})
	lPixiSetOrigin(ass033,0.5,0.5,234,71)
	lPixiSetOrigin(ass034,0.5,0.5,640,461)
	//var ass009_fwd= lPixiTexture(imgPath+"ass009.png",pageFwd,417,661)
	
	//lPixiSetOrigin(ass027,0.5,0.5,395,365)
	//lPixiSetOrigin(ass020,0.5,0.5,344,465)
	
	
	for (var i = 0; i < pageFwd.children.length; i++) {
		pageFwd.children[i].autoAlpha=0
	}
	
	var ass034_2_tl = new TimelineMax({repeat:-1,paused:true})
	ass034_2_tl.to(ass034_2,1,{autoAlpha:1})
	ass034_2_tl.to(ass034_2,1,{autoAlpha:0})
	ass034_2_tl.render(0)
	
	
	var ani_fwd = new TimelineMax({repeat:-0,paused:true})
	binTl1_init (ani_fwd,ass034,ass035,ass036,undefined,undefined)
	ani_fwd.to(ass033,0,{scaleX:2,scaleY:2})
	ani_fwd.to(pageZn,3,{onStart:ani_fdj_f1})//显示智
	ani_fwd.to(pageZn,2,{onStart:ani_fwd_f1})//变64
	ani_fwd.to(pageZn,0.5,{onStart:ani_fwd_f2})//变色
	ani_fwd.to(ass033,0.5,{scaleX:1,scaleY:1,autoAlpha:1,ease:Power3.easeOut},"-=0.5")
	ani_fwd.to(pageZn,5,{onStart:ani_fwd_f3},"-=0.3")//变色
	ani_fwd.to(ass033,0.3,{autoAlpha:0})
	ani_fwd.to(pageZn,0,{onStart:ani_fwd_f4})//飞走64
	binTl1 (5,ani_fwd,ass034,ass035,ass036,undefined,undefined,"-=0.3",false)
	ani_fwd.to(pageZn,0,{onStart:ani_fwd_f5})//飞走64
	
	function binTl1_init (tl,chanpin,copy1,copy2,zhizhen,playB)
	{
		tl.to(ass003,0,{autoAlpha:0})
		tl.to(ass002,0,{scaleX:3,scaleY:3,autoAlpha:0})
		if(chanpin!=undefined) tl.to(chanpin,0,{scaleX:2,scaleY:2})
		tl.to(copy1,0,{y:"-=30"})
		tl.to(copy2,0,{y:"+=30"})
		if(zhizhen!=undefined) tl.to(zhizhen,0,{x:"-=20"})
		if(playB!=undefined) tl.to(playB,0,{scaleX:0.5,scaleY:0.5})
	}

	function binTl1 (tid,tl,chanpin,copy1,copy2,zhizhen,playB,timeFix,glob) {
		console.log("curPage",curPage);
		if(glob==undefined) glob=true
		
		if(chanpin!=undefined) tl.to(chanpin,0.7,{scaleX:1,scaleY:1,autoAlpha:1,ease:Power4.easeOut},timeFix)
		if(glob==true) tl.to(ass003,0.7,{autoAlpha:1,ease:Power4.easeOut},"-=0.7")
		if(glob==true)tl.to(ass002,0.7,{scaleX:1,scaleY:1,autoAlpha:1,ease:Power4.easeOut,onStart:ani_p1_f6},"-=0.6")
		if(playBtn[tid]==1)
		{
			if(zhizhen!=undefined) tl.to(zhizhen,0.4,{autoAlpha:1,x:"+=20"},"-=0.6")
			if(playB!=undefined) tl.to(playB,0.2,{scaleX:1,scaleY:1,autoAlpha:1},"-=0.3")
		}
		tl.to(copy1,1,{autoAlpha:1,y:"+=30",ease:Power4.easeOut},"-=0.5")
		tl.to(copy2,1,{autoAlpha:1,y:"-=30",ease:Power4.easeOut},"-=1")
		tl.to(ass007,0,{onStart:ani_p1_f7})//显示下一页
	}
	
	function ani_fwd_f5 () {
		ass034_2_tl.play()
	}
	
	function ani_fwd_f4 () {
		TweenMax.to(colorDiv,0.3,{backgroundColor:"#000000",onUpdate:colorUpdate})
		stopBkBall()
		for (var i = 0; i < zhiBhArr.length; i++) {
			
			bhAni (zhiBhArr[i],"flyOut3",{
				delay:0,
				minTime:1,
				maxTime:2,
				scale:1,
				ease:Power2.easeOut
			})
		}
	}
	var colorDiv=lDiv(undefined,0,0,100,100,"#000000")
	
	function colorUpdate () {
		curFillColor=rgb2hex(colorDiv.style.backgroundColor,"0x")
	}
	function ani_fwd_f3 () {
		TweenMax.to(colorDiv,5,{backgroundColor:"hsl(+=360, +=0%, +=0%)",onUpdate:colorUpdate})
	}
	function ani_fwd_f2 () {
		TweenMax.to(colorDiv,0.5,{backgroundColor:"#0000ff",onUpdate:colorUpdate})
		showBkBall()
	}
	function rgb2hex(rgb,symbol) {
		if(symbol==undefined) symbol="#"
		if (rgb.charAt(0) == '#') return rgb;

		var ds = rgb.split(/\D+/);
		var decimal = Number(ds[1]) * 65536 + Number(ds[2]) * 256 + Number(ds[3]);
		var s = decimal.toString(16);
		while (s.length < 6)
			s = "0" + s;
			
		return symbol + s;
	}
	
	function ani_fwd_f1 () {
		//[1,2,3,5,7,8,9,10,12,13]
		//0,4,6,12
		var tr
		for (var i = 0; i < zhiBhArr.length; i++) 
		{	
			if(i!=0 && i!=4  && i!=6 && i!=10 && i!=11)
			{
				bhAni (zhiBhArr[i],"newPoint2",{
					minTime:1,maxTime:1.2,
					scale:1.5,
					outMinD:dftOutMinD*2,
					inMinD:dftInMinD*2,
					delay:0.03*i,
					newP:[newPoin["zhiOutPoint_fwd_bh"+i],newPoin["zhiInPoint_fwd_bh"+i]]
				})
				
			}else{
				bhAni (zhiBhArr[i],"flyOut3",{delay:0,minTime:1,maxTime:1.2,rotation:180-(i-9)*34})
			}
			
		}
		
	}
	pageFwd.onIntro=function () 
	{
		curPage=6
		pageFwd.addChildAt(ass003,0)
		pageFwd.addChildAt(ass002,0)
		ani_fwd.play()
	}
	pageFwd.onOut=function () 
	{
		//console.log(11111111111111);
		isRenderBh=true
		isRenderBackDot=true
		TweenMax.to(pageFwd,0.3,{autoAlpha:0,scaleX:0.8,scaleY:0.8})
		ass034_2_tl.stop()
	}
	
	//pageFwd.onIntro()
	
	//end============================================================
	var pageEnd = lPixiContainer(stage)
	lPixiSetOrigin(pageEnd,0.5,0.5,640,1008)
	
	pageEnd.interactive=false
	console.log(pageEnd);
	
	var ass037= lPixiTexture(imgPath+"ass037.png",pageEnd,246,234)
	var ass038= lPixiTexture(imgPath+"ass038.png",pageEnd,535-50,579)
	var ass039= lPixiTexture(imgPath+"ass039.png",pageEnd,231,650)
	
	var ass040 = lPixiTexture(imgPath+"ass040.png",pageEnd,0,638,640)
	var ass041 = lPixiTexture(imgPath+"ass041.png",pageEnd,126,116,371)
	var ass042 = lPixiTexture(imgPath+"ass042.png",pageEnd,45,915-40,240)
	var ass082 = lPixiTexture(imgPath+"ass082.png",pageEnd,421,915-40,240)
	var ass100 = lPixiTexture(imgPath+"ass100.png",pageEnd,233,915-40,240)
	var ass043 = lPixiTexture(imgPath+"ass088.png",pageEnd,27,481,645)
	var ass044 = lPixiTexture(imgPath+"ass044.png",pageEnd,132,767-60,537)
	var ass045 = lPixiTexture(imgPath+"ass045.png",pageEnd,126,489-30,390)
	var ass081 = lPixiTexture(imgPath+"ass081.png",pageEnd,135,767-30,390)
	
	lPixiSetOrigin(ass045,0.5,0.5,390,231)
	lPixiSetOrigin(ass043,0.5,0.5,595,256)
	
	for (var i = 0; i < pageEnd.children.length; i++) {
		pageEnd.children[i].autoAlpha=0
	}
	
	lPixiBtn(ass042,function () {
		track("免费领取")
		popDiv2.openPop("bd")
		ass042.lDeactive()
		onBd=true
	})
	
	lPixiBtn(ass100,function () {
		track("先睹为快")
		track2("先睹为快")
		//popDiv.openPop("qd")
		vCtrl.play(4)
		onVideoPlay ()
	})
	lPixiBtn(ass082,function () {
		track("分享")
		//popDiv2.openPop("bd")
		//ass042.lDeactive()
		popDiv.openPop("share","tra")
	})
	
	var share = lDiv(undefined,0,0,640,1008,"rgba(0,0,0,0)")
	var ass083 = lImg(imgPath+"ass083.png",share,191,0)
	lBtn(share,function () {
		track("关闭share")
		popDiv.close("tra")
	})
	
	
	
	var ani_end = new TimelineMax({repeat:-0,paused:true})
	ani_end.to(ass037,0,{y:"-=100"})
	ani_end.to(ass038,0,{x:"+=100"})
	ani_end.to(ass039,0,{y:"+=100"})
	ani_end.to(ass040,0,{y:"+=100"})
	ani_end.to(ass043,0,{x:"-=200",y:"-=40"})
	ani_end.to(ass081,0,{y:"+=100"})
	ani_end.to([ass042,ass082,ass100],0,{y:"+=100"})
	ani_end.to(ass045,0,{scaleX:2,scaleY:2})
	
	ani_end.to(ass037,1,{y:"+=100",autoAlpha:1,ease:Power4.easeOut})
	ani_end.to(pageZn,1.5,{onStart:ani_end_f1},"-=1")//显103
	ani_end.to(ass038,1,{x:"-=100",autoAlpha:1,ease:Power4.easeOut})
	ani_end.to(ass039,1,{y:"-=100",autoAlpha:1,ease:Power4.easeOut},"-=0.7")
	ani_end.to(ass039,1,{})
	ani_end.to([ass037,ass038,ass039],0.5,{autoAlpha:0})
	ani_end.to(pageZn,0.1,{onStart:ani_end_f2},"-=1")//消失103
	ani_end.to(pageZn,3,{onStart:ani_fdj_f1})//显示智
	ani_end.to(pageZn,0.7,{onStart:ani_end_f3})
	ani_end.to(ass040,1,{y:"-=100",autoAlpha:1,ease:Power4.easeOut})
	ani_end.to(ass043,0.8,{x:"+=200",y:"+=40",autoAlpha:1,ease:Power2.easeOut,onComplete:ani_end_f4},"-=0.7")
	ani_end.to(ass081,0.7,{y:"-=100",autoAlpha:1,ease:Power4.easeOut},"-=0.5")
	ani_end.to([ass042,ass082,ass100],0.7,{y:"-=100",autoAlpha:1,ease:Power4.easeOut},"-=0.6")
	ani_end.to(ass039,3,{})
	ani_end.to(ass081,0.3,{autoAlpha:0},"-=0.3")
	ani_end.to(ass045,0.5,{scaleX:1,scaleY:1,autoAlpha:1,ease:Power4.easeOut},"-=0.2")
	
	ani_end.to(ass043,0.5,{scaleX:0.5,scaleY:0.5,autoAlpha:0,ease:Power4.easeOut},"-=0.5")
	ani_end.to(ass044,0.3,{autoAlpha:1},"-=0.5")
	
	//ani_end.to(pageZn,3,{onStart:ani_end_f4})
	
	function ani_end_f4 () {
		TweenMax.to(ass043,0.5,{x:"-=2",y:"-=0.4",ease:Back.easeOut})
	}
	function ani_end_f3 () {
		TweenMax.to(mBtn,0.3,{autoAlpha:0})
		for (var i = 0; i < zhiBhArr.length; i++) 
		{
			bhAni (zhiBhArr[i],"move",{
				delay:0.02*i,
				rotation:-90,
				tR:140,
				minTime:1,
				maxTime:1.2,
				ease:Power3.easeInOut
			})
		}
	}
	
	function ani_end_f2 () {
		for (var i = 0; i < end103BhArr.length; i++) 
		{
			bhAni (end103BhArr[i],"flyOut3",{delay:0,minTime:1,maxTime:2})
		}
	}
	
	function ani_end_f1 () {
		addRenderBh(end103BhArr)
		
		//飞进智
		for (var i = 0; i < end103BhArr.length; i++) 
		{
			end103BhArr[i].inMinD=dftInMinD*2
			end103BhArr[i].outMinD=dftOutMinD
			
			if(i==1)
			{
				bhAni (end103BhArr[i],"flyIn2",{delay:0.4*i,minTime:1,maxTime:2,fixX:100})
			}else{
				bhAni (end103BhArr[i],"flyIn2",{delay:0.4*i,minTime:1,maxTime:2})
			}
			
		}
	}
	
	pageEnd.onIntro=function () 
	{
		curPage=7
		//pageFwd.addChildAt(ass003,0)
		//pageFwd.addChildAt(ass002,0)
		ani_end.play()
	}
	pageEnd.onOut=function () 
	{
		//console.log(11111111111111);
		isRenderBh=true
		isRenderBackDot=true
		//TweenMax.to(pageEnd,0.3,{autoAlpha:0,scaleX:0.8,scaleY:0.8})
	}
	
	//pageEnd.onIntro()
	
	/*var interactvD=lPixiGraphics(stage,0,0)
	interactvD.beginFill(0xFF700B, .1);
	interactvD.drawRect(0, 0, 640, 1040);
	interactvD.interactive=true
	interactvD.buttonMode=true*/
	
	//biandan============================================================
	var biaodan=lDiv(mainDiv,0,0,640,1008)
	var ass046 = lImg(imgPath+"ass046.png",biaodan,72,126,496)
	var ass048 = lImg(imgPath+"ass048.png",biaodan,118-1,275+2,399)
	var ass049 = lImg(imgPath+"ass050.png",biaodan,217,337,18)
	var ass050 = lImg(imgPath+"ass050.png",biaodan,300,337,18)
	var ass049_s = lImg(imgPath+"ass049.png",biaodan,217,337,18)
	var ass050_s = lImg(imgPath+"ass049.png",biaodan,300,337,18)
	var ass051 = lImg(imgPath+"ass051.png",biaodan,183+30,588,17)
	var ass052_1 = lImg(imgPath+"ass052_1.png",biaodan,186+30,593,13)
	var ass047 = lImg(imgPath+"ass047.png",biaodan,266,861-82,112)
	var ass052 = lImg(imgPath+"ass052.png",biaodan,214,768-80,248)
	var ass053 = lImg(imgPath+"ass053.png",biaodan,256,195,128)
	
	var biaodanA1=lDiv(biaodan,111,574,90,50,"rgba(255,0,0,0.0)")
	
	lBtn(biaodanA1,function () {
		track("隐私条款")
		
		//popSpan2.innerHTML="我仔细阅读了并接受所附的隐私条款，并且我同意其他戴姆勒集团公司及/或北京梅赛德斯-奔驰销售服务有限公司及/或授权经销商收集、使用、分享我的私人信息；同时我同意北京梅赛德斯-奔驰销售服务有限公司和/或梅赛德斯-奔驰（中国）汽车销售有限公司向我发送相关市场或营销资料。"
		popDiv.openPop("text2")
		

	})
	

	
	//ass049_s.hide()
	ass050_s.hide()
	
	var curSex="男"
	lAddClickArea(ass049,30)
	lAddClickArea(ass050,30)
	lBtn(ass049,function () {
		track("选择男")
		ass049_s.show()
		ass050_s.hide()
		curSex="男"
	},"none","none")
	
	lBtn(ass050,function () {
		track("选择女")
		ass049_s.hide()
		ass050_s.show()
		curSex="女"
	},"none","none")
	
	lAddClickArea(ass051,20)
	var ystk=false
	ass052_1.hide()
	lBtn(ass051,function () {
		track("隐私条款")
		if(ystk)
		{
			ass052_1.hide()
		}else{
			ass052_1.show()
		}
		ystk=!ystk
	},"none","none")
	
	var ipw=290
	var ip1 = lInput("",biaodan,219,274+7,undefined,25,"#fff")
	ip1.id="username"
	ip1.style.width=ipw+"px"
	ip1.style.background="none"
	ip1.style.border="none"
	ip1.placeholder=""
	ip1.iosPFix()
	ip1.maxLength=10
	
	var ip2 = lInput("",biaodan,219,373+6,undefined,25,"#fff")
	ip2.id="phone"
	ip2.style.width=ipw+"px"
	ip2.style.background="none"
	ip2.style.border="none"
	ip2.placeholder=""
	ip2.iosPFix()
	ip2.maxLength=11
	
	var ip3 = lInput("",biaodan,219,525+5,undefined,25,"#fff")
	ip3.id="send_address"
	ip3.style.width=ipw+"px"
	ip3.style.background="none"
	ip3.style.border="none"
	ip3.placeholder=""
	ip3.iosPFix()
	ip3.maxLength=50
	
	var xl1 = lSelect(["请选择",1],biaodan,213,425,117,41,20,"#000")
	xl1.addEventListener("change",function () {
		console.log(xl1.selectedIndex);//当前id
		console.log(xl1.options[xl1.selectedIndex].text)//当前选项文案
	})
	xl1.id="proname"
	xl1.name="pro"
	
	var xl2 = lSelect(["请选择",1],biaodan,381,425,136,41,20,"#000")
	xl2.addEventListener("change",function () {
		console.log(xl1.selectedIndex);//当前id
		console.log(xl1.options[xl1.selectedIndex].text)//当前选项文案
	})
	xl2.id="cityname"
	xl2.name="city"
	
	var xl3 = lSelect(["请选择",1],biaodan,213,474,304,43,20,"#000")
	xl3.addEventListener("change",function () {
		console.log(xl1.selectedIndex);//当前id
		console.log(xl1.options[xl1.selectedIndex].text)//当前选项文案
	})
	xl3.id="dealername"
	xl3.name="delay"
	
	
	var popDiv2 = lPop(mainDiv,640,1040)
	popDiv2.addPop(biaodan,"bd")
	//popDiv2.openPop("bd")
	
	var popDiv = lPop(mainDiv,640,1040)
	popDiv.addPop(share,"share")
	
	var txtPop = lDiv(undefined,"50%","50%",496,360)
	TweenMax.to(txtPop,0,{x:"-50%",y:"-50%"})
	var ass054 = lImg(imgPath+"ass054.png",txtPop,0,0,496)
	
	var ass047c = lImg(imgPath+"ass047.png",txtPop,"50%","100%",112)
	TweenMax.to(ass047c,0,{x:"-50%",y:"-50%"})
	
	var popSpan = lSpan("内容",txtPop,"10%",150-3,26,"#000")
	popSpan.style.width="80%"
	popSpan.style.textAlign="center"
	popSpan.style.lineHeight="36px"//行距
	popSpan.style.letterSpacing="3px"//字间距
	
	lBtn(ass047c,function () {
		popDiv.close()
		onBd=false
	})
	
	popDiv.addPop(txtPop,"text")
	
	//期待
	var qdPop = lDiv(mainDiv,0,0,640,1008,"rgba(0,0,0,0)")
	var ass099 = lImg(imgPath+"ass099.png",qdPop,0,280)
	var ass047c2 = lImg(imgPath+"ass047.png",qdPop,"50%",590)
	TweenMax.to(ass047c2,0,{x:"-50%"})
	
	lBtn(qdPop,function () {
		popDiv.close()
	})
	
	popDiv.addPop(qdPop,"qd")

	
	addTxtP2 ()
	//var popSpan2
	function addTxtP2 () {
		var txtPop = lDiv(undefined,"50%","50%",496,400)
		TweenMax.to(txtPop,0,{x:"-50%",y:"-50%"})
		var ass054 = lImg(imgPath+"ass054.png",txtPop,0,0,496,400)
		
		var ass047c = lImg(imgPath+"ass047.png",txtPop,"50%","100%",112)
		TweenMax.to(ass047c,0,{x:"-50%",y:"-50%"})
		/*
		popSpan2 = lSpan("",txtPop,"10%","50%",20,"#000")
		TweenMax.to(popSpan2,0,{y:"-50%"})
		popSpan2.innerHTML="我仔细阅读了并接受所附的隐私条款，并且我同意其他戴姆勒集团公司及/或北京梅赛德斯-奔驰销售服务有限公司及/或授权经销商收集、使用、分享我的私人信息；同时我同意北京梅赛德斯-奔驰销售服务有限公司和/或梅赛德斯-奔驰（中国）汽车销售有限公司向我发送相关市场或营销资料。"
		popSpan2.style.width="80%"
		popSpan2.style.textAlign="center"
		popSpan2.style.lineHeight="30px"//行距
		popSpan2.style.letterSpacing="3px"//字间距*/
		
		var ass102 = lImg(imgPath+"ass102.png",txtPop,"50%","50%")
		TweenMax.to(ass102,0,{x:"-50%",y:"-50%"})
		
		popDiv.addPop(txtPop,"text2")
		
		lBtn(ass047c,function () {
			popDiv.close()
		})
	}
	addTxtP3 ()
	function addTxtP3 () {
		var txtPop = lDiv(undefined,"50%","50%",496,360)
		TweenMax.to(txtPop,0,{x:"-50%",y:"-50%"})
		var ass054 = lImg(imgPath+"ass054.png",txtPop,0,0,496)
		
		var ass047c = lImg(imgPath+"ass047.png",txtPop,"50%","100%",112)
		TweenMax.to(ass047c,0,{x:"-50%",y:"-50%"})
		
		var ass101 = lImg(imgPath+"ass101.png",txtPop,"50%","50%")
		TweenMax.to(ass101,0,{x:"-50%",y:"-50%"})
		
		popDiv.addPop(txtPop,"com")
		
		lBtn(ass047c,function () {
			popDiv.close()
		})
	}
	
	//popDiv.openPop("com")
	
	dbInit()
	
	
	
	lBtn(ass052,function () {
		track("提交")
		if(ip1.value=="")
		{
			popSpan.innerHTML="请输入姓名"
			popDiv.openPop("text")
		}else if(ip2.value=="")
		{
			popSpan.innerHTML="请输入手机号码"
			popDiv.openPop("text")
		}else if(ip3.value=="")
		{
			popSpan.innerHTML="请输入邮寄地址"
			popDiv.openPop("text")
		}else if(xl1.selectedIndex==0)
		{
			popSpan.innerHTML="请选择省份"
			popDiv.openPop("text")
		}else if(xl2.selectedIndex==0)
		{
			popSpan.innerHTML="请选择城市"
			popDiv.openPop("text")
		}else if(xl3.selectedIndex==0)
		{
			popSpan.innerHTML="请选择经销商"
			popDiv.openPop("text")
		}else if(ystk==false)
		{
			popSpan.innerHTML="请勾选隐私条款"
			popDiv.openPop("text")
		}else if(lIsPhoneNum(ip2.value)==false)
		{
			popSpan.innerHTML="请输入正确的手机号码"
			popDiv.openPop("text")
		}else{
			track2("填写信息_提交",ip1.value,ip2.value)
			gotoAjax()
			
		}
	})
	
	function gotoAjax() {
		$.ajax({
			type: 'post',
			url: 'http://special.mercedes-benz.com.cn/thenewe-classteaser/test/submit_testdrive.php?id=' + Math.round(),
			data: {
				username: ip1.value,
				mysex: curSex,
				phone: ip2.value,
				province: xl1.options[xl1.selectedIndex].text,
				city: xl2.options[xl2.selectedIndex].text,
				dealer: xl3.options[xl3.selectedIndex].text,
				send_address: ip3.value,
				userfrom: 'mobile'
			},
			cache: false,
			dataType: 'text',
			success: function(data) {
				var mydate = eval("(" + data + ")");
				//alert(mydate.code);
				if (mydate.code == 1) {
					$("#phone").val('');
					$("#username").val('');
					$("#send_address").val('');
					var json = {
						GetType: "province"
					};
					initdata($("select[id=proname]"), json);
					$("select[id=dealername]").empty(); //清空经销商
					$("<option></option>").text("请选择").val("").appendTo($("select[id=dealername]"));
					$("select[id=cityname]").empty(); //清空城市
					$("<option></option>").text("请选择").val("").appendTo($("select[id=cityname]"));
					//alert("提交成功");
					
					//popSpan2.innerHTML="您的信息已提交，我们将会与前1000名注册用户联系VR眼镜发放事宜。<br>全新梅赛德斯-奔驰长轴距E级车预售现已开启。更多详情，敬请莅临梅赛德斯-奔驰当地授权经销商，或致电400-810-8880。 "
					popDiv.openPop("com")
					
				} else {
					// alert("数据提交失败");
					alert(mydate.msg);
				}
			}
		});
	}
	
	
	
	lBtn(ass047,function () {
		track("关闭注册领取")
		popDiv2.close()
		
		TweenMax.delayedCall(0.5,function () {
			ass042.lActive()
		})
		
	})
	
	//========================================================
	
	var ass011 = lPixiTexture(imgPath+"ass011.png",stage,33,24,235)
	var ass067 = lPixiTexture(imgPath+"ass067.png",stage,507,34)
	var ass010 = lPixiTexture(imgPath+"ass010.png",stage,292,924-30,57)
	var ass066 = lPixiTexture(imgPath+"ass066.png",stage,551,85-15,57)
	var ass065 = lPixiTexture(imgPath+"ass065.png",stage,551,160-20,57)
	
	lPixiBtn(ass066,function () {
		track("右上角眼睛")
		popDiv2.openPop("bd")
		onBd=true
	})
	lPixiBtn(ass065,function () {
		track("返回首页")
		lNavToUrlWithFillout("index.html?r="+Math.random())
	})
	
	//ass010.on('mouseup', onNexp)
	//ass010.on('touchend', onNexp)
	var pageArr=[page0,page1,pageFdj,pageTc,pageYx,pageZn,pageFwd,pageEnd]
	
	lPixiBtn(ass010,onNexp)
	
	function videoClose () {
		vCtrl.closeVideo()
		vDiv.hide()
		console.log(userM);
		if(userM==true)
		{
			mBtn.play()
		}
		lPixiBtnEnable=true
	}
	function onNexp () {
		
		console.log("onNexp",curPage);
		if(curPage==0)
		{
			ani_home.stop()
			ani_p1.play()
			
			track("首页进入")
		}
		
		videoClose()
		
		stopNextPage()
		if(pageArr[curPage]!=undefined)
		{
			if(pageArr[curPage]["onOut"]!=undefined) pageArr[curPage].onOut()
		}
		
		curPage++
		if(pageArr[curPage]!=undefined)
		{
			if(pageArr[curPage]["onIntro"]!=undefined) pageArr[curPage].onIntro()
		}
		
	}
	
	
	
	var nextPage=false
	stopNextPage (0)
	

	function startNextPage (time) {
		if(time==undefined) time=1
		nextPage=true
		TweenMax.to(ass010,0,{autoAlpha:0,y:924+50-20})
		TweenMax.to(ass010,time,{autoAlpha:1,y:924-20,ease:Power4.easeOut})
		canNextPage=true
	}
	function stopNextPage (time) {
		if(time==undefined) time=1
		nextPage=false
		//TweenMax.to(ass010,0,{autoAlpha:0,y:924+50})
		TweenMax.to(ass010,time,{autoAlpha:0,y:924+50-20,ease:Power4.easeOut})
		canNextPage=false
	}
	
	//滑动=============
	var hmCtrlObj1 = new Hammer(mainDiv);
	//将会设置所有的'swipe'事件，而不是只是目标div
	hmCtrlObj1.get('swipe').set({ direction: Hammer.DIRECTION_ALL,velocity:0.1});
	
	var canNextPage = false
	hmCtrlObj1.on('swipeup', onSwipeup);
	
	function onSwipeup () {
		if(canNextPage)
		{
			console.log("滑动");
			onNexp ()
		}
	}

	
	//fun============================================================
	
	//生成数据
	function binBhData (outArr,inArr,tname) {
		
		var rArr=[]
		
		explainTxt(outArr)
		explainTxt(inArr)
		
		for (var i = 0; i < outArr.length; i++) {
			var bh={}
			bh.tName=tname+"_"+i
			//console.log(bh.tName);
			bh.outArr=outArr[i];
			bh.inArr=inArr[i];
			bh.all=bh.outArr.concat(bh.inArr);
			
			bh.index=i;
			bh.total=outArr.length;
			bh.alpha=1
			bh.rType=0//连线类型
			
			//链接线的最短距离
			bh.inMinD=dftInMinD
			bh.outMinD=dftOutMinD
			
			//默认线透明度
			bh.inLineAlpha=0.1
			bh.outLineAlpha=0.2
			
			bh.alpha=1
			
			//内框
			for (var j = 0; j < bh.inArr.length; j++) {
				bh.inArr[j].r=lRandomRange(1,1)

				bh.inArr[j].scale=1
				bh.inArr[j].alpha=1
				bh.inArr[j].ox=bh.inArr[j].x
				bh.inArr[j].oy=bh.inArr[j].y
				bh.inArr[j].type="in"
				
			}
			
			//外框
			for (var j = 0; j < bh.outArr.length; j++) {

				if(Math.random()>=0.8)
				{
					bh.outArr[j].r=lRandomRange(4,6)
				}else{
					bh.outArr[j].r=lRandomRange(1,3)
				}
				
				bh.outArr[j].scale=1
				bh.outArr[j].alpha=1
				bh.outArr[j].ox=bh.outArr[j].x
				bh.outArr[j].oy=bh.outArr[j].y
				bh.outArr[j].type="out"
			}
			
			rArr.push(bh)
			//RenderBhArr.push(bh)
		}
		return rArr
		
	}
	
	//删除渲染数组
	function removeRenderBh (tArr) {
		lDelElmFArr(tArr,RenderBhArr)
		console.log("删除"+tArr.tName);
	}
	//增加到渲染数组
	function addRenderBh (tObj) {
		
		if(lTyepof(tObj)=="Array")
		{
			for (var i = 0; i < tObj.length; i++) {
				addArr(tObj[i])
			}
		}else{
			addArr (tObj)
		}
		
		function addArr (tArr) {
			if(RenderBhArr.indexOf(tArr)==-1)
			{
				//console.log(tArr);
				RenderBhArr.push(tArr)
			}
		}
	}
	
	var ooobj={
	}
	
	//console.log(lAngleToVectorByP({x:320,y:1008/2},0,100));
	
	//动画控制
	function bhAni (bhArr,type,op) {
		
		var tEase
		var ease
		if(op.ease!=undefined) ease=op.ease
		
		var rotation
		if(op.rotation!=undefined) rotation=op.rotation
		
		var scale=1
		if(op.scale!=undefined) scale=op.scale
		
		if(op.sScale==undefined) op.sScale=1
		
		if(op.tR==undefined) op.tR=0
		
		if(op.fixX==undefined) op.fixX=0
		if(op.fixY==undefined) op.fixY=0
		if(op.pScale==undefined) op.pScale=1
		
		var minTime=1
		if(op.minTime!=undefined) minTime=op.minTime
		
		var maxTime=4
		if(op.maxTime!=undefined) maxTime=op.maxTime
		
		var delay=0
		if(op.delay!=undefined) delay=op.delay
		
		var newP
		if(op.newP!=undefined)
		{
			newP=explainTxt(op.newP[0])
			newP = newP.concat(explainTxt(op.newP[1]))
			
			//console.log(newP.length);
			for (var i = 0; i < newP.length; i++) {
				
				if(op.fixY!=undefined)
				{
					//console.log(11111111111);
					newP[i].y+=op.fixY
				}
				if(op.fixX!=undefined)
				{
					//console.log(11111111111);
					newP[i].x+=op.fixX
				}
			}
			//console.log(newP);
		}
		
		//外部连线最短距离变化
		var outMinD=0
		if(op.outMinD!=undefined)
		{
			outMinD=op.outMinD
			if(bhArr.outMinD==undefined) bhArr.outMinD=dftOutMinD
			TweenMax.to(bhArr,maxTime,{delay:delay,outMinD:outMinD,ease:Power0.easeNone})
		}
		
		//内部连线最短距离变化
		var inMinD=0
		if(op.inMinD!=undefined)
		{
			inMinD=op.inMinD
			if(bhArr.inMinD==undefined) bhArr.inMinD=dftInMinD
			TweenMax.to(bhArr,maxTime,{delay:delay,inMinD:inMinD,ease:Power0.easeNone})
		}
		
		
		//console.log(type);
		var tP
		var rT
		var tScale
		var nP
		if(delay==undefined) delay=0
		//flyIn,定向飞入只用与智
		//flyIn2,随机飞入
		//flyIn3,飞入中不放大
		if(type=="flyIn" || type=="flyIn2"  || type=="flyIn3" )
		{
			//console.log(type);
			//飞入
			for (var j = 0; j < bhArr.all.length; j++) 
			{
				if(type=="flyIn2" || type=="flyIn3")
				{
					tP = lAngleToVectorByP({x:320,y:1008/2},360*Math.random(),800)
				}else{
					tP = lAngleToVectorByP({x:320,y:1008/2},360/bhArr.total*bhArr.index+lRandomRange(-60,60),800)
				}
				
				if(type=="flyIn3")
				{
					tScale = 1
				}else{
					tScale = 10
				}
				
				//{x:newP[j].x,y:newP[j].y}
				
				TweenMax.to(bhArr.all[j],0,{alpha:0,scale:tScale,x:tP.x,y:tP.y})
				if(newP!=undefined)
				{
					TweenMax.to(bhArr.all[j],lRandomRange(minTime,maxTime),{delay:delay,x:newP[j].x,y:newP[j].y,ease:Power4.easeOut})
				}else{
					TweenMax.to(bhArr.all[j],lRandomRange(minTime,maxTime),{delay:delay,x:bhArr.all[j].ox+op.fixX,y:bhArr.all[j].oy,ease:Power4.easeOut})
				}
				
				TweenMax.to(bhArr.all[j],lRandomRange(minTime,minTime*1.5),{alpha:1,scale:scale,delay:delay,ease:Power2.easeOut})
			}
			
		}else if(type=="flyIn4")//整齐飞入
		{
			//console.log(type);
			//飞入
			for (var j = 0; j < bhArr.all.length; j++) 
			{
				tP = lAngleToVectorByP({x:bhArr.all[j].ox,y:bhArr.all[j].oy},rotation+lRandomRange(-30,30),lRandomRange(500,800))
				
				TweenMax.to(bhArr.all[j],0,{alpha:0,scale:op.sScale,x:tP.x,y:tP.y})
				TweenMax.to(bhArr.all[j],lRandomRange(minTime,maxTime),{
					scale:scale,
					delay:delay,
					alpha:1,
					x:bhArr.all[j].ox*op.pScale+op.fixX,
					y:bhArr.all[j].oy*op.pScale+op.fixY,
					ease:ease
				})
				//TweenMax.to(bhArr.all[j],lRandomRange(minTime,minTime*1.5),{alpha:1,scale:scale,delay:delay,ease:Power2.easeOut})
			}
			
		}else if(type=="flyIn5")//正圆飞入
		{
			//console.log(type);
			//飞入
			var tempR
			for (var j = 0; j < bhArr.all.length; j++) 
			{
				tempR=lVectorToAngleByP({x:320,y:1008*0.5},{x:bhArr.all[j].ox,y:bhArr.all[j].oy})
				tP = lAngleToVectorByP({x:320,y:1008*0.5},tempR,800)
				//console.log(tP);
				TweenMax.to(bhArr.all[j],0,{alpha:0,scale:op.sScale,x:tP.x,y:tP.y})
				TweenMax.to(bhArr.all[j],lRandomRange(minTime,maxTime),{
					scale:scale,
					delay:delay,
					alpha:1,
					x:bhArr.all[j].ox,
					y:bhArr.all[j].oy,
					ease:ease
				})
				//TweenMax.to(bhArr.all[j],lRandomRange(minTime,minTime*1.5),{alpha:1,scale:scale,delay:delay,ease:Power2.easeOut})
			}
			
		}else if(type=="flyOut")
		{
			//飞出
			//console.log(111111111111);
			for (var j = 0; j < bhArr.all.length; j++) 
			{
				if(ease==undefined)
				{
					tEase=Power4.easeIn
				}else{
					tEase=ease
				}
				rT=lRandomRange(minTime,maxTime)
				tP = lAngleToVectorByP({x:320,y:1008/2},Math.random()*360,600)
				//TweenMax.to(bhArr.all[j],0,{alpha:0,scale:10,x:lRandomRange(0-3000,640+3000),y:lRandomRange(0-3000,1008+3000)})
				TweenMax.to(bhArr.all[j],rT,{alpha:0,delay:delay,x:tP.x,y:tP.y,ease:tEase})
				TweenMax.to(bhArr.all[j],rT*0.7,{scale:2,delay:delay,ease:tEase})
			}
			TweenMax.delayedCall(maxTime+delay,function () {
				removeRenderBh(bhArr)
				
			})
			
			
			
		}else if(type=="flyOut2")
		{
			//有规律的飞出
			//console.log(111111111111);
			for (var j = 0; j < bhArr.all.length; j++) 
			{
				if(ease==undefined)
				{
					tEase=Power4.easeIn
				}else{
					tEase=ease
				}
				rT=lRandomRange(minTime,maxTime)
				tP = lAngleToVectorByP({x:bhArr.all[j].ox,y:bhArr.all[j].oy},rotation,600)
				//TweenMax.to(bhArr.all[j],0,{alpha:0,scale:10,x:lRandomRange(0-3000,640+3000),y:lRandomRange(0-3000,1008+3000)})
				TweenMax.to(bhArr.all[j],rT,{alpha:1,delay:delay,x:tP.x,y:tP.y,ease:tEase})
				//TweenMax.to(bhArr.all[j],rT,{alpha:0,delay:delay,x:tP.x,y:tP.y,ease:tEase})
				//TweenMax.to(bhArr.all[j],rT*0.7,{x:tP.x,y:tP.y,delay:delay,ease:tEase})
			}
			TweenMax.delayedCall(maxTime+delay,function () {
				
				removeRenderBh(bhArr)
			})
			
		}else if(type=="flyOut3")
		{
			//有规律的飞出
			//console.log(111111111111);
			for (var j = 0; j < bhArr.all.length; j++) 
			{
				if(ease==undefined)
				{
					tEase=Power4.easeIn
				}else{
					tEase=ease
				}
				rT=lRandomRange(minTime,maxTime)
				tP = lAngleToVectorByP({x:320,y:1008/2},Math.random()*360,600)
				//TweenMax.to(bhArr.all[j],0,{alpha:0,scale:10,x:lRandomRange(0-3000,640+3000),y:lRandomRange(0-3000,1008+3000)})
				TweenMax.to(bhArr.all[j],rT,{alpha:0,scale:0,delay:delay,x:tP.x,y:tP.y,ease:tEase})
				//TweenMax.to(bhArr.all[j],rT,{alpha:0,delay:delay,x:tP.x,y:tP.y,ease:tEase})
				//TweenMax.to(bhArr.all[j],rT*0.7,{x:tP.x,y:tP.y,delay:delay,ease:tEase})
			}
			TweenMax.delayedCall(maxTime+delay,function () {
				
				removeRenderBh(bhArr)
			})
			
		}else if(type=="move")
		{
			//有规律的飞出
			//console.log(111111111111);
			for (var j = 0; j < bhArr.all.length; j++) 
			{
				if(ease==undefined)
				{
					tEase=Power4.easeIn
				}else{
					tEase=ease
				}
				rT=lRandomRange(minTime,maxTime)
				tP = lAngleToVectorByP({x:bhArr.all[j].x,y:bhArr.all[j].y},rotation,op.tR)
				//TweenMax.to(bhArr.all[j],0,{alpha:0,scale:10,x:lRandomRange(0-3000,640+3000),y:lRandomRange(0-3000,1008+3000)})
				TweenMax.to(bhArr.all[j],rT,{alpha:1,scale:scale,delay:delay,x:tP.x,y:tP.y,ease:tEase})
			}
			
		}else if(type=="newPoint"){
			//飞到新点
			//console.log(111111111111);
			for (var j = 0; j < bhArr.all.length; j++) 
			{
				rT=lRandomRange(minTime,maxTime)
				
				TweenMax.to(bhArr.all[j],rT,{
					scale:scale,
					delay:delay,
					//bezier:[{x:bhArr.all[j].x+lRandomRange(-150,150), y:bhArr.all[j].y+lRandomRange(-150,150)}, {x:newP[j].x,y:newP[j].y}],
					bezier:[{x:lRandomRange(0+150,640-150), y:lRandomRange(0+150,1008-150)}, {x:newP[j].x,y:newP[j].y}],
					ease:Power2.easeInOut
				})
			}
		}else if(type=="newPoint2"){
			//飞到新点
			//console.log(111111111111);
			console.log(op.fixY);
			for (var j = 0; j < bhArr.all.length; j++) 
			{
				rT=lRandomRange(minTime,maxTime)
				
				TweenMax.to(bhArr.all[j],rT,{
					scale:scale,
					delay:delay,
					//bezier:[{x:bhArr.all[j].x+lRandomRange(-150,150), y:bhArr.all[j].y+lRandomRange(-150,150)}, {x:newP[j].x,y:newP[j].y}],
					x:newP[j].x*op.pScale+op.fixX,
					y:newP[j].y*op.pScale+op.fixY,
					ease:Power2.easeInOut
				})
			}
		}else if(type=="bomb"){
			//飞到新点
			//console.log(111111111111);
			for (var j = 0; j < bhArr.all.length; j++) 
			{
				rT=lRandomRange(minTime,maxTime)
				TweenMax.to(bhArr.all[j],0,{x:320,y:1008*0.5,alpha:0})
				TweenMax.to(bhArr.all[j],rT,{x:bhArr.all[j].ox,y:bhArr.all[j].oy,alpha:1})
			}
		}
		
	}
	
	//tempGf.pivot.x=100
	//tempGf.pivot.y=0
	//TweenMax.to(tempGf.scale,0,{x:3,y:3})
	
	function renderBh () {
		//console.log("renderBh");
		tempGf.clear()
		for (var i = 0; i < RenderBhArr.length; i++) {
			drawPL(RenderBhArr[i])
		}
	}
	
	var draw_length
	var draw_inMinD
	var draw_outMinD
	var draw_inLineAlpha
	var draw_outLineAlpha
	var curFillColor=0x000000
	function drawPL (tArr) {
		
		draw_length=tArr.all.length
		//draw_inMinD=dftInMinD//40
		//draw_outMinD=dftOutMinD//110
		
		draw_inMinD = tArr.inMinD
		draw_outMinD = tArr.outMinD
		draw_inLineAlpha = tArr.inLineAlpha
		draw_outLineAlpha = tArr.outLineAlpha
		
		
		//console.log(curFillColor);
		//画点
		for (var i = 0; i < draw_length; i++) 
		{
			//点
			//tArr.all[i].r=lRandomRange(1,4)
			
			tempGf.beginFill(curFillColor,tArr.all[i].alpha*tArr.alpha);
			//tempGf.beginFill(0x000000,.1);
				//tempGf.lineStyle(5, curFillColor,0.5*tArr.all[i].alpha);
			tempGf.lineStyle(0);
			
			setdot(tempGf,tArr.all[i],tArr.all[i].scale)
			tArr.all[i].lineNum=0//已经连线的数量
			
			//tempGf.beginFill(0xcbcbcb,.1);
			//tempGf.drawCircle(tArr.all[i].x, tArr.all[i].y,11);
			//tempGf.endFill()
		}
		//tempGf.tint = 0xFF0000;
		
		if(tArr.type!="free")
		{
			
			//画线
			for (var i = 0; i < tArr.outArr.length; i++) {
				
				//内部点连线
				for (var j = 0; j < tArr.inArr.length; j++) {
					spring2(tArr.outArr[i],tArr.inArr[j],tempGf,draw_inMinD,1,curFillColor,draw_inLineAlpha)
				}
				
				//外部点连线
				if(i!=0)
				{
					spring2(tArr.outArr[i-1],tArr.outArr[i],tempGf,draw_outMinD,1,curFillColor,draw_outLineAlpha)
				}else{
					spring2(tArr.outArr[0],tArr.outArr[tArr.outArr.length-1],tempGf,draw_outMinD,1,curFillColor,draw_outLineAlpha)
				}
				
			}
			if(tArr.rType==1)
			{
				
				lCompare (tArr.inArr,function (a,b) {
					spring2(a,b,tempGf,draw_inMinD,1,0x000000,draw_inLineAlpha)
				})
			}
			
		}
		
		
		
		tempGf.endFill()
		//tempGf.tint=0xff0000
		//tempGf.tint=0xff0000
	}
	
	
	//背景球
	var dudeBoundsPadding = 5;
	var dudeBounds = new PIXI.Rectangle(-dudeBoundsPadding,-dudeBoundsPadding,renderer.width + dudeBoundsPadding * 2,renderer.height + dudeBoundsPadding * 2);
		
	
	var backDotArray = [];
	var totalbackDot = 15;
	if(hiQ) totalbackDot=20
	setBackDot()
	function setBackDot(){
		for(var i=1;i<totalbackDot;i++){
			var dot={};
			dot.x = Math.floor(Math.random() * renderer.width);
			dot.y = Math.floor(Math.random() * renderer.height);
			dot.turningSpeed = Math.random() - 0.8;
			dot.speed = 1 + Math.random() * 1;
			dot.direction = Math.random() * Math.PI * 2;
			dot.r=3+Math.ceil(Math.random()*3);
			backDotArray.push(dot);
		}
	}
	function RBackDot(){
		var i,dot;
		backGraphics.clear();
		
		//console.log(backDotArray.length);
		for ( i = 0; i < backDotArray.length; i++)
		{
			dot = backDotArray[i];
			dot.direction += dot.turningSpeed * 0.01;
			dot.x += Math.sin(dot.direction) * dot.speed*timeScale;
			dot.y += Math.cos(dot.direction) * dot.speed*timeScale;
			
			if (dot.x < dudeBounds.x)
			{
				dot.x += dudeBounds.width;
			}else if (dot.x > dudeBounds.x + dudeBounds.width)
			{
				dot.x -= dudeBounds.width;
			}
			
			if (dot.y < dudeBounds.y)
			{ 
				dot.y += dudeBounds.height;
			}else if (dot.y > dudeBounds.y + dudeBounds.height)
			{
				dot.y -= dudeBounds.height;
			}
			
			
		}
		
		backDotArray.forEach(move);
		backGraphics.endFill();
		backGraphics.lineStyle(0);
		backGraphics.beginFill(0xcbcbcb,.7);
		//backGraphics.beginFill(0xff0000,1);
		for ( i = 0; i < backDotArray.length; i++)
		{
			dot=backDotArray[i];
			setdot(backGraphics,dot)
		}
		backGraphics.endFill();
		
		
	}
	function move(ballA,i){
		for(var ballB,j=i+1;j<backDotArray.length;j++){
			ballB=backDotArray[j];
			spring(ballA,ballB,backGraphics,42500);
		}
	}
	function spring(ballA,ballB,tGraphics,minD){
		var dx=ballB.x-ballA.x,
			dy=ballB.y-ballA.y,
			//dist=Math.sqrt(dx*dx+dy*dy);
			dist=dx*dx+dy*dy
			
		//console.log(dist,minD);
		if(dist<minD){
			if(hiQ==true)
			{
				tGraphics.lineStyle(2, 0xcbcbcb,Math.min(0.7,(1-(dist/minD))*5));
			}else{
				tGraphics.lineStyle(2, 0xcbcbcb,0.7);
			}
			
			tGraphics.moveTo(ballA.x, ballA.y);
			tGraphics.lineTo(ballB.x, ballB.y);
		}
	}
	
	function spring2(ballA,ballB,tGraphics,minD,w,color,alpha){
		var dx=ballB.x-ballA.x,
			dy=ballB.y-ballA.y,
			//dist=Math.sqrt(dx*dx+dy*dy);
			dist=dx*dx+dy*dy
			
		//console.log(dist,minD);
		if(dist<minD && ballA.lineNum<=5 && ballB.lineNum<=5){
			if(ballA.type!="out") ballA.lineNum++
			if(ballB.type!="out") ballB.lineNum++
			tGraphics.lineStyle(w, color,alpha);
			
			tGraphics.moveTo(ballA.x, ballA.y);
			tGraphics.lineTo(ballB.x, ballB.y);
		}
	}
	
	
	function setdot(mc,dot,scale){
		var tr = dot.r
		if(scale)
		{
			tr = dot.r*scale
		}
		mc.drawCircle(dot.x, dot.y,tr);
	}
	
	function explainTxt(tTxt){
		
		if(tTxt!=undefined)
		{
			
			if(typeof(tTxt)=="string")
			{
				return run(tTxt)
			}else{
				for (var i = 0; i < tTxt.length; i++) {
					
					
					if(tTxt[i]!=undefined)
					{
						//console.log(i);
						tTxt[i]=run(tTxt[i])
						//console.log(tTxt[i]);
					}
					
				}
			}
			
			function run (txt) {
				//console.log(txt,111);
				var meTxt=txt.split('|');
				var st, i,obj={},arr=[];
				for(i=0;i<meTxt.length;i++){
					if(meTxt[i]!=""){
						st=meTxt[i].split('_');
						obj={};
						obj.x=Math.floor(st[0]);
						obj.y=Math.floor(st[1]);
						arr.push(obj);
					}
				}
				return arr;
			}
			
		}
		
	}
	
	var isRenderBackDot=true
	var isRenderBh=true
	var time = new Date().getTime()
	var dTime
	requestAnimationFrame(animate);
	var animateI=0
	var timeScale=1
	var rBgDot=false
	if(lIsIos()==true || lIsMobile()==false) rBgDot=true
	function animate() 
	{
		//if(animateI%10==0)
		{
			
			dTime = new Date().getTime()
			timeScale=(dTime-time)/16.6
			//console.log((dTime-time)/16.6);
			time=dTime
			if(stage)
			{
				if(loadingCom==false) loadAnimation()
				if(isRenderBackDot && rBgDot) RBackDot()
				if(isRenderBh) renderBh ()
				renderer.render(stage);
			}
		}
		
		animateI++
		requestAnimationFrame(animate);
	}
	
	//代理
	function proxy(name) {
		return eval(name)
	}
	proxyF=proxy
	
	function track(name,type) {
		
		if(type==undefined)	type='click'
		
		if(window._hmt!=undefined)
		{
			console.log("track",name);
			_hmt.push(['_trackEvent', type, name, name])
		}else{
			console.log("未安装百度检测",name);
		}
	}
	//"填写信息_提交","动态传入姓名","动态传入手机号码"]);
	function track2(name,name2,name3) {
		try{
			_smq.push(["custom",name,name2,name3]);
		}catch(e){
			//TODO handle the exception
		}
	}
	
	window.addEventListener("resize",function () {
		mainDiv.scrollTop=0
	})
})