// JavaScript Document

function initdata(bindobj, data, currentvalue) {
    bindobj.empty();
    $.ajax({
        url: "http://special.mercedes-benz.com.cn/thenewe-classteaser/test/GetProvinceDealer.php",
        data: data,
        type: "post",
        dataType: "text",
        success: function (o) {
            var data = eval("(" + o + ")");
            $("<option></option>").text("请选择").val("").appendTo(bindobj);
            $.each(data, function (i, item) {
                if (currentvalue == item)
                    $("<option></option>").text(item).val(item).appendTo(bindobj).attr("selected", "selected");
                else
                    $("<option></option>").text(item).val(item).appendTo(bindobj);
            });
        }
    });
}


function dbInit () {
    var json = { GetType: "province" };
    initdata($("select[id=proname]"), json);
    $("select[id=proname]").change(function () {
        $("select[id=dealername]").empty();//清空经销商
        $("<option></option>").text("请选择").val("").appendTo($("select[id=dealername]"));

        var v = $(this).val();
        json = { GetType: "City", prov: v };
        initdata($("select[id=cityname]"), json);
    });
    $("select[id=cityname]").change(function () {
        var v = $(this).val();
        json = { GetType: "DealerName", CityName: v };
        initdata($("select[id=dealername]"), json);
    });
}

var reg = /^((13|14|15|18)\d{9})|(0\d{2,3}-\d{7,8})$/i;
function isphone(mo_phone) {
	if (reg.test(mo_phone)) {
		return true;
	}
	else return false;
}

function tijiaoinfo() {
    var username = $("#username").val();
	if (username.length < 1) {
		alert("请输入姓名");
		$("#username").focus();
		return false;
	}
	var usersex = $("li.sex").children("span.selected").attr("tag");
	var phone = $("#phone").val();
	if (phone.length < 1) {
		alert("请输入手机号码");
		$("#phone").focus();
		return false;
	}
	else
	{
	   if (!isphone(phone)) {
			alert("电话格式不正确");
			$("#phone").focus();
			return false;
		}
	}
	var province = $("#proname").val();  //省
	var city = $("#cityname").val();  //市
	var dealer = $("#dealername").val();  //经销商
	var send_address = $("#send_address").val();  //邮寄地址
	if (send_address.length < 1) {
		alert("请输入邮寄地址");
		$("#send_address").focus();
		return false;
	}
	var status = $("span[abc='status']").attr("class");
	if (status != "clause") {
	    $.ajax({
	        type: 'post',
	        url: 'submit_testdrive.php?id='+Math.round(),
	        data: {
	            username: username,
	            mysex: usersex,
	            phone: phone,
	            province: province,
	            city: city,
	            dealer: dealer,
				send_address:send_address,
                userfrom:'mobile'
	        },
	        cache: false,
	        dataType: 'text',
	        success: function (data) {
	            var mydate = eval("(" + data + ")");
				//alert(mydate.code);
				if (mydate.code == 1) {
				    $("#phone").val('');
				    $("#username").val('');
					$("#send_address").val('');
				    var json = { GetType: "province" };
				    initdata($("select[id=proname]"), json);
				    $("select[id=dealername]").empty();//清空经销商
				    $("<option></option>").text("请选择").val("").appendTo($("select[id=dealername]"));
				    $("select[id=cityname]").empty(); //清空城市
				    $("<option></option>").text("请选择").val("").appendTo($("select[id=cityname]"));
	                alert("提交成功");
	            }
	            else {
	               // alert("数据提交失败");
				   alert(mydate.msg);
	            }
	        }
	    });
	}
	else {
	    alert("您还没阅读隐私条款");
	}
	return false;
}