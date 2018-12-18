//截取url的值方法
var ajaxurl = "http://ys.qrit.cn:20057"



function browserRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if ( bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM){ 
    }else{
        window.location.href="/index.aspx";     
    }

}
 
browserRedirect();


function getQueryString(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var r = window.location.search.substr(1).match(reg);
	if(r != null) {
		return decodeURI(r[2]);
	}
	return null;
}

//底部导航栏跳转
var menuBtn = mui(".mui-bar-tab .mui-tab-item");
for(var i = 0;i < menuBtn.length;i++){
	menuBtn[i].addEventListener("tap",function(){
		location.href = this.href;
	})
}

//判断是否为整数
function isInteger(obj) {
 return (obj | 0) === obj
}

/* 
 *  方法:Array.remove(dx) 
 *  功能:根据元素值删除数组元素. 
 *  参数:元素值 
 *  返回:在原数组上修改数组 
 */  
Array.prototype.indexOf = function (val) {  
    for (var i = 0; i < this.length; i++) {  
        if (this[i] == val) {  
            return i;  
        }  
    }  
    return -1;
};  
  
Array.prototype.removevalue = function (val) {  
    var index = this.indexOf(val);  
    if (index > -1) {  
        this.splice(index, 1);  
    }  
}; 

//js模板引擎函数
function LoadTPL(tplid, viewid, data) {
    var tpl = document.getElementById(tplid).innerHTML;
    console.log(tplid,viewid,data);
    laytpl(tpl).render(data,function(html){
    	mui(viewid)[0].innerHTML += html;
    });
}

//表单序列化
function serialize(form){
    var len=form.elements.length;//表单字段长度;表单字段包括<input><select><button>等
    var field=null;//用来存储每一条表单字段
    var parts=[];//保存字符串将要创建的各个部分
    var opLen,//select中option的个数
        opValue;//select中option的值
    for(var i=0;i<len;i++){
        field=form.elements[i];
        switch(field.type){
            case"select-one":
            case"select-multiple":
                if(field.name.length){
                    for(var j=0,opLen=filed.options.length;j<opLen;j++){
                        option=field.options[j];
                        if(option.selected){
                            opValue='';
                            if(option.hasAttribute){
                                opValue=(option.hasAttribute('value')?option.value:option.text);
                            }else{
                                opValue=(option.hasAttribute['value'].specified?option.value:option.text);//IE下
                            }
                            parts.push(encodeURIComponent(field.name)+':"'+encodeURIComponent(opValue)+'"');
                        }

                    }
                }
                break;
            case undefined:
            case"file":
            case"submit":
            case"reset":
            case"button":
                            break;
            case"radio":
            case"checkbox":
                if(!field.checked){
                    break;
                }
            default:
                if(field.name.length){
                    parts.push('"'+encodeURIComponent(field.name)+'":"'+field.value+'"');

                }
                            break;
        }
    }
    return parts.join(",");
}



//表单验证
function getValid(e){
	console.log(1)
	var oBox = document.getElementById(e);
	var oInput = oBox.getElementsByTagName('input');
	var dataType={
		"notnull":/[\w\W]+/,//不能为空
		"name":/^[\u4E00-\u9FA5]{2,6}$/,
		"sfz":/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
//					"*6-16":/^[\w\W]{6,16}$/,
		"n":/^[0-9]*[1-9][0-9]*$/,//只能为正整数
//					"n6-16":/^\d{6,16}$/,
		"s":/^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]+$/,//只能为中文
//					"s6-18":/^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{6,18}$/,
		"p":/^[0-9]{6}$/,//密码至少为六位
		"phone": /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/,//手机号或者座机号
		"e":/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,//邮箱
		"url":/^(\w+:\/\/)?\w+(\.\w+)+.*$/,//url地址
		'bankcard':/^([1-9]{1})(\d{14}|\d{18})$/,
		'password':/^[a-zA-Z0-9]{6,20}$/,
	}
	for(var i=0;i<oInput.length;i++){
		var data = oInput[i].getAttribute('datatype');
		var errormsg = oInput[i].getAttribute('errormsg');
		if(dataType[data]){
			if(dataType[data].test(oInput[i].value) == false){
				mui.toast(errormsg);
				return false;
			}
		}
	}
	return true;
}


/*图片上传*/

function setImagePreviews(obj) {
    var docObj = obj;
	var imgObjPreview = obj.parentNode.querySelector("img");
    var fileList = docObj.files;
            if (docObj.files) {
                imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
            } else {
                //IE下，使用滤镜
                docObj.select();
                var imgSrc = document.selection.createRange().text;
                alert(imgSrc);
                //图片异常的捕捉，防止用户修改后缀来伪造图片
                var localImagId = obj.parentNode.querySelector("img");
                try {
                    localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                    localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
                } catch (e) {
                    alert("您上传的图片格式不正确，请重新选择!");
                    return false;
                }
                imgObjPreview.style.display = 'none';
                document.selection.empty();
            }
	return true;
}



//发送手机短信验证码
var wait = 0; //计算变量
function sendSMS(btnObj, valObj, sendUrl,isres) {
	if(mui(valObj)[0].value == ""){
		mui.toast("请填写手机号获取验证码！")
		return false;
	}
    //发送AJAX请求
    if(isres){
        var odata = { "mobile": mui(valObj)[0].value, "flag":1}
    }else{
        var odata = { "mobile": mui(valObj)[0].value}
    }
	mui.ajax(ajaxurl+sendUrl,{
		type: "POST",
		data: odata,
		dataType: "json",
		beforeSend: function(XMLHttpRequest) {
			mui("body").off("tap",btnObj)
		},
		success: function (data) {
			if (data.status == 1) {
				wait = 60; //赋值时间
				time(); //调用计算器
				mui.toast(data.msg)
			} else {
				mui(btnObj)[0].innerHTML = "获取验证码";
				mui("body").on("tap",btnObj,function(){
					if(isres){
                        sendSMS(btnObj, valObj, sendUrl,isres); //重新绑定事件
                    }else{
                        sendSMS(btnObj, valObj, sendUrl); //重新绑定事件
                    }
				});
				mui.toast(data.msg)
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			mui(btnObj)[0].innerHTML = "获取验证码";
			mui("body").on("tap",btnObj,function(){
                if(isres){
                    sendSMS(btnObj, valObj, sendUrl,isres); //重新绑定事件
                }else{
                    sendSMS(btnObj, valObj, sendUrl); //重新绑定事件
                }
			
			});
			console.log(a+","+b+","+c)
		}
	});
	//倒计时计算器
	function time(){
		if (wait == 0) {
			mui(btnObj)[0].innerHTML = "获取验证码";
			mui(btnObj)[0].addEventListener("tap", function(){
				if(isres){
                    sendSMS(btnObj, valObj, sendUrl,isres); //重新绑定事件
                }else{
                    sendSMS(btnObj, valObj, sendUrl); //重新绑定事件
                }
			});
		}else{
			mui(btnObj)[0].innerHTML = "重新发送(" + wait + ")";
			wait--;
			setTimeout(function() {
				time();
			},1000)
		}
	}
}

//webuploader 创建
function createUploader(parentObj) {
    //初始化WebUploader
    var uploader = WebUploader.create({
        auto: true, //自动上传
        swf: "/js/Uploader.swf", //SWF路径
        server: "/tools/upload_ajax.ashx?action=UpLoadFile", //上传地址
        pick: {
            id: $(parentObj)
        },
        accept: {
            title: 'Images',
            extensions: "gif,jpg,jpeg,bmp,png",
            mimeTypes: 'image/*' 
        },
        formData: {
            'DelFilePath': '' //定义参数
        },
        fileVal: 'Filedata', //上传域的名称
        fileSingleSizeLimit: 1024 * 1024 * 10 //文件大小
    });

    //当validate不通过时，会以派送错误事件的形式通知
    uploader.on('error', function (type) {
        switch (type) {
            case 'Q_EXCEED_NUM_LIMIT':
                mui.toast("错误：上传文件数量过多！");
                break;
            case 'Q_EXCEED_SIZE_LIMIT':
                mui.toast("错误：文件总大小超出限制！");
                break;
            case 'F_EXCEED_SIZE':
                mui.toast("错误：文件大小超出限制！");
                break;
            case 'Q_TYPE_DENIED':
                mui.toast("错误：禁止上传该类型文件！");
                break;
            case 'F_DUPLICATE':
                mui.toast("错误：请勿重复上传该文件！");
                break;
            default:
                mui.toast('错误代码：' + type);
                break;
        }
    });
    
    uploader.refresh();
    
    var mask;

    //当有文件添加进来的时候
    uploader.on('fileQueued', function (file) {
	 	mask = layer.load(1, {shade: [0.1, 'transparent'], time: 3000});
    });

    //当文件上传出错时触发
    uploader.on('uploadError', function (file, reason) {
        uploader.removeFile(file); //从队列中移除
        mui.toast(file.name + "上传失败，错误代码：" + reason);
    });

    //当文件上传成功时触发
    uploader.on('uploadSuccess', function (file, data) {
        if (data.status == '0') {
            mui.toast(data.msg);
        }
        if (data.status == '1') {
        	mui(parentObj)[0].parentNode.querySelector("img").setAttribute("src",data.path);
        	mui(parentObj)[0].parentNode.querySelector("input[type=hidden]").value = data.path;
        }
        uploader.removeFile(file); //从队列中移除
    });

    //不管成功或者失败，文件上传完成时触发
    uploader.on('uploadComplete', function (file) {
		layer.close(mask);
    });
};

function getzf(num) { //补0操作
	if(parseInt(num) < 10) {
		num = '0' + num;
	}
	return num;
}
//时间戳转换
function jsonDateFormat(jsonDate) { //json时间格式转换
	var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
	var month = date.getMonth() + 1 < 10 ? +(date.getMonth() + 1) : date.getMonth() + 1;
	var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	var milliseconds = date.getMilliseconds();
	return date.getFullYear() + "-" + getzf(month) + "-" + day + " " + getzf(hours) + ":" + getzf(minutes) + ":" + getzf(seconds) /* + "." + milliseconds*/ ;
}

function jsonDateFormat1(jsonDate) { //json时间格式转换
	var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
	var month = date.getMonth() + 1 < 10 ? +(date.getMonth() + 1) : date.getMonth() + 1;
	var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	var milliseconds = date.getMilliseconds();
	return date.getFullYear() + "-" + getzf(month) + "-" + day;
}

function cssTransform(el, attr, val) {
    if (!el.transform) {
        el.transform = {};
    }
    if (arguments.length > 2) {
        el.transform[attr] = val;
        var sVal = "";
        for (var s in el.transform) {
            switch (s) {
                case "rotate":
                case "skewX":
                case "skewY":
                    sVal += s + "(" + el.transform[s] + "deg) ";
                    break;
                case "translateX":
                case "translateY":
                case "translateZ":
                    sVal += s + "(" + el.transform[s] + "px) ";
                    break;
                case "scaleX":
                case "scaleY":
                case "scale":
                    sVal += s + "(" + el.transform[s] + ") ";
                    break;
            }
            el.style.WebkitTransform = el.style.transform = sVal;
        }
    } else {
        val = el.transform[attr];
        if (typeof val == "undefined") {
            if (attr == "scale" || attr == "scaleX" || attr == "scaleY") {
                val = 1;
            } else {
                val = 0;
            }
        }
        return val;
    }
}

function setFontSize(){
    var fontSize=document.body.getBoundingClientRect().width/3.75
    document.querySelector('html').style.fontSize = fontSize+'px';
}
setFontSize()